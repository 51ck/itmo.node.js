var http = require( "http" );
var fs = require( "fs" );
var url = require( "url" );
var path = require( "path" );

var mimeTypes = {
    '.js' : 'text/javascript',
    '.html': 'text/html',
    '.css' : 'text/css' ,
    '.jpg' : 'image/jpeg',
    '.gif' : 'image/gif',
    '.png' : 'image/png',
    '.jpg' : 'image/jpeg',
    '.ico' : 'image/ico'
};

http.createServer(function onRequest(request, response) {


    let now = new Date();

    let log = `${ now.toLocaleTimeString() }:${ now.getMilliseconds() } \t` +
        `${ request.socket.remoteAddress }:${ request.socket.remotePort } \t${ request.method } \t` +
        `${ request.headers.host }${ request.url } \t`;

    console.log( log )


    var pathname = url.parse(request.url).path;
    if (pathname == '/')
        pathname = '/index.html';
        //чтобы убрать начальный слэш

    let extname = path.extname(pathname);
    let mimeType = mimeTypes[ extname ];

    if ( extname in [ '.png', '.gif', '.jpg', '.ico' ] ) {
        // image/xxxx
        fs.readFile( 'site' + pathname, function ( err, data ) {
            if ( err ) {
                console.error( err );
            } else {
                response.writeHead( 200, {'Content-Type': mimeType } );
                response.end( data, 'binary' );
            };
        } );
    } else {
        // text/xxxx
        fs.readFile( 'site' + pathname, function ( err, data ) {
            if ( err ) {
                console.error( err );
            } else {
                response.writeHead( 200, {'Content-Type': mimeType } );
                response.end( data );
            };
        } );
    };

}).listen( 8080 );
