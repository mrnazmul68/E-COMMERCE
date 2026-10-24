import { UPLOAD_CONSTANTS } from "@shared/constants.js";
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,

  fileFilter: (_req, file, callback) => {
    if (UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.mimetype as never)) {
      callback(null, true);
      return;
    }

    callback(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only JPEG, PNG, WebP and AVIF images are allowed",
      ),
    );
  },

  limits: {
    fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE,
    files: UPLOAD_CONSTANTS.MAX_FILES,
  },
});
