import { useState, useRef, useEffect } from "react";
import axios from "axios";
import CodeEditorWidget from "./components/CodeEditorWidget";
import LanguageSelectorWidget from "./components/LanguageSelectorWidget";
import EditorButtons from "./components/EditorButtons";
import InputWidget from "./components/InputWidget";
import OutputWidget from "./components/OutputWidget";

const DEMO_CODE = {
  javascript:
    `// JavaScript Demo\n// Reads input from window.userInput (string)\nfunction reverseWords(input) {\n  return input.split(' ').reverse().join(' ');\n}\nreverseWords(window.userInput || '');`,
  python:
    `# Python Demo\n# Reads input from stdin\ninput_str = input()\nprint(' '.join(reversed(input_str.split())))`,
  cpp:
    `// C++ Demo\n// Reads input from stdin\n#include <iostream>\n#include <sstream>\n#include <vector>\nusing namespace std;\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<string> words;\n    string word;\n    while (iss >> word) words.push_back(word);\n    for (int i = words.size() - 1; i >= 0; --i) {\n        cout << words[i];\n        if (i) cout << ' ';\n    }\n    cout << endl;\n    return 0;\n}`
};

const DEMO_INPUT = {
  javascript: 'hello world from js',
  python: 'hello world from python',
  cpp: 'hello world from cpp'
};

