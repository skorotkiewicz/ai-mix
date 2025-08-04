import { useState } from "react";
import { Languages, ArrowRight } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function Translator() {
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState("english");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const languages = {
    english: t("translator.languages.english"),
    spanish: t("translator.languages.spanish"),
    french: t("translator.languages.french"),
    german: t("translator.languages.german"),
    italian: t("translator.languages.italian"),
    portuguese: t("translator.languages.portuguese"),
    russian: t("translator.languages.russian"),
    chinese: t("translator.languages.chinese"),
    japanese: t("translator.languages.japanese"),
    korean: t("translator.languages.korean"),
  };

  const translateText = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = t("translator.prompt", {
      language: languages[targetLang],
      text: inputText,
    });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.3,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <Languages size={20} />
        </div>
        <h3 className="card-title">{t("translator.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">{t("translator.inputLabel")}</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t("translator.inputPlaceholder")}
          className="form-textarea"
          style={{ minHeight: "120px" }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t("translator.targetLanguageLabel")}</label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="form-select"
        >
          {Object.entries(languages).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={translateText}
        disabled={isLoading || !inputText.trim()}
        className="btn"
      >
        {isLoading ? <div className="loading-spinner" /> : <ArrowRight size={16} />}
        {t("translator.generate")}
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">
            {t("translator.resultTitle", { language: languages[targetLang] })}
          </div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
