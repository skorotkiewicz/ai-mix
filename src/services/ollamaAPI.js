export class OllamaAPI {
  static getOllamaUrl() {
    return localStorage.getItem("ollamaUrl") || "http://localhost:11434";
  }

  static getSelectedModel() {
    return localStorage.getItem("selectedModel") || "llama3.2";
  }

  static isLocalUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      return hostname === 'localhost' || 
             hostname === '127.0.0.1' || 
             hostname.startsWith('192.168.') ||
             hostname.startsWith('10.') ||
             hostname.startsWith('172.');
    } catch {
      return false;
    }
  }

  static async makeProxiedRequest(url, options = {}) {
    const ollamaUrl = OllamaAPI.getOllamaUrl();
    
    // If it's a local URL and we're likely on a public domain, use service worker proxy
    if (OllamaAPI.isLocalUrl(ollamaUrl) && window.location.protocol === 'https:') {
      const proxyHeaders = {
        ...options.headers,
        'X-Ollama-Proxy': 'true',
        'X-Ollama-Target-URL': url
      };

      return fetch(window.location.origin, {
        ...options,
        headers: proxyHeaders
      });
    }
    
    // Direct request for non-local URLs or HTTP contexts
    return fetch(url, options);
  }

  static async generateText(prompt, model = null, options = {}) {
    const ollamaUrl = OllamaAPI.getOllamaUrl();
    const selectedModel = model || OllamaAPI.getSelectedModel();

    try {
      const response = await OllamaAPI.makeProxiedRequest(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            ...options,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Ollama API Error:", error);
      throw new Error(
        `Failed to connect to Ollama. Make sure Ollama is running on ${ollamaUrl}`,
      );
    }
  }

  static async streamChat(messages, model = null, onChunk) {
    const ollamaUrl = OllamaAPI.getOllamaUrl();
    const selectedModel = model || OllamaAPI.getSelectedModel();

    try {
      const response = await OllamaAPI.makeProxiedRequest(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              onChunk(parsed.message.content);
            }
          } catch (_e) {
            // Skip invalid JSON lines
          }
        }
      }
    } catch (error) {
      console.error("Ollama Stream Error:", error);
      throw new Error(
        `Failed to connect to Ollama. Make sure Ollama is running on ${ollamaUrl}`,
      );
    }
  }

  static async getAvailableModels(customUrl = null) {
    const ollamaUrl = customUrl || OllamaAPI.getOllamaUrl();

    try {
      const response = await OllamaAPI.makeProxiedRequest(`${ollamaUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error("Failed to get models:", error);
      return [];
    }
  }
}
