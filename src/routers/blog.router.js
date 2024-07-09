import { Router } from "express";
import { Upload } from "../middlewire/multer.middlewire.js";
import authJwtTow from "../middlewire/authTypeTwo.middlewire.js";
import { addMassage, creatBlog, disLikeBlog, getAllBlog, likeBlog } from "../controller/blog.controller.js";



const router = Router();


router.route("/addblog").post(
    Upload.single("avatar"),
    authJwtTow,
    creatBlog
)

router.route("/getall").post(
    authJwtTow,
    getAllBlog
)

router.route("/addcomment").post(
    authJwtTow,
    addMassage
)

router.route("/likeblog").post(
    authJwtTow,
    likeBlog
)

router.route("/dislikeblog").post(
    authJwtTow,
    disLikeBlog
)











export default router;