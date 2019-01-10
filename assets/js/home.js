function loadView( name ) {
  $( ".loader" ).show();
  $( ".content" ).removeClass( "done" );
  $( ".site_content" ).empty();
  setTimeout( function () {
    $( ".site_content" ).load( 'site/' + name + '/index.html', function () {
      $( ".content" ).addClass( "done" );
      $( ".loader" ).hide();
    } );
  }, 1200 );
}


$( ".site_loader" ).click( function () {
  loadView( $( this ).text() );
} );

const ipc = require( 'electron' ).ipcRenderer
ipc.send( 'resizable-disable' );
ipc.send( 'resize-dashboard' );


function showDialogue( title, content, question, accept, close_disabled ) {

  if ( $( '.dialogue_wrapper' ) )
    $( '.dialogue_wrapper' ).remove();

  $( '.site_content' ).append( '<div class="dialogue_wrapper"><div class="dialogue"></div></div>' );
  var dialogue = $( ".dialogue" );
  dialogue.hide();

  dialogue.append( '<i class="close"></i>' );
  dialogue.append( '<h1>' + title + '</h1>' );
  dialogue.append( '<p>' + content + '</p>' );

  if ( !close_disabled )
    $( ".close" ).click( function () {
      $( '.dialogue_wrapper' ).remove();
    } );

  if ( question ) {
    dialogue.append( '<div class="button_wrapper">' +
      '<a class="button button_refuse animated03">Refuse</a>' +
      '<a class="button button_accept animated03">Accept</a></div>' );

    $( ".button_wrapper .button_refuse" ).click( function () {
      $( '.dialogue_wrapper' ).remove();
    } );

    $( ".button_wrapper .button_accept" ).click( function () {
      accept && accept();
    } );
  }

  dialogue.show();
}



function showModal( title, content, input_name, done ) {

  if ( $( '.dialogue_wrapper' ) )
    $( '.dialogue_wrapper' ).remove();

  $( '.site_content' ).append( '<div class="dialogue_wrapper"><div class="dialogue"></div></div>' );
  var dialogue = $( ".dialogue" );
  dialogue.hide();

  dialogue.append( '<i class="close"></i>' );
  dialogue.append( '<h1>' + title + '</h1>' );
  dialogue.append( '<p>' + content + '</p>' );
  dialogue.append( '<input class="input_dialogue" placeholder="' + input_name + '" type="name"></input>' );

  $( ".close" ).click( function () {
    $( '.dialogue_wrapper' ).remove();
  } );

  dialogue.append( '<div class="button_wrapper">' +
    '<a class="button button_accept animated03">Accept</a></div>' );
  $( ".button_wrapper .button_accept" ).click( function () {
    done && done( $( ".input_dialogue" ).val() );
    $( '.dialogue_wrapper' ).remove();
  } );

  dialogue.show();
}