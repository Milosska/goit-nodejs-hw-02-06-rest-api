const { HttpError } = require("../utils/HttpError");
const { Contact } = require("../models/contacts");

const listContacts = async (user, query) => {
  const { _id: owner } = user;
  const defaultFavorite = { $in: [true, false] };
  const { page = 1, limit = 10, favorite = defaultFavorite } = query;
  const skip = (page - 1) * limit;

  const contacts = await Contact.find(
    { owner, favorite },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).populate("owner", "email subscription");
  return contacts;
};

const getContactById = async (contactId) => {
  const searchedContact = await Contact.findById(contactId);
  if (!searchedContact) {
    throw new HttpError(404, "Not found");
  }
  return searchedContact || null;
};

const addContact = async (body, user) => {
  const { _id: owner } = user;
  const newContact = await Contact.create({ ...body, owner });
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
