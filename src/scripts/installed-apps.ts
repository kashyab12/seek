import { exec } from "child_process"
import { promisify } from "util";
import { promises as fs } from 'fs';
import { App } from "electron";

const execAsync = promisify(exec)

const enum DesktopFilePaths {
    AppsUsrShare = "/usr/share/applications",
    IconsUsrShare = "/usr/share/icons",
    AppsLocalShare = "/.local/share/applications",
    IconsLocalShare = "/.local/share/icons",
    AppsSnap = "/var/lib/snapd",
    IconsSnap = "/var/lib/snapd/desktop/icons",
    AppsFlatpak = "/var/lib/flatpak",
    IconsFlatpak = "/var/lib/flatpak/desktop/icons"
}

const enum DesktopFileProps {
    Name = "Name",
    Type = "Type",
    Icon = "Icon",
    Exec = "Exec",
    // todo: use this as keywords in the search
    Categories = "Categories",
    // terminal app?
    Terminal = "Terminal",
    // keywords?
    Comment = "Comment",
    // todo: keyword for search
    GenericName = "GenericName",
    NoDisplay = "NoDisplay"
}

export interface DesktopFile {
    name: string;
    icon: string;
    exec: string;
    type: string;
    noDisplay: boolean
}

export interface InstalledAppsInfo {
    desktopPath: string;
    iconPath: string;
    b64Icon: string;
    execCmd: string
}

export type AppInfo = Record<string, InstalledAppsInfo>

// todo: use worker threads to make concurrent.
async function findAppIcon(desktopPath: string, desktopFile: DesktopFile, electronAppInfo: App) {
    try {
        if (desktopFile.icon.includes("/")) return desktopFile.icon
        let getAppIconPathCmd: string;
        if (desktopPath.includes(DesktopFilePaths.AppsUsrShare)) {
            getAppIconPathCmd = `find ${DesktopFilePaths.IconsUsrShare} -name '${desktopFile.icon}.*' -type f`
        } else if (desktopPath.includes(DesktopFilePaths.AppsLocalShare)) {
            getAppIconPathCmd = `find ${electronAppInfo.getPath("home")}${DesktopFilePaths.IconsLocalShare} -name '${desktopFile.icon}.*' -type f`
        } else if (desktopPath.includes(DesktopFilePaths.AppsSnap)) {
            getAppIconPathCmd = `find ${DesktopFilePaths.IconsSnap} -name '${desktopFile.icon}.*' -type f`
        } else if (desktopPath.includes(DesktopFilePaths.AppsFlatpak)) {
            getAppIconPathCmd = `find ${DesktopFilePaths.IconsFlatpak} -name '${desktopFile.icon}.*' -type f`
        } else throw new EvalError('could not find any icon')
        const { stdout: getAppIconPathStdout, stderr: getAppIconPathStderr } = await execAsync(getAppIconPathCmd)
        if (getAppIconPathStderr) console.log(getAppIconPathStderr)
        return getAppIconPathStdout.split("\n")[0]
    } catch (getAppIconPathError) {
        console.log(getAppIconPathError)
        return ""
    }
}

async function imgToB64(imagePath: string) {
    try {
        if (!imagePath) return ""
        const imgData = await fs.readFile(imagePath)
        const b64Data = Buffer.from(imgData).toString('base64')
        const imgExt = imagePath.split(".").at(-1)
        const mimeType = imgExt === "svg" ? "svg+xml" : imgExt
        return `data:image/${mimeType};base64,${b64Data}`
    } catch (convertError) {
        console.error(convertError)
        return ""
    }
}

async function getInstalledApps(electronAppInfo: App) {
    try {
        // sifting through diff locations where .desktop files would exist
        const validPaths = [DesktopFilePaths.AppsUsrShare, `${electronAppInfo.getPath("home")}${DesktopFilePaths.AppsLocalShare}`, DesktopFilePaths.AppsSnap, DesktopFilePaths.AppsFlatpak]
        const findDesktopFilesCmd = 'locate "*.desktop"'
        const { stdout: findDesktopFilesStdout, stderr: findDesktopFilesStderr } = await execAsync(findDesktopFilesCmd)
        if (findDesktopFilesStderr) console.log(findDesktopFilesStderr)
        return findDesktopFilesStdout.split("\n").filter(desktopPath => {
            return validPaths.some(validPath => desktopPath.includes(validPath))
        })
    } catch (findDesktopFilesError) {
        console.log(findDesktopFilesError)
        return []
    }
}

async function desktopFileParser(desktopFilePath: string) {
    const desktopFile: DesktopFile = {
        name: "",
        icon: "",
        exec: "",
        type: "",
        noDisplay: false
    }
    try {
        const unstructDesktop: string = await fs.readFile(desktopFilePath, { encoding: 'utf-8' })
        const props: string[] = unstructDesktop.split('\n').filter(line => line.trim() !== '' && !line.startsWith("#") && !line.startsWith("["));
        for (const desktopProp of props) {
            const [desktopKey, desktopValue] = desktopProp.split("=", 2)
            switch (desktopKey.trim()) {
                case DesktopFileProps.Name:
                    if (!desktopFile.name) desktopFile.name = desktopValue.trim()
                    break
                case DesktopFileProps.Icon:
                    if (!desktopFile.icon) desktopFile.icon = desktopValue.trim()
                    break
                case DesktopFileProps.Exec:
                    if (desktopFile.exec) desktopFile.exec = desktopValue.trim()
                    break
                case DesktopFileProps.Type:
                    desktopFile.type = desktopValue.trim()
                    break
                case DesktopFileProps.NoDisplay:
                    desktopFile.noDisplay = Boolean(desktopValue.trim())
                    break
            }
        }
    } catch (parsingError) {
        console.error(parsingError)
    }
    return desktopFile
}

export async function generateInstalledAppsInfo(electronAppInfo: App) {
    const installedApps = await getInstalledApps(electronAppInfo)
    const appInfo: AppInfo = {}
    // todo: make concurrent via worker threads
    for (const desktopPath of installedApps) {
        const desktopFile = await desktopFileParser(desktopPath)
        if (desktopFile.noDisplay || desktopFile.type.toLowerCase() != 'application') continue
        const iconPath = await findAppIcon(desktopPath, desktopFile, electronAppInfo)
        const b64Icon = await imgToB64(iconPath)
        appInfo[desktopFile.name] = {
            desktopPath,
            iconPath,
            b64Icon,
            execCmd: desktopFile.exec
        }
    }
    return appInfo
}