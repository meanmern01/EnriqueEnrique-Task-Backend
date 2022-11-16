const Controller = require("../Controller/Auth");
const Authentication = require('../Middleware/JWT')
var router = require("express").Router();

module.exports = (app) => {

  router.post("/signup", Controller.signUp);
  router.post("/signin", Controller.signIn);
  router.post("/logout",Authentication,Controller.Logout);

  app.use("/api", router);
};
