if ( is_electron ) {
  var path = require( 'path' );
  var fs = require( 'fs' );
  var electron = require( 'electron' );
}



class Store {
  constructor( opts ) {
    if ( is_electron ) {
      const userDataPath = ( electron.app || electron.remote.app ).getPath( 'userData' );
      this.path = path.join( userDataPath, opts.configName + '.json' );
      this.data = parseDataFile( this.path, opts.defaults );
    }
  }

  get( key ) {
    if ( !is_electron )
      return localStorage.getItem( key ) || "";
    return this.data[ key ];
  }

  set( key, val ) {

    if ( !is_electron ) {
      localStorage.setItem( key, val );
      return;
    }
    this.data[ key ] = val;
    fs.writeFileSync( this.path, JSON.stringify( this.data ) );
  }
}

function parseDataFile( filePath, defaults ) {
  try {
    return JSON.parse( fs.readFileSync( filePath ) );
  } catch ( error ) {
    return defaults;
  }
}
