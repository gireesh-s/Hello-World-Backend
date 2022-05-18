const router = require("express").Router();

const { requireSignIn, isAuth } = require("../controllers/auth");
const { signUp, signin, searchUser, userById } = require("../controllers/user");

router.post("/signup", signUp);
router.post("/signin", signin);
router.get("/search/:userId",requireSignIn, isAuth, searchUser);

router.param("userId", userById);

module.exports = router;