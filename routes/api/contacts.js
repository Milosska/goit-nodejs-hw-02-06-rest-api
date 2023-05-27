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
const validateSchema = require("../../decorators/validateSchema");
const isValidId = require("../../decorators/isValidId");
const authControll = require("../../decorators/authControll");

const router = express.Router();
router
  .route("/")
  .get(authControll, listContacts)
  .post(authControll, validateSchema(ContactSchema), addContact);
router
  .route("/:contactId")
  .get(authControll, isValidId, getContactById)
  .put(authControll, isValidId, validateSchema(ContactSchema), updateContact)
  .delete(authControll, isValidId, removeContact);
router
  .route("/:contactId/favorite")
  .patch(
    authControll,
    isValidId,
    validateSchema(updateFavoriteSchema),
    updateStatusContact
  );

module.exports = router;
