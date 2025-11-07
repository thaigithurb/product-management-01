const productsRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");
const usersRoutes = require("./users.route");
const checkoutRoutes = require("./checkout.route");
const chatRoutes = require("./chat.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingsMiddleware = require("../../middlewares/client/settings.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");


module.exports = (app) => {

    app.use(categoryMiddleware.category);

    app.use(userMiddleware.infoUser);

    app.use(cartMiddleware.cartId);

    app.use(settingsMiddleware.settingsGeneral);
    
    app.use("/", homeRoutes);

    app.use("/products", productsRoutes);

    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);

    app.use("/checkout", checkoutRoutes);

    app.use("/user", userRoutes);

    app.use("/chat", authMiddleware.requireAuth, chatRoutes);

    app.use("/users", authMiddleware.requireAuth, usersRoutes);

}