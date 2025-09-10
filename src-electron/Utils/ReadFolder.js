const path = require('path')
const fs = require("fs");


/**
 * 相关配置
 */
const FileTreeConfig = {
    /**
     * 文件树节点的数据结构
     */
    fileNodeObj: {
        id: 1,
        parentId: 0,
        fileAbsolutePath: '',
        fileFullName: '',
        fileExtensionName: '',
        fileSize: 0,
        children: [],
        nodeType: '',
        fileType: '',
        fileIcon: '',
        createTime: '',
        updateTime: '',
    },

    /**
     * 图标
     */
    iconMap: {
        'un-empty': '\ue671',
        'empty': '\ue671',
        'jpg': '\ue601',
        'png': '\ue69e',
        'md': '\ue705',
        'other996': '\ue677',
    },

    /**
     * 每次构建文件树时，文件 id 的起始值，默认根节点的 id 为 1
     */
    DFSIndex: 1,
}


/**
 * 格式化时间
 */
function formatDate(dateString) {
    // 创建一个 Date 对象
    const date = new Date(dateString);
    // 提取各个部分
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    // 格式化日期字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


/**
 * 格式化字节数（如 KB、MB、GB 等）。
 *
 * @param {number} bytes - 要转换的字节数。
 * @param {number} [decimals=2] - 保留的小数位数，默认为 2。
 * @returns {string} - 格式化后的字符串，包含数值和单位。
 */
function getFormatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    // 定义单位数组，从最小的 Bytes 到最大的 YB
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = 0;
    // 通过除以 1024 来找到适当的单位，直到字节数小于 1024 或达到最大单位
    while (bytes >= 1024 && i < sizes.length - 1) {
        bytes /= 1024
        i++
    }
    // 使用 toFixed 方法保留指定的小数位数，并返回格式化后的字符串
    return parseFloat(bytes.toFixed(decimals)) + ' ' + sizes[i]
}


/**
 * 从绝对路径中提取文件全名
 */
function getFileFullNameByAbsolutePath(absolutePath) {
    return path.basename(absolutePath)
}


/**
 * 从绝对路径中提取文件扩展名
 */
function getFileExtensionName(absolutePath) {
    let fileFullName = path.basename(absolutePath)
    let extensionName = ''
    if (fileFullName.includes('.')) {
        let parts = fileFullName.split('.')
        extensionName = parts[parts.length - 1]
    }
    return extensionName
}


/**
 * 读取根文件
 */
function getRootNode(folderAbsolutePath) {
    const stat = fs.statSync(folderAbsolutePath)
    return {
        id: FileTreeConfig.DFSIndex++,
        fileAbsolutePath: folderAbsolutePath,
        fileFullName: getFileFullNameByAbsolutePath(folderAbsolutePath),
        fileExtensionName: getFileExtensionName(folderAbsolutePath),
        fileSize: 0,
        nodeType: 'folder',
        createTime: stat.birthtime,
        updateTime: stat.mtime,
        parentId: 0,
        children: [],
    }
}


/**
 * 读取子文件【基于DFS使用fs进行目录结构的搜搜，结果保存为list】
 */
function dfsReadDir(list) {
    // 1. 找到当前节点【必是文件夹】
    let nowNode = list[list.length - 1]
    // 2. 读取目录
    const children = fs.readdirSync(nowNode.fileAbsolutePath, {withFileTypes: true})
    // 3. 处理当前节点的子节点
    for (let i = 0; i < children.length; i++) {
        const stat = fs.statSync(path.join(nowNode.fileAbsolutePath, children[i].name))
        // 文件
        if (children[i].isFile()) {
            let itemFile = {
                id: FileTreeConfig.DFSIndex++,
                fileAbsolutePath: path.join(nowNode.fileAbsolutePath, children[i].name),
                fileFullName: getFileFullNameByAbsolutePath(path.join(nowNode.fileAbsolutePath, children[i].name)),
                fileExtensionName: getFileExtensionName(path.join(nowNode.fileAbsolutePath, children[i].name)),
                fileSize: stat.size,
                nodeType: 'file',
                createTime: stat.birthtime,
                updateTime: stat.mtime,
                parentId: nowNode.id,
                children: [],
            }
            list.push(itemFile)
        }
        // 文件夹
        else if (children[i].isDirectory()) {
            let itemFile = {
                id: FileTreeConfig.DFSIndex++,
                fileAbsolutePath: path.join(nowNode.fileAbsolutePath, children[i].name),
                fileFullName: getFileFullNameByAbsolutePath(path.join(nowNode.fileAbsolutePath, children[i].name)),
                fileExtensionName: getFileExtensionName(path.join(nowNode.fileAbsolutePath, children[i].name)),
                fileSize: 0,
                nodeType: 'folder',
                createTime: stat.birthtime,
                updateTime: stat.mtime,
                parentId: nowNode.id,
                children: [],
            }
            list.push(itemFile)
            dfsReadDir(list)
        }
    }
}


/**
 *  获取所有文件树节点
 */
function getAllNode(rootNode) {
    let list = [rootNode]
    dfsReadDir(list)
    return list
}


