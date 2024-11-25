const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Create post
router.post("/", async(req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch(err) {
    return res.status(500).json({error: err.message});
  }
});

// Edit post
router.put("/:id", async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json(post);
    } else {
      return res.status(403).json("You can update only your post!");
    }
  } catch(err) {
    return res.status(500).json({error: err.message});
  }
})

// Delete post
router.delete("/:id", async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("Post is deleted");
    } else {
      return res.status(403).json("You can only delete your post!");
    }
  } catch(err) {
    return res.status(500).json({error: err.message});
  }
})

// Get post
router.get("/:id", async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch(err) {
    return res.status(500).json({error: err.message});
  }
})

// Like to post
router.put("/:id/like", async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId
        }
      });
      return res.status(200).json("Like");
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId
        }
      })
      return res.status(200).json("Remove like");
    }
  } catch(err) {
    return res.status(500).json({error: err.message});
  }
})

// Get posts on timeline
router.get("/timeline/all", async(req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const [myPosts, friendsPosts] = await Promise.all([
      Post.find({userId: currentUser._id}),
      Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({userId: friendId});
        })
      )
    ]);
    const timelinePosts = myPosts.concat(...friendsPosts);
    return res.status(200).json(timelinePosts);
  } catch(err) {
    return res.status(500).json({error: err.message});
  }
})

module.exports = router;