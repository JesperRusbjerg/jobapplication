require('mocha')
const expect = require("chai").expect
const makeData = require("../makeData")
const disconnect = require("../dbConnect").disconnect
const connect = require("../dbConnect").connect
const UserModel = require("../models/user")
const blogModel = require("../models/locationBlog")

const blogFacade = require("../facades/blogFacade")

describe("blogFacade", function () {
    before(async function () {
       // await connect(require("../settings").DEV_DB_URI); //Vi burde ikke connecte til dev db? 

        await connect();
    })

    after(async function () {
        await disconnect()
    })

    beforeEach(async function () {
        await makeData();
    })

    describe("addLocationBlog()", function () {
        it("Should add locationBlog", async function () {
            const user = await UserModel.findOne({})
            const location = {
                info: "Test",
                pos: {
                    longitude: 11,
                    latitude: 11
                },
                author: user._id
            }

            let blogLengthBefore = await blogModel.find({}).then(data => data.length);
            const blog = await blogFacade.addLocationBlog(location)
            const blogLengthAfter = await blogModel.find({}).then(data => data.length);
            expect(blogLengthAfter).to.be.equal(++blogLengthBefore);
            expect(blog).to.not.be.null
            expect(blog._id).to.not.be.null
        })
    })
    describe("likeLocationBlog()", function () {
        it("Should add user to locationBlog likes by", async function () {
            const user = await UserModel.findOne({});
            const blog = await blogModel.findOne({});
            const updatedBlog = await blogFacade.likeLocationBlog(blog._id, user._id);
            expect(updatedBlog.likedBy.length).to.be.equal(1);
        })
    })
})