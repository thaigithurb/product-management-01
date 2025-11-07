const User = require("../../models/user.modal");
const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {

    // socket.io 
    usersSocket(res);
    // end socket.io 

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        $and: [{
                _id: {
                    $nin: requestFriends
                }
            },
            {
                _id: {
                    $ne: userId
                }
            },
            {
                _id: {
                    $nin: acceptFriends
                }
            },
        ],
        status: "active",
        deleted: false
    }).select("id fullName");


    res.render("client/pages/users/not-friend.pug", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}

// [GET] /users/request
module.exports.request = async (req, res) => {

    // socket.io 
    usersSocket(res);
    // end socket.io 

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriends = myUser.requestFriends;

    const users = await User.find({
        _id: {
            $in: requestFriends
        },
        status: "active",
        deleted: false
    }).select("id fullName");


    res.render("client/pages/users/request.pug", {
        pageTitle: "Lời mời đã gửi",
        users: users
    })
}

// [GET] /users/request
module.exports.accept = async (req, res) => {

    // socket.io 
    usersSocket(res);
    // end socket.io 

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: {
            $in: acceptFriends
        },
        status: "active",
        deleted: false
    }).select("id fullName");


    res.render("client/pages/users/accept.pug", {
        pageTitle: "Lời mời kết bạn",
        users: users
    })
}