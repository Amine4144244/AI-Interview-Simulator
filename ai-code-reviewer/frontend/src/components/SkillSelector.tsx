interface SkillSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SKILL_LEVELS = [
  { value: 'junior', label: 'Junior', description: 'Basic concepts and syntax' },
  { value: 'mid', label: 'Mid-level', description: 'Design patterns and best practices' },
  { value: 'senior', label: 'Senior', description: 'Architecture and production readiness' },
];

export default function SkillSelector({ value, onChange }: SkillSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-light-text dark:text-dark-text">
        Review Level
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SKILL_LEVELS.map((skill) => (
          <button
            key={skill.value}
            onClick={() => onChange(skill.value)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              value === skill.value
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-light-border dark:border-dark-border hover:border-blue-400 dark:hover:border-blue-500'
            }`}
          >
            <div className="font-semibold text-light-text dark:text-dark-text">
              {skill.label}
            </div>
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              {skill.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
