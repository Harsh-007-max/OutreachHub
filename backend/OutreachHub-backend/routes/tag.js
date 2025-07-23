const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController.js');
const auth = require('../middlewares/auth.js');

router.get('/', TagController.getAllTags);
router.post('/create', auth, TagController.createTag);
router.delete('/:tagId',auth, TagController.deleteTag);
router.patch('/:tagId', auth, TagController.updateTag);
router.get('/:tagId', TagController.getTagById);

module.exports = router;
