using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Domain.Models;
using Domain.Services;

namespace Domain.Test
{
    /// <summary>
    /// Summary description for UnitTest1
    /// </summary>
    [TestClass]
    public class ContactServiceTest
    {
        public ContactServiceTest()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        //
        // You can use the following additional attributes as you write your tests:
        //
        // Use ClassInitialize to run code before running the first test in the class
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // Use ClassCleanup to run code after all tests in a class have run
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // Use TestInitialize to run code before running each test 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup to run code after each test has run
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion

        private static Contact GetContact()
        {
            var contact = new Contact()
            {
                firstName = "Sean",
                lastName = "Smith",
                emails = new List<string>() { "strmshdw@gmail.com" },


            };
            return contact;
        }

        [TestMethod]
        public void AddTest()
        {
            ContactService service = new ContactService();
            service.Clear();

            var contact = GetContact();

            var id = service.Add(contact);

            Assert.IsTrue(id > 0);

        }


        [TestMethod]
        public void UpdateTest()
        {
            ContactService service = new ContactService();
            var all = service.GetAll();

            if (service.GetAll().Count <= 0)
            {
                AddTest();
                all = service.GetAll();
            }

            var contact = all[0];
            contact.emails = new List<string>() { "new@email.com" };

            service.Update(contact);

            var updatedAll = service.GetAll();
            var actual = updatedAll.Find(c => c.id == contact.id);
            Assert.AreEqual(contact.emails[0], actual.emails[0]);
        }

        [TestMethod]
        public void DeleteTest()
        {
            ContactService service = new ContactService();
            var all = service.GetAll();

            if (all.Count == 0)
            {
                AddTest();
                all = service.GetAll();
            }

            var contact = all[0];
            service.Delete(contact);

            var updatedAll = service.GetAll();

            var deleted = updatedAll.Find(c => c.id == contact.id);
            Assert.IsTrue(deleted == null);
        }
    }
}
