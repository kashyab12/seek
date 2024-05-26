## Setup
Please ensure you have [nodejs intalled](https://nodejs.org/en/download/package-manager). [nvm](https://github.com/nvm-sh/nvm) is a popular option to manage multiple nodejs versions. Once you've cloned the project, `cd` into the project directory and if you have [nvm](https://github.com/nvm-sh/nvm) installed run `nvm use` to install the identical nodejs version to what I've used while developing this. Once done, execute the following to install the project dependencies and run the project with hot reloading enabled:
```bash
$ npm install && npm run start
```
* Press **ctrl+enter** to display seek and search for apps.
* To close the app press **ctrl+q** or open the tray menu (located on the top right corner) and click 'Exit'.
* To get the chrome debugger view (in order to debug the renderer process) uncomment the `mainWindow.webContents.openDevTools();` line in `main.ts`.
* Instructions on debugging the main process can be found in the [electron docs](https://www.electronjs.org/docs/latest/tutorial/debugging-main-process).
