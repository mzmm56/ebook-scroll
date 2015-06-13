var $            = require('./vendor/jquery');
var environment  = require('./environment');
var reader       = require('./reader');
var settings     = require('./settings');
var styles       = require('./styles');
var layout       = require('./layout');
var userSettings = require('./user-settings');
var events       = require('./events');
var mobile       = require('./mobile');
var chapters     = require('./chapters');
var search       = require('./search');
var hover        = require('./hover');
var storage      = require('./shims/storage');

module.exports = function (options) {

    var _this = this,
        opts = options;

    this.init = function () {

        events.bindEventHandlers();

        if (opts) {
            $.extend(settings, opts);
        }

        if (settings.clearStorage && !localStorage.refreshed) {
            localStorage.clear();
            localStorage.setItem('refreshed', true);
            window.location.href = window.location.href;
        } else if (settings.clearStorage && localStorage.refreshed) {
            localStorage.removeItem('refreshed');
        }

        window.addEventListener('orientationchange', events.orientationHasChanged);
        window.onunload = window.onbeforeunload = (function () {
            $('html, body').scrollTop(0);

            var writeComplete = false;

            return function () {

                if (writeComplete) {
                    return;
                }

                writeComplete = true;
                if (!settings.clearStorage) {
                    userSettings.saveLocation();
                    userSettings.updateUserPreferences();
                }

            };

        }());

        $(window).on('resize', function () {
            var intrvl;
            intrvl = setInterval(function () {
                clearInterval(intrvl);
                $(document).trigger('updateUi', {});
            }, 200);
        });


        $.event.trigger({
            type:'udpateUi',
            data:{}
        });

        $(document).on('updateUi', function(e, data){
            chapters.bindChapters();
            layout.adjustFramePosition();
            userSettings.updateUserPreferences();
            events.countPages();
        });

        function addJsonDataToDom(data) {

            $.each(data, function (i, o) {

                $('<li/>', {
                    html: $('<a/>', {
                        text: o.title,
                        href: o.src,
                        click: function (e) {
                            e.preventDefault();
                            userSettings.saveLocation();
                            // load new chapter fn
                            userSettings.goToPreviousLocation();
                        }
                    })
                }).appendTo(settings.chapters);

            });

            if (settings.debug) {
                console.log('JSON data added to DOM');
            }

        }

        // Bootstrap
        var globalStore = {};
        var pathArray = window.location.href.split('/'),
            protocol = pathArray[0],
            host = pathArray[2],
            // siteUrl = protocol + '//' + host,
            JSONUrl = settings.jsonPath

        $.when( // get json data, update settings

            $.get(JSONUrl, {
                'bust': window.ebookAppData.urlArgs
            }, function (data) {
                $.each(data, function (i) {
                    if (this.uuid === window.ebookAppData.uuid) {
                        var components = this.components;
                        settings.bookId = this.uuid;
                        userSettings.updatedReaderData('components', components);
                        userSettings.updatedReaderData('currentPage', components[0].src);
                        userSettings.updatedReaderData('firstPage', components[0].src);
                        userSettings.updatedReaderData('lastPage', components[components.length - 1].src);
                    }
                });

                if (reader.currentPage === null) {
                    if (localStorage && !localStorage.refreshed) {
                        window.onunload = window.onbeforeunload = function () {
                            return;
                        };
                        localStorage.clear();
                        localStorage.setItem('refreshed', true);
                        window.location.href = window.location.href;
                    } else if (localStorage && localStorage.refreshed) {
                        localStorage.removeItem('refreshed');
                        window.location.href = '/404';
                        return false;
                    }
                }

                userSettings.updateLocalStorage(settings.bookId, 'currentPage', reader.currentPage);

            })

        ).then(function () {

            $.when( // get pages from updated settings

                $.get(reader.currentPage, {
                    'bust': window.ebookAppData.urlArgs
                }, function (html) {
                    globalStore.html = html;
                }),

                $.get(window.ebookAppData.bookPath + '/Styles/online.css', {
                    'bust': window.ebookAppData.urlArgs
                }, function (css) {
                    globalStore.css = css;
                })

            ).then(function () { // append html to page

                addJsonDataToDom(reader.components);

                $('<style />').html(globalStore.css).appendTo('head');

                settings.el.html(
                    $('<section/>', {
                        id: 'page',
                        css: {
                            margin: 0,
                            padding: 0,
                            border: 0
                        },
                        html: globalStore.html
                    })
                );

                userSettings.getLocation();
                userSettings.getUserPreferences();
                userSettings.goToPreviousLocation();
                layout.setStyles();

                // requires elements in DOM
                events.countPages();
                events.cursorListener();

                $('.controls, .runner-help, .runner-page-count, #page, .search-wrapper').animate({
                    opacity: 1
                }, 200);
                $('.spinner').fadeOut(200, function () {
                    setTimeout(function () {
                        events.startScrolling();
                    }, 50);
                });

                if ($([]).pushStack($('h1,h2,h3,h4,h5,h6')).length > 0) {
                    chapters.bindChapters();
                    chapters.appendNav();

                    $('.chapter-nav').animate({
                        opacity: 1
                    }, 200);
                }

                layout.adjustFramePosition();
                events.contrastToggle(settings.contrast);

                var shadows = layout.renderShadows();

                settings.el.append(shadows.shadowTop);
                settings.el.append(shadows.shadowBottom);

            });

        });

    };

};
