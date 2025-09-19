//button Status
const buttonsStatus = document.querySelectorAll("[button-status]");

if (buttonsStatus.length > 0) {

    const url = new URL(window.location.href);

    buttonsStatus.forEach(button => {

        button.addEventListener("click", () => {

            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        })
    })
}
//end button Status

// form Search 
const formSearch = document.querySelector("#form-search");

if (formSearch) {

    const url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();

        const keyword = e.target.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    })
}
//end form Search 

// pagination 
const paginationButtons = document.querySelectorAll("[button-pagination]");
paginationButtons.forEach(button => {

    const url = new URL(window.location.href);

    button.addEventListener("click", () => {
        const buttonPagination = button.getAttribute("button-pagination");

        url.searchParams.set("page", buttonPagination);

        window.location.href = url.href;
    })
})
//end pagination 

// checkbox 
const checkBoxMulti = document.querySelector("[checkbox-multi]");

if (checkBoxMulti) {
    const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']");

    const inputsId = checkBoxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => input.checked = true);
        } else {
            inputsId.forEach(input => input.checked = false);
        }
    })

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;

            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })

}
// end checkbox 

// multi change form 
const multiChangeForm = document.querySelector("[multi-change-form]");

if (multiChangeForm) {
    multiChangeForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkBoxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");

        const type = e.target.type.value;

        if (type == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");

            if (!isConfirm) {
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];

            inputsChecked.forEach(input => {
                const id = input.value;

                if (type == "position-change") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`)
                } else {
                    ids.push(id);
                }
            });

            const inputIds = multiChangeForm.querySelector("input[name='ids']");
            inputIds.value = ids.join(", ");

            const redirectUrl = window.location.href;
            multiChangeForm.action = multiChangeForm.action + `&redirect=${redirectUrl}`;

            multiChangeForm.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 bản ghi!");
        }

    })
}
// end multi change form 

// show alert 
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));

    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })

}

// end show aler 

// pre-view image 

const preViewThumbnail = document.querySelector("#thumbnail");

if (preViewThumbnail) {

    preViewThumbnail.onchange = evt => {
        const [file] = preViewThumbnail.files;

        if (file) {
            const blah = document.querySelector("#blah");

            blah.classList.remove("hidden");

            blah.src = URL.createObjectURL(file);

        } else {
            blah.classList.add("hidden");
        }
    }
}
// end pre-view image 


// sort 
const sort = document.querySelector('[sort]');
if (sort) {
    const sortSelect = document.querySelector("[sort-select]");
    const sortClear = document.querySelector("[sort-clear]");


    sortSelect.addEventListener("change", (e) => {
        e.preventDefault();
        
           let url = new URL(window.location.href);

        const sortArr = e.target.value;
        const sortItems = sortArr.split("-");
        
        const [sortKey, sortValue] = sortItems;

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url;
    })

    // clear sort 
    sortClear.addEventListener("click", () => {
        let url = new URL(window.location.href); // Tạo URL mới mỗi lần

        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url;
    })
    // end clear sort 
}
// end sort

