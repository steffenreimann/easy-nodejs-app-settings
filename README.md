# easy-nodejs-app-settings

## Attention from version 0.0.2 to version 0.0.3 some major changes have been made. So the versions are no longer compatible with each other 


With this module you can easily save settings of your Nodejs App or Electron App.


## Use Module

### Install
```javascript
npm install easy-nodejs-app-settings --save
```
### Run Test
This test will be ckeck if the module is working. And has the right permissions.
```javascript
npm run test
```
### require
```javascript
const fm = require('easy-nodejs-app-settings')
```


### Init with async function and await
```javascript

asnyc function init(){
	var DataStore = new fm.File({ 
		appname: 'YOUR-APP-NAME', // required
		file: 'DataStore.json', // required
		data: {}, // Optional, If you set Data and File has allready data it will not be overwritten
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


