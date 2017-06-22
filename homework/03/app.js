let http = require( 'http' );
let fs = require( 'fs' );
let cp = require( 'child_process' );



let subServer = cp.fork('./sub-server.js');
subServer.on( 'message', function( message ){
    console.log( message );
    this.kill();
} );

function serve( request, response ) {
    let lang = process.env[ 'LANG' ].split( '.' )[0];
    let filename;
    if ( lang === 'ru_RU' || lang === 'en_US' ) {
        filename = `index_${ lang.split( '_' )[0] }.html`;
    } else {
        filename = 'index_en.html';
    };

    fs.readFile( `./${ filename }`, ( error, data ) => {
        if ( error ) {
            console.error( error );
        } else {
            response.writeHeader( 200, { 'Content-Type': 'text/html' } );
            response.end( data );
        };
    } );

};

http.createServer( serve ).listen( 8080 );