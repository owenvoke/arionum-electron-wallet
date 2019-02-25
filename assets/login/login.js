console.log("resize");

if (store.get("publickey") != "")
  location.replace("./index.html");

setTimeout(function() {
  if (is_electron) {
    const ipc = require('electron').ipcRenderer
    ipc.send('resizable-disable');
    ipc.send('resize-login');

  }



}, 10);

var file = false;
$(".button_choosefile").click(function() {
  if (is_electron) {
    const {
      dialog
    } = require('electron').remote;
    dialog.showOpenDialog({
      properties: ['openFile']
    }, function(files) {
      if (files !== undefined) {

        const fs = require("fs");
        var data = fs.readFileSync(files[0]) + "";
        requestPasswordWithFile(data);
      }
    });
  } else {

    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
      var file = e.target.files[0];
      console.log("File chosen");
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function(evt) {
        console.log("File load");
        requestPasswordWithFile(evt.target.result);
      }
    }

    input.click();


  }
});


function requestPasswordWithFile(data) {

  console.log("Request PW");

  $($(".form-row")[1]).hide();
  $(".button_choosefile").hide();
  $(".button_signup").hide();
  $("h1").text("Security");
  $($(".form-row .input-group label")).text("Password");
  file = true;
  $(".button").click(function() {
    try {
      console.log($(".field1").val());
      console.log("DATA: " + data);
      keypair = aro.decodeKeypair(data, $(".field1").val() + "");
      store.set('publickey', keypair.publicCoin);
      store.set('privatekey', CryptoJS.AES.encrypt(keypair.privateCoin, $(".field1").val()) + "");
      location.replace("./index.html");
    } catch (e) {
      $($(".form-row .input-group label")).css("color", "red");
      $(".field1").val("");
      setTimeout(function() {
        $($(".form-row .input-group label")).css("color", "");
      }, 1200);
      console.log(e);
    }
  });
}

var signup = false;
$(".button_signup").click(function() {
  if (!signup) {
    $("h1").text("Create");
    $(".button_signup").text("Login");
    $(".button").text("Create");
    $($(".form-row .input-group label")[0]).text("Password");
    $($(".form-row .input-group label")[1]).text("Repeat Password");
    $(".button_choosefile").hide();
  } else {
    $(".button_choosefile").show();
    $("h1").text("Login");
    $(".button_signup").text("Create");
    $(".button").text("Login");

    $($(".form-row .input-group label")[0]).text("PublicKey");
    $($(".form-row .input-group label")[1]).text("PrivateKey");
  }
  signup = !signup;
});

$(".button").click(function() {
  if (!file) {
    if (signup) {
      createWallet();
    } else {
      loginWithKeys();
    }
  }
});


function createWallet() {
  requestPasswordAndLogin();
}

function requestPasswordAndLogin() {
  var password = $(".field1").val() + "";
  var password2 = $(".field2").val() + "";

  if (password == password2 && password != "" && password.length > 4) {
    var keypair = aro.encodeKeypair();

    $($(".form-row .input-group label")[0]).text("PublicKey");
    $($(".form-row .input-group label")[1]).text("PrivateKey");
    $(".field1").val(keypair.publicCoin);
    $(".field2").val(keypair.privateCoin);
    $(".button_signup").hide();
    $(".button").text("Login");
    file = true;

    if (is_electron) {
      const path = require('path');
      const userDataPath = (electron.app || electron.remote.app).getPath('userData');
      var paths = path.join(userDataPath, 'wallet.aro');

      aro.encryptAro(keypair.encoded, password2).then(encrypt => {
        var fs = require('fs');
        fs.writeFileSync(paths, encrypt, 'utf-8');
      });

      console.log(paths);

    } else {
      aro.encryptAro(keypair.encoded, password2).then(encrypt => {
        var text = encrypt;
        var filename = "wallet.aro";
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });

    }

    $(".button").click(function() {
      requestPasswordWithFile(paths);
    });

  } else {
    $($(".form-row .input-group label")).css("color", "red");
    $(".field1").val("");
    $(".field2 ").val("");
    setTimeout(function() {
      $($(".form-row .input-group label")).css("color", "");
    }, 1200);
  }
}

function loginWithKeys() {
  var private = $(".field2 ").val();
  if (private == "")
    private = $(".field1").val();
  var encoded = "arionum:" + private + ":" + $(".field1").val();
  console.log(encoded);
  var keypair = aro.decodeKeypair(encoded);

  if ($(".field2 ").val() != "") {
    $(".field1").val("");
    $(".field2 ").val("");
    $("h1").text("Security");
    $(".button_choosefile").hide();
    $(".button_signup").hide();
    $(".button").text("Enter");
    $($(".form-row .input-group label")[0]).text("Password");
    $($(".form-row .input-group label")[1]).text("Repeat Password");
    file = true;
    $(".button").click(function() {

      const fs = require("fs");
      const path = require('path');
      const userDataPath = (electron.app || electron.remote.app).getPath('userData');
      var paths = path.join(userDataPath, 'wallet.aro');
      aro.encryptAro(keypair.encoded, $(".field2 ").val()).then(encrypt => {
        fs.writeFileSync(paths, encrypt, 'utf-8');
      });
      requestPasswordWithFile(paths);
    });
  } else {
    const fs = require("fs");
    const path = require('path');
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    var paths = path.join(userDataPath, 'wallet.aro');
    fs.writeFileSync(paths, encoded, 'utf-8');

    var data = fs.readFileSync(paths) + "";
    try {
      keypair = aro.decodeKeypair(data);
      store.set('publickey', keypair.publicCoin);
      store.set('privatekey', CryptoJS.AES.encrypt(keypair.privateCoin, $(".field1").val()) + "");
      location.replace("./index.html");
    } catch (e) {
      $($(".form-row .input-group label")).css("color", "red");
      $(".field1").val("");
      setTimeout(function() {
        $($(".form-row .input-group label")).css("color", "");
      }, 1200);
      console.log(e);
    }

  }
}