const express = require("express");
const router  = express.Router();
const { LAWYERS } = require("../data/lawyers.js");

// GET /api/lawyers?domain=criminal_law
router.get("/", (req, res) => {
  const { domain } = req.query;
  const result = domain
    ? LAWYERS.filter(l => l.domains.includes(domain))
    : LAWYERS;
  res.json({ status: "ok", lawyers: result });
});

module.exports = router;
