import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import textFieldEdit from 'https://cdn.jsdelivr.net/npm/text-field-edit@^4/index.js'

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

// insert icon chat 

document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
    textFieldEdit.insert(document.querySelector('.input-bar input'), e.detail.unicode)
})
//end insert icon chat 