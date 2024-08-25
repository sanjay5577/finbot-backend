const express = require("express");
const chatController = require("../../controllers/chat.controller");
const router = express.Router();


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement a route definition for `/v1/chat

router.get("/", chatController.getchats);

console.log("at route")
router.post(
  "/",
  chatController.addchat
);

module.exports = router;