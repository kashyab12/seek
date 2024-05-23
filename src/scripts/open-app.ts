import { exec } from "child_process"
import { promisify } from "util";
import { AppInfo } from "@/scripts/installed-apps";

const execAsync = promisify(exec)

export async function openApp(appInfo: AppInfo, appName: string) {
    try {
        const launchAppCmd = `gio launch ${appInfo[appName].desktopPath}`
        const launchApp = await execAsync(launchAppCmd)
        return launchApp.stdout
    } catch (launchError) {
        throw launchError
    }
} 