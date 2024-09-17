const Users = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await Users.findOne({ username: username });
    if (usernameCheck) {
      return res.json({ message: "username already used", status: false });
    }
    const emailnameCheck = await Users.findOne({ email: email });
    if (emailnameCheck) {
      return res.json({ message: "email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user: user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username: username });
    if (!user) {
      return res.json({ 
        message: "incorrect username or password",
        status: false,
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect password", status: false });
    }
    delete user.password;
    return res.json({ status: true, user: user });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  console.log("avatar called");
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await Users.findByIdAndUpdate(userId, {
      avatarImage: avatarImage,
      isAvatarImage: true,
    });
    return res.json({
      isSet: userData.isAvatarImage,
      image: userData.avatarImage,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};
