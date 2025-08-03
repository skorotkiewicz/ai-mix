import { useState } from "react";
import { Feather, Sparkles } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function PoetryGenerator() {
  const [theme, setTheme] = useState("");
  const [style, setStyle] = useState("free");
  const [mood, setMood] = useState("neutral");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const styles = {
    free: "Wolny vers",
    sonnet: "Sonet",
    haiku: "Haiku",
    limerick: "Limerick",
    ballad: "Ballada",
    rhyming: "Rymowany",
  };

  const moods = {
    romantic: "Romantyczny",
    melancholic: "Melancholijny",
    joyful: "Radosny",
    dramatic: "Dramatyczny",
    peaceful: "Spokojny",
    mysterious: "Tajemniczy",
    neutral: "Neutralny",
  };

  const generatePoetry = async () => {
    if (!theme.trim()) return;

    setIsLoading(true);
    setError("");

    const styleInstructions = {
      free: "w formie wolnego wersu bez rymu",
      sonnet: "w formie sonetu (14 wersów z odpowiednim schematem rymów)",
      haiku: "w formie haiku (3 wersy, 5-7-5 sylab)",
      limerick: "w formie limericka (5 wersów, humorystyczny)",
      ballad: "w formie ballady (opowiadający, rytmiczny)",
      rhyming: "w formie rymowanej z regularnym schematem",
    };

    const moodInstructions = {
      romantic: "romantycznym i czułym",
      melancholic: "melancholijnym i refleksyjnym",
      joyful: "radosnym i pełnym energii",
      dramatic: "dramatycznym i intensywnym",
      peaceful: "spokojnym i harmonijnym",
      mysterious: "tajemniczym i intrygującym",
      neutral: "zrównoważonym",
    };

    const prompt = `Napisz wiersz ${styleInstructions[style]} w ${moodInstructions[mood]} nastroju na temat: ${theme}

Wiersz powinien być oryginalny, poetycki i emocjonalny. Zwróć tylko sam wiersz bez dodatkowych komentarzy.`;

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
        <h3 className="card-title">Generator Poezji</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">Temat wiersza</label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Np. Jesień w parku, miłość, samotność..."
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
          <label className="form-label">Forma poetycka</label>
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
          <label className="form-label">Nastrój</label>
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
        Napisz Wiersz
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">Wygenerowany wiersz:</div>
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
