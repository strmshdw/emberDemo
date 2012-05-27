define(['jquery'], function ($) {
    var cs = function () { };

    cs.prototype.getAll = function (callback) {
        $.ajax({ type: 'GET', url: '/api/contacts', success: callback });
    }

    return new cs;
});