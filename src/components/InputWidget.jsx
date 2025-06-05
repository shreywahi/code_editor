// src/components/InputWidget.jsx
import React from "react";

const InputWidget = React.forwardRef(({ input, setInput }, ref) => (
  <div className="w-full flex flex-col gap-2">
    <label className="block mb-1 font-semibold text-center sm:text-left" htmlFor="input-area">
      Input <span className="text-xs text-gray-400">(stdin, optional)</span>
    </label>
    <div className="relative" ref={ref} style={{ minHeight: 48, minWidth: 250, width: '100%', resize: 'both', overflow: 'auto' }}>
      <textarea
        id="input-area"
        className="w-full rounded-lg bg-gray-700 text-white p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[48px] resize-y"
        placeholder="Enter input for your code here..."
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={2}
      />
      <div id="input-resizer-horiz" className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-gray-600 opacity-40 hover:opacity-80 rounded-r" title="Resize input horizontally"></div>
    </div>
  </div>
));

export default InputWidget;
