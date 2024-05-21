import { fork } from "child_process"
import { TextDecoder } from "util"

const decoder = new TextDecoder('utf8')

interface InstalledAppsInfo {
    desktopPath: string;
    iconPath: string
    // execCmd: string
}

async function findAppIcon(desktopPath: string) {
    const iconsDir = "/usr/share/icons"
    const iconPathCmd = `grep Icon ${desktopPath}`
    const getIconName = fork('/bin/sh', ['-c', iconPathCmd])
    let getIconNameStdout = ""
    for await (const chunk of getIconName.stdout) {
        getIconNameStdout += decoder.decode(chunk)
    }
    if (getIconNameStdout) {
        const iconName = getIconNameStdout.split("=").at(-1).split("\n").at(0)
        const getAppIconPathCmd = `find ${iconsDir} -name '${iconName}.*' -type f`
        const getAppIconPath = fork('/bin/sh', ['-c', getAppIconPathCmd])
        let appIconPath = ""
        for await (const chunk of getAppIconPath.stdout) {
            appIconPath += decoder.decode(chunk)
        }
        return appIconPath
    }
    return getIconNameStdout
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
    const findDesktopFilesCmd = 'dpkg --search "*.desktop"'
    const getDesktopFiles = fork('/bin/sh', ['-c', findDesktopFilesCmd])
    let allDesktopFiles = ""
    for await (const chunk of getDesktopFiles.stdout) {
        allDesktopFiles += decoder.decode(chunk)
    }
    if (!allDesktopFiles) {
        throw new EvalError(`could not find any desktop files via ${findDesktopFilesCmd}`)
    }
    const filterShareAppsCmd = 'grep /usr/share/applications'
    const getFilteredShareApps = fork('/bin/sh', ['-c', filterShareAppsCmd])
    let shareApps = ""
    for await (const chunk of getFilteredShareApps.stdout) {
        shareApps += decoder.decode(chunk)
    }
    if (!shareApps) {
        throw new EvalError(`no filtered apps found via ${getFilteredShareApps}`)
    }
    const filterUniqueEntriesCmd = 'sort --unique'
    const getFilterUniqueEntries = fork("/bin/sh", ["-c", filterUniqueEntriesCmd])
    let uniqueDesktopFiles = ""
    for await (const chunk of getFilterUniqueEntries.stdout) {
        uniqueDesktopFiles += decoder.decode(chunk)
    }
    if (!uniqueDesktopFiles) {
        throw new EvalError(`could not filter unique desktop apps via ${uniqueDesktopFiles}`)
    }
    return uniqueDesktopFiles
}

async function generateInstalledAppsInfo() {
    const installedApps = await getInstalledApps()
    const appInfo: Record<string, InstalledAppsInfo> = {}
    for (const appByPath of installedApps.split("\n")) {
        if (appByPath) {
            const [app, desktopPath] = appByPath.split(": ")
            const appIcon = await findAppIcon(desktopPath)
            const iconPath = appIcon? appIcon.split("\n")[0]: ""
            // const execCmd = 
            appInfo[app] = {
                desktopPath,
                iconPath,
            }
        }
    }
    return appInfo
}