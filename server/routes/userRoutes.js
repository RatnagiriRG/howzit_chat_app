const {
  register,
  login,
  setAvatar,
  getAllUsers,
} = require("../controllers/userController");

const router = require("express").Router();

//post
router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);

//get
router.get("/allusers/:id", getAllUsers);

module.exports = router;
