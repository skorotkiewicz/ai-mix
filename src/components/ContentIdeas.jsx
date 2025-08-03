import { useState } from "react";
import { Lightbulb, Target, TrendingUp } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function ContentIdeas() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("blog");
  const [audience, setAudience] = useState("");
  const [count, setCount] = useState(10);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const platforms = {
    blog: "Blog/Artykuły",
    social: "Media społecznościowe",
    youtube: "YouTube/Video",
    podcast: "Podcast",
    newsletter: "Newsletter",
    linkedin: "LinkedIn",
  };

  const generateIdeas = async () => {
    if (!niche.trim()) return;

    setIsLoading(true);
    setError("");

    let prompt = `Wygeneruj ${count} kreatywnych i angażujących pomysłów na treści dla ${platforms[platform]} w niszy: ${niche}.`;

    if (audience) prompt += ` Grupa docelowa: ${audience}.`;

    prompt += `

Każdy pomysł powinien zawierać:
- Tytuł/temat
- Krótki opis (1-2 zdania)
- Dlaczego może zainteresować odbiorców

Format odpowiedzi:
1. [Tytuł] - [Krótki opis] - [Dlaczego interesujące]

Pomysły powinny być:
- Aktualne i trendy
- Angażujące dla odbiorców
- Praktyczne do zrealizowania
- Różnorodne

Odpowiedz w języku polskim:`;

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.8,
      });

      const ideas = response
        .split("\n")
        .filter((line) => line.trim() && /^\d+\./.test(line.trim()))
        .map((line) => {
          const cleaned = line.replace(/^\d+\.\s*/, "").trim();
          const parts = cleaned.split(" - ");
          return {
            title: parts[0] || cleaned,
            description: parts[1] || "",
            reason: parts[2] || "",
          };
        });

      setResults(ideas);
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
          <Lightbulb size={20} />
        </div>
        <h3 className="card-title">Generator Pomysłów na Treści</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">Nisza/Branża</label>
        <input
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="Np. technologia, zdrowie, biznes, gotowanie..."
          className="form-input"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 100px",
          gap: "calc(var(--spacing-unit) * 2)",
        }}
      >
        <div className="form-group">
          <label className="form-label">Platforma</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="form-select"
          >
            {Object.entries(platforms).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Grupa docelowa (opcjonalnie)</label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Np. freelancerzy, studenci..."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Liczba</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="form-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={generateIdeas}
        disabled={isLoading || !niche.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <TrendingUp size={16} />
        )}
        Generuj Pomysły
      </button>

      {results.length > 0 && (
        <div className="result-container">
          <div className="result-title">
            Pomysły na treści ({platforms[platform]}):
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "calc(var(--spacing-unit) * 2)",
            }}
          >
            {results.map((idea, index) => (
              <div
                key={index}
                style={{
                  padding: "calc(var(--spacing-unit) * 3)",
                  background: "var(--background-card)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "calc(var(--spacing-unit) * 1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "calc(var(--spacing-unit) * 1)",
                  }}
                >
                  <Target size={16} style={{ color: "var(--accent-color)" }} />
                  {idea.title}
                </div>
                {idea.description && (
                  <div
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "calc(var(--spacing-unit) * 1)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {idea.description}
                  </div>
                )}
                {idea.reason && (
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                    }}
                  >
                    💡 {idea.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
