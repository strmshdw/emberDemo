require.config({
    baseUrl: '',
    paths: {
        'jquery': 'scripts/libraries/jquery-1.6.2.min',
        'jqueryui': 'scripts/libraries/jquery-ui-1.8.11.min',
        'ember': 'scripts/libraries/ember-0.9.8.1',
        'text': 'scripts/libraries/text'
    }
});

require(['jquery', 'jqueryui', 'ember', 'scripts/services/contactService', 'text!scripts/templates/mobile/contacts.htm'], function ($, jqueryui, _ember, cs, template) {
    window.App = Ember.Application.create({ rootElement: '#app',
        ready: function () {
            App.contactsController.getAll();
        }
    });

    App.Contact = Ember.Object.extend({
        firstName: null,
        lastName: null,
        isSelected: false,
        emails: [],
        id: null,
        isDirty: false,
        toJSON: function () {
            var emails, i, data = this.getProperties('id', 'firstName', 'lastName');


            emails = this.get('emails');
            data.emails = $.map(emails, function (email) { return email.email; });

            return data;
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
                contact.set('id', id);
                _this.pushObject(contact);
                contact.set('isDirty', false);
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
                    if (content[i].get('id') == id) {
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

                    this.remove(content[i].get('id'));
                }
            }
        },
        update: function (contact) {
            cs.update(contact.toJSON());
            contact.set('isDirty', false);
        },
        updateContent: function (content) {
            var i;
            this.clear();
            for (i = 0; i < content.length; i++) {
                var contact = content[i];

                contact.emails = contact.emails || [];
                contact.emails = $.map(contact.emails, function (email) { return { email: email }; });

                var c = App.Contact.create(contact);
                this.pushObject(App.Contact.create(c));
            }
        }
    });

    App.TextField = Ember.TextField.extend({
        valid: true,
        keyUp: function () {
            this.get('content').set('isDirty', true);
            this.validate();
        },
        onChange: (function () {
            this.$().val(this.get('value'));
        }).observes('value'),
        attributeBindings: ['style', 'name', 'placeholder'],
        style: (function () {
            if (this.valid) {
                return "";
            }
            else {
                return "border:1px solid red";
            }
        }).property('valid'),
        validate: function () {
            if (this.regex) {
                var regex = new RegExp(this.regex);
                this.set('valid', regex.test(this.$().val()));
            }
        }
    });

    App.ContactsView = Ember.View.extend({ template: Ember.Handlebars.compile(template) });

    App.AddContactView = Ember.View.extend({
        tagName: 'a',
        attributeBindings: ['href'],
        click: function () {
            App.contactsController.set('selectedContact', App.Contact.create({ emails: [], isDirty: true }));
        }
    });

    App.ContactItemView = Ember.View.extend({
        tagName: 'li',
        classNames: ['contact'],
        content: null,
        eventManager: {
            click: function (event, view) {
                var content = view.get('content');
                App.contactsController.set('selectedContact', content);
            }
        },
        contentChanged: (function () {
            if (this.getPath('content.isDirty')) {
                this.$().css('background-color', '#c66');
            }
            else {
                this.$().css('background-color', '')
            }
        }).observes('content.isDirty'),
        isSelected: (function () {
            if (this.get('content') === App.contactsController.selectedContact) {
                this.$().css('background-color', '#999');
            }
            else {
                this.$().css('background-color', '')
            }

            if (this.getPath('content.isDirty')) {
                this.$().css('background-color', '#c66')
            }
            
        }).observes('App.contactsController.selectedContact')

    });

    App.RemoveContactsView = Ember.View.extend({
        tagName: 'a',
        click: function () {
            App.contactsController.removeSelected();
        }
    });

    App.ContactDetail = Ember.View.extend({
        contactBinding: 'App.contactsController.selectedContact'
    });

    App.DetailView = Ember.View.extend({
        didInsertElement: function () {
            this.$().show('slow');
        }
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

    App.AddEmailView = Ember.View.extend({
        tagName: 'a',
        click: function () {
            var contact = App.contactsController.get('selectedContact');
            contact.set('isDirty', true);

            var emails = contact.get('emails');
            emails.pushObject({ email: '' });

        }
    });

    App.RemoveEmailView = Ember.View.extend({
        tagName: 'a',
        click: function () {
            var email = this.get('email');

            var contact = App.contactsController.get('selectedContact');
            var emails = contact.get('emails');
            emails.removeObject(email);

            contact.set('isDirty', true);

        }
    });

});