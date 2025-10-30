const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})




const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const codeFormats = ["c", "cpp", "js", "py", "java", "txt"];
    const docFormats = ["pdf", "doc", "docx"];
    const extension = file.originalname.split(".").pop().toLowerCase();

    if (codeFormats.includes(extension)) {
      // raw type does NOT require allowed_formats
      return {
        folder: "questiva",
        resource_type: "raw",
        public_id: `${file.fieldname}-${Date.now()}`
      };
    } else {
      // normal docs
      return {
        folder: "questiva",
        resource_type: "auto",
        allowed_formats: docFormats,
        public_id: `${file.fieldname}-${Date.now()}`
      };
    }
  }
});

module.exports = { cloudinary, storage };