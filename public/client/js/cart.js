// cập nhật số lượng trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");

if (inputsQuantity) {
    inputsQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            e.preventDefault();

            const productId = input.getAttribute("item-id");
            const quantity = input.value;

            window.location.href = `/cart/update/${productId}/${quantity}`;
        })
    })
}

// cập nhật số lượng trong giỏ hàng