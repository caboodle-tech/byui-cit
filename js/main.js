/**
 * Polyfill forEach.
 * 
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach|Source Code}
 */
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

var byui = ( function() {

    var intervals = {
        'nav': null
    };

    var attachAnchors = function() {

        var anchors = document.querySelectorAll( 'ol > li' );
        var a  = null;
        var h1 = null;

        anchors.forEach( function( anchor, index ){
            anchor.id = 'anchor-' + ( index + 1);
            h1 = anchor.querySelector( 'h2' );
            if ( h1 ) {
                a = document.createElement( 'a' );
                a.href = window.location.origin + window.location.pathname + '#anchor-' + ( index + 1 );
                a.innerHTML = h1.innerHTML;
                h1.innerHTML = '';
                h1.appendChild( a );
            }
        } );

    };

    var attachCollapsible = function() {

        var collapsibles = document.querySelectorAll( '.collapsible' );

        collapsibles.forEach( function( collapsible ){
            collapsible.addEventListener( 'click', toggleCollapsible );
        } );

    };

    var attachListeners = function() {

        // Is the sidebar on this page?
        if ( document.getElementById('sidebar' ) ) {
            // Yes, if it exists attach the listener to the mobile nav button.
            if ( document.getElementById('mobile-nav-button' ) ) {
                document.getElementById( 'mobile-nav-button' ).addEventListener( 'click', toggleNav );
            }
        } else {
            // No, hide the mobile nav button if it exists.
            if ( document.getElementById('mobile-nav-button' ) ) {
                document.getElementById( 'mobile-nav-button' ).style.display = 'none';
            }
        }

        var mores = document.querySelectorAll( 'nav .more' );
        mores.forEach( function( more ) {
            more.addEventListener( 'click', toggleMore );
        } );

        var links = document.querySelectorAll( 'nav .link' );
        links.forEach( function( link ) {
            var empty = link.querySelector( 'a' );
            if ( ! empty ) {
                // Pass click over to the more button, this is a placeholder link.
                link.addEventListener( 'click', passToMore );
            }
        } );

    };

    var convertImages = function() {

        var images = document.querySelectorAll( '#main-content img' );
        images.forEach( function( img ) {
            var cls = '';
            if ( img.classList.contains( 'left' ) ) {
                cls = 'left';
                img.classList.remove( 'left' );
            } else if ( img.classList.contains( 'right' ) ) {
                cls = 'right';
                img.classList.remove( 'right' );
            } else {
                cls = 'center';
                img.classList.remove( 'center' );
            }
            var fig = document.createElement( 'FIGURE' );
            fig.classList.add( cls );
            fig.innerHTML = img.outerHTML;

            if ( img.dataset.caption ) {
                fig.innerHTML = fig.innerHTML + '<figcaption>' + img.dataset.caption + '</figcaption>';
            }

            img.parentNode.replaceChild( fig, img );
        } );

    };

    var convertVideoLinks = function() {

        var videos = document.querySelectorAll( '[data-video]' );

        videos.forEach( function( video ) {
            var type = video.dataset.video
            if ( type ) {
                type = type.trim();
                processVideo( type.toUpperCase(), video );
            }
        } );

    };

    /**
     * Vanilla Javascript DOM Ready function supporting IE 8+.
     *
     * @param {function} fn A function to call when the DOM is ready.
     * @see {@link http://youmightnotneedjquery.com/>}
     * @author adamfschwartz
     * @author zackbloom
     */
    var domReady = function( fn ) {
        if (document.readyState != 'loading'){
            fn();
        } else if (document.addEventListener) {
            document.addEventListener( 'DOMContentLoaded', fn );
        } else {
            document.attachEvent( 'onreadystatechange', function(){
                if (document.readyState != 'loading'){
                    fn();
                }
            });
        }
    };

    var initialize = function() {

        attachListeners();

        attachAnchors();

        setTimeout( function(){
            scrollToAnchor();
        }, 500 );

        attachCollapsible();

        convertImages();

        convertVideoLinks();

    };

    var passToMore = function() {
        var more = this.nextElementSibling;
        if ( more ) {
            if ( more.classList.contains( 'more' ) ) {
                toggleMore.call( more );
            }
        }
    };

    var processVideo = function( type, link ) {

        switch ( type ) {
            case 'YOUTUBE':
                // Get the video source or bail.
                var src = link.href;
                if ( src ) {
                    src = src.substring( src.lastIndexOf( '/' ) + 1 );
                    if ( src.length < 5 ) {
                        return;
                    }
                }
                // Build the iframe.
                var frame = document.createElement( 'IFRAME' );
                frame.setAttribute( 'allowFullScreen', '' );
                frame.setAttribute( 'allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' );
                frame.setAttribute( 'frameborder', '0' );
                frame.setAttribute( 'src', 'https://www.youtube-nocookie.com/embed/' + src );
                // Make a new link.
                var a = document.createElement( 'A' );
                a.setAttribute( 'href', link.href );
                a.setAttribute( 'target', '_blank' );
                // Make the fallback link div and add it after the existing link.
                var fallback = document.createElement( 'DIV' );
                fallback.classList.add( 'video-fallback' );
                fallback.innerHTML = '&mdash;&nbsp;&nbsp;<a href="' + link.href + '" target="_blank">&#x2139;&nbsp;&nbsp;' + link.innerHTML + '</a>';
                fallback.appendChild( a );
                link.parentElement.insertBefore( fallback, link.nextSibling );
                // Swap out the link and replace with the video and fallback divs.
                var html = document.createElement( 'DIV' );
                html.classList.add( 'video' );
                html.appendChild( frame );
                link.parentElement.replaceChild( html, link );
                break;
        }
    };

    var scrollToAnchor = function() {

        var anchor = window.location.hash;

        if ( anchor.length > 1 ) {
            anchor = anchor.substring( 1 );
            anchor = document.getElementById( anchor );
            if ( anchor ) {

                anchor.scrollIntoView( {
                    'behavior': 'smooth',
                    'block': 'center'
                } );

                anchor.classList.add( 'highlight' );

                setTimeout( function() {
                    var anchor = document.querySelector( 'li.highlight' );
                    if ( anchor ) {
                        anchor.classList.remove( 'highlight' );
                    }
                }, 3000 );
            }
        }
    };

    var toggleCollapsible = function() {
        this.classList.toggle( 'open' );
    };

    var toggleMore = function() {
        if ( this.classList.contains( 'open' ) ) {
            // Close open child menu.
            this.classList.remove( 'open' );
            if ( this.nextElementSibling ) {
                this.nextElementSibling.classList.remove( 'open' );
                // Also close any remaining open child menus.
                var menus = this.nextElementSibling.querySelectorAll( '.open' );
                menus.forEach( function( menu ) {
                    menu.classList.remove( 'open' );
                } );
            }
        } else {
            // Open child menu.
            this.classList.add( 'open' );
            if ( this.nextElementSibling ) {
                this.nextElementSibling.classList.add( 'open' );
            }
        }
    };

    var toggleNav = function() {
        
        var nav = document.getElementById( 'sidebar' );

        if ( ! nav.classList.contains( 'block' ) ) {

            nav.classList.add( 'block' );
            var width = nav.offsetWidth;

            if ( nav.classList.contains( 'open' ) ) {

                nav.classList.remove( 'open' );

                // Close the menu.
                intervals.nav = setInterval( function(){

                    var nav   = document.getElementById( 'sidebar' );
                    var width = nav.offsetWidth;
                    var right = parseInt( nav.style.right ) - 10;

                    if ( right < -width ) {
                        nav.style.right = '-' + width + 'px';
                        nav.classList.remove( 'block' );
                        clearInterval( intervals.nav );
                    } else {
                        nav.style.right = right + 'px';
                    }

                }, 20 );

            } else {

                nav.classList.add( 'open' );
                nav.style.right = '-' + width + 'px';

                // Open the menu.
                intervals.nav = setInterval( function(){

                    var nav   = document.getElementById( 'sidebar' );
                    var right = parseInt( nav.style.right ) + 10;

                    if ( right >= 0 ) {
                        nav.style.right = '0';
                        nav.classList.remove( 'block' );
                        clearInterval( intervals.nav );
                    } else {
                        nav.style.right = right + 'px';
                    }

                }, 20 );

            }

        }

    };

    domReady( initialize );

    return {};

} )();