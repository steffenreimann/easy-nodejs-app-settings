var path = require('path')
var fs = require('fs')

var EventEmitter = require('events').EventEmitter;

var ev = new EventEmitter();



module.exports.settingFilePath = ''
module.exports.data = {}
module.exports.isInit = false
module.exports.doLogging = false




var init = (App, Interval) => {
    return new Promise((resolve, reject) => {
        var AppName = App
        var WatcherInterval = Interval || 5000
        module.exports.settingFilePath = path.join(process.env.LOCALAPPDATA, AppName, `settings.json`)
        log('Init Settings File - Path is ->', module.exports.settingFilePath)
        getSettings().then((resolveData) => {
            watchSttingsFile(module.exports.settingFilePath, WatcherInterval)
            resolve(resolveData)
        }, (err) => {
            if (err.code == 'ENOENT') {
                dir(path.dirname(module.exports.settingFilePath)).then((dirERR) => {
                    if (dirERR) {
                        reject(dirERR)
                    } else {
                        fs.writeFile(module.exports.settingFilePath, JSON.stringify({ App: AppName }), { recursive: true }, (fileERR) => {
                            if (fileERR) {
                                log('Cant write Settings File!')
                                //log('File write error')
                                reject(fileERR)
                            } else {
                                log('Settings File is Created.')
                                //log('reading file after write')
                                getSettings().then((settings) => {
                                    module.exports.isInit = true
                                    watchSttingsFile(module.exports.settingFilePath, WatcherInterval)
                                    resolve(settings)

                                }, (errr) => { reject(errr) })
                            }
                        })
                    }
                }, reject);
            } else {
                reject(err)
            }
        })
    })
}
var getSettings = () => {
    return new Promise((resolve, reject) => {
        //log('Reading Settings File - ', module.exports.settingFilePath)

        fs.readFile(module.exports.settingFilePath, function (err, data) {
            if (err) {
                log('Read Settings File Failed')
                reject(err)
            } else {
                module.exports.data = JSON.parse(data.toString())
                resolve(module.exports.data)
            }
        });
    })
}

var setSettings = (data) => {
    return new Promise((resolve, reject) => {
        //log('Set Settings', module.exports.settingFilePath)


        fs.writeFile(module.exports.settingFilePath, JSON.stringify(data), { recursive: true }, (fileERR) => {
            if (fileERR) {
                log('Write Settings File Failed')
                reject(fileERR)
            } else {
                getSettings().then((settings) => { resolve(settings) }, (errr) => { reject(errr) })
            }
        })
    })
}

var setKey = (data) => {
    return new Promise((resolve, reject) => {
        // log(module.exports.settingFilePath)

        getSettings().then((settings) => {

            setObjKeys(settings, data).then((newSettings) => {

                log('Save Settings File', newSettings)

                fs.writeFile(module.exports.settingFilePath, JSON.stringify(newSettings), { recursive: true }, (fileERR) => {
                    if (fileERR) {
                        log('Write Settings File Failed')
                        reject(fileERR)
                    } else {
                        getSettings().then((settings) => { resolve(settings) }, (errr) => { reject(errr) })
                    }
                })

            })
        }, reject)
    })
}

var getKey = (data) => {
    return new Promise((resolve, reject) => {
        //log(module.exports.settingFilePath)

        getSettings().then((settings) => {
            resolve(index(settings, data))
        }, reject)
    })
}

var dir = (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(dirPath, (dirERR) => { if (dirERR) { if (dirERR.code == 'EEXIST') { resolve(null) } else { reject(dirERR) } } else { resolve(null) } })
    })
}

function log() {
    if (module.exports.doLogging) {
        var args = Array.prototype.slice.call(arguments);
        console.log.apply(console, args);
    }
}

function watchSttingsFile(file, interval) {
    //log("watchSttingsFile ");
    fs.watchFile(file, { bigint: false, persistent: true, interval: interval }, (curr, prev) => {
        //log("Settings File changed = ");
        //log("Previous Modified Time", prev.mtime);
        //log("Current Modified Time", curr.mtime);
        getSettings().then((settings) => {
            log("Settings File changed = ", settings);
            module.exports.ev.emit('changed', settings)
        }, () => { })
    });
}

function index(obj, is, value) {
    if (typeof is == 'string')
        return index(obj, is.split('.'), value);
    else if (is.length == 1 && value !== undefined)
        return obj[is[0]] = value;
    else if (is.length == 0)
        return obj;
    else
        return index(obj[is[0]], is.slice(1), value);
}

var setObjKeys = (settings, newData) => {
    return new Promise((resolve, reject) => {

        Object.keys(newData).forEach(function (key) {
            index(settings, key, newData[key])
            //log('new index func = ', settings)
        })
        //log('resolve setobjkeys = ', settings)
        resolve(settings)
    })
}

module.exports = {
    init,
    getSettings,
    setSettings,
    setKey,
    getKey,
    ev
};