const express = require("express");
const { userModel } = require("../Models/User.model");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
//   },
// });

const upload = multer({ dest: "uploads/" });

const userRouter = express.Router();
userRouter.use("/uploads", express.static("uploads"));

userRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    res.send({ message: "User already exists" });
  } else {
    const new_user = new userModel({
      username,
      email,
      password,
    });
    await new_user.save();
    res.send({ message: "Signup successful", data: new_user });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    res.send({ message: "Email doesn't exist" });
  } else if (email === user.email && password === user.password) {
    res.send({ message: "Login successful", data: user, status: 200 });
  } else {
    res.send({ message: "Email or password doesn't match" });
  }
});

userRouter.post("/uploads", upload.single("image"), async (req, res) => {
  const id = req.body.id;
  const imageUrl = req.file.path;
  if (!imageUrl || !id) {
    res.send({ message: "Bad Request" });
  } else {
    const user = await userModel.findById(id);
    user.images.push(imageUrl);
    await user.save();
    res.send({ message: "file upload successful" });
  }
});

userRouter.post("/images", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.send({ message: "Bad Request" });
  } else {
    const user = await userModel.findById(id);
    res.send({ message: "successful", data: user });
  }
});

userRouter.get("/profiles", async (req, res) => {
  const { q } = req.query;
  let params = {};

  let regex = new RegExp(q, "i");
  q && (params.username = regex);

  const data = await userModel.find(params);
  res.send({ message: "Result Successful", data: data });
});

userRouter.get("/profiles/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    const data = await userModel.findById(id);
    res.send({ message: "Result Successful", data: data });
  } else {
    res.send({ message: "Bad request" });
  }
});

userRouter.post("/follow", async (req, res) => {
  const { followersID, followingID } = req.body;

  if (followersID && followingID) {
    const followingIDData = await userModel.findById(followingID);
    const followersIDData = await userModel.findById(followersID);

    if (
      !followingIDData.following.includes(followersID) &&
      !followersIDData.followers.includes(followingID)
    ) {
      followingIDData.following.push(followersID);
      await followingIDData.save();
      followersIDData.followers.push(followingID);
      await followersIDData.save();
      res.send({
        message: "Following successful",
        followingIDData,
        followersIDData,
      });
    } else {
      let followingTemp = followingIDData.following.filter((item) => {
        return item !== followersID;
      });
      followingIDData.following = followingTemp;
      await followingIDData.save();

      let followersTemp = followersIDData.followers.filter((item) => {
        return item !== followingID;
      });
      followersIDData.followers = followersTemp;
      await followersIDData.save();

      res.send({
        message: "Unfollow successful",
        followersIDData,
        followingIDData,
      });
    }
  } else {
    res.send({ message: "Couldn't follow at this moment, please try later" });
  }
});

userRouter.post("/data", async (req, res) => {
  const arr = req.body;
  if (!arr) {
    res.send({ message: "Bad request" });
  }
  let temp = await Promise.all(
    arr.map(async (id) => {
      let data = await userModel.findById(id);
      return data;
    })
  );
  res.send({ message: "Result Successful", data: temp });
});

userRouter.post("/updateProfile", upload.single("image"), async (req, res) => {
  const id = req.body.id;
  const imageUrl = req.file.path;
  if (!imageUrl || !id) {
    res.send({ message: "Bad Request" });
  } else {
    const user = await userModel.findById(id);
    user.profilePicture = imageUrl;
    await user.save();
    res.send({ message: "file upload successful", data: user });
  }
});

module.exports = {
  userRouter,
};
