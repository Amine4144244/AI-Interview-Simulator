import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  height?: string;
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language, 
  readOnly = false,
  height = '500px' 
}: CodeEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, monospace',
        }}
      />
    </div>
  );
}
