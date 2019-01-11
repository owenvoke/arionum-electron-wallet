console.log( "resize" );

if ( store.get( "publickey" ) != "" )
  location.replace( "./index.html" );

setTimeout( function () {
  const ipc = require( 'electron' ).ipcRenderer
  ipc.send( 'resizable-disable' );
  ipc.send( 'resize-login' );

}, 10 );


$( ".button_choosefile" ).click( function () {
  const {
    dialog
  } = require( 'electron' ).remote;
  dialog.showOpenDialog( {
    properties: [ 'openFile' ]
  }, function ( files ) {
    if ( files !== undefined ) {
      const fs = require( "fs" );
      var data = fs.readFileSync( files[ 0 ] ) + "";

      $( $( ".form-row" )[ 1 ] ).hide();
      $( ".button_choosefile" ).hide();
      $( ".button_signup" ).hide();

      $( $( ".form-row .input-group label" ) ).text( "Password" );


      $( ".button" ).click( function () {
        try {
          keypair = aro.decodeKeypair( data, $( ".address" ).val() );
          console.log( keypair );



          store.set( 'publickey', keypair.publicCoin );
          store.set( 'privatekey', CryptoJS.AES.encrypt( keypair.privateCoin, $( ".address" ).val() ) + "" );

          location.replace( "./index.html" );
        } catch ( e ) {
          $( $( ".form-row .input-group label" ) ).css( "color", "red" );
          $( ".address" ).val( "" );
          setTimeout( function () {
            $( $( ".form-row .input-group label" ) ).css( "color", "" );
          }, 1200 );
          console.log( e );
        } finally {

        }

      } );


    }
  } );
} );