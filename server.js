const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const path = require("path");
const app = express();
require("dotenv").config();

var favicon = require("serve-favicon");

// app.use(favicon(__dirname + "/bitchly.ico"));
// app.use(favicon(path.join(__dirname, "public", "images", "bitchly.ico")));
app.use("/favicon.ico", express.static("public/images/favicon.ico"));

const DB = process.env.DB;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//replacing # with %23 because of "MongoParseError: URI does not have hostname, domain name and tld" error
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); //To get data from form

app.get("/", async (req, res) => {
  //   res.send("Welcome!");
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls }); //Gives us access to fullUrl input field. We use urlencoded to get this property to work
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);