/**
 * 建树
 */
function createTree(fileNodeList) {
    const rootNodeId = 1
    // 1. 预处理
    let map = {}
    fileNodeList.forEach(fileNode => map[fileNode.id] = fileNode)
    // 2. 列表转树
    fileNodeList.forEach(fileNode => {
        if (fileNode.id !== rootNodeId) {
            map[fileNode.parentId].children.push(fileNode)
        }
    })
    // 3. 找根节点
    let rootNode
    for (let i = 0; i < fileNodeList.length; i++) {
        if (fileNodeList[i].id === rootNodeId) {
            rootNode = fileNodeList[i]
            break
        }
    }
    return rootNode
}


/**
 * 计算并设置文件树所有的节点所占空间的字节数
 */
function setFileSize(fileNode) {
    let count = 0
    fileNode.children.forEach(child => {
        if (child.nodeType === 'file') {
            count = count + child.fileSize
        }
        if (child.nodeType === 'folder') {
            if (child.fileSize === 0) {
                setFileSize(child)
            }
            count = count + child.fileSize
        }
    })
    fileNode.fileSize = count
}


/**
 * 格式化文件树所有节点的属性
 */
function formatNodeAttributes(fileNode) {
    // 1. 处理当前节点
    {
        // 文件
        if (fileNode.nodeType === 'file') {
            fileNode.fileType = fileNode.fileExtensionName
            fileNode.fileIcon = FileTreeConfig.iconMap[fileNode.fileType] || FileTreeConfig.iconMap['other996']
        }
        // 非空文件夹
        if (fileNode.nodeType === 'folder' && fileNode.children.length > 0) {
            fileNode.fileType = 'un-empty'
            fileNode.fileIcon = FileTreeConfig.iconMap['un-empty']
        }
        // 空文件夹
        if (fileNode.nodeType === 'folder' && fileNode.children.length === 0) {
            fileNode.fileType = 'empty'
            fileNode.fileIcon = FileTreeConfig.iconMap['empty']
        }
    }
    {
        fileNode.fileSize = getFormatBytes(parseInt(fileNode.fileSize))
        fileNode.createTime = formatDate(fileNode.createTime)
        fileNode.updateTime = formatDate(fileNode.updateTime)
    }
    // 2. 处理子节点
    fileNode.children.forEach(fileNode => formatNodeAttributes(fileNode))
}


/**
 * 对节点排序【冒泡排序】
 */
function bubbleSortByDFS(node, isAscByFileFullName) {
    // 文件名升序
    if (isAscByFileFullName) {
        for (let i = 0; i < node.children.length; i++) {
            for (let j = i + 1; j < node.children.length; j++) {
                // 文件夹在前，文件在后，不需要交换
                if (node.children[i].nodeType === 'folder' && node.children[j].nodeType === 'file') {
                    continue
                }
                // 文件在前，文件夹在后，是需要交换
                if (node.children[i].nodeType === 'file' && node.children[j].nodeType === 'folder') {
                    [node.children[i], node.children[j]] = [node.children[j], node.children[i]]
                    continue
                }
                // 此时节点类型必相同的，文件名升序【文件名称不可能相同】
                if (node.children[i].fileFullName > node.children[j].fileFullName) {
                    [node.children[i], node.children[j]] = [node.children[j], node.children[i]]
                }
            }
        }
    }
    // 文件名降序
    else {
        for (let i = 0; i < node.children.length; i++) {
            for (let j = i + 1; j < node.children.length; j++) {
                // 文件夹在前，文件在后，不需要交换
                if (node.children[i].nodeType === 'file' && node.children[j].nodeType === 'folder') {
                    continue
                }
                // 文件在前，文件夹在后，是需要交换
                if (node.children[i].nodeType === 'folder' && node.children[j].nodeType === 'file') {
                    [node.children[i], node.children[j]] = [node.children[j], node.children[i]]
                    continue
                }
                // 此时节点类型必相同的，文件名降序
                if (node.children[i].fileFullName < node.children[j].fileFullName) {
                    [node.children[i], node.children[j]] = [node.children[j], node.children[i]]
                }
            }
        }
    }
    for (let item of node.children) {
        bubbleSortByDFS(item, isAscByFileFullName)
    }
}


module.exports = {
    /**
     * 文件夹的绝对路径 ==>> 已经处理好的文件树
     */
    ReadFolder: (folderAbsolutePath, isAscByFileFullName = true) => {
        // 1. 初始化【每次重新构建树需要初始化这个 id】
        FileTreeConfig.DFSIndex = 1
        // 2. 获取根文件夹的文件树节点
        let folderNode = getRootNode(folderAbsolutePath)
        // 3. 获取所有的文件树节点
        let list = getAllNode(folderNode)
        // 4. 使用所有的文件树节点构建文件树并返回根节点【list 转 tree】
        let rootNode = createTree(list)
        // 5. 格式化文件树所有节点的属性
        setFileSize(rootNode)
        formatNodeAttributes(rootNode)
        // 6. 对节点排序，设置节点的排序规则
        bubbleSortByDFS(rootNode, isAscByFileFullName)
        return rootNode
    }
}