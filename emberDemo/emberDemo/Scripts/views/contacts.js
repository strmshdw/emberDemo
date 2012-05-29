﻿require.config({
    baseUrl: '',
    paths: {
        'jquery': 'scripts/libraries/jquery-1.6.2.min',
        'ember': 'scripts/libraries/ember-0.9.8.1.min',
        'text': 'scripts/libraries/text'
    }
});

require(['jquery', 'ember', 'scripts/services/contactService', 'text!scripts/templates/contacts.htm'], function ($, _ember, cs, template) {
    window.App = Ember.Application.create({ rootElement: '#app' });
    App.Contact = Ember.Object.extend({ FirstName: null, LastName: null, Email: null, Priority: -1, Phone: null });
    App.contactsView = Ember.View.create({ template: Ember.Handlebars.compile(template), contacts: [] });

    $('#add').click(function () {
        App.contactsView.get('contacts').push({ FirstName: 'Blah' }); 
    });
    $('#reload').click(function () { cs.getAll(function (contacts) { App.contactsView.set('contacts', contacts); App.contactsView.appendTo('#app'); }); });
});