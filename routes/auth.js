const router = require("express").Router();
const User = require("../models/User");

// router.get("/", (req, res) => {
//   res.send("auth router");
// });

router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await newUser.save();
    return res.status(200).json(user);

  } catch (err) {
    return res.status(500).json(err);
  }
})

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    const verifiedPassword = user.password === req.body.password;
    if (!verifiedPassword) return res.status(400).json("Wrong password");

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;