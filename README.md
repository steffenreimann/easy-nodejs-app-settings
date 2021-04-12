# easy-nodejs-app-settings

With this module you can easily save settings of your Nodejs App or Electron App.

A JSON file will be created automatically if it is not already present. If it is available it will be read on initialize. 

## Use Module

### Install
```javascript
npm install easy-nodejs-app-settings --save
```

### require
```javascript
const settings = require('easy-nodejs-app-settings')
```

### Init
```javascript
settings.init('YOUR_APP_NAME').then((resolveData) => {
    console.log('Settings File Succsessfull Init.')
}, (rejectData) => { 
    console.log('Cant Init Settings File!!! Error= ', rejectData) 
})
```

### Change Event
```javascript
settings.ev.on('changed', (data) => {
    console.log('Event on changed = ', data)
});
```

### Set complett File
```javascript
settings.setSettings(DATA).then((resolveData) => {
    console.log('Write Settings File!!! ', resolveData) 
}, (rejectData) => { 
    console.log('Cant write Settings File!!! Error= ', rejectData) 
})
```

### Set Value by Key
```javascript
settings.setKey('Key').then((data) => {
    console.log('Change Value by keys = ', data)
}, (err) => { 
    console.log('Set Value by key error = ', err) 
})
```

### Get Value by Key
```javascript
settings.getKey('Key').then((data) => {
    console.log('Get Value by keys = ', data)
}, (err) => { 
    console.log('Get Value by key error = ', err) 
})
```

### Reload File and get them
```javascript
settings.getSettings().then((data) => {
    console.log('getSettings = ', data)
}, (err) => { 
    console.log('getSettings error = ', err) 
})
```

### Get Settings without Reloading File
```javascript
console.log('Settings = ', settings.data)
```
