const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      })
    }
    console.log(user)
    req.user = user;
    next();
  });
};

exports.signUp = (req, res) => {
    const { name, email, password, pic } = req.body;
    User.findOne({email}).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: `Server Error`,
                err
            })
        } else if (user) {
            return res.status(400).json({
                error: "User with this email already exist"
            })
        } else if (!user) {
            let newUser = new User(req.body);
            newUser.setPassword(password);
            newUser.save((err, data)=>{
                if (err) {
                    return res.status(200).json({
                        error: "Signin Failed"
                    })
                }
                data.password = undefined;
                data.salt = undefined;
                return res.status(200).json(data);
            })
        }
    })
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "Email not found",
        });
      } else if (user) {
        // check if email and password matches
        if (!user.validPassword(password, user.salt, user.password)) {
          return res.status(401).json({
            error: "Email and Password doesn't match",
          });
        }
  
        // create token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "2d",
        });
        //Cookie
        res.cookie("t", token, { expire: new Date() + 9999 });
        user.salt = undefined;
        user.password = undefined;
        res.json({
          token, user
        });
      }
    });
};

exports.searchUser = (req, res) => {
  const regex = req.query.keyword ? {
    $or: [
      { name: { $regex: req.query.keyword, $options: "i" } },
      { email: { $regex: req.query.keyword, $options: "i" } },
    ]
  } : {};
  User.find(regex).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    } else if (data.length === 0) {
      return res.status(400).json({
        error: "User not Found"
      })
    }
    return res.status(200).json(data)
  })
}