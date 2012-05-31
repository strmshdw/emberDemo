define(['jquery'], function ($) {
    var cs = function () { };

    cs.prototype.getAll = function (callback) {
        $.ajax({ type: 'GET', url: '/api/contacts', success: callback });
    }

    cs.prototype.get = function (id, callback) {
        $.ajax({ type: 'GET', url: '/api/contacts/' + id, success: callback });
    }

    cs.prototype.add = function (contact, callback) {
        $.ajax({ type: 'PUT', url: '/api/contacts', contentType: "application/json;charset=utf-8", data: JSON.stringify(contact), success: callback });
    }

    cs.prototype.update = function (contact, callback) {
        $.ajax({ type: 'POST', url: '/api/contacts/', contentType: "application/json;charset=utf-8", data: JSON.stringify(contact), success: callback });
    }

    cs.prototype.remove = function (id, callback) {
        $.ajax({ type: 'DELETE', url: '/api/contacts/' + id, success: callback });
    }

    return new cs;
});