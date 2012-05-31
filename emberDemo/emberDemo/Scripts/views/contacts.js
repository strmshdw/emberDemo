require.config({
    baseUrl: '',
    paths: {
        'jquery': 'scripts/libraries/jquery-1.6.2.min',
        'ember': 'scripts/libraries/ember-0.9.8.1.min',
        'text': 'scripts/libraries/text'
    }
});

require(['jquery', 'ember', 'scripts/services/contactService', 'text!scripts/templates/contacts.htm'], function ($, _ember, cs, template) {
    window.App = Ember.Application.create({ rootElement: '#app',
        ready: function () {
            App.contactsController.getAll();
        }
    });

    App.Contact = Ember.Object.extend({ FirstName: null, LastName: null, Email: null, Priority: -1, Phone: null });

    App.contactsController = Ember.ArrayController.create({
        content: [],
        getAll: function () {
            cs.getAll(function (contacts) {
                App.contactsController.updateContent(contacts);
            });
        },
        add: function (contact) {
            var _this = this;
            cs.add(contact, function () { _this.getAll(); });
        },
        updateContent: function (content) {
            var i;
            this.clear();
            for (i = 0; i < content.length; i++) {

                this.pushObject(App.Contact.create(content[i]));
            }
        }
    });

    App.ContactsView = Ember.View.extend({ template: Ember.Handlebars.compile(template) });
    App.AddContactView = Ember.View.extend({
        tagName: 'a',
        attributeBindings: ['href'],
        click: function () { App.contactsController.add({ FirstName: 'Sean' }); }
    });

});