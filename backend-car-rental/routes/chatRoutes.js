const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.createChat);
router.get('/', chatController.getChats);
router.get('/:chatId/messages', chatController.getMessages);
router.post('/messages', chatController.sendMessage);
router.patch('/messages/:messageId', chatController.editMessage);
router.delete('/messages/:messageId', chatController.deleteMessage);
router.delete('/:chatId', chatController.deleteChat);
router.delete('/:chatId/messages', chatController.clearChat);

module.exports = router; 