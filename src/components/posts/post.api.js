const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
} = require("./post.service");

const router = require("express").Router();

const multer = require("multer");
const { protectedRoutes } = require("../users/user.auth");
const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/png": "png",
  "image/jpeg": "jpg",
};

// {
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     const erorr = new Error("Invalid Mime Type");
//     if (isValid) {
//       error = null;
//     }
//     cb(error, "public/images");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(" ").join("_");
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, name + Date.now() + "_" + "." + ext);
//   },
// }
let storage = multer.diskStorage({});

router
  .route("/")
  .post(protectedRoutes, multer({ storage }).single("image"), createPost)
  .get(getPosts);
router
  .route("/:id")
  .get(getPost)
  .delete(protectedRoutes, deletePost)
  .put(protectedRoutes, multer({ storage }).single("image"), updatePost);

module.exports = router;
