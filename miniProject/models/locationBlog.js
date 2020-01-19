var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let LocationBlogSchema = new Schema({
    info: {
        type: String,
        required: true
    },
    img: String,
    pos: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    likedBy: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastUpdated: Date
})

LocationBlogSchema.virtual("likedByCount").get(function(){
    return this.likedBy.length;
})

LocationBlogSchema.pre("update", function (next) {
    this.update({}, {
        $set: {
            lastUpdated: Date.now()
        }
    });
    next();
})

const LocationBlog = mongoose.model("LocationBlog", LocationBlogSchema)

module.exports = LocationBlog