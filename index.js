var path = require('path');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
/**
 * # Easy NodeJS File Maneger
 * 
 * This is an Nodejs File Maneger, it can create, read, update, delete files.
 *
 *     const fm = require('easy-nodejs-app-settings')
 *
 */

/**
 * ## Init
 * 
 * First you need to init the file manager, this function will create the file
 *
 *     var DataStore = new fm.File({ appname: 'easy-nodejs-app-settings-example', file: 'DataStore.json',  data: {} })
 *
 */

/**
 * ## Init
 * 
 * First you need to init the file manager, this function will create the file
 *
 *     var DataStore = new fm.File({ appname: 'easy-nodejs-app-settings-example', file: 'DataStore.json',  data: {} })
 *
 */

/**
 * @var Files 
 * @type {Object}
 * @description Holds all files
 * @prop 
 */
var Files = {};

class File {
	/**
	 * @constructor 
	 * @param {Object} Data { appname: 'easy-nodejs-app-settings-example', file: 'DataStore.json', data: {} }
	 * @property {string} appname
	 * @method init() - Init File
	 * @method get() - Load this File from Drive
	 * @method set() - Set Entry File 
	 * @method setKey() - Set Key, Only JSON File
	 * @method getKey() - Get Key, Only JSON File
	 * @method remove() - Remove Entry File
	 * @method watch() - Watch File
	 * @example var DataStore = new fm.File({ appname: 'easy-nodejs-app-settings-example', file: 'DataStore.json', interval: 5000, data: {}, doLogging: false })
	 */
	constructor(data) {
		/**
		 * @var appname
		 * @description Holds the name of the application.
		 * @prop 'easy-nodejs-app-settings-example'
		 */
		this.appname = data.appname || 'easy-nodejs-app-settings-example';

		if (typeof data.path != 'undefined' && data.path != '' && data.path != null && data.path != undefined && data.path != 'undefined') {
			/**
			 * @var {String} path
			 * @description Holds the path of this file
			 * @prop 'C:/path/dir/file.json'
			 */
			this.path = path.normalize(data.path);
		} else {
			this.path = path.join(process.env.LOCALAPPDATA, data.appname, data.file);
		}

		/**
		 * @var {Object} pathParsed 
		 * @description Holds all parts of the path after Init
		 * @prop { root: 'C:\\', dir: 'C:\\path\\dir', base: 'file.txt', ext: '.txt', name: 'file' }
		 */
		this.pathParsed = path.parse(this.path);

		/**
		 * @var {String} name 
		 * @description Holds The File Name
		 * @prop 'Filename'
		 */
		this.name = this.pathParsed.name;

		/**
		 * @var {Integer} interval 
		 * @description Holds The Interval of the Watch
		 * @prop 5000
		 */
		this.interval = data.interval || 0;

		/**
		 * @var {Any} data 
		 * @description Holds The Data of the File
		 * @prop Any
		 */
		this.data = data.data || {};

		//console.log(this.proxy);
		/**
		 * @var logging 
		 * @type {Boolean}
		 * @description Decides whether to log or not
		 * @prop false
		 */
		this.logging = data.doLogging || false;

		/**
		 * @var overwriteOnInit 
		 * @type {Boolean}
		 * @description overwrite On Init
		 * @prop false
		 */
		this.overwriteOnInit = data.overwriteOnInit || false;

		/**
		 * @var event 
		 * @type {Event}
		 * @description Holds The Event Emitter
		 * @prop event
		 */
		this.event = new EventEmitter();
		Files[this.name] = this;
	}

