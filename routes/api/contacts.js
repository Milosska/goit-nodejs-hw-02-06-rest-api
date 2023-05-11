const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  res.json(contact);
});

router.post("/", async (req, res, next) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const editedContact = await updateContact(contactId, req.body);
  res.json(editedContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  await removeContact(contactId);
  res.json({ message: "contact deleted" });
});

module.exports = router;
