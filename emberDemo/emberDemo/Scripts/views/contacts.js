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

    App.Contact = Ember.Object.extend({
        FirstName: null,
        LastName: null,
        Email: null,
        Priority: -1,
        Phone: null,
        isSelected: false,
        toJSON: function () {
            return this.getProperties('FirstName', 'LastName', 'Email', 'Priority', 'Phone');
        }
    });

    App.contactsController = Ember.ArrayController.create({
        content: [],
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
        get: function (id) {
            cs.get(id);
        },
        remove: function (id) {
            var _this = this;
            cs.remove(id, function () {
                var toRemove, i;
                var content = _this.content;

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
            for (i = 0; i < this.content.length; i++) {
                if (this.content[i].get('isSelected')) {
                    this.remove(this.content[i].get('Id'));
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

    App.ContactsView = Ember.View.extend({ template: Ember.Handlebars.compile(template) });

    App.AddContactView = Ember.View.extend({
        tagName: 'a',
        attributeBindings: ['href'],
        click: function () { App.contactsController.add(App.Contact.create({ FirstName: 'Sean' })); }
    });

    App.DeleteContactView = Ember.View.extend({
        tagName: 'span',
        eventManager: {
            click: function (event, view) {
                App.contactsController.remove(view.content.Id);
            }
        }
    });

    App.RemoveContactsView = Ember.View.extend({
        click: function () {
            App.contactsController.removeSelected();
        }
    });
});