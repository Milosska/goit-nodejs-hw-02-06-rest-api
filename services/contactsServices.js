const { HttpError } = require("../utils/HttpError");
const { Contact } = require("../models/contacts");

const listContacts = async () => {
  const contacts = await Contact.find({}, "-createdAt -updatedAt");
  return contacts;
};

const getContactById = async (contactId) => {
  const searchedContact = await Contact.findById(contactId);
  if (!searchedContact) {
    throw new HttpError(404, "Not found");
  }
  return searchedContact || null;
};

const addContact = async (body) => {
  const newContact = await Contact.create(body);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const editedContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!editedContact) {
    throw new HttpError(404, "Not found");
  }
  return editedContact;
};

const updateStatusContact = async (contactId, body) => {
  const editedContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!editedContact) {
    throw new HttpError(404, "Not found");
  }
  return editedContact;
};

const removeContact = async (contactId) => {
  const removedContact = await Contact.findByIdAndRemove(contactId);
  if (!removedContact) {
    throw new HttpError(404, "Not found");
  }
  return removedContact;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
};
