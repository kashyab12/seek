import { app, BrowserWindow, nativeTheme, ipcMain, nativeImage, globalShortcut, shell } from 'electron';
import { spawn } from "child_process"
import { promises as fs } from 'fs';
import path from 'path';
import { InstalledAppsInfo, generateInstalledAppsInfo, AppInfo } from '@/scripts/installed-apps';

const appWindows: BrowserWindow[] = []
// todo: store in local storage?
let appsInfo: AppInfo = {}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): BrowserWindow => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      defaultFontSize: 26
    },
    frame: false,
    transparent: true,
  });
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  return mainWindow
};

const toSeekHandler = async (_: Electron.IpcMainInvokeEvent, [searchQuery]: string) => {
  // todo: use safeStorage to encrypt/decrypt
  const child = spawn("python", [path.join(app.getAppPath(), "scripts", "scorer.py"), searchQuery, `${app.getPath('appData')}/installed_apps.json`])
  child.stdout.setEncoding("utf8")
  child.stderr.setEncoding("utf8")
  // todo: not sure these listeners are correct, need to correct this to correctly handle this promise
  let searchResults = ""
  for await (const chunk of child.stdout) {
    searchResults += chunk
  }
  let searchError = ""
  for await (const chunk of child.stderr) {
    searchError += chunk
  }
  if (searchError && !searchError.includes("score 0")) {
    throw new Error(`subprocess exited with error ${searchError}`)
  }
  const resolveResult: Array<[string, string, string]> = []
  for (const result of searchResults.split("\n")) {
    if (!result) {
      continue
    }
    const [appName, simScore, imgPath] = result.split(/[\s:;]+/)
    if (imgPath) {
      const imgData = await fs.readFile(imgPath)
      const b64Data = Buffer.from(imgData).toString('base64')
      const imgExt = imgPath.split(".").at(-1)
      const mimeType = imgExt === "svg" ? "svg+xml" : imgExt
      const b64Icon = `data:image/${mimeType};base64,${b64Data}`
      resolveResult.push([appName, simScore, b64Icon])
    } else {
      resolveResult.push([appName, simScore, ""])
    }
  }
  return resolveResult
}

const openAppHandler = async (_: Electron.IpcMainInvokeEvent, [searchResult]: string) => {
  let searchError = ""
  // todo: use safeStorage to encrypt/decrypt
  const child = spawn("python", [path.join(app.getAppPath(), "scripts", "open_app.py"), searchResult, `${app.getPath("appData")}/installed_apps.json`])
  child.stderr.setEncoding("utf8")
  for await (const chunk of child.stderr) {
    searchError += chunk
  }
  if (searchError) {
    shell.openExternal(`file://${searchResult}`)
    return false
  }
  return true
}

const regGlobKeybinds = () => {
  globalShortcut.register('Control+Return', () => {
    appWindows.forEach(window => {
      if (window.isVisible()) {
        window.hide()
      } else {
        window.show()
        window.focus()
      }
    })
  })
}

const regWindowEvents = () => {
  appWindows.forEach(window => {
    window.on('blur', () => {
      window.hide()
    })
  })
}

ipcMain.handle("toSeek", toSeekHandler)
ipcMain.handle("openApp", openAppHandler)
ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  appWindows.push(createWindow())
  appWindows.forEach(window => {
    window.hide()
  })
  appsInfo = await generateInstalledAppsInfo()
  regGlobKeybinds()
  regWindowEvents()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});