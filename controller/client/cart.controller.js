const Products = require("../../models/products.model");
const productHelper = require("../../helpers/product");
const Cart = require("../../models/cart.model");


// [GET] /add
module.exports.index = async (req, res) => {

    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    if (cart.products.length > 0) {
        for (const item of cart.products) {

            const productId = item.product_id;

            const productInfo = await Products.findOne({
                _id: productId
            }).select('title thumbnail slug price discountPercentage');

            productInfo.newPriceProduct = productHelper.detailProductNewPrice(productInfo);

            item.productInfo = productInfo;

            item.totalPrice = item.productInfo.newPrice * item.quantity;
        }
    }

    cart.totalAmount = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/cart/index.pug", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
}



// [GET] /add/:productId
module.exports.add = async (req, res) => {

    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);
        const cartId = req.cookies.cartId;

        const productDatabase = await Products.findOne({
            _id: productId
        });

        // Find cart
        const cart = await Cart.findOne({
            _id: cartId
        });

        // Check if product already exists in cart
        const existProductInCart = cart.products.find(
            item => item.product_id === productId
        );

        if (existProductInCart) {
            // Product exists - update quantity
            await Cart.updateOne({
                _id: cartId,
                "products.product_id": productId
            }, {
                $set: {
                    "products.$.quantity": existProductInCart.quantity + quantity
                }
            });
        } else {
            // Product doesn't exist - add new
            const product = {
                product_id: productId,
                quantity: quantity
            };

            await Cart.updateOne({
                _id: cartId
            }, {
                $push: {
                    products: product
                }
            });
        }

        res.redirect(`/products/detail/${productDatabase.slug}`)


    } catch (error) {

        console.error("Add to cart error:", error);

    }
}

// [GET] /delete/:productId
module.exports.delete = async (req, res) => {

    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;

        await Cart.updateOne({
            _id: cartId
        }, {
            $pull: {
                products: {
                    product_id: productId
                }
            }
        });

        req.flash("success", "Đã xóa sản phẩm trong giỏ hàng");
        res.redirect(`/cart`);

    } catch (error) {
        console.log(error);
        req.flash("success", "Đã xóa sản phẩm trong giỏ hàng");
        res.redirect(`/cart`);
    }


    res.send("ok");
}

// [GET] /update/:productId/:quantity
module.exports.update = async (req, res) => {

    try {
        const cartId = req.cookies.cartId;

        const productId = req.params.productId;
        const quantity = req.params.quantity;

        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId,
        }, {
            $set: {
                "products.$.quantity": quantity,
            }
        });

        req.flash("success", "Đã cập nhật số lượng sản phẩm");

        res.redirect(`/cart`);

    } catch (error) {
        req.error("error", "Cập nhật số lượng sản phẩm không thành công");

        res.redirect(`/cart`);
    }


}