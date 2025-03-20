const express = require('express');
const Router = express.Router();

const {indexController, profileController, registerController, loginController, createController, postCreateController, logoutController, redirectController, deleteController } = require('../controllers/indexController')
const { isLoggedIn , redirectToProfile } = require("../middleware/middleware")
Router.get("/", redirectToProfile, indexController);
Router.get("/profile", isLoggedIn ,profileController);
Router.post("/register",  redirectToProfile, registerController)
Router.post("/login", loginController)
Router.post("/logout", logoutController)
Router.get("/create",isLoggedIn , createController);
Router.get("/logout",logoutController);
Router.post("/create", isLoggedIn ,postCreateController);
Router.get("/link/:id", isLoggedIn ,redirectController);
Router.get("/:username/:id", isLoggedIn ,redirectController);
Router.post("/delete/:id", isLoggedIn ,deleteController);



module.exports = Router;