import { Bug, Zap, Code2, Shield } from 'lucide-react';

interface FocusSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const FOCUS_AREAS = [
  { value: 'bugs', label: 'Bugs & Logic', icon: Bug, color: 'text-red-500' },
  { value: 'performance', label: 'Performance', icon: Zap, color: 'text-yellow-500' },
  { value: 'clean_code', label: 'Clean Code', icon: Code2, color: 'text-green-500' },
  { value: 'security', label: 'Security', icon: Shield, color: 'text-purple-500' },
];

export default function FocusSelector({ value, onChange }: FocusSelectorProps) {
  const toggleFocus = (focus: string) => {
    if (value.includes(focus)) {
      onChange(value.filter(f => f !== focus));
    } else {
      onChange([...value, focus]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-light-text dark:text-dark-text">
        Review Focus Areas
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FOCUS_AREAS.map((area) => {
          const Icon = area.icon;
          const isSelected = value.includes(area.value);
          return (
            <button
              key={area.value}
              onClick={() => toggleFocus(area.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-light-border dark:border-dark-border hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${area.color} mx-auto mb-2`} />
              <div className="text-sm font-medium text-center text-light-text dark:text-dark-text">
                {area.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
