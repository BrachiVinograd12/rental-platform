
const express = require("express");
const router = express.Router();

const {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
} = require("../controllers/tenantController");

router.get("/", getTenants);
router.post("/", createTenant);
router.get("/:id", getTenantById);
router.patch("/:id", updateTenant);
router.delete("/:id", deleteTenant);

module.exports = router;
