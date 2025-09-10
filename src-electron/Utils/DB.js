const sqlite3 = require('sqlite3')


const DB = {
    _db: new sqlite3.Database('sql.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE),
    executeSQL: (sql, params) => {
        return new Promise((resolve, reject) => {
            DB._db.get(sql, params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    },
    executeCreateTableSQL: (sql) => {
        return new Promise((resolve, reject) => {
            DB._db.get(sql, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    },
}


/**
 * 建表
 */
DB.executeCreateTableSQL('create table if not exists t_config (id INT, dir_path TEXT)')
    .then(() => {
        console.log('Create Table Success')
    })
    .catch(() => {
        console.error('Create Table Error')
    })


/**
 * 从数据库中读取一个绝对路径
 */
const getFolderPathBySQL = async () => {
    let querySQL = 'select dir_path as path from t_config where id = ?'
    let queryParams = [1]
    const data = await DB.executeSQL(querySQL, queryParams)
    return data.path === null ? '' : data.path
}


/**
 *  向数据库中写入一个绝对路径
 */
const addFolderPathToSQL = (folderPath) => {
    let querySQL = 'select count(dir_path) as count from t_config where id = ?'
    let queryParams = [1]
    let insertSQL = 'insert into t_config (id, dir_path) values (?, ?)'
    let insertParams = [1, folderPath]
    let updateSQL = 'UPDATE t_config SET dir_path = ? WHERE id = ?'
    let updateParams = [folderPath, 1]

    DB.executeSQL(querySQL, queryParams)
        .then(data => {
            // 未查询到数据，新增即可
            if (data.count === 0) {
                DB.executeSQL(insertSQL, insertParams)
                    .then(() => {
                        console.log(`将 ${folderPath} 保存到SQL中成功`)
                    })
                    .catch(() => {
                        console.error(`将 ${folderPath} 保存到SQL中失败`)
                    })
            }
            // 查询到数据，修改即可
            else {
                DB.executeSQL(updateSQL, updateParams)
                    .then(() => {
                        console.log(`将 ${folderPath} 修改到SQL中成功`)
                    })
                    .catch(() => {
                        console.error(`将 ${folderPath} 修改到SQL中失败`)
                    })
            }
        })
        .catch(error => {
            console.error('Error', error.message)
        })
}


module.exports = {
    getFolderPathBySQL,
    addFolderPathToSQL,
}