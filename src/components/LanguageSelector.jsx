// components/LanguageSelector.jsx
export default function LanguageSelector({ language, setLanguage }) {
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' }
  ];

  return (
    <select
      id="language-select"
      className="w-full rounded-lg bg-gray-700 text-white p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      value={language}
      onChange={e => setLanguage(e.target.value)}
    >
      {languages.map(lang => (
        <option key={lang.value} value={lang.value}>{lang.label}</option>
      ))}
    </select>
  );
}
