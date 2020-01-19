const LocationBlog = require("../models/locationBlog")

async function addLocationBlog(blog) {
    return LocationBlog.create(blog)
}

async function likeLocationBlog(blogId, userId) {
    return LocationBlog.findOneAndUpdate({ _id: blogId }, {
        $push: { likedBy: userId },
        lastUpdated: Date.now()
    }, {new: true});
}


module.exports = {
    addLocationBlog,
    likeLocationBlog
}