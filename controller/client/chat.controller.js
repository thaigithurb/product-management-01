const Chat = require("../../models/chat.model");
const User = require("../../models/user.modal");
const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {

    const roomChatId = req.params.roomChatId;

    // socket.io 
    chatSocket(req, res);
    // end socket.io 

    const chats = await Chat.find({
        room_chat_id: roomChatId,
        deleted: false
    });

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id,
        }).select("fullName");

        chat.infoUser = infoUser;
    }

    res.render("client/pages/chat/index.pug", {
        pageTitle: "Chat",
        chats: chats
    })
}