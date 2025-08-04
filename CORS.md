
# How to Enable CORS in Ollama

To allow your application (e.g., a React frontend) to access the local Ollama API from a different host, you need to enable CORS.

## Linux

1. Edit the Ollama service:
   ```bash
   sudo systemctl edit ollama.service

2. Add the following under the `[Service]` section:

   ```ini
   [Service]
   Environment="OLLAMA_ORIGINS=*"
   ```
3. Reload systemd and restart Ollama:

   ```bash
   sudo systemctl daemon-reexec
   sudo systemctl restart ollama
   ```

## macOS

1. Open Terminal and run:

   ```bash
   launchctl setenv OLLAMA_ORIGINS "*"
   ```
2. Restart the Ollama service.

## Windows (Preview)

1. Open the Control Panel and navigate to **System Environment Variables**.
2. Create a new user environment variable:

   * **Name:** `OLLAMA_ORIGINS`
   * **Value:** `*`
3. Restart the Ollama service to apply the changes.

## Docker

Run the Docker container with the CORS setting:

```bash
docker run -d --gpus=all \
  -v ollama:/root/.ollama \
  -e OLLAMA_ORIGINS="*" \
  -p 11434:11434 \
  --name ollama \
  ollama/ollama
```


## Example

`# cat /usr/lib/systemd/system/ollama.service`

```ini
[Unit]
Description=Ollama Service
Wants=network-online.target
After=network.target network-online.target

[Service]
ExecStart=/usr/bin/ollama serve
WorkingDirectory=/var/lib/ollama
Environment="HOME=/var/lib/ollama"
Environment="OLLAMA_MODELS=/var/lib/ollama"
Environment="OLLAMA_ORIGINS=*"
User=ollama
Group=ollama
Restart=on-failure
RestartSec=3
RestartPreventExitStatus=1
Type=simple
PrivateTmp=yes
ProtectSystem=full
ProtectHome=yes

[Install]
WantedBy=multi-user.target
```