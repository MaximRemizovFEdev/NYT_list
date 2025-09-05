const jsonServer = require('json-server')
const auth = require('json-server-auth')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('mock-db.json')
const middlewares = jsonServer.defaults()

const JWT_SECRET = 'your-secret-key'
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Регистрация
server.post('/register', (req, res) => {
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  const existingUser = router.db.get('users').find({ email }).value()
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' })
  }

  const newUser = {
    id: Date.now(),
    email,
    password,
    createdAt: new Date().toISOString()
  }

  router.db.get('users').push(newUser).write()

  const accessToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
  const refreshToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })

  router.db.get('refreshTokens').push({ token: refreshToken, userId: newUser.id }).write()

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  })
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.json({ 
    user: { id: newUser.id, email: newUser.email },
    message: 'Registration successful'
  })
})

// Логин
server.post('/login', (req, res) => {
  const { email, password } = req.body
  
  const user = router.db.get('users').find({ email, password }).value()
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
  const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })

  router.db.get('refreshTokens').push({ token: refreshToken, userId: user.id }).write()

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  })
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.json({ user: { id: user.id, email: user.email } })
})

// Refresh
server.post('/refresh', (req, res) => {
  const { refreshToken } = req.body
  
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET)
    const storedToken = router.db.get('refreshTokens').find({ token: refreshToken }).value()
    
    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
    
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    })
    
    res.json({ accessToken: newAccessToken })
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

// Получение профиля
server.get('/users/me', (req, res) => {
  const token = req.cookies.accessToken
  
  if (!token) {
    return res.status(401).json({ error: 'No token' })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = router.db.get('users').find({ id: decoded.userId }).value()
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ id: user.id, email: user.email })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

server.use(auth)
server.use(router)

server.listen(3001, () => {
  console.log('JSON Server with custom auth is running on port 3001')
})