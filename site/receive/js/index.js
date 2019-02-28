var qrcode = new QRCode("qrcode", {
  text: "eXampleCode0==))()(/(/&&))",
  width: 128,
  height: 128,
  colorDark: "#292929",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H
});
$("#qrcode").prop('title', '');


function updateQRCode(text) {
  $("#qrcode").removeClass("blurred");
  $("#qrcode").prop('title', '');
  qrcode.clear();
  qrcode.makeCode(text);
}

$(".generate").click(function() {
  updateQRCode("arosend" + "|" + address + "|" + $(".addresss").val() + "|" + "Arionum Request for " + $(".addresss").val() + " ARO");
});

$(".address").val(address);
$(".alias").val(alias);

if (alias == "none") {
  $(".alias").hide();
  $(".alias").after('<a class="button alias_buy">Buy</a>');
}


$(".alias_buy").click(function() {
  showModal("Purchase an Alias",
    "An Alias will open up a new way of transactions between users with an easier and shorter receiver!" + "<br>" +
    "The cost of an Alias is: <b>10 ARO</b> and this action <b style='color:red'>cannot</b> be <b style='color:red'>undone</b>" + "<br><br>" +
    "<i>Enter your Alias</i>",
    "Alias",
    function(aliasf) {

      alert(aliasf);

      var amount = parseFloat("0.00000001").toFixed(8);
      var fee = parseFloat("10").toFixed(8);

      var message = aliasf;

      var timeStampInMs = window.performance && window.performance.now &&
        window.performance.timing && window.performance.timing.navigationStart ?
        window.performance.now() + window.performance.timing.navigationStart : Date.now();
      var time = parseInt(timeStampInMs / 1000);

      var key = aro.decodeKeypair("arionum:" + privatekey + ":" + publickey);


      var version = 3;

      var presignedmessage = amount + "-" + fee + "-" + address + "-" + message + "-" + version + "-" + publickey + "-" + time;
      var signature = aro.sign(key.key, presignedmessage);

      sendTransactionA(address, amount, fee, signature, publickey, version, message, time, function(data) {
        var status = data.status;

        if (status == "ok") {
          setTimeout(function() {
            showDialogue("Transaction Success", "Your Transaction has been sent successfully!<br>ID: <b>" + data.data + "</b>");
          }, 100);
        } else {
          setTimeout(function() {
            showDialogue("Transaction Error", "There was an Error while sending your transaction: <b>" + data.data + "</b>");
          }, 100);
        }
      });

    }, true);


});