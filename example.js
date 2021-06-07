const settings = require('./index.js')

settings.doLogging = true;
settings.init('easy-nodejs-app-settings-example', 500).then((resolveData) => {

    console.log('Settings File Succsessfull Init.')
    settings.setKey({ 'Key': 'value', 'otherKey': 'otherValue' }).then((data) => {
        //console.log('Change Value by keys = ', data)
    }, (err) => {
        //console.log('Set Value by key error = ', err)
    })
}, (rejectData) => {
    //console.log('Cant Init Settings File!!! Test Error= ', rejectData)
})

settings.ev.on('changed', (data) => {
    console.log('Event on changed')
});