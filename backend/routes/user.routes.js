const { Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const userModel = require("../models/user.model");

const roles = {
  ADMIN: "ADMIN",
  USER: "USER",
};

// POST ADD USER
router.route("/register").post(async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;
    const existingUser = await User.findOne({ email: email });

    // VALIDATION
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered" });
    if (password.length < 5)
      // PASS LENGTH CHECK
      return res
        .status(400)
        .json({ msg: "Password too short. 5 charactes minimun long" });
    if (password !== passwordCheck)
      // PASS EQUAL CHECK
      return res.status(400).json({ msg: "Different password" });
    if (existingUser) return res.status(400).json({ msg: "Enter a new email" });
    if (!displayName) displayName = email;

    // ENCRIPTATION OF PASSOWRD
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const isFirstUser = (await userModel.countDocuments({})) === 0;
    const newRole = isFirstUser ? roles.ADMIN : roles.USER;

    // SAVE USER INTO DATABASE
    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      role: newRole,
    });

    await newUser
      .save()
      .then(() => res.json("User added!"))
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

// POST LOGIN
router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body; // Obtiene el email y password del formulario
    const user = await User.findOne({ email: email }); // Verifica si existe un email registrado en la BD

    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const newPassword = await bcrypt.compare(password, user.password); // Verifica si la contraseña igresada es correcta

    // Si la password ingresada no coincide con la guardada en la DB, devuelve un error de incorrect password
    if (!newPassword) return res.status(400).json("Incorrect password");

    // Crea un token para el usuario que se esta logeando
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.route("/delete").delete(auth, async (req, res) => {
  // Al ingresar a la ruta, primero lee el archivo auth y luego realiza el callback async
  try {
    // Busca una coleccion por id en la BD y la elimina por completo.
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.route("/tokenIsValid").post(async (req, res) => {
  try {
    // Comprueba si existe el header con el siguiente nombre
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    // Verifica si el token es valido
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    // Verifica si el id del token concuerda con el id de una coleccion en la BD
    const user = User.findById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Ruta para verificar si un usuario esta logeado
router.route("/").get(auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
    role: user.role,
  });
});

router.get("/all", auth, async (req, res) => {
  const user = await User.find();
  function getFullUser(user) {
    var newUser = {id: user._id, user: user.displayName, email: user.email, role: user.role, createdAt: user.createdAt};
    return newUser;
  }

  res.json(user.map(getFullUser));
});

module.exports = router;
