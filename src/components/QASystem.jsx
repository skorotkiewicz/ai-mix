import { useState } from "react";
import { HelpCircle, FileText } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function QASystem() {
  const [context, setContext] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sampleContexts = [
    {
      label: "Dokument firmowy",
      content: `Nasza firma została założona w 2010 roku i specjalizuje się w tworzeniu oprogramowania. Mamy 50 pracowników w trzech biurach: Warszawa, Kraków i Gdańsk. Oferujemy usługi: tworzenie aplikacji webowych, mobilnych oraz systemy ERP. Naszymi klientami są głównie firmy średnie i duże z sektora finansowego i e-commerce.`,
    },
    {
      label: "Przepisy kulinarne",
      content: `Spaghetti Carbonara: Składniki na 4 osoby: 400g spaghetti, 200g pancetta, 4 jajka, 100g parmezanu, pieprz, sól. Ugotuj makaron al dente. Usmaż pancettę. Wymieszaj jajka z parmezanem. Połącz gorący makaron z pancettą, dodaj mieszankę jajeczną poza ogniem. Dopraw pieprzem.`,
    },
  ];

  const answerQuestion = async () => {
    if (!context.trim() || !question.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = `Na podstawie poniższego kontekstu odpowiedz na pytanie. Jeśli nie możesz znaleźć odpowiedzi w kontekście, powiedz o tym jasno.

KONTEKST:
${context}

PYTANIE: ${question}

ODPOWIEDŹ:`;

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

  const loadSampleContext = (sampleContent) => {
    setContext(sampleContent);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <HelpCircle size={20} />
        </div>
        <h3 className="card-title">System Q&A</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <div className="form-label">Przykładowe konteksty:</div>
        <div
          style={{
            display: "flex",
            gap: "calc(var(--spacing-unit) * 1)",
            flexWrap: "wrap",
          }}
        >
          {sampleContexts.map((sample, index) => (
            <button
              type="button"
              key={index}
              onClick={() => loadSampleContext(sample.content)}
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
        <label className="form-label">Kontekst / Dokument</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Wklej tutaj tekst dokumentu, artykułu lub informacji, na podstawie których AI ma odpowiadać na pytania..."
          className="form-textarea"
          style={{ minHeight: "150px" }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Pytanie</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Zadaj pytanie dotyczące powyższego kontekstu..."
          className="form-textarea"
          style={{ minHeight: "80px" }}
        />
      </div>

      <button
        type="button"
        onClick={answerQuestion}
        disabled={isLoading || !context.trim() || !question.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <HelpCircle size={16} />
        )}
        Odpowiedz na Pytanie
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">Odpowiedź AI:</div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
