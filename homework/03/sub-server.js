let http = require( 'http' );
let url = require( 'url' );

function serve( request, response ) {
    let query = url.parse( request.url, true ).query;
    process.send( query );
};



http.createServer( serve ).listen( 8123 );