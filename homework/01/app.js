const http = require('http');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = 1337;

const statuses = {
    200: "Ok",
    404: "Not found",
    500: "Server error"
};

const templates = {
    header: "templates/header.html",
    index: "templates/index.html",
    footer: "templates/footer.html",
    404: "templates/404.html"
};

var getQuery = ( url ) => {
    let rawQuery = url.match( /\?([^#]*)/ );
    let query = {};
    if ( rawQuery && rawQuery[1].length ) {
        let pairs = rawQuery[1].split('&')
        for ( let i = 0, key; i < pairs.length; i++ ) {
            [ key, query[ key ] ] = pairs[ i ].split('=');
        };
    };
    return query;
};

var getPath = ( url ) => {
    let rawPath = url.match( /\/([^?]*)/ );
    return rawPath ? rawPath[1] : null;
};

var getFragment = ( url ) => {
    let rawFragment = url.match( /#(.*)/ );
    return rawFragment ? rawFragment[1] : null;
};

var server = http.createServer( (request, response) => {

    let now = new Date();

    let log = `${ now.toLocaleTimeString() }:${ now.getMilliseconds() } \t` +
        `${ request.socket.remoteAddress }:${ request.socket.remotePort } \t${ request.method } \t` +
        `${ request.headers.host }${ request.url } \t`;

    let [ path, query, fragment ] = [
        getPath( request.url ),
        getQuery( request.url ),
        getFragment( request.url )
    ];

    console.log( log );

    fs.readFile( path === "" ? "index.html" : path,
        'utf-8',
        function( err, data ) {

            if ( err ) {
                console.log(err.toString());
                if ( err.errno === -2 ) {
                    // if File not exist sent status 404
                    fs.readFile( templates['404'], 'utf-8', function( err, data ) {
                        response.writeHead( 404, statuses[404], { 'Content-Type': 'text/html' });
                        if ( err ) {
                            console.log(err.toString());
                            response.write( `<strong>${path}</strong> not found.` );
                        } else {
                            response.write( data );
                        };
                        response.end();
                    } );
                } else {
                    // else send internal error status
                    response.writeHead( 500, statuses[500], { 'Content-Type': 'text/html' });
                    response.end();
                };
            } else {
                response.writeHead( 200, statuses[200], { 'Content-Type': 'text/html' });
                response.write( data );
                response.end();
            };
        } );


} );

server.listen( port, hostname, () => {
    console.log( `Server running @ http://${ hostname }:${ port }/\n` );
} );
