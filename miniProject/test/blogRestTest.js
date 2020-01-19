require('mocha')
const expect = require("chai").expect
const makeData = require("../makeData")
const dbDisconnect = require("../dbConnect").disconnect
const dbConnect = require("../dbConnect").connect
const restStart = require("./../rest/mainRest").start
const restStop = require("./../rest/mainRest").stop
const fetch = require("node-fetch")
const userModel = require("./../models/user")
const blogModel = require("./../models/locationBlog")

describe("Test blog rest endpoints", function () {
    before(async function () {
        await dbConnect();
        await restStart();
    })

    after(async function () {
        await restStop();
        await dbDisconnect();
    })

    beforeEach(async function () {
        await makeData();
    })

    describe("POST: /addBlog", function () {
        it("Should add a blog", async function () {
            const user = await userModel.findOne({});
            const blog = {
                info: "Test",
                pos: {
                    longitude: 11,
                    latitude: 11
                },
                author: user._id
            }

            const url = "http://localhost:3001/api/blog/addBlog"
            const responseBody = await fetch(url, {
                method: "POST",
                body: JSON.stringify(blog),
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(res => res.json())
            expect(responseBody._id).to.not.be.null
        })
    })

    describe("POST: /likeBlog", function () {
        it("Should push user._id to blog likedBy array and return updated blog", async function () {
            const blogId = await blogModel.findOne({}, {_id: 1}); 
            const userId = await userModel.findOne({}, {_id: 1}); 
            const body = {blogId, userId}
            const url = "http://localhost:3001/api/blog/likeBlog"
            const responseBody = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(res => res.json())
            expect(responseBody.likedBy.length).to.be.equal(1);
        })
    })
})