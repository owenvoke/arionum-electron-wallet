const electron = require( 'electron' )
const {
  app,
  ipcMain,
  ipcRenderer,
  BrowserWindow
} = require( 'electron' )

let mainWindow

/*
  width: 522,
  height: 819,
*/



function createWindow() {
  mainWindow = new BrowserWindow( {
    webPreferences: {
      webSecurity: false
    },
    height: 748,
    width: 468,
    transparent: true,
    frame: false
  } )

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


  if ( checkData( "publickey" ) == "" )
    mainWindow.loadFile( 'login.html' );
  else {
    mainWindow.setResizable( false );
    mainWindow.setSize( 1318, 790, true );
    mainWindow.center();
    mainWindow.loadFile( 'index.html' );
  }


  mainWindow.on( 'closed', function () {
    mainWindow = null
  } )




}


function checkData( key ) {
  const electron = require( 'electron' );
  const path = require( 'path' );
  const fs = require( 'fs' );
  const userDataPath = ( electron.app || electron.remote.app ).getPath( 'userData' );
  var paths = path.join( userDataPath, "arionum-config" + '.json' );
  var data = parseDataFile( paths, "" );
  return data[ key ];
}

function parseDataFile( filePath, defaults ) {
  try {
    return JSON.parse( fs.readFileSync( filePath ) );
  } catch ( error ) {
    return defaults;
  }
}

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