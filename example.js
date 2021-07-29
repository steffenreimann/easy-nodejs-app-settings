const fm = require('./index.js');

async function ASYNC_AWAIT() {
	//var DataStore = new settings.File('DataStore', 'easy-nodejs-app-settings', 5000, {}, true)
	var DataStore = new fm.File({ appname: 'easy-nodejs-app-settings-example', file: 'DataStore.json', interval: 5000, data: {}, doLogging: true });
	//Init File
	await DataStore.init();
	//console.log('INIT Finished = ', DataStore.path)
	//console.log('INIT Finished = ', DataStore)

	// Listen on File events
	DataStore.event.on('change', (data) => {
		console.log('Event change: ');
		//  console.log('Event change: ', data)
	});

	// Set Enrty File
	await DataStore.set({ user: { name: 'herbbert', email: 'herbbert@gmail.com', address: { name: 'herb', lastname: 'bert', country: 'Ger', town: { name: 'Berlin', code: '35355', road: 'Berlinstr.', Number: '10a' } } } });
	// console.log('SET Enrty File Finished = ', DataStore.data)

	// Set Multiple Keys in File
	await DataStore.setKey({ data: {}, 'data.data1': {}, 'data.data1.data2': {} });
	await DataStore.setKey({ 'user.name': 'herbert24', 'user.address.name': 'herb24', 'user.address.town.Number': '24' });
	//console.log('Set Keys Finished = ', DataStore.data)

	//If you try to set a JSON File to String
	DataStore.set('TEST JOO').then(
		() => {
			console.log('TEST JOO = ', DataStore.data);
		},
		(err) => {
			console.log('Error: ', err);
		}
	);

	try {
		await DataStore.set('TEST JOO');
	} catch (error) {
		console.log('Error: ', error);
	}

	DataStore.log('Hallo', 'test', DataStore.data);

	var DataStoreTXT = new settings.File({ path: 'C:/Users/Steffen/AppData/Local/easy-nodejs-app-settings-example/DataStoreTESTPATH1.csv', interval: 5000, data: 'Test', doLogging: false });

	await DataStoreTXT.init();
	//console.log('INIT Finished = ', DataStoreTXT.path)
	console.log('INIT Finished = ', DataStoreTXT);

	// Set Enrty File
	await DataStoreTXT.set('TEST JOO');
	console.log('SET Enrty File Finished = ', DataStore.data);
}

function WITH_THEN(params) {
	new settings.File('DataStore', 'easy-nodejs-app-settings', 5000, {}, true).init().then((newFile) => {
		console.log('newFile = ', newFile);
		console.log('constructedFiles = ', settings.Files);
		settings.Files['DataStore'].setKey({ test: 'Nice' });
	});
}

ASYNC_AWAIT();
//WITH_THEN()
