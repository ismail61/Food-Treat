const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const profileController = require('../app/http/controllers/customers/profileController')
const orderController = require("../app/http/controllers/customers/orderController");
const cartController = require("../app/http/controllers/customers/cartController");
const checkActivity = require("../app/http/middleware/authentication");
const adminCheck = require("../app/http/middleware/admin/authentication");
const adminOrderController = require("../app/http/controllers/admin/adminOrderController");
const statusController = require("../app/http/controllers/admin/statusController");
const parser = require("body-parser");
const bodyParserUrl = parser.urlencoded({ extended: true });
const bodyParser = parser.json();

function routes(app) {
  app.get("/", adminCheck().admin, homeController().home);
  app.get("/login", checkActivity().UserIn, authController().login);
  
  app.post("/login", authController().loginUser);
  app.get("/register", checkActivity().UserIn, authController().register);
  app.post("/register", authController().userRegister);
  app.get("/logout", checkActivity().Guest, authController().logout);
  //app.get("/customers/profile", checkActivity().Guest, authController().profile);
  app.get("/cart", cartController().cart);
  app.post("/orders", checkActivity().Guest, orderController().store);
  app.get("/customers/orders",checkActivity().Guest, orderController().showOrders);
  app.get("/customers/profile",checkActivity().Guest, profileController().profile);
  app.post("/customers/profile",checkActivity().Guest, profileController().updateInfo);
  app.post("/customers/password",checkActivity().Guest, profileController().updatePassword);

  app.get("/customers/orders/:id",checkActivity().Guest, orderController().showSingleOrder);

  app.post("/update-cart", cartController().update);

  //user
  app.post("/update-details", bodyParser, authController().update);
  //Admin
  app.get("/admin/orders", adminCheck().admin, adminOrderController().orders);
  app.get(
    "/admin/products",
    adminCheck().admin,
    adminOrderController().showProducts
  );
  app.get(
    "/admin/profile",
    adminCheck().admin,
    adminOrderController().profile
  );
  app.post(
    "/admin/update",
    adminCheck().admin,
    adminOrderController().updateProduct
  );
  app.get(
    "/admin/product",
    adminCheck().admin,
    adminOrderController().newProductCreate
  );
  app.post(
    "/admin/product",
    adminCheck().admin,
    adminOrderController().aProductCreate
  );
  app.post(
    "/admin/order/status-update",
    adminCheck().admin,
    statusController().update
  );
}

module.exports = routes;
