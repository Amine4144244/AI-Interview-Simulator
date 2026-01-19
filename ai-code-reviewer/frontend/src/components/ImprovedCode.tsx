import CodeEditor from './CodeEditor';

interface ImprovedCodeProps {
  code: string;
  language: string;
  explanation: string;
}

export default function ImprovedCode({ code, language, explanation }: ImprovedCodeProps) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
          Refactored Code
        </h3>
        <CodeEditor
          value={code}
          onChange={() => {}}
          language={language}
          readOnly={true}
          height="400px"
        />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
          What Changed and Why
        </h3>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="text-light-text dark:text-dark-text whitespace-pre-wrap">
            {explanation}
          </div>
        </div>
      </div>
    </div>
  );
}
