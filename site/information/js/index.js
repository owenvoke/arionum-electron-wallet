var qrcode = new QRCode("qrcode", {
  text: "eXampleCode0==))()(/(/&&))",
  width: 128,
  height: 128,
  colorDark: "#292929",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H
});
$("#qrcode").prop('title', '');


function updateQRCode(text, size) {
  $("#qrcode").empty();
  var qrcode1 = new QRCode("qrcode", {
    text: "text",
    width: size,
    height: size,
    colorDark: "#292929",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
  $("#qrcode").prop('title', '');
  qrcode1.makeCode(text);
}



$(".address").val(address);
$(".publickey").val(publickey);
$(".privatekey").val(privatekey);


$(".mobileQRbutton").click(function() {
  showModal("Show your PrivateKey",
    "Your PrivateKey should <b style='color:red'>never</b> get into any other persons hand! <b>Refrain from sharing this key!</b> " + "<br>" + "<br>" +
    "<i>Enter your Wallet-Password</i>",
    "password",
    function(password) {
      var decrypted;
      try {
        decrypted = CryptoJS.AES.decrypt(privatekey, password);
        updateQRCode(address + "|" + decrypted.toString(CryptoJS.enc.Utf8) + "|" + publickey, 190);
        $(".mobileQRbutton").hide();
        $("#qrcode").removeClass("blurred");
      } catch (e) {
        $($(".form-row .input-group label")).css("color", "red");
        setTimeout(function() {
          $($(".form-row .input-group label")).css("color", "");
        }, 1200);
      }
    }, false, true);
});

$(".privatekeybutton").click(function() {
  showModal("Show your PrivateKey",
    "Your PrivateKey should <b style='color:red'>never</b> get into any other persons hand! <b>Refain from sharing this key!</b> " + "<br>" + "<br>" +
    "<i>Enter your Wallet-Password</i>",
    "password",
    function(password) {
      var decrypted;
      try {
        decrypted = CryptoJS.AES.decrypt(privatekey, password);
        $(".privatekey").val(decrypted.toString(CryptoJS.enc.Utf8));
        $(".privatekeybutton").hide();
        $(".privatekey").removeClass("blurred");
      } catch (e) {
        $($(".form-row .input-group label")).css("color", "red");
        setTimeout(function() {
          $($(".form-row .input-group label")).css("color", "");
        }, 1200);
      }
    }, false, true);
});


$(".logout").click(function() {
  store.set("publickey", "");
  store.set("privatekey", "");


  location.replace("./login.html");
});