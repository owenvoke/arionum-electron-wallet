/* SEND TRANSACTION*/


$( ".button" ).click( function () {
  var value = 0.0002;
  var address_to = "";

  showDialogue( "Send a Transaction", "Do you really want to <b>send</b> your <b>" + value + " ARO</b> to " + address_to + "?", true, function () {
    showDialogue( "Sending Transaction", "Your transaction is being send", false, function () {}, true );
    showProgressbar();
    updateProgressbar( 5 );
    setTimeout( function () {
      sendPayment();
    }, 100 );
  } );
} );


function showProgressbar() {
  $( ".dialogue p" ).append( '<div class="progress">  <b class="progress__bar"></b></div>' );
}

function updateProgressbar( percentage ) {
  var $progress = $( ".progress" ),
    $bar = $( ".progress__bar" );
  $progress.addClass( "progress--active" );
  $bar.css( {
    width: percentage + "%"
  } );
}

$( '.amount' ).on( 'propertychange input', function ( e ) {
  var valueChanged = false;

  if ( e.type == 'propertychange' ) {
    valueChanged = e.originalEvent.propertyName == 'value';
  } else {
    valueChanged = true;
  }
  if ( valueChanged ) {
    var cfloat = parseFloat( $( '.amount' ).val() );
    var fee = cfloat * 0.0025;
    if ( fee > 10 ) fee = 10;
    if ( fee < 0.00000001 ) fee = 0.00000001;
    $( '.fee' ).val( fee.toFixed( 8 ) );
  }
} );

function sendPayment() {

  showModal( "Security",
    "Please enter your password to send this Transaction " + "<br>" + "<br>" +
    "<i>Enter your Wallet-Password</i>",
    "password",
    function ( password ) {
      var decrypted;
      try {
        decrypted = CryptoJS.AES.decrypt( privatekey, password );
        updateProgressbar( 5 );
        var address = $( ".address" ).val();
        var message = "";
        message = $( ".message" ).val();
        var amount = parseFloat( $( ".amount" ).val() ).toFixed( 8 );
        var timeStampInMs = window.performance && window.performance.now &&
          window.performance.timing && window.performance.timing.navigationStart ?
          window.performance.now() + window.performance.timing.navigationStart : Date.now();
        var time = parseInt( timeStampInMs / 1000 );
        updateProgressbar( 10 );
        var fee = parseFloat( $( ".fee" ).val() ).toFixed( 8 );
        var key = aro.decodeKeypair( "arionum:" + decrypted.toString( CryptoJS.enc.Utf8 ) + ":" + publickey );
        var version = address.length < 26 ? 2 : 1;
        console.log( version );
        if ( version == 2 ) {
          address = address.toUpperCase();
        }
        updateProgressbar( 30 );

        var presignedmessage = amount + "-" + fee + "-" + address + "-" + message + "-" + version + "-" + publickey + "-" + time;
        console.log( presignedmessage );
        var signature = aro.sign( key.key, presignedmessage );
        console.log( "signature: " + signature );
        updateProgressbar( 60 );
        sendTransaction( address, amount, signature, publickey, version, message, time, function ( data ) {
          updateProgressbar( 90 );
          console.log( data );
          var status = data.status;
          if ( status == "ok" ) {
            updateProgressbar( 100 );
            setTimeout( function () {
              showDialogue( "Transaction Success", "Your Transaction has been sent successfully!<br>ID: <b>" + data.data + "</b>" );
            }, 100 );
          } else {
            updateProgressbar( 100 );
            setTimeout( function () {
              showDialogue( "Transaction Error", "There was an Error while sending your transaction: <b>" + data.data + "</b>" );
            }, 100 );
          }
        } );
      } catch ( e ) {
        console.log( e );
        $( $( ".form-row .input-group label" ) ).css( "color", "red" );
        setTimeout( function () {
          $( $( ".form-row .input-group label" ) ).css( "color", "" );
        }, 1200 );
      }
    }, false, true );
}