var qrcode = new QRCode( "qrcode", {
  text: "eXampleCode0==))()(/(/&&))",
  width: 128,
  height: 128,
  colorDark: "#292929",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H
} );
$( "#qrcode" ).prop( 'title', '' );


function updateQRCode( text, size ) {
  $( "#qrcode" ).empty();
  var qrcode1 = new QRCode( "qrcode", {
    text: "text",
    width: size,
    height: size,
    colorDark: "#292929",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  } );
  $( "#qrcode" ).prop( 'title', '' );
  qrcode1.makeCode( text );
}



$( ".address" ).val( address );
$( ".publickey" ).val( publickey );
$( ".privatekey" ).val( privatekey );


$( ".mobileQRbutton" ).click( function () {
  $( this ).hide();
  $( "#qrcode" ).removeClass( "blurred" );
  updateQRCode( address + "|" + privatekey + "|" + publickey, 190 );
} );

$( ".privatekeybutton" ).click( function () {
  $( this ).hide();
  $( ".privatekey" ).removeClass( "blurred" );

} );