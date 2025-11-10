// chức năng gửi yêu cầu 
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".box-user").classList.add("add");
            const userId = btn.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);
        })
    });
}
//end chức năng gửi yêu cầu 

// chức năng hủy gửi yêu cầu 
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".box-user").classList.remove("add");
            const userId = btn.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_REQUEST_FRIEND", userId);
        })
    });
}
//end chức năng hủy gửi yêu cầu 

// chức năng chấp nhận kết bạn
const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");
        const userId = button.getAttribute("btn-accept-friend");

        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
}

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(btn => {
        acceptFriend(btn);
    });
}
//end chức năng cháp nhận kết bạn

// chức năng từ chối kết bạn
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");
        const userId = button.getAttribute("btn-refuse-friend");

        socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
}


const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(btn => {
        refuseFriend(btn);
    });
}
//end chức năng từ chối kết bạn

// SERVER_RETURN_ACCEPT_FIREND_LENGTH 
const badgeUserAccept = document.querySelector("[badge-users-accept]");
if (badgeUserAccept) {
    const userId = badgeUserAccept.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_ACCEPT_FIREND_LENGTH", (data) => {
        if (userId === data.userId) {
            badgeUserAccept.innerHTML = data.acceptFriendsLength;
        }
    });
}
//END SERVER_RETURN_ACCEPT_FIRENDS_LENGTH 

// SERVER_RETURN_INFO_ACCEPT_FIREND
socket.on("SERVER_RETURN_INFO_ACCEPT_FIREND", (data) => {
    // Trang lời mời đã nhận  
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");
        if (userId == data.userId) {
            const div = document.createElement("div");
            div.classList.add("box-user");
            div.setAttribute("user-id", data.infoUserA._id);

            div.innerHTML = `
                <div class="inner-avatar">
                    <img src="${data.infoUserA.avatar || 'https://i.pravatar.cc/60'}" alt="Avatar">
                </div>
                <div class="inner-info">
                    <h4>${data.infoUserA.fullName}</h4>
                    <div class="btn-group">
                        <button class="add" btn-accept-friend="${data.infoUserA._id}">Chấp nhận</button>
                        <button class="cancel" btn-refuse-friend="${data.infoUserA._id}">Xóa</button>
                        <button class="deleted hidden" btn-deleted-friend disabled>Đã xóa</button>
                    </div>
                </div>
            `;
            dataUsersAccept.appendChild(div);

            const btnRefuse = div.querySelector("btn-refuse-friend");

            refuseFriend(btnRefuse);

            // chấp nhận 
            const btnAccept = div.querySelector("btn-accept-friend");
            acceptFriend(btnAccept);
        }
    }


    // Trang danh sách người dùng 
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
        if (userId == data.userId) {
            const boxUserCancel = document.querySelector(`[user-id="${data.infoUserA._id}"]`);
            if (boxUserCancel) {
                dataUsersNotFriend.removeChild(boxUserCancel);
            }
        }
    }
});

// END SERVER_RETURN_INFO_ACCEPT_FIREND


// SERVER_RETURN_USER_ID_CANCEL_FRIEND 
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const boxUserCancel = document.querySelector(`[user-id="${data.userIdA}"]`);
    if (boxUserCancel) {
        const dataUsersAccept = document.querySelector("[data-users-accept]");
        const userIdB = badgeUserAccept.getAttribute("badge-users-accept");
        if (userIdB == data.userIdB) {
            dataUsersAccept.removeChild(boxUserCancel);
        }
    }
});
// END SERVER_RETURN_USER_ID_CANCEL_FRIEND 