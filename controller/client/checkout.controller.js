const Products = require("../../models/products.model");
const productHelper = require("../../helpers/product");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");


// [GET] /checkout
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

    res.render("client/pages/checkout/index.pug", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    })
}


// [GET] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address
    };

    const products = [];

    const cart = await Cart.findOne({
        _id: cartId
    });

    for (const product of cart.products) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        };

        const productInfo = await Products.findOne({
            _id: product.product_id
        }).select("price discountPercentage");

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;

        products.push(objectProduct);
    }


    const orderInfo = {
        cartId: cartId,
        userInfo: userInfo,
        products: products
    }

    const order = new Order(orderInfo);
    order.save();

    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    });

    res.redirect(`/checkout/success/${order.id}`);

}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    res.render("client/pages/checkout/success.pug", {
        pageTitle: "Đặt hàng thành công",
    })
}