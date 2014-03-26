App = App || {};
$.extend(App, {
    eventHandlers: {
        '.play-btn, click': 'playPause',
        '.speed-inc, click': 'speedIncrement',
        '.speed-dec, click': 'speedDecrement',
        '.font-inc, click': 'fontIncrement',
        '.font-dec, click': 'fontDecrement',
        '.contrast-toggle, click': 'contrastToggle',
        '.full-screen, click': 'toggleFullScreen',
        'main a, click': 'embeddedLinkClick'
    },
    bindEventHandlers: function() {
        var that = this;
        $.each(that.eventHandlers, function(k, v) {
            var split = k.split(","),
                el = $.trim(split[0]),
                trigger = $.trim(split[1]);
            $(document).delegate(el, trigger, that.events[v]);
        });
    },
    events: {
        toggleFullScreen: function() {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        },
        listenForPageChangeInterval: null, // storing setInterval
        listenForPageChange: function() {
            var that = App;
            if (that.readerData.isScrolling === false) return;

            var fontSize = $(that.el.first('p')).css('font-size');
            var lineHeight = Math.floor(parseInt(fontSize.replace('px', '')) * 1.5);

            var intrvl = (lineHeight * that.el.height()) * (that.readerData.scrollSpeed / 30);

            window.clearInterval(that.events.listenForPageChangeInterval);
            that.events.listenForPageChangeInterval = setInterval(function() {
                that.layout.countPages();
            }, intrvl);
        },
        playPause: function() {
            var that = App,
                playBtn = $('.controls').find('.play-btn'),
                state = that.readerData.isScrolling ? 'play' : 'pause';
            playBtn.attr('data-state', state);
            if (that.readerData.isScrolling === false) {
                that.events.startScrolling();
            } else if (that.readerData.isScrolling === true) {
                that.events.stopScrolling();
            }
        },
        startScrolling: function() {
            var that = App;
            var playBtn = $('.controls').find('.play-btn').attr('data-state', 'pause');
            window.clearInterval(that.readerData.scrollInt);
            that.readerData.scrollInt = setInterval(function() {
                that.el.scrollTop(that.el.scrollTop() + 1);
            }, that.readerData.scrollSpeed);
            that.readerData.isScrolling = true;
            that.events.listenForPageChange();
        },
        stopScrolling: function() {
            var that = App;
            var playBtn = $('.controls').find('.play-btn').attr('data-state', 'play');
            if (App.debug) console.log('Stopped');
            window.clearInterval(that.readerData.scrollInt);
            window.clearInterval(that.events.listenForPageChangeInterval);
            that.readerData.isScrolling = false;
        },
        speedIncrement: function() {
            var that = App;
            that.events.stopScrolling();
            that.readerData.scrollSpeed -= 20;
            that.events.startScrolling();
            that.updateUserPreferences();
        },
        speedDecrement: function() {
            var that = App;
            that.events.stopScrolling();
            that.readerData.scrollSpeed += 20;
            that.events.startScrolling();
            that.updateUserPreferences();
        },
        isChapterEnd: function() {
            var that = App;
            that.events.stopScrolling();
            if (App.debug) console.log('Chapter end');
        },
        isBookEnd: function() {
            var that = App;
            that.events.stopScrolling();
            if (App.debug) console.log('Book end');
        },
        fontIncrement: function() {
            var that = App;
            var size = that.readerData.fSize < that.readerData.maxFontSize() ? that.readerData.fSize + 20 : that.readerData.fSize;
            that.el.css('font-size', size + '%');
            that.layout.adjustFramePosition();
            that.updatedReaderData('fSize', size);
            that.updateUserPreferences();
        },
        fontDecrement: function() {
            var that = App;
            var size = that.readerData.fSize > that.readerData.minFontSize() ? that.readerData.fSize - 20 : that.readerData.fSize;
            that.el.css('font-size', size + '%');
            that.layout.adjustFramePosition();
            that.updatedReaderData('fSize', size);
            that.updateUserPreferences();
        },
        contrastToggle: function(e) {
            var that = App;
            var contrast = e && e.currentTarget ? $(e.currentTarget).attr('data-contrast') : e,
                html = $('html');

            if (contrast === 'dark') {
                html.addClass('darkCss');
                html.removeClass('lightCss');
            } else if (contrast === 'light') {
                html.addClass('lightCss');
                html.removeClass('darkCss');
            }

            that.updatedReaderData('contrast', contrast);
            that.updateUserPreferences();
        },
        embeddedLinkClick: function(e) {
            var that = App;
            var target = $(e.currentTarget),
                href = target.attr('href'),
                ext = href.match(/^http/);

            if (ext) {
                routeExternalLink(href);
            } else {
                e.preventDefault();
                routeInternalLink(href);
            }

            function routeInternalLink(url) {
                that.loadChapter(url);
                that.saveLocation();
            }

            function routeExternalLink(url) {
                e.stopPropagation();
                target.attr('target', '_blank');
            }
        },
        orientationHasChanged: function() {
            var that = App;

            if (App.debug) {
                switch (window.orientation) {
                    case -90:
                    case 90:
                        console.log('Orientation has changed to landscape');
                        break;
                    default:
                        console.log('Orientation has changed to portrait');
                        break;
                }
            }

            setTimeout(function() {
                if (pageYOffset) {
                    window.scrollTo(0, 1);
                }
            }, 1);

            if (that.readerData.isScrolling) {
                that.events.stopScrolling();
                setTimeout(function() {
                    that.events.startScrolling();
                }, 500);
            }

        }

    }
});
