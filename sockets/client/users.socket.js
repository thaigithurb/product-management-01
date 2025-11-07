const User = require("../../models/user.modal");

module.exports = async (res) => {
    global._io.once("connection", (socket) => {

        // gửi lời mời
        socket.on("CLIENT_ADD_FRIEND", async(userId) => {
            const myUserId = res.locals.user.id;

            // thêm id của A vào acceptFriends của B 
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if (!existAinB) {
                await User.updateOne({
                    _id: userId,
                }, { $push: { acceptFriends:  myUserId } })
            };

            // thêm id của B vào requestFriends của A
              const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (!existBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, { $push: { requestFriends:  userId } })
            };
        })

        // hủy lời mời
        socket.on("CLIENT_CANCEL_REQUEST_FRIEND", async(userId) => {
            const myUserId = res.locals.user.id;

            // xóa id của A trong acceptFriends của B 
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if (existAinB) {
                await User.updateOne({
                    _id: userId,
                }, { $pull: { acceptFriends:  myUserId } })
            };

            // xóa id của B trong requestFriends của A
              const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (existBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, { $pull: { requestFriends:  userId } })
            };
        })
        
        // từ chối kết bạn 
        socket.on("CLIENT_REFUSE_FRIEND", async(userId) => {
            const myUserId = res.locals.user.id;

            // xóa id của A trong acceptFriends của B 
            const existAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });

            if (existAinB) {
                await User.updateOne({
                    _id: myUserId,
                }, { $pull: { acceptFriends:  userId } })
            };

            // xóa id của B trong requestFriends của A
            const existBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            if (existBinA) {
                await User.updateOne({
                    _id: userId,
                }, { $pull: { requestFriends:  myUserId } })
            };
        })
    })
}