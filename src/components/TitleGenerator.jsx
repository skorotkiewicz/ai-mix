import { useState } from "react";
import { Type, RefreshCw } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function TitleGenerator() {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("blog");
  const [count, setCount] = useState(5);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = {
    blog: "Post na blog",
    article: "Artykuł naukowy",
    news: "Artykuł informacyjny",
    marketing: "Materiał marketingowy",
    tutorial: "Tutorial/Poradnik",
    review: "Recenzja",
    story: "Opowiadanie",
  };

  const generateTitles = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = `Na podstawie następującej treści wygeneruj ${count} kreatywnych i atrakcyjnych tytułów dla ${categories[category]}:

Treść:
${content}

Tytuły powinny być:
- Przyciągające uwagę
- Dokładnie opisujące treść
- Odpowiednie dla kategorii "${categories[category]}"
- W języku polskim

Zwróć tylko listę tytułów, każdy w nowej linii, ponumerowanych:`;

    try {
      const response = await OllamaAPI.generateText(prompt, "llama3.2", {
        temperature: 0.8,
      });

      const titles = response
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((title) => title.length > 0);

      setResults(titles);
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
          <Type size={20} />
        </div>
        <h3 className="card-title">Generator Tytułów</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">Treść lub opis</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Opisz treść artykułu, posta lub materiału..."
          className="form-textarea"
          style={{ minHeight: "120px" }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "calc(var(--spacing-unit) * 2)",
        }}
      >
        <div className="form-group">
          <label className="form-label">Kategoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            {Object.entries(categories).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Liczba tytułów</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="form-select"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={generateTitles}
        disabled={isLoading || !content.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <RefreshCw size={16} />
        )}
        Generuj Tytuły
      </button>

      {results.length > 0 && (
        <div className="result-container">
          <div className="result-title">Propozycje tytułów:</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "calc(var(--spacing-unit) * 2)",
            }}
          >
            {results.map((title, index) => (
              <div
                key={index}
                style={{
                  padding: "calc(var(--spacing-unit) * 2)",
                  background: "var(--background-card)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => navigator.clipboard.writeText(title)}
                title="Kliknij aby skopiować"
              >
                <div
                  style={{ fontWeight: "500", color: "var(--text-primary)" }}
                >
                  {index + 1}. {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
