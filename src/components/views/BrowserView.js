import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

const HOME_URL = 'https://www.google.com';

// Look like regular Chrome so Google sign-in doesn't reject the embedded browser.
function chromeUserAgent() {
    const v = (window.process && window.process.versions && window.process.versions.chrome) || '124.0.0.0';
    const p = navigator.platform || '';
    const os = p.startsWith('Win') ? 'Windows NT 10.0; Win64; x64' : p.startsWith('Mac') ? 'Macintosh; Intel Mac OS X 10_15_7' : 'X11; Linux x86_64';
    return `Mozilla/5.0 (${os}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v} Safari/537.36`;
}

// Turn address-bar input into a URL: full URLs pass through, bare domains get https://, anything else is a search.
function toUrl(input) {
    const s = input.trim();
    if (/^https?:\/\//i.test(s)) return s;
    if (/^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(s)) return 'https://' + s;
    return 'https://www.google.com/search?q=' + encodeURIComponent(s);
}

export class BrowserView extends LitElement {
    static properties = {
        _url: { state: true },
        _loading: { state: true },
    };

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .bar {
            display: flex;
            gap: 6px;
            padding: 8px;
            border-bottom: 1px solid var(--border);
            background: var(--bg-surface);
        }
        button {
            background: none;
            border: 1px solid var(--border);
            border-radius: 6px;
            color: var(--text-primary);
            cursor: pointer;
            min-width: 30px;
            font-size: 14px;
        }
        button:hover {
            background: var(--bg-hover);
        }
        input {
            flex: 1;
            padding: 6px 10px;
            border: 1px solid var(--border);
            border-radius: 6px;
            background: var(--bg-app);
            color: var(--text-primary);
            font-size: 13px;
        }
        webview {
            flex: 1;
            width: 100%;
        }
    `;

    constructor() {
        super();
        this._url = HOME_URL;
        this._loading = false;
        this._ua = chromeUserAgent();
    }

    get _wv() {
        return this.renderRoot.querySelector('webview');
    }

    firstUpdated() {
        const wv = this._wv;
        const sync = () => (this._url = wv.getURL());
        wv.addEventListener('did-navigate', sync);
        wv.addEventListener('did-navigate-in-page', sync);
        wv.addEventListener('did-start-loading', () => (this._loading = true));
        wv.addEventListener('did-stop-loading', () => (this._loading = false));
    }

    _go(e) {
        e.preventDefault();
        const input = this.renderRoot.querySelector('input');
        this._wv.loadURL(toUrl(input.value));
    }

    render() {
        return html`
            <form class="bar" @submit=${this._go}>
                <button type="button" title="Back" @click=${() => this._wv.canGoBack() && this._wv.goBack()}>←</button>
                <button type="button" title="Forward" @click=${() => this._wv.canGoForward() && this._wv.goForward()}>→</button>
                <button type="button" title=${this._loading ? 'Stop' : 'Reload'} @click=${() => (this._loading ? this._wv.stop() : this._wv.reload())}>
                    ${this._loading ? '✕' : '↻'}
                </button>
                <button type="button" title="Home" @click=${() => this._wv.loadURL(HOME_URL)}>⌂</button>
                <input .value=${this._url} spellcheck="false" @focus=${e => e.target.select()} />
            </form>
            <webview src=${HOME_URL} partition="persist:browser" useragent=${this._ua}></webview>
        `;
    }
}

customElements.define('browser-view', BrowserView);
