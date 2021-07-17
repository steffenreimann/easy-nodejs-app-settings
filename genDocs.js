var markdox = require('markdox');

var options = {
    output: 'docs.md',
    formatter: markdox.defaultFormatter,
    compiler: markdox.defaultCompiler,
    template: markdox.defaultTemplate
};

markdox.process('index.js', options, function () {
    console.log('File `all.md` generated with success');
});