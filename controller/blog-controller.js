import mongoose from "mongoose";
import BlogModel from "../model/Blog-model";
import userModel from "../model/user-model";

export const getAllBlogs = async (req, res, next) => {
  let blogs;

  try {
    blogs = await BlogModel.find().populate("user");
  } catch (error) {
    console.log(error);
  }

  if (!blogs) {
    return res.status(400).json({ message: "No blogs are found" });
  }

  return res.status(200).json({ blogs });
};

export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  let existingUser;

  try {
    existingUser = await userModel.findById(user);
  } catch (error) {
    return console.log(error);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find the user" });
  }

  const blog = new BlogModel({ title, description, image, user });

  try {

    const session = await mongoose.startSession();

    session.startTransaction();

    await blog.save({session});
    existingUser.blogs.push(blog);
    await existingUser.save({session})
    await session.commitTransaction();

  } catch (error) {
    console.log(error);;
    return res.status(500).json({message: error})
  }

  return res.status(200).json({ blog });
};

export const updateBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const { title, description } = req.body;

  let blog;

  try {
    blog = await BlogModel.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (error) {
    return console.log(error);
  }

  if (!blog) {
    return res.status(500).json({ message: "Unable to Update the blog" });
  }

  return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
  const id = req.params.id;

  let blog;

  try {
    blog = await BlogModel.findById(id);
  } catch (error) {
    return console.log(error);
  }

  if (!blog) {
    return res.status(400).json({ message: "Blog was not foudn" });
  }

  return res.status(200).json({ blog });
};

export const deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;

  let blog;

  try {
    blog = await BlogModel.findByIdAndRemove(blogId).populate('user');
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (error) {
    return console.log(error);
  }

  if (!blog) {
    return res.status(500).json({ message: "blog not found" });
  }

  return res.status(200).json({message: "delete blog sussceflully" });
};


export const getByUserId = async(req,res,next)=> {

    const userId = req.params.id;

    let userBlogs;

    try {
        userBlogs = await userModel.findById(userId).populate('blogs');

    } catch (error) {
        return console.log(error);
    }

    if(!userBlogs){
        return res.status(404).json({message: "No Blogs found"})
    }

    return res.status(200).json({blogs: userBlogs})
}