//INIT
var aro = new aro;
var instance = this;

const store = new Store( {
  configName: 'arionum-config',
  defaults: {
    publickey: "",
    privateCoin: ""
  }
} );

//TODO -> VALUES

//// TODO: DEBUG PZ8Tyr4Nx8MHsRAGMpZmZ6TWY63dXWSCwJ65ajWp8WD2zLcxtHBSzvuYQX1PmQVWtvFFfgKKxf7jKtJyfKPxwKKg8gCoFMyBjooCta93Am5sNDCJHsPYifd3
var account = "";

//PZ8Tyr4Nx8MHsRAGMpZmZ6TWY63dXWSCys8HWrmhES5nKR4G3JoLZRWC5Bcp4gRL8k4mxA53zyPQHSYhJRhBUFWBqeVKNfE5pU9ZpYj78DFYM7Lu3tZ5PZaL

var publickey = store.get( "publickey" );
var privatekey = store.get( "privatekey" );
var alias = "";

if ( typeof login == "undefined" )
  if ( publickey == "" )
    location.replace( "login.html" );

//<===DEPRECATED===>
var address = "";
address = aro.getAddress( publickey );

var cors_bypass = "https://cubedpixels.net:9080/";
var peer = "";
if ( window && window.process && window.process.type ) {
  if ( process.versions.electron )
    peer = "http://peer1.arionum.com";
} else
  peer = cors_bypass + "http://peer1.arionum.com";

setElectronHeight();

function init() {
  getAlias();
  if ( typeof loadView !== "undefined" ) {
    loadView( "home" );
  }
}

function setElectronHeight() {
  if ( window && window.process && window.process.type )
    if ( process && process.versions.electron ) {
      $( ".content" ).addClass( "animated_fast" );
      if ( typeof login !== "undefined" ) {

        $( "html" ).css( "font-size", "9px" );
        $( ":root" ).css( "font-size", "9px" );
      } else {

        $( "html" ).css( "font-size", "16px" );
        $( ":root" ).css( "font-size", "16px" )
      }
    }

  setTimeout( function () {
    $( ".content" ).removeClass( "animated_fast" );
    $( ".content" ).addClass( "animated" );
    init();
  }, 100 )
}




/*  // TODO: API METHODS    */


function getAlias() {
  getArionumAlias( function ( data ) {
    var datas = data;
    if ( datas == "false" )
      datas = "none";
    if ( datas == "null" || datas == null )
      datas = "none";
    alias = datas;
  } );
}

function getArionumBlock( success ) {
  getJSONP( 'currentBlock', function ( data ) {
    success && success( data );
  } );
}

function getArionumAccountDetails( success ) {
  getJSONP( 'node-info', function ( data1 ) {
    success && success( data1 );
  } );
}

function getArionumBalance( success ) {
  getJSONP( 'getBalance&public_key=' + publickey + "&account=" + address, function ( data ) {
    success && success( data.data );
  } );
}

function getAccountBalance( account, success ) {
  getJSONP( 'getBalance&account' + account, function ( data ) {
    success && success( data.data );
  } );
}

function getArionumAlias( success ) {
  getJSONP( 'getAlias&account=' + address, function ( data ) {
    success && success( data.data );
  } );
}

function sendTransaction( dst, val, signature, public_key, ver, message, date, success ) {
  getJSONP( 'send' + "&version=" + ver + "&dst=" + dst + "&val=" + val + "&signature=" + signature + "&public_key=" + public_key + "&message=" + message + "&date=" + date, function ( data ) {
    success && success( data );
  } );
}

function sendTransactionA( dst, val, fee, signature, public_key, ver, message, date, success ) {
  getJSONP( 'send' + "&version=" + ver + "&dst=" + dst + "&val=" + val + "&signature=" + signature + "&public_key=" + public_key + "&message=" + message + "&date=" + date, function ( data ) {
    success && success( data );
  } );
}

function getTransactions( success, clear, download ) {
  getJSONP( 'getTransactions&public_key=' + publickey + "&account=" + address + "&limit=100", function ( data ) {
    clear && clear( data );
    for ( var i = 0; i < data.data.length; i++ ) {
      var obj = data.data[ i ];
      success && success( obj.date, obj.type, obj.val, obj.confirmations, obj.src, obj.dst, obj.message, obj.id );
    }
  } );
}

function getLatestTransaction( success ) {
  getJSONP( 'getTransactions&public_key=' + publickey + "&account=" + address + "&limit=1", function ( data ) {
    success && success( data );
  } );
}

/* UTILS */

function getJSONP( url, success ) {
  setTimeout( function () {
    $.getJSON( peer + '/api.php?q=' + url, function ( data ) {
      success && success( data );
    } );
  }, 1 );
}

/* WINDOW */



var remote = require( 'electron' ).remote;
$( ".min-btn" ).click( function () {
  var window = remote.getCurrentWindow();
  window.minimize();
} );

$( ".max-btn" ).click( function () {
  var window = remote.getCurrentWindow();
  if ( typeof login == "undefined" )
    window.maximize();
} );

$( ".close-btn" ).click( function () {
  var window = remote.getCurrentWindow();
  window.close();
} );