const User = require("../../models/user.modal");

module.exports = async (res) => {
    global._io.once("connection", (socket) => {

        // gửi lời mời
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // thêm id của A vào acceptFriends của B 
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if (!existAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        acceptFriends: myUserId
                    }
                })
            };

            // thêm id của B vào requestFriends của A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (!existBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        requestFriends: userId
                    }
                })
            };

            // lấy ra độ dài acceptFriends của B 
            const infoUserB = await User.findOne({
                _id: userId
            });

            const acceptFriendsLength = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_ACCEPT_FIREND_LENGTH", {
                userId: userId,
                acceptFriendsLength: acceptFriendsLength,
            });

            // lấy info của A trả về cho B 
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FIREND", {
                userId: userId,
                infoUserA: infoUserA
            });
        })

        // hủy lời mời
        socket.on("CLIENT_CANCEL_REQUEST_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // xóa id của A trong acceptFriends của B 
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if (existAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: {
                        acceptFriends: myUserId
                    }
                })
            };

            // xóa id của B trong requestFriends của A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (existBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: {
                        requestFriends: userId
                    }
                })
            };

            // lấy ra độ dài acceptFriends của B 
            const infoUserB = await User.findOne({
                _id: userId
            });

            const acceptFriendsLength = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_ACCEPT_FIREND_LENGTH", {
                userId: userId,
                acceptFriendsLength: acceptFriendsLength
            });

        })

        // từ chối kết bạn 
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // xóa id của A trong acceptFriends của B 
            const existAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });

            if (existAinB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: {
                        acceptFriends: userId
                    }
                })
            };

            // xóa id của B trong requestFriends của A
            const existBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            if (existBinA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: {
                        requestFriends: myUserId
                    }
                })
            };
        })
        // hết từ chối kết bạn 

        // chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Kiểm tra A có trong acceptFriends của B không
            const existAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });

            // Kiểm tra B có trong requestFriends của A không
            const existBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            // Nếu cả 2 điều kiện đều thỏa mãn → Chấp nhận kết bạn
            if (existAinB && existBinA) {
                // Thêm vào friendList của B và xóa khỏi acceptFriends
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: userId
                    },
                    $pull: {
                        acceptFriends: userId
                    }
                });

                // Thêm vào friendList của A và xóa khỏi requestFriends
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: myUserId
                    },
                    $pull: {
                        requestFriends: myUserId
                    }
                });

                // Lấy độ dài acceptFriends mới của B
                const infoUserB = await User.findOne({
                    _id: myUserId
                });
                const acceptFriendsLength = infoUserB.acceptFriends.length;

                socket.broadcast.emit("SERVER_RETURN_ACCEPT_FIREND_LENGTH", {
                    userId: myUserId,
                    acceptFriendsLength: acceptFriendsLength
                });

                // Lấy info của B trả về cho A
                const infoUserBFull = await User.findOne({
                    _id: myUserId
                }).select("id avatar fullName");

                // thêm vào danh sách bạn bè của A
                socket.broadcast.emit("SERVER_RETURN_INFO_FRIEND", {
                    userId: userId,
                    infoUser: infoUserBFull
                });

                // Lấy info của A trả về cho B
                const infoUserAFull = await User.findOne({
                    _id: userId
                }).select("id avatar fullName");

                // thêm vào danh sách bạn bè của B
                socket.broadcast.emit("SERVER_RETURN_INFO_FRIEND", {
                    userId: myUserId,
                    infoUser: infoUserAFull
                });
            }
        })
        // hết chấp nhận kết bạn

    })
}