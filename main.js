/* INIT VARS */
const electron = require('electron')
const {
  app,
  ipcMain,
  ipcRenderer,
  BrowserWindow,
  Tray,
  Menu
} = require('electron')
var path = require('path')
let mainWindow



app.requestSingleInstanceLock()
app.on('second-instance', function(event, commandLine, workingDirectory) {
  app.quit()
});



/* INIT PROGRAM*/
loadApp();

//DISPLAY WIDTH HEIGHT


let isQuiting = false;
var width = 0;
var height = 0;

/* FUNCTIONS */

function loadApp() {
  app.on('ready', function() {
    const {
      widthX,
      heightX
    } = electron.screen.getPrimaryDisplay().workAreaSize;
    width = widthX;
    height = heightX;
    if (width < defaultwidth) {
      defaultwidth = width;
      defaultheight = Math.trunc(defaultwidth / perception);
    }
    console.log(defaultwidth);
    console.log(defaultheight);


    createCallbacks();
    setupTray();
    createWindow();
  })

  app.on('uncaughtException', function(error) {
    alert(error)
  });


  app.on('activate', function() {
    if (mainWindow === null) {
      createCallbacks();
      setupTray();
      createWindow()
    }
  })
  app.on('window-all-closed', function(event) {
    event.preventDefault();
    app.exit();
  })

}
console.log(path.join(__dirname, ''));

var temp_maximized = false;

function createCallbacks() {
  console.log("Create Callbacks");
  ipcMain.on('update-notify-value', function(event, arg) {
    const notifier = require('node-notifier');
    notifier.notify({
      icon: path.join(__dirname, 'icon.png'),
      title: 'Arionum Wallet',
      message: arg,
      appID: ""
    });
  });
  ipcMain.on('changeWindowState', function(event, arg) {
    temp_maximized ? mainWindow.unmaximize() : mainWindow.maximize()
    temp_maximized = !temp_maximized;
  });
}
var tray;

function setupTray() {
  try {
    const path = require('path');
    const imgPath = path.join(__dirname, 'icon.ico')
    console.log("Create Tray");
    tray = new Tray(imgPath);
    tray.on('double-click', (event, bounds) => {
      mainWindow.show();
    });
    tray.on('click', (event, bounds) => {
      mainWindow.show();
    });

    var contextMenu = Menu.buildFromTemplate([{
        label: 'Show App',
        click: function() {
          loadSite();
          tray.setToolTip('Showing');
          mainWindow.show();
        }
      },
      {
        label: 'Quit',
        click: function() {
          app.isQuiting = true;
          app.quit();
        }
      }
    ]);
    tray.setContextMenu(contextMenu)
    tray.setTooltip('Error getting market price.');
  } catch (e) {

  } finally {

  }

}

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false
    },
    height: 748,
    width: 468,
    transparent: true,
    frame: false,
    icon: path.join(__dirname, 'assets/icons/64x64.png')
  });

  mainWindow.on('show', function() {
    tray.setHighlightMode('always');
    tray.setToolTip('Getting market price...');
  })
  mainWindow.on('minimize', function(event) {
    event.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on('close', function(event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.minimize();
    }
    return false;
  })

  registerWindowEvents();
  loadSite();
}

var defaultwidth = 1318;
var defaultheight = 790;
var perception = defaultwidth / defaultheight;


function loadSite() {
  if (checkData("publickey") == "") {
    mainWindow.loadFile('login.html');
    mainWindow.center();
  } else {
    mainWindow.setResizable(true);
    mainWindow.setSize(defaultwidth, defaultheight, true);
    mainWindow.center();
    mainWindow.loadFile('index.html');
    mainWindow.setResizable(false);
  }
}

function registerWindowEvents() {
  mainWindow.onbeforeunload = (e) => {
    e.returnValue = true;
  };
  mainWindow.webContents.on('will-navigate', function(event, newUrl) {
    var new_site = newUrl.split("/")[newUrl.split("/").length - 1] + "";
    new_site = new_site.replace(".html", "");

    if (new_site == "index") {
      //mainWindow.setResizable( true );
      mainWindow.setResizable(true);
      mainWindow.setSize(defaultwidth, defaultheight, true);
      mainWindow.center();
      mainWindow.setResizable(false);
    }
    if (new_site == "login") {
      mainWindow.setResizable(true);
      mainWindow.setSize(468, 748, true);
      mainWindow.center();
      mainWindow.setResizable(false);
    }
  });
}


function checkData(key) {
  const electron = require('electron');
  const fs = require('fs');
  const userDataPath = (electron.app || electron.remote.app).getPath('userData');
  var paths = path.join(userDataPath, "arionum-config" + '.json');
  var data = parseDataFile(paths, key);
  return data;
}

function parseDataFile(filePath, key) {
  try {
    const fs = require('fs');
    return JSON.parse(fs.readFileSync(filePath))[key];
  } catch (error) {
    return "";
  }
}