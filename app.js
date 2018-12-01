const express = require("express");
const bodyParser = require('body-parser');
const exec = require('child_process').exec;
const axios = require("axios");
const FormData = require('form-data');
const fs = require("fs");
const multer = require("multer");
const app = express();

// configure
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "5mb"
  })
);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const upload2S3 = async (id) => {
  const fd = new FormData();
  const buffer = fs.readFileSync(`official-${id}.png`);
  fd.append("file", buffer, {
    filename: `${id}.png`,
    contentType: "image/png",
    knownLength: buffer.length
  });
  return await axios.post(`http://133.167.127.211:8080/upload?path=official-${id}.png`, fd, {
    headers: fd.getHeaders()
  });
}

app.post("/share", (req, res) => {
  const { id, name, icon } = req.body;
  exec(`python main.py ${name} ${icon} official-${id}.png`, async (err) => {
    if(err) {
      res.json({
        err
      });
    }

    await upload2S3(id);

    exec(`rm -rf official-${id}.png`);
    res.json({
      url: `https://s3-us-west-2.amazonaws.com/dinner-match/nellow/official-${id}.png`
    })
  });
})

app.listen(4000, () => {
  console.log(`listen on port 4000`);
})