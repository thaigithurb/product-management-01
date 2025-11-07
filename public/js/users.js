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

// chức năng hủy gửi yêu cầu 
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".box-user").classList.add("refuse");
            const userId = btn.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        })
    });
}
//end chức năng hủy gửi yêu cầu 

