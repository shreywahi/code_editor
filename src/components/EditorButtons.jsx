// src/components/EditorButtons.jsx
import React from "react";

export default function EditorButtons({ onRun, onReset, onClear, onCopy, loading }) {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between">
      <button
        onClick={onRun}
        className="px-6 py-2 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto mx-auto bg-blue-500 hover:bg-blue-600 text-white"
        disabled={loading}
      >
        {loading ? "Running..." : "Run (Ctrl+Enter)"}
      </button>
      <button
        onClick={onReset}
        className="px-6 py-2 rounded-lg font-semibold transition border bg-gray-700 hover:bg-gray-600 text-white border-gray-600 w-full sm:w-auto"
        title="Reset code to default demo"
      >
        Reset
      </button>
      <button
        onClick={onClear}
        className="px-6 py-2 rounded-lg font-semibold transition border bg-red-500 hover:bg-red-600 text-white border-red-600 w-full sm:w-auto"
        title="Clear output"
      >
        Clear Output (Ctrl+L)
      </button>
      <button
        onClick={onCopy}
        className="px-6 py-2 rounded-lg font-semibold transition border bg-green-500 hover:bg-green-600 text-white border-green-600 w-full sm:w-auto"
        title="Copy output to clipboard"
      >
        Copy Output
      </button>
    </div>
  );
}
