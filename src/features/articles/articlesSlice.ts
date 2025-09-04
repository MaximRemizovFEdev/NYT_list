import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchArchive, ArchiveDoc } from '../../services/nyt'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

interface ArticlesState {
  items: ArchiveDoc[]
  status: Status
  error?: string
}

const initialState: ArticlesState = {
  items: [],
  status: 'idle',
}

export const loadArchive = createAsyncThunk(
  'articles/loadArchive',
  async ({ year, month }: { year: number; month: number }) => {
    const data = await fetchArchive(year, month)
    return data.response.docs
  }
)

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clear(state) {
      state.items = []
      state.status = 'idle'
      state.error = undefined
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadArchive.pending, state => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(loadArchive.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadArchive.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { clear } = articlesSlice.actions
export default articlesSlice.reducer