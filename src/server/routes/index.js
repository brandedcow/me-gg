const router = require("express").Router();
const apiRoutes = require("./api");

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );
  res.setHeader("Expires", "-1");
  res.setHeader("Pragma", "no-cache");
  next();
});

router.use("/api/", apiRoutes);

module.exports = router;
