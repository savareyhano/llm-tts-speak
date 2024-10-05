# LLM-TTS-Speak

Chat with LLM that speak on your audio, supports full offline mode with LibreTranslate and Ollama.

Quickstart example:

```bash
npm install
```

```bash
docker compose up --profile piper up -d
```

```bash
npm run start
```

For Piper, get the voices from [piper initial release page on github](https://github.com/rhasspy/piper/releases/tag/v0.0.2), get the `.onnx` and `.onnx.json` files from the zip and put it inside the `models` folder, then put the voice name in the `.env` file, for example:

```
PIPER_VOICE_NAME=en-us-ryan-high
```

## Docker

### VOICEVOX CPU

Start

```bash
docker compose --profile voicevox-cpu up -d
```

Stop

```bash
docker compose --profile voicevox-cpu down
```

### VOICEVOX GPU

Start

```bash
docker compose --profile voicevox-gpu up -d
```

Stop

```bash
docker compose --profile voicevox-gpu down
```

### Piper

Start

```bash
docker compose --profile piper up -d
```

Stop

```bash
docker compose --profile piper down
```

## TODO

- [ ] Write a better Docs
- [ ] LLM uses memory/memory management
- [ ] Make the code better
