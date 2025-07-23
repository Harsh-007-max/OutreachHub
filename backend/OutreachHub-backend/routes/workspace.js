const express = require('express');
const router = express.Router();
const WorkspaceController = require('../controllers/workspaceController.js');
const auth = require('../middlewares/auth.js');

router.get('/', auth, WorkspaceController.getAllWorkspacesByUser);
router.post('/create', auth, WorkspaceController.createWorkspaceByUser);
router.post('/:workspaceId', auth, WorkspaceController.addMemberToWorkspace);
router.delete('/:workspaceId', auth, WorkspaceController.deleteMemberFromWorkspace);
router.get('/:workspaceId', auth, WorkspaceController.getWorkspaceById);
module.exports = router;
