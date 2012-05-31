define(['jquery'], function ($) {
    var cs = function () { };
    
    cs.prototype.getAll = function (callback) {
        $.ajax({ type: 'GET', url: '/api/contacts', success: callback });
    }

    cs.prototype.add = function (contact, callback) {
        $.ajax({ type: 'PUT', url: '/api/contacts', contentType: "application/json;charset=utf-8", data: JSON.stringify(contact), success: callback });
    }

    return new cs;
});