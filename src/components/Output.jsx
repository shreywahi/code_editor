// components/Output.jsx
export default function Output({ output }) {
  return (
    <pre className="w-full h-full bg-gray-900 text-green-300 rounded-lg p-3 overflow-auto whitespace-pre-wrap text-sm border border-gray-700 min-h-[120px]">
      {output}
    </pre>
  );
}
