// src/pages/LoginPage.tsx
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loginUser, registerUser, clearError } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error } = useAppSelector(state => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await dispatch(loginUser({ email, password })).unwrap()
      } else {
        await dispatch(registerUser({ email, password })).unwrap()
      }
      navigate('/')
    } catch (err) {
      // ошибка уже в сторе
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: 16 }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{ width: '100%', padding: 12, background: '#007bff', color: 'white', border: 'none', marginBottom: 12 }}
        >
          {status === 'loading' ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
        </button>
        
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin)
            dispatch(clearError())
          }}
          style={{ width: '100%', padding: 8, background: 'transparent', color: '#007bff', border: '1px solid #007bff' }}
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти'}
        </button>
      </form>
    </div>
  )
}