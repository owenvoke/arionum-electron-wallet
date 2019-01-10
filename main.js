const electron = require( 'electron' )
const {
  app,
  ipcMain,
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
    height: 819,
    width: 522,
    transparent: true,
    frame: false
  } )

  ipcMain.on( 'resizable-enable', ( event, arg ) => {
    mainWindow.setResizable( true );
  } )
  ipcMain.on( 'resizable-disable', ( event, arg ) => {
    mainWindow.setResizable( false );
  } )

  mainWindow.loadFile( 'login.html' )


  mainWindow.on( 'closed', function () {
    mainWindow = null
  } )


}

ipcMain.on( 'resize-dashboard', ( event, arg ) => {
  mainWindow.setSize( 1318, 730 );
  mainWindow.center();
} );

app.on( 'ready', createWindow )


app.on( 'uncaughtException', function ( error ) {
  alert( error )
} );

app.on( 'window-all-closed', function () {
  if ( process.platform !== 'darwin' ) {
    app.quit()
  }
} )

app.on( 'activate', function () {
  if ( mainWindow === null ) {
    createWindow()
  }
} )