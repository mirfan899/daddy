<img width="1299" height="424" alt="Daddy" src="docs/banner.png" />

**[Download for Windows and Linux](https://github.com/mirfan899/daddy/releases/latest)**

A real-time AI assistant for calls, interviews, presentations and meetings. It listens to the audio, reads your screen when asked, and shows answers in a transparent overlay.

Fork of [sohzm/cheating-daddy](https://github.com/sohzm/cheating-daddy) (GPL-3.0).

## Features

- **Live assistance** with Gemini 3.8 Live, or Groq / local models
- **Analyze Screen** (`Ctrl+Enter`): screenshot to answer, with highlighted code and a Copy button
- **Built-in browser** in the sidebar, with a persistent login
- **Profiles**: Job Interview, Sales Call, Business Meeting, Presentation, Negotiation, Exam Assistant
- **Overlay**: transparent, always on top, click-through and movable by keyboard
- **Hidden from screen capture** on Windows 10 (2004+) / 11 and macOS

## Install

Download from [Releases](https://github.com/mirfan899/daddy/releases/latest):

- **Windows**: `Daddy-<version>.Setup.exe`. The installer isn't code-signed, so in SmartScreen click *More info*, then *Run anyway*.
- **Linux**: `Daddy-<version>-x64.AppImage`. Run `chmod +x Daddy-*.AppImage`, then start it.

Then enter a [Gemini API key](https://aistudio.google.com/apikey) (or a Groq key) on the home screen.

## Keyboard shortcuts

Shortcuts use `Ctrl` on Windows/Linux and `Cmd` (`Alt` for moving the window) on macOS. You can change them in Settings.

| Action | Shortcut |
| --- | --- |
| Start session / Analyze Screen | `Ctrl+Enter` |
| Show / hide window | `Ctrl+\` |
| Toggle click-through | `Ctrl+M` |
| Move window | `Ctrl+Arrow keys` |
| Previous / next response | `Ctrl+[` / `Ctrl+]` |
| Scroll response | `Ctrl+Shift+Up` / `Ctrl+Shift+Down` |
| Emergency erase | `Ctrl+Shift+E` |

## Platform notes

- **Screen-capture hiding** works only on Windows and macOS. Linux has no OS support for it, so the app is visible in screenshots and screen shares there.
- **Audio**: Windows uses loopback (system audio). macOS uses [SystemAudioDump](https://github.com/Mohammed-Yasin-Mulla/Sound). Linux uses the microphone.

## Development

```bash
npm install
npm start          # run the app
npm run make       # build installers into out/make
```

Pushing a `v*` tag builds the Windows and Linux installers in GitHub Actions and attaches them to a release.
