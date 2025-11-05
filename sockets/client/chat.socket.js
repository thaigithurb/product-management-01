const uploadToCloudinaryHelper = require("../../helpers/uploadToCloudinary.js");
const Chat = require("../../models/chat.model");

// [GET] / 
module.exports = async (res) => {

    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

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
}