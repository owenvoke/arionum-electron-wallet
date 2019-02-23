/*// TODO: INIT*/
init();

function init() {
  updateBalance();
  updateTransactions();
  initUpdater();

  updatePieChart()
}



function updatePieChart() {
  getArionumBlock(function(data) {
    updateFirst(data);
    getArionumAccountDetails(function(data1) {
      updateSecondValue(data, data1);
    });
  });
}

function updateBalance() {
  getArionumBalance(function(data) {
    if (document.getElementById("balance") !== null) {
      document.getElementById("balance").innerHTML = data;
    }
  });
}

function updateTransactions() {
  loadLastTransactions();
}

function initUpdater() {
  setInterval(function() {
    updateBalance();
    updateTransactions();
  }, 1000 * 70);
}


/*// TODO: METHODS*/

function showLoader() {
  if ($(".loader")) {
    $(".loader").show();
    $("#loader path").css("cssText", "fill: #1cbfff;");
    $("#loader rect").css("cssText", "fill: #1cbfff;");
  }
}

function hideLoader() {
  if ($(".loader")) {
    $(".loader").hide();
    $("#loader path").css("cssText", "fill: #fff;");
    $("#loader rect").css("cssText", "fill: #fff;");
  }
}


function loadLastTransactions() {

  showLoader();
  getTransactions(setupTransactionTable, function(data) {
    $("#transactiontable").empty();
    generateRecentReportsChart(data);
  });
  hideLoader();
}


function setupTransactionTable(date, type, val, confirmations, from_adr, to, message, id) {
  try {

    var date_cal = new Date(date * 1000);

    var date_format = "" + date_cal.getFullYear() + "-" +
      ("0" + (date_cal.getMonth() + 1)).slice(-2) +
      "-" + ("0" + date_cal.getDate()).slice(-2) +
      " " + ("0" + date_cal.getHours()).slice(-2) +
      ":" + ("0" + date_cal.getMinutes()).slice(-2);

    var table = document.getElementById("transactiontable");
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    cell1.innerHTML = date_format;
    cell2.innerHTML = type;
    cell3.innerHTML = parseFloat(val).toFixed(2);;
    cell4.innerHTML = confirmations;

    cell5.className = "text-right";
    cell5.innerHTML = from_adr;
    cell6.className = "text-right";
    cell6.innerHTML = to;
    cell7.className = "text-right";
    cell7.className = "text-right";
    var temp_message = "";
    if (message !== null)
      temp_message = message;
    if (temp_message.length > 10)
      temp_message = temp_message;
    cell7.innerHTML = temp_message;
    cell8.className = "text-right";
    cell8.innerHTML = id;

    if (temp_message == "")
      temp_message = "-";

    row.addEventListener("click", function(e) {
      showDialogue("Transaction",
        "<p class='selectable'><b>Date: </b>" + date_format + "<br>" +
        "<b>Action: </b>" + type + "<br>" +
        "<b>Value: </b>" + val + "<br>" +
        "<b>Confirmations: </b>" + confirmations + "<br>" +
        "<b>From: </b>" + from_adr + "<br>" +
        "<b>To: </b>" + to + "<br>" +
        "<b>Message: </b>" + temp_message + "<br>" +
        "<b>ID: </b>" + id + "<br></p>");
    }, false);

  } catch (e) {

  } finally {

  }

}





/*// TODO: UTILS*/

function arrayContains(needle, arrhaystack) {
  return (arrhaystack.indexOf(needle) > -1);
}

function reverseObject(object) {
  var newObject = {};
  var keys = [];
  for (var key in object) {
    keys.push(key);
  }
  for (var i = keys.length - 1; i >= 0; i--) {

    var value = object[keys[i]];
    newObject[keys[i]] = value;
  }

  return newObject;
}