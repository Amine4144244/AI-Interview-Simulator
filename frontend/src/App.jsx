import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InterviewSession from './pages/InterviewSession';
import ResultPage from './pages/ResultPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import { useDarkMode } from './context/DarkModeContext';

function App() {
  const { darkMode } = useDarkMode();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <BrowserRouter>
        <Header />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 pt-32 pb-8"
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
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
        </motion.div>
      </BrowserRouter>
    </div>
  );
}

export default App;