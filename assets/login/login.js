console.log( "resize" );

if ( store.get( "publickey" ) != "" )
  location.replace( "./index.html" );

setTimeout( function () {
  const ipc = require( 'electron' ).ipcRenderer
  ipc.send( 'resizable-disable' );
  ipc.send( 'resize-login' );
}, 10 );

var file = false;
$( ".button_choosefile" ).click( function () {
  const {
    dialog
  } = require( 'electron' ).remote;
  dialog.showOpenDialog( {
    properties: [ 'openFile' ]
  }, function ( files ) {
    if ( files !== undefined ) {
      requestPasswordWithFile( files[ 0 ] );
    }
  } );
} );

function requestPasswordWithFile( path ) {
  const fs = require( "fs" );
  var data = fs.readFileSync( path ) + "";
  $( $( ".form-row" )[ 1 ] ).hide();
  $( ".button_choosefile" ).hide();
  $( ".button_signup" ).hide();
  $( $( ".form-row .input-group label" ) ).text( "Password" );
  file = true;
  $( ".button" ).click( function () {
    try {
      keypair = aro.decodeKeypair( data, $( ".field1" ).val() );
      store.set( 'publickey', keypair.publicCoin );
      store.set( 'privatekey', CryptoJS.AES.encrypt( keypair.privateCoin, $( ".field1" ).val() ) + "" );
      location.replace( "./index.html" );
    } catch ( e ) {
      $( $( ".form-row .input-group label" ) ).css( "color", "red" );
      $( ".field1" ).val( "" );
      setTimeout( function () {
        $( $( ".form-row .input-group label" ) ).css( "color", "" );
      }, 1200 );
      console.log( e );
    }
  } );
}

var signup = false;
$( ".button_signup" ).click( function () {
  if ( !signup ) {
    $( "h1" ).text( "Create" );
    $( ".button_signup" ).text( "Login" );
    $( ".button" ).text( "Create" );
    $( $( ".form-row .input-group label" )[ 0 ] ).text( "Password" );
    $( $( ".form-row .input-group label" )[ 1 ] ).text( "Repeat Password" );
    $( ".button_choosefile" ).hide();
  } else {
    $( ".button_choosefile" ).show();
    $( "h1" ).text( "Login" );
    $( ".button_signup" ).text( "Create" );
    $( ".button" ).text( "Login" );

    $( $( ".form-row .input-group label" )[ 0 ] ).text( "PublicKey" );
    $( $( ".form-row .input-group label" )[ 1 ] ).text( "PrivateKey" );
  }
  signup = !signup;
} );

$( ".button" ).click( function () {
  if ( !file ) {
    if ( signup ) {
      createWallet();
    } else {
      loginWithKeys();
    }
  }
} );


function createWallet() {
  var password = $( ".field1" ).val();
  var password2 = $( ".field2" ).val();

  if ( password == password2 && password != "" && password.length > 4 ) {
    var keypair = aro.encodeKeypair();

    $( $( ".form-row .input-group label" )[ 0 ] ).text( "PublicKey" );
    $( $( ".form-row .input-group label" )[ 1 ] ).text( "PrivateKey" );
    $( ".field1" ).val( keypair.publicCoin );
    $( ".field2" ).val( keypair.privateCoin );
    $( ".button_signup" ).hide();
    $( ".button" ).text( "Login" );
    file = true;

    const path = require( 'path' );
    const userDataPath = ( electron.app || electron.remote.app ).getPath( 'userData' );
    var paths = path.join( userDataPath, 'wallet.aro' );

    aro.encryptAro( keypair.encoded, password ).then( encrypt => {
      var fs = require( 'fs' );
      fs.writeFileSync( paths, encrypt, 'utf-8' );
    } );

    console.log( paths );

    $( ".button" ).click( function () {
      requestPasswordWithFile( paths );
    } );

  } else {
    $( $( ".form-row .input-group label" ) ).css( "color", "red" );
    $( ".field1" ).val( "" );
    $( ".field2 " ).val( "" );
    setTimeout( function () {
      $( $( ".form-row .input-group label" ) ).css( "color", "" );
    }, 1200 );
  }
}

function loginWithKeys() {

}