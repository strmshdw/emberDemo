require.config({
    baseUrl: '',
    paths: {
        'jquery': 'scripts/libraries/jquery-1.6.2.min',
        'jqueryui': 'scripts/libraries/jquery-ui-1.8.11.min',
        'ember': 'scripts/libraries/ember-0.9.8.1',
        'text': 'scripts/libraries/text'
    }
});

require(['jquery', 'jqueryui', 'ember', 'scripts/services/contactService', 'text!scripts/templates/contacts.htm'], function ($, jqueryui, _ember, cs, template) {
    window.App = Ember.Application.create({ rootElement: '#app',
        ready: function () {
            App.contactsController.getAll();
        }
    });

    App.Contact = Ember.Object.extend({
        FirstName: null,
        LastName: null,
        Email: null,
        isSelected: false,
        toJSON: function () {
            return this.getProperties('FirstName', 'LastName', 'Email', 'Priority', 'Phone');
        }
    });

    App.contactsController = Ember.ArrayController.create({
        content: [],
        selectedContact: null,
        getAll: function () {
            cs.getAll(function (contacts) {
                App.contactsController.updateContent(contacts);
            });
        },
        add: function (contact) {
            var _this = this;
            cs.add(contact.toJSON(), function (id) {
                contact.set('Id', id);
                _this.pushObject(contact);
            });
        },
        getById: function (id) {
            cs.get(id);
        },
        remove: function (id) {
            var _this = this;
            cs.remove(id, function () {
                var toRemove, i;
                var content = _this.get('content');

                for (i = 0; i < content.length; i++) {
                    if (content[i].get('Id') == id) {
                        toRemove = content[i];
                    }
                }

                if (toRemove) {
                    _this.removeObject(toRemove);
                }

            });
        },
        removeSelected: function () {
            var i;

            var content = this.get('content');

            for (i = 0; i < content.length; i++) {
                if (content[i].get('isSelected')) {

                    if (this.get('selectedContact') === content[i]) {
                        this.set('selectedContact', null);
                    }

                    this.remove(content[i].get('Id'));
                }
            }
        },
        update: function (contact) {
            cs.update(contact);
        },
        updateContent: function (content) {
            var i;
            this.clear();
            for (i = 0; i < content.length; i++) {
                this.pushObject(App.Contact.create(content[i]));
            }
        }
    });

    App.TextField = Ember.TextField.extend({
        onChange: (function () {
            this.$().val(this.get('value'));
        }).observes('value')
    });

    App.ContactsView = Ember.View.extend({ template: Ember.Handlebars.compile(template) });

    App.AddContactView = Ember.View.extend({
        tagName: 'a',
        attributeBindings: ['href'],
        click: function () {
            App.contactsController.set('selectedContact', App.Contact.create());
        }
    });

    App.ContactItemView = Ember.View.extend({
        tagName: 'span',
        eventManager: {
            click: function (event, view) {
                var content = view.get('content');
                App.contactsController.set('selectedContact', content);
            }
        }
    });

    App.RemoveContactsView = Ember.View.extend({
        click: function () {
            App.contactsController.removeSelected();
        }
    });

    App.ContactDetail = Ember.View.extend({
        contactBinding: 'App.contactsController.selectedContact',
        contactDidChange: (function () {
            if (App.contactsController.get('selectedContact')) {
                $(this.element).show(500);
            }
            else {
                $(this.element).hide(500);
            }
        }).observes('App.contactsController.selectedContact')
    });

    App.UpdateContactLink = Ember.View.extend({
        tagName: 'a',
        click: function () {
            App.contactsController.update(this.get('contact'));
        }
    });

    App.AddContactLink = Ember.View.extend({
        tagName: 'a',
        click: function () {
            App.contactsController.add(this.get('contact'));
        }
    });

});