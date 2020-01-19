const express = require("express");
const blogFacade = require("../facades/blogFacade")
const route = express.Router();

route.post("/addBlog",async (req, res) => {
    const blog = req.body;
    const createdBlog = await blogFacade.addLocationBlog(blog);
    res.json(createdBlog);
})

route.post("/likeBlog", async (req, res) => {
    const {userId, blogId} = req.body
    const likeBlog = await blogFacade.likeLocationBlog(blogId, userId);
    res.json(likeBlog);    
})

module.exports = route;