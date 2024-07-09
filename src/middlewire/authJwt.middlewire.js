import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const authJwt = async (req, res) => {
  const responce = req.headers.authorization;
  const token = responce.replace("Bearer ", "");

  if (!token) {
    console.log("token required");
  }
  const decodedToken = jwt.verify(token, "HRhuKhsaT");

  const user = await User.findById(decodedToken._id);
  req.user = user;
  res.status(200).send(user);
};

export default authJwt;
