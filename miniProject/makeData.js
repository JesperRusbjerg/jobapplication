var User = require("./models/user");
var LocationBlog = require("./models/locationBlog");
var Position = require("./models/position");
const debug = require("debug")("jp-makeData")

function positionCreator(lon, lat, userId, dateInFuture) {
    var posDetail = {
        user: userId,
        loc: {
            coordinates: [lon, lat]
        }
    }
    if (dateInFuture) {
        posDetail.created = "2022-09-25T20:40:21.899Z"
    }
    return posDetail;
}
async function makeData() {
    debug("Making users")
    try {
        const user1 = {
            firstName: "Nikolai",
            lastName: "Perlt",
            userName: "Perlt11",
            password: "sol",
            email: "Perlt@gmail.com",
            job: [{
                type: "Programmer",
                company: "Corporate",
                companyUrl: "Perlt.net"
            }],
        }

        const user2 = {
            firstName: "Jesper",
            lastName: "Rusbjerg",
            userName: "Ruzbjerg",
            password: "sol2",
            email: "Rusbjerg@gmail.com2",
            job: [{
                type: "Programmer2",
                company: "Corporate2",
                companyUrl: "Rusbjerg.net2"
            }, {
                type: "Brogrammer",
                company: "Corporate22",
                companyUrl: "Perlt.net22"
            }],
        }

        const user3 = {
            firstName: "Per",
            lastName: "Perlt",
            userName: "perPerlt",
            password: "test",
            email: "per@gmail.com",
            job: [{
                type: "Programmer",
                company: "Corporate",
                companyUrl: "Perlt.net"
            }],
        }
        var userInfos = [user1, user2, user3];
        await User.deleteMany({});
        await Position.deleteMany({});
        await LocationBlog.deleteMany({})

        var users = await User.insertMany(userInfos);
        users[0].friends.push(users[1]._id)
        users[0].friends.push(users[2]._id)
        users[1].friends.push(users[2]._id)
        await User.findByIdAndUpdate(users[0]._id, users[0])
        await User.findByIdAndUpdate(users[1]._id, users[1])
        await User.findByIdAndUpdate(users[2]._id, users[2])

        var positions = [positionCreator(12.572307586669924, 55.78275147606407, users[1]._id, true), positionCreator(12.588307586669924, 55.79875147606407, users[2]._id, true),]

        await Position.insertMany(positions)

        var blogs = [{
            info: "Cool Place",
            pos: {
                longitude: 26,
                latitude: 57
            },
            author: users[0]._id
        },]
        await LocationBlog.insertMany(blogs);
    } catch (err) {
        debug(err);
    }
}

module.exports = makeData