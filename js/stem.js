document.addEventListener( 'DOMContentLoaded', function( event ) { 

    // Setup.
    var scripts = document.querySelectorAll( 'head script' );
    var root    = ''
    var absPath = document.location.href.substring( 0, document.location.href.lastIndexOf( '/' ) );
    var relPath = '';

    /**
     * Using the absolute path to the current file and the stem.js
     * file path determine the sites root path.
     */
    var len = scripts.length;
    for ( var x = 0; x < len; x++ ) {
        if ( scripts[ x ].src ) {
            if ( scripts[ x ].src.includes( 'stem.js' ) ) {
                root = scripts[ x ].src.substring( 0, scripts[ x ].src.lastIndexOf( '/' ) );
                root = root.substring( 0, root.lastIndexOf( '/' ) );
                break;
            }
        }
    }

    // Determine how many directories we are away from the root and build the relative path.
    relPath = absPath.replace( root, '' );
    count   = relPath.split( '/' ).length - 1;
    relPath = '';
    while ( count > 0 ) {
        relPath += '../';
        count--;
    }

    // Load the Highlight JS stylesheet into the current page.
    var tag  = document.createElement( 'LINK' );
    tag.rel  = 'stylesheet';
    tag.href = relPath + 'css/highlight.min.css';
    document.head.appendChild( tag );

    // Load the Highlight JS script into the current page.
    tag      = document.createElement( 'SCRIPT' );
    tag.type = 'text/javascript';
    tag.src  = relPath + 'js/highlight.min.js';
    document.head.appendChild( tag );

    // Load the Katex stylesheet into the current page.
    tag  = document.createElement( 'LINK' );
    tag.rel  = 'stylesheet';
    tag.href = relPath + 'css/katex.min.css';
    document.head.appendChild( tag );

    // Load the Katex script into the current page.
    tag      = document.createElement( 'SCRIPT' );
    tag.type = 'text/javascript';
    tag.src  = relPath + 'js/katex.min.js';
    document.head.appendChild( tag );

    // Load the Mermaid script into the current page.
    tag      = document.createElement( 'SCRIPT' );
    tag.type = 'text/javascript';
    tag.src  = relPath + 'js/mermaid.min.js';
    document.head.appendChild( tag );

    // Once the scripts have been loaded call the functions to initialize them.
    loadHighlight( 0 );
    loadMermaid( 0 );
    loadKatex( 0 );

    function loadHighlight( count ) {

        if ( count > 30 ) {
            return;
        }

        if ( typeof mermaid !== 'undefined' ) {

            // Initialize Highlight.js to format all code examples on the page.
            var tag  = document.createElement( 'SCRIPT' );
            tag.type = 'text/javascript';
            tag.innerHTML = 'hljs.initHighlighting();';
            document.head.appendChild( tag );

        } else {
            setTimeout( loadHighlight.bind( null, count++ ), 100 );
        }

    }

    function loadMermaid( count ) {

        if ( count > 30 ) {
            return;
        }

        if ( typeof mermaid !== 'undefined' ) { 
            var tag  = document.createElement( 'SCRIPT' );
            tag.type = 'text/javascript';
            tag.innerHTML = 'mermaid.initialize( { startOnLoad: true } );';
            document.head.appendChild( tag );
        } else {
            setTimeout( loadMermaid.bind( null, count++ ), 100 );
        }

    }

    function loadKatex( count ) {

        if ( count > 30 ) {
            return;
        }

        if ( typeof katex !== 'undefined' ) { 
            katexAreas = document.querySelectorAll( '.katex' );
            katexAreas.forEach( function( elem ) {
            katex.render( elem.innerHTML, elem, { throwOnError: false } );
            } );
        } else {
            setTimeout( loadKatex.bind( null, count++ ), 100 );
        }

    }

} );