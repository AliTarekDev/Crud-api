const AppError = require("../../utils/appError");
const { catchAsyncError } = require("../../utils/catchAsync");
const Post = require("./post.model");
const User= require('../users/user.model')

exports.createPost = catchAsyncError(async (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}/public/images/`;
  let post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: url + req.file.filename,
    user: req.user.id
  });

  post = await post.save();
  !post && res.status(400).json({ message: "Cannot Add Post" });

  post && res.status(201).json({ message: "Post Added Successfully", post });
});

exports.getPosts = catchAsyncError(async (req, res, next) => {
  let pagesize = +req.query.pagesize;
  let page = +req.query.page;
  let mongooseQuery = Post.find({});
  let fetchedPosts;
  if (page && pagesize) {
    skip = pagesize * (page - 1);
    mongooseQuery.skip(skip).limit(pagesize);
  }

  mongooseQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      return res.status(200).json({
        message: "Fetching Done !",
        posts: fetchedPosts,
        maxPost: count,
      });
    });
});

exports.getPost = catchAsyncError(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  !post && new AppError("cant Get Post !");

  post && res.status(201).json(post);
});

exports.deletePost = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let user= await User.findById(req.user._id);
  !user && next(new AppError("Please Login First"));

  let postExist= await Post.findById(id);
  !postExist && next(new AppError("Cannot get Post"))

  if(user._id.toString() === postExist.user.toString()) {
    let post = await Post.findByIdAndRemove(id);

    !post && next(new AppError("cant Delete Post !"));
  
    post &&
      res.status(201).json({ message: "Post Deleted Successfully !", post });
  }else { 
    return res.status(401).json({message: "Not Authorized to Delete"})
  }
 
});

exports.updatePost = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let user= await User.findById(req.user._id);
  !user && next(new AppError("Please Login First"));


  let post = await Post.findById(id);
  !post && res.status(400).json({ message: "Cannot Find Post" });

  if(user._id.toString() === post.user.toString()) {
    let imagePath;
    const url = `${req.protocol}://${req.get("host")}/public/images/`;
    if (req.file) {
      imagePath = url + req.file.filename;
    } else {
      imagePath = post.image;
    }
  
    let updtPost = await Post.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        content: req.body.content,
        image: imagePath,
      },
      { new: true }
    );
  
    !updtPost && next(new AppError("Cannot update Post !"));
  
    updtPost &&
      res.status(201).json({ message: "Post Update Successfully !", updtPost });
  }else {
    return res.status(401).json({message: "Not Authorized to update"});
  }

  
});
