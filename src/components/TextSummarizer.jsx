import { useState } from "react";
import { FileText, Minimize2 } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function TextSummarizer() {
  const [text, setText] = useState("");
  const [summaryType, setSummaryType] = useState("bullet");
  const [length, setLength] = useState("medium");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const summaryTypes = {
    bullet: "Punkty kluczowe",
    paragraph: "Akapit opisowy",
    abstract: "Abstrakt naukowy",
    executive: "Streszczenie wykonawcze",
  };

  const lengths = {
    short: "Krótkie (2-3 zdania)",
    medium: "Średnie (1 akapit)",
    long: "Długie (2-3 akapity)",
  };

  const sampleTexts = [
    {
      label: "Artykuł naukowy",
      content: `Sztuczna inteligencja (AI) to technologia, która pozwala maszynom wykonywać zadania zwykle wymagające ludzkiej inteligencji. W ostatnich latach AI dokonała znaczących postępów w dziedzinach takich jak rozpoznawanie obrazów, przetwarzanie języka naturalnego i uczenie maszynowe. Głębokie uczenie się, poddziedzina AI, wykorzystuje sieci neuronowe do analizy dużych zbiorów danych. Zastosowania AI obejmują autonomiczne pojazdy, diagnostykę medyczną, tłumaczenie językowe i systemy rekomendacji. Jednak rozwój AI rodzi także pytania etyczne dotyczące prywatności, bezpieczeństwa i wpływu na rynek pracy.`,
    },
    {
      label: "Tekst biznesowy",
      content: `Nasze przedsiębiorstwo przechodzi przez okres transformacji cyfrowej mającej na celu zwiększenie efektywności operacyjnej i poprawę doświadczenia klientów. Plan strategiczny obejmuje implementację nowych systemów IT, automatyzację procesów, szkolenie personelu oraz inwestycje w technologie chmurowe. Przewidujemy, że pełna transformacja zajmie 18 miesięcy i przyniesie oszczędności w wysokości 2 milionów złotych rocznie. Kluczowymi elementami są: modernizacja infrastruktury, integracja systemów CRM i ERP, oraz wprowadzenie rozwiązań Business Intelligence.`,
    },
  ];

  const summarizeText = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    const typeInstructions = {
      bullet: "w formie punktów kluczowych",
      paragraph: "w formie spójnego akapitu",
      abstract: "w formie abstrakt naukowy z najważniejszymi informacjami",
      executive: "w formie streszczenia wykonawczego dla kadry zarządzającej",
    };

    const lengthInstructions = {
      short: "bardzo krótkie (2-3 zdania)",
      medium: "średnie (około 100-150 słów)",
      long: "szczegółowe (około 200-300 słów)",
    };

    const prompt = `Stwórz ${lengthInstructions[length]} streszczenie następującego tekstu ${typeInstructions[summaryType]}:

${text}

Streszczenie powinno zawierać najważniejsze informacje i być napisane w języku polskim:`;

    try {
      const response = await OllamaAPI.generateText(prompt, "llama3.2", {
        temperature: 0.3,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleText = (content) => {
    setText(content);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <FileText size={20} />
        </div>
        <h3 className="card-title">Podsumowywacz Tekstu</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <div className="form-label">Przykładowe teksty:</div>
        <div
          style={{
            display: "flex",
            gap: "calc(var(--spacing-unit) * 1)",
            flexWrap: "wrap",
          }}
        >
          {sampleTexts.map((sample, index) => (
            <button
              type="button"
              key={index}
              onClick={() => loadSampleText(sample.content)}
              className="btn btn-secondary"
              style={{
                fontSize: "0.8rem",
                padding:
                  "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
              }}
            >
              <FileText size={14} />
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tekst do podsumowania</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wklej tutaj długi tekst, artykuł lub dokument do podsumowania..."
          className="form-textarea"
          style={{ minHeight: "150px" }}
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
          <label className="form-label">Typ streszczenia</label>
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="form-select"
          >
            {Object.entries(summaryTypes).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Długość</label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="form-select"
          >
            {Object.entries(lengths).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={summarizeText}
        disabled={isLoading || !text.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <Minimize2 size={16} />
        )}
        Podsumuj Tekst
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">Streszczenie:</div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
