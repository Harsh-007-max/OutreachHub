const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/contactController.js");
const auth = require("../middlewares/auth.js");

router.get("/", auth, ContactController.getAllContactsByUser );
router.post("/",auth, ContactController.addContactByUser);

module.exports = router;

