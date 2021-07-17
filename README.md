# easy-nodejs-app-settings

With this module you can easily save settings of your Nodejs App or Electron App.

A File will be created automatically if it is not already present. If it is available it will be read on initialize. 

## Use Module

### Install
```javascript
npm install easy-nodejs-app-settings --save
```
### Run Test
```javascript
npm run test
```
### require
```javascript
const fm = require('easy-nodejs-app-settings')
```


### require
```javascript

asnyc function init(){
    
var DataStore = new fm.File({ appname: 'YOUR-APP-NAME', file: 'DataStore.json', data: {} })

await DataStore.init()
console.log('DataStore File Init')
console.log(DataStore.data)
}

```


[More Docs](docs.md)
