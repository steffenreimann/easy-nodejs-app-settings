var path = require('path')
var fs = require('fs')

var EventEmitter = require('events').EventEmitter;




/**
 * Init Settings 
 * @function [<init>]
 * @param {Object} p - The Parameter
 * @param {string} p.AppName - The App Name
 * @param {Object} p.data - The Init Settings Structure
 * @param {Number} p.Interval - The Interval for the Watcher
 * @returns {Boolean} 
 */





var initParams = { appname: 'easy-nodejs-app-settings-example', files: { settings: { data: {}, interval: 5000 }, DataStore: { data: '', interval: 5 } } }

var Files = {}

class File {
    constructor(name, appname, interval, data, doLogging) {
        this.appname = appname || 'easy-nodejs-app-settings-example';
        this.name = name;
        this.interval = interval || 0;
        this.data = data || {};
        this.path = path.join(process.env.LOCALAPPDATA, appname, `${name}.json`)
        this.logging = doLogging || false;
        this.event = new EventEmitter();


        Files[this.name] = this;
    }
    async init() {
        return new Promise(async (resolve, reject) => {
            this.get().then((data) => {
                if (this.interval >= 2000) {
                    this.watch()
                }
                resolve(this)
            }, (err) => {
                if (err.code == 'ENOENT') {
                    this.log('Settings File Not Found, Create New One')
                    dir(path.dirname(this.path)).then((dirERR) => {
                        if (dirERR) {
                            reject(dirERR)
                        } else {

                            fs.writeFile(this.path, JSON.stringify(this.data), { recursive: true }, (fileERR) => {
                                if (fileERR) {
                                    this.log('Cant write Settings File!')
                                    //this.log('File write error')
                                    reject(fileERR)
                                } else {
                                    this.log('File is Created.')
                                    //this.log('reading file after write')
                                    this.get().then((data) => {
                                        this.data = data
                                        if (this.interval != 0) {
                                            this.watch()
                                            //watchFile(key)
                                        }
                                        resolve(this)
                                    }, (err) => {
                                        reject(err)
                                    })
                                }
                            })
                        }
                    })
                } else if (err.code == 'EJSON') {
                    if (err.data == '') {
                        this.log('File not')
                        this.set(this.data).then((data) => {
                            resolve(this)
                        }, (err) => {
                            reject(err)
                        })
                    } else {
                        this.log('This File has non JSON Data')
                    }
                }
                this.log(err)
            })
        })
    }
    async get() {
        return new Promise(async (resolve, reject) => {
            fs.readFile(this.path, 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                } else {

                    try {
                        var jsondata = JSON.parse(data)
                        this.data = jsondata
                        resolve(jsondata)

                    } catch (e) {
                        var error = { code: 'EJSON', message: 'Invalid JSON', data: data, err: e }
                        reject(error)
                    }
                }
            })
        })
    }
    async set(data) {
        return new Promise(async (resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(data), { recursive: true }, (err) => {
                if (err) {
                    reject(err)
                } else {
                    this.data = data
                    resolve(data)
                }
            })
        })
    }
    async setKey(NewData) {
        return new Promise((resolve, reject) => {

            this.get().then((HDDdata) => {
                if (HDDdata == null) {
                    this.set(NewData).then((HDDdata) => { resolve(HDDdata) }, (errr) => { reject(errr) })
                } else {

                    setObjKeys(HDDdata, NewData).then((newSettings) => {
                        this.log('Save Settings File', newSettings)
                        fs.writeFile(this.path, JSON.stringify(newSettings), { recursive: true }, (fileERR) => {
                            if (fileERR) {
                                this.log('Write Settings File Failed')
                                reject(fileERR)
                            } else {
                                this.get().then((data) => {
                                    this.data = data
                                    resolve(data)
                                }, (errr) => { reject(errr) })
                            }
                        })
                    })

                }
            }, reject)

        })
    }
    async getKey(key) {
        return new Promise((resolve, reject) => {
            this.get().then((data) => {
                resolve(index(data, key))
            }, (err) => {
                reject(err)
            })
        })

    }
    async remove() {
        return new Promise(async (resolve, reject) => {
            fs.unlink(this.path, (err) => {
                if (err) {
                    reject(err)
                } else {
                    delete Files[this.name]
                    resolve(null)
                }
            })
        })
    }
    async watch() {
        return new Promise(async (resolve, reject) => {
            if (this.interval != 0) {
                fs.watchFile(this.path, { bigint: false, persistent: true, interval: this.interval }, (curr, prev) => {
                    this.log('Changed File', this.path)
                    this.get().then((data) => {
                        this.event.emit('change', data)
                    }, (err) => {
                        if (err.code == 'ENOENT') {
                            delete Files[this.name]
                            this.event.emit('remove')
                        }
                    })
                });
            }
            resolve(null)
        })
    }
    log() {
        if (this.logging) {
            var args = Array.prototype.slice.call(arguments);
            console.log.apply(console, args);
        }
    }
}


var dir = (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(dirPath, (dirERR) => { if (dirERR) { if (dirERR.code == 'EEXIST') { resolve(null) } else { reject(dirERR) } } else { resolve(null) } })
    })
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
    File,
    Files
};
