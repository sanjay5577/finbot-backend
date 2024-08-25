const express = require("express");
const chatRoute = require("./chat.route");

const router = express.Router();

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Reroute all API requests beginning with the `/v1/chat` route to Express router in chat.route.js
router.use("/chat", chatRoute);



module.exports = router;