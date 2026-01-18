import { ThemeProvider } from './context/ThemeContext';
import ReviewPage from './pages/ReviewPage';
import './styles/tailwind.css';

function App() {
  return (
    <ThemeProvider>
      <ReviewPage />
    </ThemeProvider>
  );
}

export default App;