	/** 
	 * @method init
	 * @description This Function must be called after Construction
	 * @example await File.init()
	 * @example File.init().then((data) => { console.log('init ',data)}, (err) => { console.log('init Failed ', err)})
	 */
	async init() {
		return new Promise(async (resolve, reject) => {
			var overwriteData = this.data
			this.get().then(
				async (data) => {
						if (this.interval >= 2000) {
							this.watch();
						}
						if (this.overwriteOnInit) {
							await this.set(overwriteData);
						}

						resolve(this);
					},
					(err) => {
						if (err.code == 'ENOENT') {
							this.log('Settings File Not Found, Create New One');
							dir(path.dirname(this.path)).then((dirERR) => {
								if (dirERR) {
									reject(dirERR);
								} else {
									this.log('Init file data = ', this.data);
									this.set(this.data).then(
										(data) => {
											this.data = data;
											if (this.interval != 0) {
												this.watch();
											}
											resolve(this);
										},
										(err) => {
											this.log('Cant write Settings File!');
											//this.log('File write error')
											reject(err);
										}
									);
								}
							});
						} else if (err.code == 'EJSON') {
							if (err.data == '') {
								this.log('File not');
								this.set(this.data).then(
									(data) => {
										resolve(this);
									},
									(err) => {
										reject(err);
									}
								);
							} else {
								this.log('This File has non JSON Data');
							}
						}
						this.log(err);
					}
			);
		});
	}

	/** 
	 * @method get
	 * @description Load this File from Drive
	 * @returns {Promise}  Returns a Promise
	 * @example await File.get()
	 * @example File.get().then((data) => { console.log('get ',data)}, (err) => { console.log('get Failed ', err)})
	 */
	async get() {
		return new Promise(async (resolve, reject) => {
			fs.readFile(this.path, 'utf8', (err, data) => {
				if (err) {
					reject(err);
				} else {
					if (this.pathParsed.ext == '.json') {
						try {
							var jsondata = JSON.parse(data);
							this.data = jsondata;
							resolve(jsondata);
						} catch (e) {
							var error = {
								code: 'EJSON',
								message: 'Invalid JSON',
								data: data,
								err: e
							};
							reject(error);
						}
					} else {
						this.data = data;
						resolve(data);
					}
				}
			});
		});
	}

	/**
	 * @method set
	 * @description Write Data to Drive
	 * @param {Object} data  Data to be written to the file
	 * @returns {Promise}  Returns a Promise
	 * @example await File.set({key: 'value'})
	 * @example File.set({key: 'value'}).then((data) => { console.log('Set ',data)}, (err) => { console.log('Set Failed ', err)})
	 */
	async set(data) {
		return new Promise(async (resolve, reject) => {
			if (this.pathParsed.ext == '.json') {
				if (typeof data == 'object') {
					fs.writeFile(this.path, JSON.stringify(data), {
						recursive: true
					}, (err) => {
						if (err) {
							this.log('Cant write Settings File! Error: ', err);
							reject(err);
						} else {
							this.log(`Write Successful: ${this.path}`);
							this.data = data;
							resolve(data);
						}
					});
				} else {
					this.log('This Data are not JSON');
					reject('This Data are not JSON');
				}
			} else {
				fs.writeFile(this.path, data, {
					recursive: true
				}, (err) => {
					if (err) {
						this.log('Cant write Settings File! Error: ', err);
						reject(err);
					} else {
						this.log(`Write Successful: ${this.path}`);
						this.data = data;
						resolve(data);
					}
				});
			}
		});
	}

	/**
	 * @method setKey
	 * @description Set Key Only JSON Files
	 * @param {Object} data  Keys wich will be written to the file
	 * @returns {Promise}  Returns a Promise
	 * @example await File.setKey({key: 'value'})
	 * @example File.setKey({key: 'value'}).then((data) => { console.log('Set Keys ',data)}, (err) => { console.log('Set Keys Failed ', err)})
	 */
	async setKey(NewData) {
		return new Promise((resolve, reject) => {
			if (this.pathParsed.ext != '.json') {
				this.log('This File is not JSON');
				reject(new Error('This File is not JSON'));
			} else {
				this.get().then((HDDdata) => {
					if (HDDdata == null) {
						this.set(NewData).then(
							(HDDdata) => {
								resolve(HDDdata);
							},
							(errr) => {
								reject(errr);
							}
						);
					} else {
						setObjKeys(HDDdata, NewData).then((newSettings) => {
							this.set(newSettings).then(
								(data) => {
									this.log('Save Settings File');
									this.data = data;
									resolve(data);
								},
								(errr) => {
									this.log('Write Settings File Failed');
									reject(errr);
								}
							);
						});
					}
				}, reject);
			}
		});
	}

