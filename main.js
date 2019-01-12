/* INIT VARS */
const electron = require( 'electron' )
const {
  app,
  ipcMain,
  ipcRenderer,
  BrowserWindow
} = require( 'electron' )
var path = require( 'path' )
let mainWindow

/* INIT PROGRAM*/
loadApp();

/* FUNCTIONS */

function loadApp() {
  app.on( 'ready', createWindow )

  app.on( 'uncaughtException', function ( error ) {
    alert( error )
  } );

  app.on( 'window-all-closed', function () {
    app.exit();
  } )

  app.on( 'activate', function () {
    if ( mainWindow === null ) {
      createWindow()
    }
  } )
}

function createWindow() {

  mainWindow = new BrowserWindow( {
    webPreferences: {
      webSecurity: false
    },
    height: 748,
    width: 468,
    transparent: true,
    frame: false,
    icon: path.join( __dirname, 'assets/icons/64x64.png' )
  } );

  registerWindowEvents();
  loadSite();
}

function loadSite() {
  if ( checkData( "publickey" ) == "" )
    mainWindow.loadFile( 'login.html' );
  else {
    mainWindow.setResizable( false );
    mainWindow.setSize( 1318, 790, true );
    mainWindow.center();
    mainWindow.loadFile( 'index.html' );
  }
}

function registerWindowEvents() {
  mainWindow.webContents.on( 'will-navigate', function ( event, newUrl ) {
    var new_site = newUrl.split( "/" )[ newUrl.split( "/" ).length - 1 ] + "";
    new_site = new_site.replace( ".html", "" );

    if ( new_site == "index" ) {
      //mainWindow.setResizable( true );
      mainWindow.setResizable( false );
      mainWindow.setSize( 1318, 790, true );
      mainWindow.center();
    }
    if ( new_site == "login" ) {
      mainWindow.setResizable( true );
      mainWindow.setSize( 468, 748, true );
      mainWindow.center();
      mainWindow.setResizable( false );
    }
  } );
  mainWindow.on( 'closed', function () {
    mainWindow = null
  } )
}


function checkData( key ) {
  const electron = require( 'electron' );
  const fs = require( 'fs' );
  const userDataPath = ( electron.app || electron.remote.app ).getPath( 'userData' );
  var paths = path.join( userDataPath, "arionum-config" + '.json' );
  var data = parseDataFile( paths, key );
  return data;
}

function parseDataFile( filePath, key ) {
  try {
    const fs = require( 'fs' );
    return JSON.parse( fs.readFileSync( filePath ) )[ key ];
  } catch ( error ) {
    return "";
  }
}