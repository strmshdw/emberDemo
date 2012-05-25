using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Domain.Models;

namespace Domain.Services
{
    public interface IContactService
    {
        List<Contact> GetAll();
        int Add(Contact contact);
        void Update(Contact contact);
        void Delete(Contact contact);
    }
}
