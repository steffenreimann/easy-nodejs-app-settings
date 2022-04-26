# easy-nodejs-app-settings

### Attention from version 0.0.2 to version 0.0.3 some major changes have been made. So the versions are no longer compatible with each other 


With this module you can easily save settings of your Nodejs App or Electron App.


## Use Module

### Install
```javascript
npm install easy-nodejs-app-settings --save
```
### Run Test
This test will be ckeck if the module is working. And has the right permissions. 
```javascript
cd node_modules/easy-nodejs-app-settings

npm run test
```
### require
```javascript
const fm = require('easy-nodejs-app-settings')
```


### Init with async function and await
```javascript

async function init(){
	var DataStore = new fm.File({ 
		appname: 'YOUR-APP-NAME', // required
		file: 'DataStore.json', // required
		data: {}, // Optional, Set Data on Init only if the file is newly created or overwriteOnInit is true
		overwriteOnInit: true, // Optional, Set true if you want to overwrite the file on init. Attention the whole file will be overwritten! 
		interval: 5000, // Optional, if not set the interval no File watcher will be created 
		doLogging: false // Optional
	})

	await DataStore.init()
	console.log('DataStore File Init')
	console.log(DataStore.data)
}
```		

### Events
```javascript
DataStore.event.on('change', (data) => {
	console.log('Event change: ');
});

DataStore.event.on('remove', (data) => {
	console.log('Event remove: ');
});

```


### Set Entry File
```javascript
try {
	await DataStore.set({user: {name: 'John Doe', age: 30, email:''}});
} catch (error) {
	console.log('Error: ', error);
}
```

### get Entry File without reloading from Drive
```javascript
console.log(DataStore.data);
```

### get Entry File with reloading from Drive
```javascript
await DataStore.get();
```

### remove File from Drive
```javascript
await DataStore.remove();
```


## JSON Files only

### Set Key Value
```javascript
await DataStore.setKey({ 'user.name': 'herbbert', 'user.age': '28' });
```
### Get Key Value
```javascript
await DataStore.getKey('user.name');
```

### Push to Array or Assign to Object
#### if you want to push to an Array or Assign data to an Object, the array or object must be defined in the file
```javascript
// Define an Array
await DataStore.setKey({ testArr: [ 1, 2 ] });
// Define an Object
await DataStore.setKey({ testObj: { A: 1, B: 2 } });
```

### push Value to Array or Object
```javascript
//Push to Array
await DataStore.push({ testArr: 3 });
//Assign to Object
await DataStore.push({ testObj: { C: 3, D: 4 } });
```


