import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Build absolute path to /public/temp
    const uploadPath = path.join(process.cwd(), "src", "public", "temp");

    // ✅ Create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Store file with timestamp + original name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Export configured multer
export const upload = multer({ storage });
