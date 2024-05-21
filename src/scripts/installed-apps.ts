import { fork } from "child_process"
import { TextDecoder } from "util"

const decoder = new TextDecoder('utf8')

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

async function getInstalledApps() {
    const findDesktopFilesCmd = 'dpkg --search "*.desktop"'
    const getDesktopFiles = fork('/bin/sh', ['-c', findDesktopFilesCmd])
    const filterShareApps = 'grep /usr/share/applications'
    const filterUniqueEntries = 'sort --unique'
}