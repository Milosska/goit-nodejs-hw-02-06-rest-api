const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
} = require("../../controllers/contactsControllers");
const {
  ContactSchema,
  updateFavoriteSchema,
} = require("../../schemas/contactsSchemas");
const validateContact = require("../../decorators/validateContact");
const isValidId = require("../../decorators/isValidId");

const router = express.Router();
router
  .route("/")
  .get(listContacts)
  .post(validateContact(ContactSchema), addContact);
router
  .route("/:contactId")
  .get(isValidId, getContactById)
  .put(isValidId, validateContact(ContactSchema), updateContact)
  .delete(isValidId, removeContact);
router
  .route("/:contactId/favorite")
  .patch(isValidId, validateContact(updateFavoriteSchema), updateStatusContact);

module.exports = router;
