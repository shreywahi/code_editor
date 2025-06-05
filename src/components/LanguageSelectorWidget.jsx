// src/components/LanguageSelectorWidget.jsx
import React from "react";
import LanguageSelector from "./LanguageSelector";

export default function LanguageSelectorWidget({ language, setLanguage }) {
  return (
    <div className="flex-1 w-full">
      <label className="block mb-1 font-semibold text-center sm:text-left" htmlFor="language-select">Language</label>
      <LanguageSelector language={language} setLanguage={setLanguage} />
    </div>
  );
}
