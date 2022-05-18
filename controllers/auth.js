const { expressjwt: expressJWT } = require("express-jwt");

exports.requireSignIn = expressJWT({
    secret: "chatapp",
    algorithms: ["HS256"],
    userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
    let user = req.user && req.auth && req.user._id == req.auth._id;
    console.log(req.user);
    console.log(req.auth);
    if (!user) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}