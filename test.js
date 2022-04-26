const fm = require('./index.js');
const fs = require('fs');
const path = require('path');

async function ASYNC_AWAIT() {
	const pathToDir = path.join(process.env.LOCALAPPDATA, 'easy-nodejs-app-settings-test');
	var DataStore = new fm.File({ appname: 'easy-nodejs-app-settings-test', file: 'test.json', interval: 5000, data: {}, doLogging: true });
	try {
		//Init File
		await DataStore.init();

		// Listen on File events
		DataStore.event.on('change', (data) => {
			console.log('Event change!');
		});
		DataStore.event.on('remove', (data) => {
			console.log('Event remove!');
		});

		// Set Enrty File
		await DataStore.set({ user: { name: 'herbbert', email: 'herbbert15@gmail.com', address: { name: 'herb', lastname: 'bert', country: 'Ger', town: { name: 'Berlin', code: '35355', road: 'Berlinstr.', Number: '10a' } } } });

		// Set Multiple Keys in File
		await DataStore.setKey({ data: {}, 'data.data1': {}, 'data.data1.data2': {} });
		await DataStore.setKey({ 'user.name': 'herbert24', 'user.address.name': 'herb24', 'user.address.town.Number': '24' });

		console.log(DataStore);
		await DataStore.setKey({ testArr: [ 1, 2 ] });
		await DataStore.setKey({ testObj: { A: 1, B: 2 } });
		console.log(DataStore.data.testArr);

		// Push Element to an Array and save them
		await DataStore.push({ testArr: 3 });
		await DataStore.push({ testArr: 4 });

		await DataStore.push({ testObj: { C: 3, D: 4 } });
		await DataStore.push({ testObj: { E: 5, F: 6 } });

		//deleteFolderRecursive(pathToDir);
		console.log('Test finished without Errors!');

		//process.exit(0);
	} catch (err) {
		//deleteFolderRecursive(pathToDir);
		console.log('Test Cant Finished! Error: ');
		console.log(err);

		//process.exit(1);
	}
}

const deleteFolderRecursive = function(directoryPath) {
	if (fs.existsSync(directoryPath)) {
		fs.readdirSync(directoryPath).forEach((file, index) => {
			const curPath = path.join(directoryPath, file);
			if (fs.lstatSync(curPath).isDirectory()) {
				// recurse
				deleteFolderRecursive(curPath);
			} else {
				// delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(directoryPath);
	}
};

ASYNC_AWAIT();
