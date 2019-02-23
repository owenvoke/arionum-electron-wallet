//INIT
var aro = new aro;
var instance = this;


const store = new Store({
  configName: 'arionum-config',
  defaults: {
    publickey: "",
    privateCoin: ""
  }
});

//TODO -> VALUES

//// TODO: DEBUG PZ8Tyr4Nx8MHsRAGMpZmZ6TWY63dXWSCwJ65ajWp8WD2zLcxtHBSzvuYQX1PmQVWtvFFfgKKxf7jKtJyfKPxwKKg8gCoFMyBjooCta93Am5sNDCJHsPYifd3
var account = "";


//PZ8Tyr4Nx8MHsRAGMpZmZ6TWY63dXWSCys8HWrmhES5nKR4G3JoLZRWC5Bcp4gRL8k4mxA53zyPQHSYhJRhBUFWBqeVKNfE5pU9ZpYj78DFYM7Lu3tZ5PZaL

var publickey = store.get("publickey");
var privatekey = store.get("privatekey");
var alias = "";


if (typeof login == "undefined")
  if (publickey == "")
    location.replace("login.html");

//<===DEPRECATED===>
var address = "";
address = aro.getAddress(publickey);

var cors_bypass = "https://cubedpixels.net:9080/";
var peer_setup = false;
var peer = "";
var requestInit = true;

function checkInit() {
  if (peer_setup)
    init();
  else
    requestInit = true;
}

function setupPeer(peer_done) {
  peer_setup = true;

  peer = peer_done;

  if ($("#peer"))
    $("#peer").text(peer.replace("http://", "").replace(cors_bypass, ""));

  if (requestInit)
    init();
}

function getFastestPeer(peers) {
  var lines = peers.split('\n');

  var fastest_response = "";

  $.xhrPool = [];
  $.xhrPool.abortAll = function() {
    $(this).each(function(i, jqXHR) {
      jqXHR.abort();
      $.xhrPool.splice(i, 1);
    });
  }

  for (var i = 0; i < lines.length; i++) {
    var peer_url = is_electron ? lines[i] : cors_bypass + lines[i];
    if (peer_url == "")
      continue;
    var ajax = $.ajax({
      url: peer_url,
      success: function(result) {
        console.log("Response from: " + this.url);
        if (fastest_response == "") {
          $.xhrPool.abortAll();
          fastest_response = this.url;
          setupPeer(fastest_response);
        }
      }
    });
    $.xhrPool.push(ajax);
  }



}


function downloadPeers() {

  var request = $.ajax({
    url: is_electron ? "http://api.arionum.com/peers.txt" : cors_bypass + "http://api.arionum.com/peers.txt"
  });

  console.log(is_electron ? "http://api.arionum.com/peers.txt" : cors_bypass + "http://api.arionum.com/peers.txt");

  request.done(function(peers) {
    getFastestPeer(peers);
  });

  request.fail(function(jqXHR, textStatus) {
    setupPeer(is_electron ? "http://peer1.arionum.com" : cors_bypass + "http://peer1.arionum.com");
  });
}

downloadPeers();
setElectronHeight();

function init() {
  getAlias();
  if (typeof loadView !== "undefined") {
    loadView("home");
  }
}

function setElectronHeight() {
  if (window && window.process && window.process.type)
    if (process && process.versions.electron) {
      $(".content").addClass("animated_fast");
      if (typeof login !== "undefined") {

        $("html").css("font-size", "9px");
        $(":root").css("font-size", "9px");
      } else {

        $("html").css("font-size", "16px");
        $(":root").css("font-size", "16px")
      }
    }

  setTimeout(function() {
    $(".content").removeClass("animated_fast");
    $(".content").addClass("animated");
    checkInit();
  }, 100)
}




/*  // TODO: API METHODS    */


function getAlias() {
  getArionumAlias(function(data) {
    var datas = data;
    if (datas == "false")
      datas = "none";
    if (datas == "null" || datas == null)
      datas = "none";
    alias = datas;
  });
}

function getArionumBlock(success) {
  getJSONP('currentBlock', function(data) {
    success && success(data);
  });
}

function getArionumAccountDetails(success) {
  getJSONP('node-info', function(data1) {
    success && success(data1);
  });
}

function getArionumBalance(success) {
  getJSONP('getBalance&public_key=' + publickey + "&account=" + address, function(data) {
    success && success(data.data);
  });
}

function getAccountBalance(account, success) {
  getJSONP('getBalance&account' + account, function(data) {
    success && success(data.data);
  });
}

function getArionumAlias(success) {
  getJSONP('getAlias&account=' + address, function(data) {
    success && success(data.data);
  });
}

function sendTransaction(dst, val, signature, public_key, ver, message, date, success) {
  getJSONP('send' + "&version=" + ver + "&dst=" + dst + "&val=" + val + "&signature=" + signature + "&public_key=" + public_key + "&message=" + message + "&date=" + date, function(data) {
    success && success(data);
  });
}

function sendTransactionA(dst, val, fee, signature, public_key, ver, message, date, success) {
  getJSONP('send' + "&version=" + ver + "&dst=" + dst + "&val=" + val + "&signature=" + signature + "&public_key=" + public_key + "&message=" + message + "&date=" + date, function(data) {
    success && success(data);
  });
}

function getTransactions(success, clear, download) {
  getJSONP('getTransactions&public_key=' + publickey + "&account=" + address + "&limit=100", function(data) {
    clear && clear(data);
    for (var i = 0; i < data.data.length; i++) {
      var obj = data.data[i];
      success && success(obj.date, obj.type, obj.val, obj.confirmations, obj.src, obj.dst, obj.message, obj.id);
    }
  });
}

var latestTransaction = "";

function checkTransaction(data) {
  if (is_electron && data.data.length > 0) {
    var type = data.data[0].type;
    var id = data.data[0].id;
    var val = data.data[0].val;
    if (latestTransaction != "" && id != latestTransaction) {
      const ipc = electron.ipcRenderer;
      if (type == "credit")
        ipc.send('update-notify-value', "A transaction of " + val + " ARO has been received!");
      if (type == "debit")
        ipc.send('update-notify-value', val + " ARO have been sent !");
    }
    latestTransaction = id;
  }
}
setInterval(function() {
  if (publickey != "")
    getLatestTransaction();
}, 5000);


function getLatestTransaction(success) {
  getJSONP('getTransactions&public_key=' + publickey + "&account=" + address + "&limit=1", function(data) {
    checkTransaction(data)
    success && success(data);
  });
}

/* UTILS */

function getJSONP(url, success) {
  setTimeout(function() {
    $.getJSON(peer + '/api.php?q=' + url, function(data) {
      success && success(data);
    });
  }, 1);
}

/* WINDOW */


if (is_electron) {
  var remote = require('electron').remote;
  $(".min-btn").click(function() {
    var window = remote.getCurrentWindow();
    window.minimize();
  });

  $(".max-btn").click(function() {
    var window = remote.getCurrentWindow();
    if (typeof login == "undefined")
      window.maximize();
  });

  $(".close-btn").click(function() {
    var window = remote.getCurrentWindow();
    window.minimize();
  });
}