	/**
	 * @method getKey
	 * @description Get Key Only JSON File
	 * @param {String} Key  Data to be written to the file
	 * @returns {Promise}  Returns a Promise
	 * @example await File.getKey()
	 * @example File.getKey().then((data) => { console.log('Get Keys, ', data)}, (err) => { console.log('Get Keys Failed ', err)})
	 */
	async getKey(key) {
		return new Promise((resolve, reject) => {
			if (this.pathParsed.ext != '.json') {
				reject(new Error('This File is not JSON'));
			} else {
				this.get().then(
					(data) => {
						resolve(index(data, key));
					},
					(err) => {
						reject(err);
					}
				);
			}
		});
	}

	/**
	 * @method push
	 * @description push element to array
	 * @param {Object} data  Data to be written to a Objekt or Array
	 * @returns {Promise}  Returns a Promise
	 * @example 
	 * @example 
	 */
	async push(NewData) {
		return new Promise(async (resolve, reject) => {
			if (this.pathParsed.ext != '.json') {
				reject(new Error('This File is not JSON'));
			} else {
				if (this.pathParsed.ext != '.json') {
					this.log('This File is not JSON');
					reject(new Error('This File is not JSON'));
				} else {
					this.get().then(async (HDDdata) => {
						if (HDDdata == null) {
							this.set(NewData).then(
								(HDDdata) => {
									resolve(HDDdata);
								},
								(errr) => {
									reject(errr);
								}
							);
						} else {
							for await (let key of Object.keys(NewData)) {
								if (typeof HDDdata[key] == 'object') {
									if (Array.isArray(HDDdata[key])) {
										HDDdata[key].push(NewData[key]);
										console.log('push data to drivedata');
									} else {
										Object.assign(HDDdata[key], NewData[key]);
										console.log('assign data to drivedata = ', HDDdata[key]);
									}
								}
								await this.setKey({
									[key]: HDDdata[key]
								});
							}
							resolve(HDDdata);
						}
					}, reject);
				}
			}
		});
	}

	/**
	 * @method remove
	 * @description Remove this File from Drive
	 * @returns {Promise}  Returns a Promise
	 * @example await File.remove()
	 * @example File.remove().then(() => { console.log('File Removed')}, (err) => { console.log('File Remove Failed')})
	 */
	async remove() {
		return new Promise(async (resolve, reject) => {
			fs.unlink(this.path, (err) => {
				if (err) {
					this.log('Cant remove File! Error: ', err);
					reject(err);
				} else {
					delete Files[this.name];
					this.log('File Removed', this.path);
					resolve(null);
				}
			});
		});
	}

	/**
	 * @method watch
	 * @description Watch this File
	 * @returns {Promise}  Returns a Promise
	 */
	async watch() {
		return new Promise(async (resolve, reject) => {
			if (this.interval != 0) {
				fs.watchFile(this.path, {
					bigint: false,
					persistent: true,
					interval: this.interval
				}, (curr, prev) => {
					this.log('Changed File', this.path);
					this.get().then(
						(data) => {
							this.event.emit('change', data);
						},
						(err) => {
							if (err.code == 'ENOENT') {
								delete Files[this.name];
								this.event.emit('remove');
							}
						}
					);
				});
			}
			resolve(null);
		});
	}

	/**
	 * @method log
	 * @description Will be console.log when logging is true
	 */
	log() {
		if (this.logging) {
			var args = Array.prototype.slice.call(arguments);
			console.log.apply(console, args);
		}
	}
}

var dir = (dirPath) => {
	return new Promise((resolve, reject) => {
		fs.mkdir(dirPath, (dirERR) => {
			if (dirERR) {
				if (dirERR.code == 'EEXIST') {
					resolve(null);
				} else {
					reject(dirERR);
				}
			} else {
				resolve(null);
			}
		});
	});
};

function index(obj, is, value) {
	if (typeof is == 'string') return index(obj, is.split('.'), value);
	else if (is.length == 1 && value !== undefined) return (obj[is[0]] = value);
	else if (is.length == 0) return obj;
	else return index(obj[is[0]], is.slice(1), value);
}

var setObjKeys = (settings, newData) => {
	return new Promise((resolve, reject) => {
		Object.keys(newData).forEach(function (key) {
			index(settings, key, newData[key]);
			//log('new index func = ', settings)
		});
		//log('resolve setobjkeys = ', settings)
		resolve(settings);
	});
};

module.exports = {
	File,
	Files
};