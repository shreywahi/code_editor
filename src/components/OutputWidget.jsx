// src/components/OutputWidget.jsx
import React from "react";
import Output from "./Output";

const OutputWidget = React.forwardRef(({ output, loading }, ref) => (
  <div className="w-full relative" ref={ref} style={{ minHeight: 160, height: 220, minWidth: 250, width: '100%', resize: 'both', overflow: 'auto' }}>
    <label className="block mb-1 font-semibold text-center sm:text-left">Output</label>
    <Output output={loading ? "Running code..." : output} />
    <div id="output-resizer" className="w-full h-2 cursor-ns-resize bg-gray-600 opacity-40 hover:opacity-80 rounded-b" title="Resize output vertically"></div>
    <div id="output-resizer-horiz" className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-gray-600 opacity-40 hover:opacity-80 rounded-r" title="Resize output horizontally"></div>
  </div>
));

export default OutputWidget;
