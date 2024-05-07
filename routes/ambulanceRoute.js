const express = require("express");
const {
  renderAmbulanceList,
  createAmbulance,
  renderCreateAmbulanceForm,
  deleteAmbulance,
  renderAmbulanceDetail,
  getAmbulances,
} = require("../controllers/ambulance/ambulanceController");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.route("/new").get(renderCreateAmbulanceForm);
router
  .route("/")
  .get(catchAsync(getAmbulances))
  .post(catchAsync(createAmbulance));
router
  .route("/:id")
  .get(catchAsync(deleteAmbulance))
  .get(renderAmbulanceDetail);

module.exports = router;
