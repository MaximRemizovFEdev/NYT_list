// src/App.tsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { checkAuth } from "./features/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import FeedPage from "./pages/FeedPage";

function App() {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (status === "loading") {
    return <div style={{ textAlign: 'center', padding: 20 }}>Загрузка...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;