const {contextBridge} = require('electron/renderer')
const {ipcRenderer} = require('electron/renderer')

ipcRenderer.invoke('Get-IPCConstant').then(MessageSubAndPubOfIPC => {
    contextBridge.exposeInMainWorld('electronAPI', {
        // 渲染进程 ===>>> 主进程
        minimizeWindow: () => ipcRenderer.invoke(MessageSubAndPubOfIPC.MINIMIZE_WINDOW),
        maximizeWindow: () => ipcRenderer.invoke(MessageSubAndPubOfIPC.MAXIMIZE_WINDOW),
        closeWindow: () => ipcRenderer.invoke(MessageSubAndPubOfIPC.CLOSE_WINDOW),
        changeStateOfDevTools: () => ipcRenderer.invoke(MessageSubAndPubOfIPC.CHANGE_STATE_OF_DEV_TOOLS),
        openHref: (url) => ipcRenderer.invoke(MessageSubAndPubOfIPC.OpenHrefUseBrowser, url),

        // 渲染进程 ===> 主进程 ===> 渲染进程
        getIsFullScreen: () => ipcRenderer.invoke(MessageSubAndPubOfIPC.CHECK_FULL_SCREEN_STATE),
        getFolderPath: (isSQL) => ipcRenderer.invoke(MessageSubAndPubOfIPC.GET_FOLDER_PATH_BY_SELECT, isSQL),
        getFileListByFolderPath: (folderPath, isAscByFileFullName) => ipcRenderer.invoke(MessageSubAndPubOfIPC.GET_FILE_LIST_BY_WHILE, folderPath, isAscByFileFullName),
        readMarkdownFile: (markdownFilePath) => ipcRenderer.invoke(MessageSubAndPubOfIPC.READ_MD_FILE, markdownFilePath), // 读取 markdown 文件
        openRunCodeWindow: (codeContent) => ipcRenderer.invoke(MessageSubAndPubOfIPC.OPEN_RUN_CODE_WINDOW, codeContent),
        returnIndexPage: () => ipcRenderer.invoke(MessageSubAndPubOfIPC.RETURN_INDEX_PAGE),
        getRunCodeContent: () => ipcRenderer.invoke(MessageSubAndPubOfIPC.GET_RUN_CODE_CONTENT),

        // 主进程 ===> 渲染进程
        onWindowEnterFullScreen: _callback => ipcRenderer.on(MessageSubAndPubOfIPC.WINDOW_ENTER_FULL_SCREEN, () => _callback()),
        onWindowLeaveFullScreen: _callback => ipcRenderer.on(MessageSubAndPubOfIPC.WINDOW_LEAVE_FULL_SCREEN, () => _callback()),
    })
})