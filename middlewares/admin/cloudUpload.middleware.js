const uploadToCloudinaryHelper = require("../../helpers/uploadToCloudinary.js");


module.exports.upload = async (req, res, next) => {
    try {
        if (req.file) {
            const link = await uploadToCloudinaryHelper.uploadToCloudinary(req.file.buffer);
            req.body[req.file.fieldname] = link;
        }
        next();
    } catch (error) {
        next(error);
    }
}