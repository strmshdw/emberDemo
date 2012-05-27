require.config({
    baseUrl: '.',
    paths: {
        'jquery':'scripts/libraries/jquery-1.6.2.min'
    }
});

require(['jquery', 'scripts/services/contactService'], function ($, cs) {
    cs.getAll(function (contacts) { debugger });
});