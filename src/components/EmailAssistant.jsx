import { useState } from "react";
import { Mail, Send, User, Briefcase } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function EmailAssistant() {
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("professional");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const tones = {
    professional: "Profesjonalny",
    friendly: "Przyjazny",
    formal: "Formalny",
    casual: "Swobodny",
    persuasive: "Przekonujący",
  };

  const templates = [
    {
      id: "meeting",
      label: "Zaproszenie na spotkanie",
      icon: <User size={16} />,
    },
    {
      id: "follow-up",
      label: "Follow-up po spotkaniu",
      icon: <Briefcase size={16} />,
    },
    { id: "apology", label: "Email z przeprosinami", icon: <Mail size={16} /> },
    {
      id: "introduction",
      label: "Email przedstawiający się",
      icon: <User size={16} />,
    },
  ];

  const generateEmail = async () => {
    if (!purpose.trim()) return;

    setIsLoading(true);
    setError("");

    const toneInstructions = {
      professional: "profesjonalnym i biznesowym",
      friendly: "przyjaznym i ciepłym",
      formal: "formalnym i oficjalnym",
      casual: "swobodnym i nieformalnym",
      persuasive: "przekonującym i motywującym",
    };

    const prompt = `Napisz email w ${toneInstructions[tone]} tonie. 

Cel emaila: ${purpose}
${recipient ? `Odbiorca: ${recipient}` : ""}
${context ? `Dodatkowy kontekst: ${context}` : ""}

Email powinien zawierać:
- Odpowiedni temat
- Właściwe powitanie
- Główną treść
- Grzeczne zakończenie
- Podpis

Zwróć kompletny email gotowy do wysłania:`;

    try {
      const response = await OllamaAPI.generateText(prompt, "llama3.2", {
        temperature: 0.7,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const useTemplate = (templateId) => {
    const templates_content = {
      meeting:
        "Chciałbym zaprosić Cię na spotkanie w sprawie omówienia projektu. Czy masz czas w przyszłym tygodniu?",
      "follow-up":
        "Dziękuję za dzisiejsze spotkanie. Chciałbym podsumować główne punkty i następne kroki.",
      apology:
        "Chciałbym przeprosić za opóźnienie w odpowiedzi i wyjaśnić sytuację.",
      introduction:
        "Chciałbym się przedstawić jako nowy członek zespołu i nawiązać współpracę.",
    };
    setPurpose(templates_content[templateId]);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <Mail size={20} />
        </div>
        <h3 className="card-title">Asystent Email</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <div className="form-label">Szablony emaili:</div>
        <div
          style={{
            display: "flex",
            gap: "calc(var(--spacing-unit) * 1)",
            flexWrap: "wrap",
          }}
        >
          {templates.map((template) => (
            <button
              type="button"
              key={template.id}
              onClick={() => useTemplate(template.id)}
              className="btn btn-secondary"
              style={{
                fontSize: "0.8rem",
                padding:
                  "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
              }}
            >
              {template.icon}
              {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Cel emaila</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Np. Chcę zaprosić klienta na spotkanie w sprawie nowego projektu..."
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
          <label className="form-label">Odbiorca (opcjonalnie)</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Np. Pan Kowalski, dyrektor..."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ton emaila</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="form-select"
          >
            {Object.entries(tones).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Dodatkowy kontekst (opcjonalnie)</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Dodatkowe informacje, które mogą być przydatne..."
          className="form-textarea"
          style={{ minHeight: "80px" }}
        />
      </div>

      <button
        type="button"
        onClick={generateEmail}
        disabled={isLoading || !purpose.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <Send size={16} />
        )}
        Generuj Email
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">Wygenerowany email:</div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
