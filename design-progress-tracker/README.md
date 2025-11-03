<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/13YXxK8mtxQsJvumPDmqACW9WDPEHfDqf

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run with Docker (Windows & cross-platform)

The project now includes a multi-stage Dockerfile that works with Docker Desktop on Windows (Linux containers) as well as other platforms.

### Build the image

From the `design-progress-tracker` directory run:

```powershell
docker build -t design-progress-tracker .
```

### Run the container

Provide your Gemini API key when starting the container. In PowerShell you can run:

```powershell
$Env:API_KEY="your_api_key_here"
docker run --rm -it -p 4173:4173 -e API_KEY $Env:API_KEY design-progress-tracker
```

Then open http://localhost:4173 in your browser.

> [!TIP]
> If you prefer command prompt (`cmd`), replace the environment variable assignment with `set API_KEY=your_api_key_here` and use `%API_KEY%` in the `docker run` command.
