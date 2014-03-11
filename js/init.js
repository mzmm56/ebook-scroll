App = App || {};
$.extend(App, {
    init: function() {

        this.getJsonData();

        // local storage->readerData
        this.getLocation();

        // if localstorage exists, it's already readerData.currentPage, if not it's readerData.firstPage
        var page = this.readerData.currentPage;
        this.loadChapter(page);

        // readerData page location->DOM
        this.goToPreviousLocation();

    }
});

// DOM ready
$(function() {

    App.init();

    // events
    $(window).on('beforeunload', function() {
        App.saveLocation();
    });

});
