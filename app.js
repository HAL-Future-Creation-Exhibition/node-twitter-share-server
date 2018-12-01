const express = require("express");
const bodyParser = require('body-parser');
const exec = require('child_process').exec;
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

app.post("/share", (req, res) => {
  const { id, name, icon } = req.body;
  exec(`python main.py ${name} ${icon} ${id}.png`, err => {
    if(err) {
      res.json({
        err
      });
    }
    exec(`rm -rf ${id}.png`);
    res.json({
      url: `https://hogehoge.com`
    })
  });
})

app.listen(4000, () => {
  console.log(`listen on port 4000`);
})