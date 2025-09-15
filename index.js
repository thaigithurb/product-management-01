const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const multer  = require('multer');
require('dotenv').config();

const database = require("./config/database");
const systemConfig = require("./config/system");

const adminRoute = require("./routes/admin/index.route");

const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', `${__dirname}/views`) ;
app.set('view engine', 'pug');

// flash 
app.use(cookieParser('ABDSLKFNLA'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash 

app.use(express.static(`${__dirname}/public`));

// App Locals Variable 
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// routes 
route(app);
adminRoute(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
