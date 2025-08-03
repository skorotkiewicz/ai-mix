import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError("");

    try {
      const assistantMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      await OllamaAPI.streamChat(
        [...messages, userMessage],
        "llama3.2",
        (chunk) => {
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content += chunk;
            return newMessages;
          });
        },
      );
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.slice(0, -1)); // Remove empty assistant message
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <MessageCircle size={20} />
        </div>
        <h3 className="card-title">Chat z AI</h3>
        <button
          type="button"
          onClick={clearChat}
          className="btn btn-secondary"
          style={{ marginLeft: "auto" }}
        >
          <Trash2 size={16} />
          Wyczyść
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div ref={chatContainerRef} className="chat-container">
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              marginTop: "100px",
            }}
          >
            Rozpocznij rozmowę z AI...
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.role}`}>
              <div
                style={{
                  fontWeight: "500",
                  marginBottom: "calc(var(--spacing-unit) * 1)",
                }}
              >
                {message.role === "user" ? "Ty" : "AI"}
              </div>
              <div>{message.content}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="chat-message assistant">
            <div
              style={{
                fontWeight: "500",
                marginBottom: "calc(var(--spacing-unit) * 1)",
              }}
            >
              AI
            </div>
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "calc(var(--spacing-unit) * 2)" }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Napisz wiadomość..."
          className="form-textarea"
          style={{ minHeight: "60px", flex: 1 }}
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="btn"
          style={{ alignSelf: "flex-end" }}
        >
          <Send size={16} />
          Wyślij
        </button>
      </div>
    </div>
  );
}
