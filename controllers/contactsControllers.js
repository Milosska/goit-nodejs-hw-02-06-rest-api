const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../models/contacts");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const getAllContacts = async (req, res, next) => {
  const contacts = await listContacts();
  res.json(contacts);
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  res.json(contact);
};

const addNewContact = async (req, res, next) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
};

const changeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const editedContact = await updateContact(contactId, req.body);
  res.json(editedContact);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  await removeContact(contactId);
  res.json({ message: "contact deleted" });
};

module.exports = {
  listContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContact),
  addContact: ctrlWrapper(addNewContact),
  updateContact: ctrlWrapper(changeContact),
  removeContact: ctrlWrapper(deleteContact),
};
