const {upload,csvUpload, uploadImageOnly} = require("../helper/s3FileUpload");
const singleUpload = upload.single("file");
const csvSingleUpload = csvUpload.single("file");
const singleImageUpload = uploadImageOnly.single("file");

module.exports.fileUpload = function(req,res,next){
    singleUpload(req, res, function (err) {
        if (err) {
          return res.json({
            success: false,
            errors: {
              title: "File Upload Error",
              detail: err.message,
              error: err,
            },
          });
        }
        next();
    })
}

module.exports.fileUploadImageOnly = function(req,res,next){    
    singleImageUpload(req, res, function (err) {
        if (err) {
          return res.status(400).json({
            success: false,
            errors: {
              title: "File Upload Error",
              detail: err.message,
              error: err,
            },
            message:err.message
          });
        }
        next();
    })
}

module.exports.csvFileUpload = function(req,res,next){
  csvSingleUpload(req,res,function(err){
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "File Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }
    next();
  })
}
