const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { chatService } = require("../services");
const ApiError = require("../utils/ApiError");



const getchats = catchAsync(async( req, res) =>{

    const chats = await chatService.getChats();
    if(!chats){
      throw new ApiError(httpStatus.NOT_FOUND, "chats not found");
    }

    return res.status(200).send({"chats" : chats}); 
}) 


const addchat = catchAsync(async (req, res) => {
  const chatDetails = await chatService.createChat(
    req.body
  );
  // const chatDetails = "huui"

  res.status(httpStatus.CREATED).send({"reply" : chatDetails});
});


module.exports = {

  getchats,
  addchat,
};
