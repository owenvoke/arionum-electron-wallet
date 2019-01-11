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


  mainWindow.loadFile( 'login.html' )


  mainWindow.on( 'closed', function () {
    mainWindow = null
  } )




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