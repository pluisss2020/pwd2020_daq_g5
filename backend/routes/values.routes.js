const router = require("express").Router();
const auth = require("../middleware/auth");
const valuesModel = require("../models/values.model");
const Value = require("../models/values.model");

router.route("/").post(auth, async (req, res) => {
  try {
    const { temperature, humidity } = req.body;
    // console.info(req.body)
    // const newJson = JSON.parse(req.body);
    const newTemperature = parseFloat(temperature);
    const newHumidity = parseFloat(humidity);
    // Validation
    if (!newTemperature || !newHumidity)
      return res.status(400).json({ msg: "Please insert all the fields!!" });

    const newValue = new Value({
      temperature: newTemperature,
      humidity: newHumidity,
    });
    const savedValue = await newValue.save();
    res.json(savedValue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.route("/last").get(auth, async (req, res) => {
  try {
    const savedValue = await valuesModel.find().sort({ _id: -1 }).limit(1);
    res.status(200).json(savedValue);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

router.route("/all").get(auth, async (req, res) => {
  const Values = await Value.find();
  res.json(Values);
});

router.route("/:id").delete(auth, async (req, res) => {
  const { id } = req.params;
  const deleteValue = await Value.findOne({ _id: id });
  if (!deleteValue)
    return res.status(400).json({
      msg: "No Value found with this ID that belongs to the current user.",
    });

  const deletedValue = await Value.findByIdAndDelete(id);
  res.json(deletedValue);
});

module.exports = router;
