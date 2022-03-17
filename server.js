require("dotenv/config");

const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
// const uuid = require('uuid/v4')
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;
// var params = {
//   Bucket: process.env.S3_BUCKET_NAME,
//   Key: fileName,
//   Body: stream,
//   ContentType: stream1.mime, //'image/jpeg',
//   ContentDisposition: "inline",
//   ACL: "public-read",
//   CacheControl: "public, max-age=31536000",
// };
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("image");

app.post("/upload", upload, (req, res) => {
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuidv4()}.${fileType}`,
    Body: req.file.buffer,
  };
  //   s3.listBuckets(function (err, data) {
  //     console.log(err, data);
  //   });

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send(data);
  });
});

app.listen(port, () => {
  console.log(`Server is up at ${port}`);
});

// const express = require("express");
// const multer = require("multer");
// require("dotenv").config();
// const AWS = require("aws-sdk");
// const { v4: uuidv4 } = require("uuid");
// const { param } = require("express/lib/request");
// const app = express();
// app.use(express.json());
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ID,
//   secretAccessKey: process.env.AWS_SECRET_KEY,
// });
// const storage = multer.memoryStorage({
//   destination: (req, file, cb) => {
//     cb(null, "");
//   },
// });

// const upload = multer({ storage }).single("image");

// app.post("/upload", upload, (req, res) => {
//   let myFile = req.file.originalname.split(".");
//   const fileType = myFile[myFile.length - 1];
//   console.log(req.file);

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `${uuidv4()}.${fileType}`,
//     Body: req.file.buffer,
//   };

//   s3.upload(params, (error, data) => {
//     if (error) {
//       res.status(500).send(error.message);
//     }
//     res.status(200).send(data);
//   });
//   res.send("aws done");
// });

// app.listen(process.env.PORT, () => {
//   console.log(`server is running on port ${process.env.PORT}`);
// });
