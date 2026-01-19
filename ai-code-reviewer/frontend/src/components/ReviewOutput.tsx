import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { ReviewIssue, ReviewScores } from '../services/api';

interface ReviewOutputProps {
  issues: ReviewIssue[];
  scores: ReviewScores;
  followUpQuestions: string[];
}

const severityConfig = {
  critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-500' },
  high: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-500' },
  medium: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-500' },
  low: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-500' },
  info: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-500' },
};

function ScoreBar({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-light-text dark:text-dark-text">{label}</span>
        <span className="text-light-text-secondary dark:text-dark-text-secondary">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function ReviewOutput({ issues, scores, followUpQuestions }: ReviewOutputProps) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
          Code Quality Scores
        </h3>
        <div className="space-y-4">
          <ScoreBar label="Overall Quality" score={scores.overall} />
          <ScoreBar label="Correctness" score={scores.correctness} />
          <ScoreBar label="Readability" score={scores.readability} />
          <ScoreBar label="Maintainability" score={scores.maintainability} />
          <ScoreBar label="Performance" score={scores.performance} />
          <ScoreBar label="Security" score={scores.security} />
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
          Issues Found ({issues.length})
        </h3>
        {issues.length === 0 ? (
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            No issues found. Great job!
          </p>
        ) : (
          <div className="space-y-4">
            {issues.map((issue, index) => {
              const config = severityConfig[issue.severity];
              const Icon = config.icon;
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${config.bg} ${config.border}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold uppercase ${config.color}`}>
                          {issue.severity}
                        </span>
                        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                          Line {issue.line}
                        </span>
                      </div>
                      <h4 className="font-semibold text-light-text dark:text-dark-text">
                        {issue.title}
                      </h4>
                      <div className="text-sm space-y-2 text-light-text dark:text-dark-text">
                        <div>
                          <span className="font-medium">Problem:</span> {issue.description}
                        </div>
                        <div>
                          <span className="font-medium">Risk:</span> {issue.risk}
                        </div>
                        <div>
                          <span className="font-medium">Solution:</span> {issue.suggestion}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {followUpQuestions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
            Questions to Consider
          </h3>
          <ul className="space-y-2">
            {followUpQuestions.map((question, index) => (
              <li 
                key={index}
                className="flex items-start gap-3 text-sm text-light-text dark:text-dark-text"
              >
                <span className="text-blue-500 font-bold">Q:</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
