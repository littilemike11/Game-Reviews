const express = require("express");
import userRoute from "./userRoutes.js";
import reviewRoute from "./reviewRoutes.js";

const router = express.Router();

router.use("/users", userRoute);
router.use("/reviews", reviewRoute);

export default router;
