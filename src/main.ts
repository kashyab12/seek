import { app, BrowserWindow, nativeTheme, ipcMain, nativeImage, globalShortcut, shell } from 'electron';
import { spawn } from "child_process"
import path from 'path';
import { generateInstalledAppsInfo, AppInfo } from '@/scripts/installed-apps';
import { openApp } from '@/scripts/open-app';

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
    icon: `${app.getAppPath()}/images/icon.png`,
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
  const resolveResult: Array<[string, string, string]> = []
  for (const appName in appsInfo) {
    const { b64Icon } = appsInfo[appName]
    resolveResult.push([appName, "1", b64Icon])
  }
  return resolveResult
}

const openAppHandler = async (_: Electron.IpcMainInvokeEvent, [searchResult]: string) => {
  try {
    const openAppOut = await openApp(appsInfo, searchResult)
    console.log(openAppOut)
    return true
  } catch (openAppError) {
    console.log(openAppError)
    return false
  }
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