const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        const expiredCookie = 1000 * 60 * 60 * 24 * 3;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiredCookie)
        });
    }
    else {
        const cart = await Cart.findOne(
            {
                _id: req.cookies.cartId
            }
        );

        const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

        cart.totalQuantity = totalQuantity;

        res.locals.miniCart = totalQuantity;
    }

    next();
}