export default function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEMO_CODE['javascript']);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState(DEMO_INPUT['javascript']);
  const [loading, setLoading] = useState(false);
  const editorContainerRef = useRef();
  const outputContainerRef = useRef();
  const inputContainerRef = useRef();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
        if (
          document.activeElement &&
          document.activeElement.tagName === 'TEXTAREA'
        ) {
          document.activeElement.blur();
        }
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        setOutput('');
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [output, code, language, loading]);

  // Resizable Editor, Output, and Input
  useEffect(() => {
    let isResizingEditor = false;
    let isResizingOutput = false;
    let isResizingEditorHoriz = false;
    let isResizingOutputHoriz = false;
    let isResizingInputHoriz = false;
    let startY, startHeight, startX, startWidth;
    const editorResizer = document.getElementById('editor-resizer');
    const outputResizer = document.getElementById('output-resizer');
    const editorResizerHoriz = document.getElementById('editor-resizer-horiz');
    const outputResizerHoriz = document.getElementById('output-resizer-horiz');
    const inputResizerHoriz = document.getElementById('input-resizer-horiz');
    const editorDiv = editorContainerRef.current;
    const outputDiv = outputContainerRef.current;
    const inputDiv = inputContainerRef.current;

    const onMouseMove = (e) => {
      if (isResizingEditor && editorDiv) {
        const newHeight = Math.max(120, startHeight + (e.clientY - startY));
        editorDiv.style.height = newHeight + 'px';
      }
      if (isResizingOutput && outputDiv) {
        const newHeight = Math.max(60, startHeight + (e.clientY - startY));
        outputDiv.style.height = newHeight + 'px';
      }
      if (isResizingEditorHoriz && editorDiv) {
        const newWidth = Math.max(250, startWidth + (e.clientX - startX));
        editorDiv.style.width = newWidth + 'px';
      }
      if (isResizingOutputHoriz && outputDiv) {
        const newWidth = Math.max(250, startWidth + (e.clientX - startX));
        outputDiv.style.width = newWidth + 'px';
      }
      if (isResizingInputHoriz && inputDiv) {
        const newWidth = Math.max(250, startWidth + (e.clientX - startX));
        inputDiv.style.width = newWidth + 'px';
      }
    };
    const onMouseUp = () => {
      isResizingEditor = false;
      isResizingOutput = false;
      isResizingEditorHoriz = false;
      isResizingOutputHoriz = false;
      isResizingInputHoriz = false;
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    if (editorResizer) {
      editorResizer.onmousedown = (e) => {
        isResizingEditor = true;
        startY = e.clientY;
        startHeight = editorDiv.offsetHeight;
        document.body.style.cursor = 'ns-resize';
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };
    }
    if (outputResizer) {
      outputResizer.onmousedown = (e) => {
        isResizingOutput = true;
        startY = e.clientY;
        startHeight = outputDiv.offsetHeight;
        document.body.style.cursor = 'ns-resize';
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };
    }
    if (editorResizerHoriz) {
      editorResizerHoriz.onmousedown = (e) => {
        isResizingEditorHoriz = true;
        startX = e.clientX;
        startWidth = editorDiv.offsetWidth;
        document.body.style.cursor = 'ew-resize';
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };
    }
    if (outputResizerHoriz) {
      outputResizerHoriz.onmousedown = (e) => {
        isResizingOutputHoriz = true;
        startX = e.clientX;
        startWidth = outputDiv.offsetWidth;
        document.body.style.cursor = 'ew-resize';
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };
    }
    if (inputResizerHoriz) {
      inputResizerHoriz.onmousedown = (e) => {
        isResizingInputHoriz = true;
        startX = e.clientX;
        startWidth = inputDiv.offsetWidth;
        document.body.style.cursor = 'ew-resize';
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };
    }
    return () => {
      if (editorResizer) editorResizer.onmousedown = null;
      if (outputResizer) outputResizer.onmousedown = null;
      if (editorResizerHoriz) editorResizerHoriz.onmousedown = null;
      if (outputResizerHoriz) outputResizerHoriz.onmousedown = null;
      if (inputResizerHoriz) inputResizerHoriz.onmousedown = null;
    };
  }, []);

  // Update both language and code together
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEMO_CODE[lang]);
    setInput(DEMO_INPUT[lang]);
  };

  const runCode = async () => {
    setLoading(true);
    setOutput('');
    if (language === 'javascript') {
      try {
        window.userInput = input;
        const result = eval(code);
        setOutput(String(result));
      } catch (err) {
        setOutput(err.message);
      }
      setLoading(false);
    } else {
      try {
        const response = await axios.post(
          'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
          {
            source_code: code,
            language_id: language === 'python' ? 71 : 54,
            stdin: input
          },
          {
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
              'X-RapidAPI-Key': 'a708f1d537mshd5087a1dcb7c069p1351e0jsn3e4e20ab5485'
            }
          }
        );
        setOutput(response.data.stdout || response.data.stderr || 'No output');
      } catch (err) {
        let errorMsg = 'Error running code';
        if (err.response) {
          if (err.response.status === 429) {
            errorMsg = 'Rate limit exceeded: You have sent too many requests to the Judge0 API. Please wait and try again later.';
          } else if (err.response.data && err.response.data.message) {
            errorMsg = `API Error: ${err.response.data.message}`;
          } else {
            errorMsg = `API Error: ${err.response.status} ${err.response.statusText}`;
          }
        } else if (err.request) {
          errorMsg = 'No response from Judge0 API. Please check your internet connection or try again later.';
        } else if (err.message) {
          errorMsg = `Error: ${err.message}`;
        }
        setOutput(errorMsg);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white transition-colors duration-300 font-sans">
      <header className="mb-6 sm:mb-8 w-full max-w-3xl text-center text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 drop-shadow font-display tracking-tight">Online Code Editor</h1>
        <p className="text-base sm:text-lg mb-4 text-gray-400 font-medium font-sans">Write, run, and test your code in multiple languages!</p>
      </header>
      <main className="w-full max-w-5xl rounded-2xl shadow-2xl p-4 sm:p-10 flex flex-col gap-10 border items-center mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-gray-700 transition-colors duration-300 font-sans">
        {/* 2x2 Grid layout for controls, input, editor, and output */}
        <div className="w-full grid grid-cols-2 md:grid-cols-2 grid-rows-2 gap-8 items-center justify-items-center font-sans">
          {/* Top-left: Language selector + buttons */}
          <div className="flex flex-col gap-6 items-center justify-center min-w-[320px] min-h-[100px] bg-gray-800/80 rounded-xl p-6 shadow-lg w-full max-w-sm min-w-[260px] min-h-[180px] border border-gray-700 font-sans">
            <LanguageSelectorWidget language={language} setLanguage={handleLanguageChange} />
            <EditorButtons
              onRun={runCode}
              onReset={() => {
                setCode(DEMO_CODE[language]);
                setOutput("");
                setInput(DEMO_INPUT[language]);
              }}
              onClear={() => setOutput("")}
              onCopy={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(output);
                } else {
                  const textarea = document.createElement('textarea');
                  textarea.value = output;
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textarea);
                }
              }}
              loading={loading}
            />
          </div>
          {/* Top-right: Input */}
          <div className="flex items-end justify-center w-full max-w-md bg-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700 font-sans">
            <InputWidget ref={inputContainerRef} input={input} setInput={setInput} />
          </div>
          {/* Bottom-left: Code editor */}
          <div className="w-full flex justify-center items-center min-w-[420px] bg-gray-900/80 rounded-xl p-4 shadow-lg border border-gray-700 min-h-[220px] min-w-[320px] max-w-[520px] font-mono">
            <CodeEditorWidget ref={editorContainerRef} language={language} code={code} setCode={setCode} />
          </div>
          {/* Bottom-right: Output */}
          <div className="w-full flex justify-center items-center bg-gray-900/80 rounded-xl p-4 shadow-lg border border-gray-700 min-h-[220px] min-w-[320px] max-w-[520px] font-mono">
            <OutputWidget ref={outputContainerRef} output={output} loading={loading} />
          </div>
        </div>
      </main>
      <footer className="mt-8 text-xs text-center opacity-80 text-gray-400 font-sans">
        <p>Made with <span className="text-blue-400 font-semibold">React</span> &amp; <span className="text-cyan-400 font-semibold">Tailwind CSS</span> | Powered by Judge0 API</p>
        <p>© 2025 - Shrey Wahi</p>
      </footer>
    </div>
  );
}
