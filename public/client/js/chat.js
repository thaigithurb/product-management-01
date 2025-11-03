

// CLIENT_SEND_MESSAGE 
const formSendData = document.querySelector(".input-bar");

if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.content.value = ""
        }
    })
}
//end CLIENT_SEND_MESSAGE 

// SERVER_RETURN_MESSAGE 
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".messages");
    const div = document.createElement("div");
    div.classList.add("message");
    // Check if message is mine
    if (data.userId == myId) {
        div.classList.add("right");
        div.innerHTML = `
            <p class="">${data.content}</p>
        `;
    } else {
        div.classList.add("left");
        div.innerHTML = `
            <div class="name">${data.fullName}</div>
            <p class="content">${data.content}</p>
        `;
    }
    body.appendChild(div);

    // Auto scroll to bottom
    body.scrollTop = body.scrollHeight;
})
// END SERVER_RETURN_MESSAGE 