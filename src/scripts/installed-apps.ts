import { exec } from "child_process"
import { promisify } from "util";
import { promises as fs } from 'fs';

const execAsync = promisify(exec)

export interface InstalledAppsInfo {
    desktopPath: string;
    iconPath: string;
    b64Icon: string;
    // execCmd: string
}

export type AppInfo = Record<string, InstalledAppsInfo>

async function findAppIcon(desktopPath: string) {
    const iconsDir = "/usr/share/icons"
    const iconPathCmd = `grep Icon ${desktopPath}`
    try {
        const { stdout: getIconNameStdout, stderr: getIconNameStderr } = await execAsync(iconPathCmd)
        if (getIconNameStderr) {
            console.log(getIconNameStderr)
        }
        try {
            const iconName = getIconNameStdout.split("=").at(-1).split("\n").at(0)
            const getAppIconPathCmd = `find ${iconsDir} -name '${iconName}.*' -type f`
            const { stdout: getAppIconPathStdout, stderr: getAppIconPathStderr } = await execAsync(getAppIconPathCmd)
            if (getAppIconPathStderr) {
                console.log(getAppIconPathStderr)
            }
            return getAppIconPathStdout
        } catch (getAppIconPathError) {
            console.log(getAppIconPathError)
            return ""
        }
    } catch (getAppIconError) {
        console.log(getAppIconError)
        return ""
    }
}

// async function getAppExecCmd(desktopPath: string) {
//     const grepExecCmd = `grep Exec ${desktopPath}`
//     const getExecCmd = fork('/bin/sh', ['-c', grepExecCmd])
//     let execCmds = ""
//     for await (const chunk of getExecCmd.stdout) {
//         execCmds += decoder.decode(chunk)
//     }
//     if (!execCmds) {
//         return ""
//     }
//     const filteredExecs = []
//     for (const cmd of execCmds.split("\n")) {

//     }

// }

async function getInstalledApps() {
    try {
        const findDesktopFilesCmd = 'dpkg --search "*.desktop" | grep /usr/share/applications | sort --unique'
        const { stdout: findDesktopFilesStdout, stderr: findDesktopFilesStderr } = await execAsync(findDesktopFilesCmd)
        if (findDesktopFilesStderr) {
            console.log(findDesktopFilesStderr)
        }
        return findDesktopFilesStdout
    } catch (findDesktopFilesError) {
        console.log(findDesktopFilesError)
        return ""
    }
}

export async function generateInstalledAppsInfo() {
    const installedApps = await getInstalledApps()
    const appInfo: AppInfo = {}
    for (const appByPath of installedApps.split("\n")) {
        if (appByPath) {
            const [app, desktopPath] = appByPath.split(": ")
            const appIcon = await findAppIcon(desktopPath)
            const iconPath = appIcon ? appIcon.split("\n")[0] : ""
            let b64Icon = ""
            if (iconPath) {
                const imgData = await fs.readFile(iconPath)
                const b64Data = Buffer.from(imgData).toString('base64')
                const imgExt = iconPath.split(".").at(-1)
                const mimeType = imgExt === "svg" ? "svg+xml" : imgExt
                b64Icon = `data:image/${mimeType};base64,${b64Data}`
            }
            appInfo[app] = {
                desktopPath,
                iconPath,
                b64Icon
            }
        }
    }
    return appInfo
}