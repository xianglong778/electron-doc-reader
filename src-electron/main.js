const {app, protocol, BrowserWindow, net, shell} = require('electron')
const {dialog, ipcMain} = require('electron/main')
const fs = require('fs')
const path = require('path')
const MessageSubAndPubOfIPC = require('./Utils/MessageSubAndPubOfIPC')
const DBUtil = require('./Utils/DB')
const ReadFolderUtil = require('./Utils/ReadFolder')


function getBaseUrl() {
    const IS_DEV_ENV = true
    return IS_DEV_ENV ? 'http://localhost:12001#' : `file://${path.join(__dirname, '../dist/index.html#')}`
}

let runCodeContent = ''



/**
 * 窗口创建成功的回调
 */
function createWindowSuccessCallBack(win) {
    // 检测到进入全屏
    win.on('enter-full-screen', function () {
        win.webContents.send(MessageSubAndPubOfIPC.WINDOW_ENTER_FULL_SCREEN)
    })
    // 检测到退出全屏
    win.on('leave-full-screen', function () {
        win.webContents.send(MessageSubAndPubOfIPC.WINDOW_LEAVE_FULL_SCREEN)
    })

    // 最小化窗口
    ipcMain.handle(MessageSubAndPubOfIPC.MINIMIZE_WINDOW, function () {
        win.minimize()
    })
    // 最大化窗口
    ipcMain.handle(MessageSubAndPubOfIPC.MAXIMIZE_WINDOW, function () {
        win.isMaximized() ? win.unmaximize() : win.maximize()
    })
    // 关闭窗口
    ipcMain.handle(MessageSubAndPubOfIPC.CLOSE_WINDOW, function () {
        win.close()
    })
    // 检查窗口状态
    ipcMain.handle(MessageSubAndPubOfIPC.CHECK_FULL_SCREEN_STATE, function () {
        return win.isFullScreen()
    })
    // 打开/关闭开发者工具
    ipcMain.handle(MessageSubAndPubOfIPC.CHANGE_STATE_OF_DEV_TOOLS, function () {
        const isDevToolsOpen = win.webContents.isDevToolsOpened()
        if (isDevToolsOpen) {
            win.webContents.closeDevTools()
        } else {
            win.webContents.openDevTools()
        }
    })


    // 获取绝对路径【手动选择、SQL】
    ipcMain.handle(MessageSubAndPubOfIPC.GET_FOLDER_PATH_BY_SELECT, async function (_event, isSQL) {
        let path = ''
        if (isSQL) {
            path = await DBUtil.getFolderPathBySQL()
        } else {
            let result = await dialog.showOpenDialog({
                properties: ['openDirectory'],
                title: '选择目录',
                defaultPath: 'C:\\Users\\PC-BUGU\\Desktop',
            })
            DBUtil.addFolderPathToSQL(result.filePaths[0])
            // 检查用户是否取消了选择或没有选择任何目录
            if (result.canceled || result.filePaths.length <= 0) {
                // 用户取消了选择或没有选择目录，返回空数组或执行其他逻辑
                path = ''
            } else {
                path = result.filePaths[0]
            }
        }
        return path
    })
    // 从绝对路径中加载目录中的文件
    ipcMain.handle(MessageSubAndPubOfIPC.GET_FILE_LIST_BY_WHILE, function (_event, dirPath, isAscByFileFullName) {
        return ReadFolderUtil.ReadFolder(dirPath, isAscByFileFullName)
    })


    ipcMain.handle(MessageSubAndPubOfIPC.OPEN_RUN_CODE_WINDOW, function (_event, codeContent) {
        win.loadURL(getBaseUrl() + '/run')
        runCodeContent = codeContent
    })

    ipcMain.handle(MessageSubAndPubOfIPC.RETURN_INDEX_PAGE, function () {
        win.loadURL(getBaseUrl() + '/index')
    })
    ipcMain.handle(MessageSubAndPubOfIPC.GET_RUN_CODE_CONTENT, function () {
        return runCodeContent
    })

    // 点击 a 链接之后使用默认的浏览器打开
    ipcMain.handle(MessageSubAndPubOfIPC.OpenHrefUseBrowser, function (_event, url) {
        shell.openExternal(url)
    })

    // 读取 md 文件
    ipcMain.handle(MessageSubAndPubOfIPC.READ_MD_FILE, async function (_event, markdownFilePath) {
        return await fs.promises.readFile(markdownFilePath, 'utf-8')
    })
}


/**
 * 创建窗口
 */
function createWindow() {

    ipcMain.handle('Get-IPCConstant', (event) => {
        return MessageSubAndPubOfIPC;
    });

    let win = new BrowserWindow({
        width: 1200,
        height: 675,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false, // 是否开启浏览器的安全策略
        },
    })

    win.loadURL(getBaseUrl() + '/index').then(() => {
        win.webContents.openDevTools()
    })

    createWindowSuccessCallBack(win)
}


/**
 *  操作系统体验区别
 *      在 Windows、Linux 中
 *          - 当应用程序的所有窗口都被关闭时，程序会直接退出
 *      在 Mac 中
 *          - 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口
 *          - 当应用程序的所有窗口都被关闭时，程序不会立即退出
 */

/**
 *  当 Linux 和 Windows 应用在没有窗口打开时退出了，macOS
 */
app.on('ready', () => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})


/**
 *  关闭所有窗口，当应用程序的所有窗口都被关闭时，如果应用程序所运行的环境为
 *      - Windows   退出应用程序
 *      - Linux     退出应用程序
 *      - MaxOS     程序不会立即退出
 */
app.on('window-all-closed', function () {
    // 当前 Node.js 进程运行的操作系统平台是 Windows、Linux 时
    if (process.platform === 'win32' || process.platform === 'linux') {
        app.quit()
    }
    // 当前 Node.js 进程运行的操作系统平台是 MaxOS 时
    else if (process.platform === 'darwin') {
        // app.quit()
    }
})