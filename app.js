const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const interfaceRoutes = require("./routes/interface");
const kavlingRoutes = require("./routes/kavling");
const liveRoutes = require("./routes/live");
const propertyRoutes = require("./routes/property");
const siteRoutes = require("./routes/site");
const typeRoutes = require("./routes/type");

app.use("/interface", interfaceRoutes);
app.use("/", kavlingRoutes);
app.use("/live", liveRoutes);
app.use("/", propertyRoutes);
app.use("/site", siteRoutes);
app.use("/", typeRoutes);

module.exports = app;
