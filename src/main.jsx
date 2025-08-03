import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { OllamaProvider } from "./contexts/OllamaContext";
import App from "./App";
import "./index.css";
import "./utils/i18n";

// Register service worker for Ollama API proxying
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/ai-mix/sw.js')
      .then((registration) => {
        console.log('Ollama Proxy SW registered:', registration);
      })
      .catch((error) => {
        console.log('Ollama Proxy SW registration failed:', error);
      });
  });
}

const Root = () => {
  const AppWithCtx = (
    <OllamaProvider>
      <App />
    </OllamaProvider>
  );

  if (import.meta.env.DEV) {
    return AppWithCtx;
  }

  return <StrictMode>{AppWithCtx}</StrictMode>;
};

createRoot(document.getElementById("root")).render(<Root />);
