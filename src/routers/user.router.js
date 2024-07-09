import { Router } from "express";
import {
  creatUser,
  getAllUser,
  loginUser,
} from "../controller/creatUser.controller.js";
import authJwt from "../middlewire/authJwt.middlewire.js";
import authJwtTow from "../middlewire/authTypeTwo.middlewire.js";
import { Upload } from "../middlewire/multer.middlewire.js";
import creatReact, { loveBack } from "../controller/reactUser.controller.js";
import {
  getSpecficUserReactProfile,
  loveReject,
} from "../controller/reactUser.controller.js";
import {
  creatMatchRequest,
  deletMatchRequest,
  getSpecficUserMatchRequest,
} from "../controller/creatMatch.controller.js";
import {
  creatMassageMatch,
  sentUserAllMatchForMassage,
} from "../controller/creatMassage.controller.js";
import { creatChat, getChatMessages } from "../controller/chat.controller.js";

const router = Router();

router.route("/regester").post(Upload.single("avatar"), creatUser);
router.route("/alluser").get(getAllUser);

router.route("/login").post(loginUser);

router.route("/verify").post(authJwt);

router.route("/react").post(authJwtTow, creatReact);
router.route("/love").post(authJwtTow, getSpecficUserReactProfile);

router.route("/reject").post(authJwtTow, loveReject);

router.route("/loveback").post(authJwtTow, loveBack);

router.route("/matchrequest").post(authJwtTow, creatMatchRequest);

router
  .route("/getallmatchrequest")
  .post(authJwtTow, getSpecficUserMatchRequest);

router.route("/deletmatchrequest").post(authJwtTow, deletMatchRequest);

router.route("/setmassagematch").post(authJwtTow, creatMassageMatch);

router
  .route("/getuserallmatchmassage")
  .post(authJwtTow, sentUserAllMatchForMassage);

router.route("/chat").post(
  authJwtTow,
  creatChat
);

router.route("/getchats").post(
  authJwtTow,
  getChatMessages
);

export default router;
