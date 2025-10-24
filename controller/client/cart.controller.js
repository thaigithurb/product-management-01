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