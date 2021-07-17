

<!-- Start index.js -->

## Files

Holds all files

## watch() - Watch File(Data)

### Properties:

* **string** *appname* 

### Params:

* **Object** *Data* { appname: 'easy-nodejs-app-settings-example', file: 'DataStore.json', data: {} }

## appname

Holds the name of the application.

## path

Holds the path of this file

## pathParsed

Holds all parts of the path after Init

## name

Holds The File Name

## interval

Holds The Interval of the Watch

## data

Holds The Data of the File

## logging

Decides whether to log or not

## event

Holds The Event Emitter

## init()()

This Function must be called after Construction

## get()()

Load this File from Drive

### Return:

* **Promise** Returns a Promise

## set()(data)

Write Data to Drive

### Params:

* **Object** *data* Data to be written to the file

### Return:

* **Promise** Returns a Promise

## setKey()(data)

Set Key Only JSON Files

### Params:

* **Object** *data* Keys wich will be written to the file

### Return:

* **Promise** Returns a Promise

## getKey()(Key)

Get Key Only JSON File

### Params:

* **String** *Key* Data to be written to the file

### Return:

* **Promise** Returns a Promise

## remove()()

Remove this File from Drive

### Return:

* **Promise** Returns a Promise

## watch()()

Watch this File

### Return:

* **Promise** Returns a Promise

## log()()

Will be console.log when logging is true

<!-- End index.js -->

