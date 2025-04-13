import multer from "multer";
import { storage } from "../config/cloudinary.js";

//save image to cloudinary
const upload = multer({ storage });
export default upload;