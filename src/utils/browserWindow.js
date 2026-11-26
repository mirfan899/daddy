const { BrowserWindow, session, shell } = require('electron');

// Built-in browser window for signing in to and using gemini.google.com.
// It's a separate sandboxed window with no Node access and its own persistent
// session, so the Google login is kept between launches.

const GEMINI_URL = 'https://gemini.google.com/app';
const PARTITION = 'persist:gemini-browser';

let browserWindow = null;

// Present as regular Chrome (no "Electron"/app tokens) so Google sign-in doesn't
// reject the window as an unsupported embedded browser.
function getChromeUserAgent() {
    const chromeVersion = process.versions.chrome || '124.0.0.0';
    const platform =
        process.platform === 'darwin'
            ? 'Macintosh; Intel Mac OS X 10_15_7'
            : process.platform === 'win32'
              ? 'Windows NT 10.0; Win64; x64'
              : 'X11; Linux x86_64';
    return `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;
}

function isHttpUrl(url) {
    try {
        const { protocol } = new URL(url);
        return protocol === 'https:' || protocol === 'http:';
    } catch {
        return false;
    }
}

function openGeminiBrowser() {
    if (browserWindow && !browserWindow.isDestroyed()) {
        if (browserWindow.isMinimized()) browserWindow.restore();
        browserWindow.setAlwaysOnTop(true, 'screen-saver', 2);
        browserWindow.show();
        browserWindow.focus();
        return browserWindow;
    }

    const userAgent = getChromeUserAgent();
    const browserSession = session.fromPartition(PARTITION);
    browserSession.setUserAgent(userAgent);

    browserWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        title: 'Gemini',
        autoHideMenuBar: true,
        webPreferences: {
            partition: PARTITION,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
        },
    });

    const contents = browserWindow.webContents;
    contents.setUserAgent(userAgent);

    // Popups (e.g. Google account chooser) open as child windows in the same session.
    contents.setWindowOpenHandler(({ url }) => {
        if (!isHttpUrl(url)) return { action: 'deny' };
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                parent: browserWindow,
                autoHideMenuBar: true,
                webPreferences: { partition: PARTITION, nodeIntegration: false, contextIsolation: true, sandbox: true },
            },
        };
    });

    // Block navigation to non-web schemes (file:, custom protocols, etc.).
    contents.on('will-navigate', (event, url) => {
        if (!isHttpUrl(url)) {
            event.preventDefault();
            if (url.startsWith('mailto:')) shell.openExternal(url);
        }
    });

    // Basic browser shortcuts: Alt+Left/Right for back/forward, F5/Ctrl+R to reload.
    contents.on('before-input-event', (event, input) => {
        if (input.type !== 'keyDown') return;
        const nav = contents.navigationHistory || contents;
        if (input.alt && input.key === 'ArrowLeft' && nav.canGoBack()) {
            nav.goBack();
            event.preventDefault();
        } else if (input.alt && input.key === 'ArrowRight' && nav.canGoForward()) {
            nav.goForward();
            event.preventDefault();
        } else if (input.key === 'F5' || ((input.control || input.meta) && input.key.toLowerCase() === 'r')) {
            contents.reload();
            event.preventDefault();
        }
    });

    // The main Daddy window is always-on-top at 'screen-saver' level; without this the
    // browser window opens hidden behind it.
    browserWindow.setAlwaysOnTop(true, 'screen-saver', 2);

    browserWindow.on('closed', () => {
        browserWindow = null;
    });

    browserWindow.loadURL(GEMINI_URL);
    return browserWindow;
}

module.exports = { openGeminiBrowser };
