const Controller = require("../Controller/Auth");
const Authentication = require("../Middleware/JWT");
var router = require("express").Router();

module.exports = (app) => {
  router.post("/signup", Controller.signUp);
  router.post("/signin", Controller.signIn);
  router.post("/logout", Authentication, Controller.Logout);
  router.post("/filter", Authentication, Controller.Filter);
  router.get("/getproducts", Authentication, Controller.GetProducts);
  router.get("/users", Authentication, Controller.GetUsers);

  app.use("/api", router);
};
