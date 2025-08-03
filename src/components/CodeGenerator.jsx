import { useState } from "react";
import { Code, Copy, Check } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function CodeGenerator() {
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [complexity, setComplexity] = useState("simple");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { t } = useTranslate();

  const languages = {
    javascript: "JavaScript",
    python: "Python",
    java: "Java",
    cpp: "C++",
    csharp: "C#",
    php: "PHP",
    go: "Go",
    rust: "Rust",
  };

  const getComplexityLabel = (key) => t(`codeGenerator.complexities.${key}`);

  const generateCode = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setError("");

    const complexityText = t(`codeGenerator.prompts.${complexity}`);
    const prompt = t('codeGenerator.prompts.instruction', {
      complexity: complexityText,
      language: languages[language],
      description: description
    });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.2,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <Code size={20} />
        </div>
        <h3 className="card-title">{t('codeGenerator.title')}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">{t('codeGenerator.descriptionLabel')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('codeGenerator.descriptionPlaceholder')}
          className="form-textarea"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "calc(var(--spacing-unit) * 2)",
        }}
      >
        <div className="form-group">
          <label className="form-label">{t('codeGenerator.languageLabel')}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-select"
          >
            {Object.entries(languages).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t('codeGenerator.complexityLabel')}</label>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className="form-select"
          >
            {Object.keys({simple: '', intermediate: '', advanced: ''}).map((key) => (
              <option key={key} value={key}>
                {getComplexityLabel(key)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={generateCode}
        disabled={isLoading || !description.trim()}
        className="btn"
      >
        {isLoading ? <div className="loading-spinner" /> : <Code size={16} />}
        {t('codeGenerator.generate')}
      </button>

      {result && (
        <div className="result-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "calc(var(--spacing-unit) * 2)",
            }}
          >
            <div className="result-title">
              {t('codeGenerator.resultTitle')} ({languages[language]}):
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              className="copy-button"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="code-block">
            <pre>
              <code>{result}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
