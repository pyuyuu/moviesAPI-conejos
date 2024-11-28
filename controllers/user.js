const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../auth");

module.exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, isAdmin } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }
  if (!email.includes("@")) {
    return res.status(400).send({ message: "Invalid email format" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .send({ message: "Password must be at least 8 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false, 
    });

    await newUser.save();
    res.status(201).send({ message: "Registered Successfully" });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email.includes("@")) {
    return res.status(400).send({ message: "Invalid email format" });
  }
  User.findOne({ email })
    .then((result) => {
      if (result == null) {
        return res.status(404).send({ error: "No email found" });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(password, result.password);
        if (isPasswordCorrect) {
          const accessToken = jwt.sign(
            { id: result._id },
            process.env.JWT_SECRET_KEY,
            {}
          );
          return res.status(200).send({ access: accessToken });
        } else {
          return res
            .status(401)
            .send({ message: "Email and password do not match" });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: "Error in logging in" });
    });
};
