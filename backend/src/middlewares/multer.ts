import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Build absolute path to /public/temp
    const uploadPath = path.join(process.cwd(), "src", "public", "temp");

    console.log("📁 Multer destination path:", uploadPath);

    // ✅ Create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      console.log("📁 Creating temp directory:", uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    } else {
      console.log("📁 Temp directory already exists:", uploadPath);
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Store file with timestamp + original name
    const filename = Date.now() + "-" + file.originalname;
    console.log("📁 Generated filename:", filename);
    cb(null, filename);
  },
});

// Custom file filter for React Native compatibility
const fileFilter = (req: any, file: any, cb: any) => {
  console.log("📁 Processing file:", file.originalname, "Type:", file.mimetype);
  
  // Accept all file types for now
  cb(null, true);
};

// Export configured multer with file filter
export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});
