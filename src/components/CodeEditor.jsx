// components/CodeEditor.jsx
import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";

const getLang = (lang) => {
  switch (lang) {
    case 'python':
      return python();
    case 'cpp':
      return cpp();
    default:
      return javascript();
  }
};

export default function CodeEditor({ language, code, setCode, theme }) {
  const editor = useRef(null);
  const viewRef = useRef(null);

  // Initialize or update the editor when language changes
  useEffect(() => {
    if (!editor.current) return;
    if (viewRef.current) viewRef.current.destroy();

    viewRef.current = new EditorView({
      doc: code,
      extensions: [
        basicSetup,
        getLang(language),
        oneDark,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) setCode(v.state.doc.toString());
        })
      ],
      parent: editor.current,
    });

    return () => {
      if (viewRef.current) viewRef.current.destroy();
    };
  }, [language]);

  // Update editor content if code prop changes externally
  useEffect(() => {
    if (
      viewRef.current &&
      code !== viewRef.current.state.doc.toString()
    ) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: code }
      });
    }
  }, [code]);

  return (
    <div
      id="code-editor"
      className={`border rounded-lg p-1 h-56 sm:h-80 overflow-auto focus-within:ring-2 focus-within:ring-blue-500 transition-all ${theme === 'light' ? 'border-gray-300 bg-gray-100 text-gray-900' : 'border-gray-700 bg-[#181a1b] text-white'}`}
      ref={editor}
      tabIndex={0}
      aria-label="Code editor"
    />
  );
}
