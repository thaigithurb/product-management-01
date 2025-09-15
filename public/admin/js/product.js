// change-status 
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonChangeStatus.length > 0) {

    const changeStatusForm = document.querySelector("#change-status-form");
    const path = changeStatusForm.getAttribute("data-path");

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id")

            let statusChange = statusCurrent == "active" ? "inactive" : "active";

            const redirectUrl = window.location.href;

            const action = path + `/${statusChange}/${id}?_method=PATCH&redirect=${redirectUrl}`;
            changeStatusForm.action = action;

            changeStatusForm.submit();
        })
    })
}
// end change-status 

// item delete 
const deleteButtons = document.querySelectorAll("[delete-button]");

if (deleteButtons.length > 0) {

    const itemDeleteForm = document.querySelector("#item-delete-form");
    const path = itemDeleteForm.getAttribute("data-path");

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {

            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm không?");

            if (isConfirm) {
                const id = button.getAttribute("data-id");

                const redirectUrl = window.location.href;

                const action = path + `/${id}?_method=PATCH&redirect=${redirectUrl}`;

                itemDeleteForm.action = action;
                itemDeleteForm.submit();
            }
        })
    })
}
// end item delete 