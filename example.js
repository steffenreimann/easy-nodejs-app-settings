const settings = require('./index.js')

settings.doLogging = true;
settings.init().then((resolveData) => {
    console.log(resolveData);
    if (resolveData == null) {
        console.log('Settings File Succsessfull Init. First Start write Data')
        settings.setKey({ 'Key': 'value', 'otherKey': 'otherValue' }).then((data) => {
            console.log('Write Data First Time to File Succsessfull = ', data)
        }, (err) => {
            console.log('Write Data First Time to File Error = ', err)
        })
    } else {
        console.log('Settings File Succsessfull Init.', resolveData)
    }
}, (rejectData) => {
    //console.log('Cant Init Settings File!!! Test Error= ', rejectData)
})

settings.ev.on('changed', (data) => {
    console.log('Event on changed')
});

settings.init