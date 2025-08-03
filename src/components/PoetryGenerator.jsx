import { useState } from "react";
import { Feather, Sparkles } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function PoetryGenerator() {
  const [theme, setTheme] = useState("");
  const [style, setStyle] = useState("free");
  const [mood, setMood] = useState("neutral");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const styles = {
    free: t("poetryGenerator.styles.free"),
    sonnet: t("poetryGenerator.styles.sonnet"),
    haiku: t("poetryGenerator.styles.haiku"),
    limerick: t("poetryGenerator.styles.limerick"),
    ballad: t("poetryGenerator.styles.ballad"),
    rhyming: t("poetryGenerator.styles.rhyming"),
  };

  const moods = {
    romantic: t("poetryGenerator.moods.romantic"),
    melancholic: t("poetryGenerator.moods.melancholic"),
    joyful: t("poetryGenerator.moods.joyful"),
    dramatic: t("poetryGenerator.moods.dramatic"),
    peaceful: t("poetryGenerator.moods.peaceful"),
    mysterious: t("poetryGenerator.moods.mysterious"),
    neutral: t("poetryGenerator.moods.neutral"),
  };

  const generatePoetry = async () => {
    if (!theme.trim()) return;

    setIsLoading(true);
    setError("");

    const styleInstructions = {
      free: t("poetryGenerator.styleInstructions.free"),
      sonnet: t("poetryGenerator.styleInstructions.sonnet"),
      haiku: t("poetryGenerator.styleInstructions.haiku"),
      limerick: t("poetryGenerator.styleInstructions.limerick"),
      ballad: t("poetryGenerator.styleInstructions.ballad"),
      rhyming: t("poetryGenerator.styleInstructions.rhyming"),
    };

    const moodInstructions = {
      romantic: t("poetryGenerator.moodInstructions.romantic"),
      melancholic: t("poetryGenerator.moodInstructions.melancholic"),
      joyful: t("poetryGenerator.moodInstructions.joyful"),
      dramatic: t("poetryGenerator.moodInstructions.dramatic"),
      peaceful: t("poetryGenerator.moodInstructions.peaceful"),
      mysterious: t("poetryGenerator.moodInstructions.mysterious"),
      neutral: t("poetryGenerator.moodInstructions.neutral"),
    };

    const prompt = t("poetryGenerator.prompt", {
      style: styleInstructions[style],
      mood: moodInstructions[mood],
      theme: theme
    });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.8,
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
          <Feather size={20} />
        </div>
        <h3 className="card-title">{t("poetryGenerator.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">{t("poetryGenerator.themeLabel")}</label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder={t("poetryGenerator.themePlaceholder")}
          className="form-input"
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
          <label className="form-label">{t("poetryGenerator.styleLabel")}</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="form-select"
          >
            {Object.entries(styles).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t("poetryGenerator.moodLabel")}</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="form-select"
          >
            {Object.entries(moods).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={generatePoetry}
        disabled={isLoading || !theme.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner" />
        ) : (
          <Sparkles size={16} />
        )}
        {t("poetryGenerator.generate")}
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">{t("poetryGenerator.resultTitle")}</div>
          <div
            className="result-text"
            style={{ fontStyle: "italic", textAlign: "center" }}
          >
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
