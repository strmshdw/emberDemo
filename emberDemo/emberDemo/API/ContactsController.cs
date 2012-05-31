using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Domain.Models;
using Domain.Services;

namespace emberDemo.API
{
    public class ContactsController : ApiController
    {
        private ContactService _service;

        public ContactsController()
        {
            _service = new ContactService();
        }

        public List<Contact> Get()
        {
            var result = _service.GetAll();
            return result;
        }

        public Contact Get(int id)
        {
            var all = Get();
            var result = all.Find(c => c.Id == id);
            return result;
        }

        public void Post(Contact value)
        {
            _service.Update(value);

        }

        public int Put(Contact value)
        {
            var result = 0;

            if (value.Id > 0)
            {
                _service.Update(value);
                result = value.Id;
            }
            else
            {
                result = _service.Add(value);
            }

            return result;
        }

        public void Delete(int id)
        {
            var contact = Get(id);
            _service.Delete(contact);
        }
    }
}