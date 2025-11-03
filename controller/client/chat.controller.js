const Chat = require("../../models/chat.model");
const User = require("../../models/user.modal");

// [GET] / 
module.exports.index = async (req, res) => {

    const userId = res.locals.user.id;

    // socket.io 
    io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content,
            });
            await chat.save();
        })
    });
    // end socket.io 

    const chats = await Chat.find({
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