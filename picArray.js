require("dotenv/config");

const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");

const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

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

const upload = multer({ storage }).array("image");
app.post("/upload", upload, (req, res) => {
  const ResponseData = [];
  const files = req.files;

  let myFile = files.map((file) => {
    let arr = file.originalname.split(".");
    const fileType = arr[arr.length - 1];
    console.log(fileType);
    //where to save and how to save
    params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}.${fileType}`,
      Body: file.buffer,
    };
    console.log(params);

    s3.upload(params, (error, data) => {
      // console.log(params);
      console.log({ info: data.Location });

      if (error) {
        res.status(500).send(error);
        //   console.log("ERROR");
      } else ResponseData.push(data);
      if (ResponseData.length == files.length) {
        res.json({
          error: false,
          Message: "File Uploaded    SuceesFully",
          Data: ResponseData,
        });
      }
      // res.json({ msg: "success", data: data });
    });
  });
  //   console.log(myFile);

  //   const a=s3.upload(params, (error, data) => {
  //     if (error) {
  //       // res.status(500).send(error);
  //       console.log("ERROR");
  //     }
  // return data
  //   }

  //   );
  //   res.status(200).send(a);

  //   s3.listBuckets(function (err, data) {
  //     console.log(err, data);
  //   });
});

app.listen(port, () => {
  console.log("server is connect Array");
});
