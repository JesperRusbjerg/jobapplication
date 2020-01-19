const User = require("../models/user")
const Position = require("./../models/position")

async function addUser(user) {
    return await User.create(user)
}

async function addJobToUser(userId, job) {
    return await User.findByIdAndUpdate(userId, {
        $push: {
            job
        }
    }, { new: true })
}

async function getAllUsers() {
    return await User.find({})
}

async function findByUserName(userName) {
    return await User.findOne({
        userName
    })
}

async function login(userName, password, lon, lat, radius) {

    let user = await User.findOne({ userName, password })
        .populate("friends")
        .exec();
    if (!user) {
        throw ({ msg: "wrong username or password", status: 403 });
    }
    await Position.create({
        user: user._id,
        loc: {
            type: "Point",
            coordinates: [lon, lat]
        }
    })
    const friendsLocation = await Position.find({
        user: { $in: user.friends },
        loc: {
            $near: {
                $geometry: { "type": "Point", "coordinates": [lon, lat] },
                $minDistance: 0.1,
                $maxDistance: radius // * by 1000 to get in KM :)
            }
        }
    }).populate("user")
        .exec();

    return {
        friends: friendsLocation.map(f => {
            return {
                username: f.user.userName,
                lon: f.loc.coordinates[0],
                lat: f.loc.coordinates[1]
            }
        })
    };
}

async function deleteUser(userId) {
    try {
        await User.deleteOne({ _id: userId })
    } catch (e) {
        return false
    }
    return true
}

module.exports = {
    addUser,
    addJobToUser,
    getAllUsers,
    findByUserName,
    login,
    deleteUser
}