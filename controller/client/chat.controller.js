const Chat = require("../../models/chat.model");
const User = require("../../models/user.modal");
const uploadToCloudinaryHelper = require("../../helpers/uploadToCloudinary.js");

// [GET] / 
module.exports.index = async (req, res) => {

    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    console.log(userId);
    console.log(fullName);

    // socket.io 
    global._io.once('connection', (socket) => {

        console.log("a user connected", socket.id);

        socket.on("CLIENT_SEND_MESSAGE", async (data) => {

            console.log('📨 Received:', {
                userId: data.userId,
                fullName: data.fullName,
                content: data.content,
                images: data.images ? data.images.length : 0
            });

            let images = [];
            if (data.images && data.images.length > 0) {
                for (const imageBuffer of data.images) {
                    const link = await uploadToCloudinaryHelper.uploadToCloudinary(imageBuffer);
                    images.push(link);
                }
            }


            // lưu vào db 
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images,
            });
            await chat.save();

            // trả về client 
            global._io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            });
        });

        // typing 
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            })
        });

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