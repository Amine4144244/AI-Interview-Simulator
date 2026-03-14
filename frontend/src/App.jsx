import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Sessions from './pages/Sessions';
import InterviewSession from './pages/InterviewSession';
import ResultPage from './pages/ResultPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import { useDarkMode } from './context/DarkModeContext';

function App() {
  const { darkMode } = useDarkMode();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <Sessions />
            </ProtectedRoute>
          } />
          <Route path="/interview/:id" element={
            <ProtectedRoute>
              <InterviewSession />
            </ProtectedRoute>
          } />
          <Route path="/result/:id" element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;