import { useState } from 'react';
import { Moon, Sun, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CodeEditor from '../components/CodeEditor';
import ReviewOutput from '../components/ReviewOutput';
import ImprovedCode from '../components/ImprovedCode';
import SkillSelector from '../components/SkillSelector';
import FocusSelector from '../components/FocusSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import { reviewApi, ReviewResponse } from '../services/api';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

type Tab = 'review' | 'improved' | 'explanation';

export default function ReviewPage() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [skillLevel, setSkillLevel] = useState('senior');
  const [focusAreas, setFocusAreas] = useState<string[]>(['bugs', 'performance', 'clean_code', 'security']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('review');

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    if (focusAreas.length === 0) {
      setError('Please select at least one focus area');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await reviewApi.submitReview({
        code,
        language,
        skill_level: skillLevel,
        focus_areas: focusAreas,
      });
      setReview(result);
      setActiveTab('review');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit code review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <header className="border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
              AI Code Reviewer & Mentor
            </h1>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              Get professional code reviews from a senior developer AI
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-dark-text" />
            ) : (
              <Moon className="w-5 h-5 text-light-text" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                  Your Code
                </h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input w-auto"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            </div>

            <SkillSelector value={skillLevel} onChange={setSkillLevel} />
            <FocusSelector value={focusAreas} onChange={setFocusAreas} />

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Review My Code
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="card flex items-center justify-center min-h-[500px]">
                <LoadingSpinner size="lg" text="Analyzing your code..." />
              </div>
            ) : review ? (
              <>
                <div className="border-b border-light-border dark:border-dark-border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('review')}
                      className={`tab ${activeTab === 'review' ? 'tab-active' : 'tab-inactive'}`}
                    >
                      Review
                    </button>
                    <button
                      onClick={() => setActiveTab('improved')}
                      className={`tab ${activeTab === 'improved' ? 'tab-active' : 'tab-inactive'}`}
                    >
                      Improved Code
                    </button>
                    <button
                      onClick={() => setActiveTab('explanation')}
                      className={`tab ${activeTab === 'explanation' ? 'tab-active' : 'tab-inactive'}`}
                    >
                      Explanation
                    </button>
                  </div>
                </div>

                {activeTab === 'review' && (
                  <ReviewOutput
                    issues={review.issues}
                    scores={review.scores}
                    followUpQuestions={review.follow_up_questions}
                  />
                )}

                {activeTab === 'improved' && (
                  <ImprovedCode
                    code={review.improved_code}
                    language={review.language}
                    explanation={review.explanation}
                  />
                )}

                {activeTab === 'explanation' && (
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
                      Senior Developer Insights
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="text-light-text dark:text-dark-text whitespace-pre-wrap">
                        {review.explanation}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card flex items-center justify-center min-h-[500px]">
                <div className="text-center text-light-text-secondary dark:text-dark-text-secondary">
                  <p className="text-lg mb-2">Ready to review your code</p>
                  <p className="text-sm">Submit your code to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
