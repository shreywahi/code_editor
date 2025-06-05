// src/components/CodeEditorWidget.jsx
import React from "react";
import CodeEditor from "./CodeEditor";

const CodeEditorWidget = React.forwardRef(({ language, code, setCode, theme }, ref) => (
  <div className="w-full relative" ref={ref} style={{ minHeight: 180, height: 220, minWidth: 250, width: '100%', resize: 'both', overflow: 'auto' }}>
    <label className="block mb-1 font-semibold text-center sm:text-left" htmlFor="code-editor">Code Editor</label>
    <CodeEditor language={language} code={code} setCode={setCode} theme={theme} />
    <div id="editor-resizer" className="w-full h-2 cursor-ns-resize bg-gray-600 opacity-40 hover:opacity-80 rounded-b" title="Resize editor vertically"></div>
    <div id="editor-resizer-horiz" className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-gray-600 opacity-40 hover:opacity-80 rounded-r" title="Resize editor horizontally"></div>
  </div>
));

export default CodeEditorWidget;
