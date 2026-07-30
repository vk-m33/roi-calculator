# Building ROI Calculator — Desktop App (Tauri v2)

The desktop application uses [Tauri v2](https://tauri.app), which wraps the Vite + React
frontend in a native Windows window via WebView2. The result is a ~15 MB installer that
runs completely offline.

---

## 1. Prerequisites

These are **developer** prerequisites. End users only need WebView2 (pre-installed on
Windows 10 21H2+ and Windows 11).

### 1a. Rust toolchain

```powershell
winget install Rustlang.Rustup
# Close and re-open your terminal, then:
rustup default stable
rustup update
```

Verify: `rustc --version` and `cargo --version` should both print version numbers.

### 1b. Visual Studio Build Tools 2022

Download from https://visualstudio.microsoft.com/visual-cpp-build-tools/ and install with the
**"Desktop development with C++"** workload selected. This provides MSVC, the Windows SDK, and CMake.

### 1c. WebView2 (end-user runtime)

Pre-installed on Windows 10 21H2+ and Windows 11. No installation needed for end users on
modern Windows. On older machines (Windows 10 before 21H2), users must install WebView2 separately
from https://developer.microsoft.com/en-us/microsoft-edge/webview2/

---

## 2. First-time setup

```bash
# Install all npm dependencies (including @tauri-apps/cli)
npm install

# Generate app icons (creates all required sizes in src-tauri/icons/)
npm run tauri icon src/assets/app-icon.svg
```

The `tauri icon` command generates:
`32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.icns`, `icon.ico`

To use a custom icon, replace `src/assets/app-icon.svg` with any square SVG or PNG ≥ 1024×1024 px.

---

## 3. Development workflow

```bash
npm run tauri:dev
```

This command:
1. Starts the Vite dev server on `http://localhost:5173`
2. Compiles the Rust backend (first run takes 1–3 minutes; subsequent runs are fast)
3. Opens the app in a native window with full HMR support

Rust changes require a Tauri restart; frontend changes hot-reload instantly.

---

## 4. Production build

```bash
npm run tauri:build
```

This command:
1. Runs `npm run build` (Vite production bundle → `dist/`)
2. Compiles the Rust backend in release mode
3. Bundles everything into distributable installers

First release build takes 3–5 minutes. Subsequent builds are faster (incremental Rust
compilation).

### Debug build (keeps dev tools accessible)

```bash
npm run tauri:build:debug
```

---

## 5. Output locations

| Artifact | Path |
|---|---|
| NSIS installer (.exe) | `src-tauri/target/release/bundle/nsis/ROI Calculator_0.1.0_x64-setup.exe` |
| MSI installer (.msi) | `src-tauri/target/release/bundle/msi/ROI Calculator_0.1.0_x64_en-US.msi` |
| Raw executable | `src-tauri/target/release/roi-calculator.exe` |

Distribute either the `.exe` (NSIS, guided installer) or the `.msi` (Windows Installer,
suitable for enterprise deployment via Group Policy).

---

## 6. Versioning

The application version is defined in **`src-tauri/tauri.conf.json`**:

```json
{
  "version": "0.1.0"
}
```

Update this value before each release. The version appears in the window title bar, the
installer filename, and Add/Remove Programs.

---

## 7. Code signing (optional)

Unsigned builds will display a SmartScreen warning on first launch. For distribution:

1. Obtain an Authenticode code signing certificate (EV or standard OV)
2. Set environment variables before building:

```powershell
$env:TAURI_SIGNING_PRIVATE_KEY = "path/to/private.key"
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = "your-password"
npm run tauri:build
```

For personal or internal use, SmartScreen warnings can be dismissed and signing is not required.

---

## 8. App data and preferences

User preferences (dark/light theme) are stored in the browser's `localStorage` within the
WebView2 profile, persisted at:

```
%APPDATA%\com.roicalculator.app\
```

This directory is created automatically on first launch.

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `cargo: command not found` | Rust is not installed — see §1a |
| `LINK : fatal error LNK1181` | VS Build Tools missing — see §1b |
| White/blank window on launch | WebView2 not installed; run the installer on the target machine |
| Port 5173 already in use | Kill the process occupying the port or change `port` in `vite.config.js` (and `devUrl` in `tauri.conf.json`) |
| Icons missing build error | Run `npm run tauri icon src/assets/hero.png` — see §2 |
