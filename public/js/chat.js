import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
import textFieldEdit from 'https://cdn.jsdelivr.net/npm/text-field-edit@^4/index.js';
const myId = document.querySelector("[my-id]").getAttribute("my-id");
const body = document.querySelector(".messages");
const listTyping = body.querySelector(".inner-list-typing");


// CLIENT_SEND_MESSAGE 
const formSendData = document.querySelector(".input-bar");

if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.content.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        } else {
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
        body.scrollTop = body.scrollHeight;
    })
    body.scrollTop = body.scrollHeight;
}
//end CLIENT_SEND_MESSAGE 

// SERVER_RETURN_MESSAGE 
socket.on("SERVER_RETURN_MESSAGE", (data) => {

    const div = document.createElement("div");
    div.classList.add("message");
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
    body.insertBefore(div, listTyping);
    body.scrollTop = body.scrollHeight;
})
// END SERVER_RETURN_MESSAGE 

// show icon chat 
document.querySelector('emoji-picker')
    .addEventListener('emoji-click', event => console.log(event.detail));

const buttonIcon = document.querySelector('.button-icon')
const tooltip = document.querySelector('.tooltip')
Popper.createPopper(buttonIcon, tooltip)

buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown')
}

// end show icon chat 

// show typing 
var timeOut;
const showTyping = () => {
    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
}


const inputChat = document.querySelector(".input-bar input");

// insert icon chat 
document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
    textFieldEdit.insert(inputChat, e.detail.unicode);

    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();

    socket.emit("CLIENT_SEND_TYPING", "show");

    showTyping();
})
//end insert icon chat 

// input keyup 
inputChat.addEventListener("keyup", (e) => {
    e.preventDefault();
    socket.emit("CLIENT_SEND_TYPING", "show");

    showTyping();
});
// end input keyup 

// SERVER_RETURN_TYPING
if (listTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const existTyping = listTyping.querySelector(`[user-id="${data.userId}"]`);

            if (!(existTyping)) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;
                listTyping.appendChild(boxTyping);
            }
            body.scrollTop = body.scrollHeight;
        } else {
            const boxTypingRemove = listTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove) {
                listTyping.removeChild(boxTypingRemove);
            }
            body.scrollTop = body.scrollHeight;
        }
    })
}
// END SERVER_RETURN_TYPING