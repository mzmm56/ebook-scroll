define([
    'jquery',
    'env',
    'reader',
    'settings',
    'styles',
    'layout',
    'sys',
    'vents',
    'plugins/hoverIntent',
    'plugins/jGestures'
], function($, Env, Reader, Settings, Styles, Layout, Sys, Vents) {
    'use strict';

    return function App(options) {

        var self = this;

        this.layout = new Layout(),
        this.sys = new Sys(),
        this.vents = new Vents(),

        this.reader = Reader,
        this.settings = Settings,
        this.env = Env,
        this.styles = Styles,

        this.init = function() {

            self.vents.bindEventHandlers();

            if (options) {
                $.extend(this.settings, options);
            }

            window.addEventListener('orientationchange', self.vents.orientationHasChanged);

            window.onunload = window.onbeforeunload = (function() {

                $('html, body').scrollTop(0, 0);

                var writeComplete = false;

                return function() {

                    if (writeComplete) {
                        return;
                    }

                    writeComplete = true;

                    if (!self.settings.debug) {
                        self.sys.saveLocation();
                        self.sys.updateUserPreferences();
                    } else if (self.settings.debug && self.settings.clearStorage) {
                        localStorage.clear();
                    }

                };

            }());

            $(window).on('resize', function() {

                var intrvl;

                intrvl = setInterval(function() {
                    clearInterval(intrvl);
                    self.vents.resizeStopped();
                }, 200);

            });

            // $(document).on('touchmove', function(e) {
            //     if (!$(e.target).parents().is(self.settings.el)) {
            //         e.preventDefault();
            //     }
            // });

            // hoverIntent methods
            if (!self.env.isMobile()) {
                var wasScrolling,
                    isManuallyScrolling;

                self.settings.el.hoverIntent({
                    over: function() {
                        wasScrolling = self.reader.isScrolling;
                        log(self.settings.el);
                        self.settings.el.toggleClass('show-scroll-bar', wasScrolling);
                        if (wasScrolling) {
                            self.vents.stopScrolling();
                        }
                        isManuallyScrolling = clearInterval(isManuallyScrolling);
                        isManuallyScrolling = setInterval(function() {
                            self.vents.countPages();
                        }, this.interval / 2);
                    },
                    out: function() {
                        self.settings.el.toggleClass('show-scroll-bar', !wasScrolling);
                        if (wasScrolling) {
                            self.vents.startScrolling();
                        }
                        isManuallyScrolling = clearInterval(isManuallyScrolling);
                    },
                    interval: 200,
                    sensitivity: 1,
                    timeout: 0
                });

            }

            $(document).on('touchmove', function(e) {
                if (!$(e.target).parents().is(self.settings.el)) {
                    e.preventDefault();
                }
            });

            if (self.env.isMobile()) {

                self.settings.el.css('overflow-y', 'hidden');

                // jGestures methods
                $(document).on({
                    pinchopen: function() {
                        self.vents.fontIncrement();
                    },
                    pinchclose: function() {
                        self.vents.fontDecrement();
                    }
                });

                var wasScrolling;
                self.settings.el.on({
                    touchstart: function() {
                        wasScrolling = self.reader.isScrolling;
                        if (wasScrolling) {
                            self.vents.stopScrolling();
                            self.settings.el.css('overflow-y', 'scroll');
                            self.settings.el.toggleClass('show-scroll-bar', wasScrolling);
                        }
                        if (!wasScrolling) {
                            // log('not scrolling');
                        }
                    }
                });
            }

            // bootstrap
            var retrieveJsonData = $.ajax({

                url: 'data/bookData.json',
                dataType: 'json',
                method: 'get',
                success: function(data) {
                    self.sys.updatedReaderData('components', data);
                    self.sys.updatedReaderData('currentPage', data[0].src);
                    self.sys.updatedReaderData('firstPage', data[0].src);
                    self.sys.updatedReaderData('lastPage', data[data.length - 1].src);
                },
                error: function(x, t, s) {
                    log(x + ' ' + t);
                }

            });

            function addJsonDataToDom(data) {

                $.each(data, function(i, o) {

                    $('<li/>', {
                        html: $('<a/>', {
                            text: o.title,
                            href: o.src,
                            click: function(e) {
                                e.preventDefault();
                                self.sys.saveLocation();
                                loadChapter(o.src);
                                self.sys.goToPreviousLocation();
                            }
                        })
                    }).appendTo(self.settings.chapters);

                });

                if (self.settings.debug) {
                    log('JSON data added to DOM');
                }

            }

            function loadChapter(pageUrl) {

                return $.ajax({
                    type: 'get',
                    url: pageUrl,
                    async: false
                })
                    .then(function(data) {
                        var content = $('<section/>', {
                            id: 'page',
                            css: {
                                margin: 0,
                                padding: 0,
                                border: 0
                            }
                        }).html(data);

                        self.settings.el.html(content);

                        self.sys.updatedReaderData('currentPage', pageUrl);
                        self.sys.updateLocalStorage('clientBook', 'currentPage', pageUrl);

                        if (self.settings.debug) {
                            log('Current page is ' + pageUrl);
                        }
                    });

            }

            $.when(retrieveJsonData)
                .then(function(data) {
                    self.sys.getLocation();
                    self.sys.getUserPreferences();
                    addJsonDataToDom(self.reader.components);
                })
                .then(function() {
                    loadChapter(self.reader.currentPage);
                })
                .done(function() {
                    self.layout.adjustFramePosition();
                    self.sys.goToPreviousLocation();
                    self.vents.countPages();
                    self.layout.removeElementStyles();
                    self.vents.contrastToggle(self.settings.contrast);
                    self.layout.setStyles();
                    self.vents.startScrolling();
                });

        };

    };

});
