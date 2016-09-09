// set to true to see the console.log debug info
var debug = true;

// setup default index of 0
var index = 0;

// setup scrolling flag
var scrolling = false;

// cache a few elements for reference
var win = $( window );
var body = $( 'body' );
var container = $( '.site-container' );

// setup a few more variables for future use
var lastTop = 0;
var current, offset;

// bind scroll event
win.on( 'scroll', function( ev ) {
    // prevent the default event
    ev.preventDefault();
    // check to make sure we don't fire the scroll multiple times
    if ( debug ) console.log( scrolling, 'scrolling' );
    if ( scrolling ) return;
    
    // set the scrolling flag to true
    scrolling = true;
    
    // run the update function
    updateActive();
    
    // clear the scrolling flag to allow the user to access the next element
    setTimeout( function() { scrolling = false; }, 500 );
    
    // update a few variables for the next interaction
    current = container.find( '[data-index='+index+']' );
    offset = current.offset();
    lastTop = offset.top;
    
    // handle the animation
    body.animate(
        { scrollTop : offset.top + 'px' },300
    );
    
});
    
function updateActive() {
    // get the current top offset
    var top = win.scrollTop();
    // determine which direction we are scrolling
    if ( top > lastTop ) { 
        // down
        if ( debug ) console.log( 'scrolling down' );
        // let make sure we aren't on the last element
        if ( debug ) console.log( index, $( '.inner' ).length );
        if ( index == $( '.inner' ).length - 1 ) {
            if ( debug ) console.log( 'on last element, nothing to do' );
            return;
        }
        
        // update index & top
        if ( debug ) console.log( index, 'index before' );
        index++;
        if ( debug ) console.log( index, 'index after' );
        lastTop = top;
        
    } else { 
        // up
        if ( debug ) console.log( 'scrolling up' );
        // let make sure we aren't on the first element
        if ( ! index ) {
            if ( debug ) console.log( 'on first element, nothing to do' );
            return;
        }
        
        // update index & top
        if ( debug ) console.log( index, 'index before' );
        index--;
        if ( debug ) console.log( index, 'index after' );
        lastTop = top;
        
    }
}
