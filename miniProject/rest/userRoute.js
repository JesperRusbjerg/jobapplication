const express = require("express");
const userFacade = require("../facades/userFacade")
const route = express.Router();
const gju = require("geojson-utils")
const debug = require("debug")("jp-userRoute")
const {logger} = require("./../logging")



route.get("/all", async (req, res) => {
    const users = await userFacade.getAllUsers();
    logger.info(`Get all users - url:${req.url}`)
    debug("Fetch all users")
    res.json(users)
})

route.get("/:userName", async (req, res) => {
    logger.info(`Tried to fetch ${req.params.userName}`)
    debug("Fetch based on username " + req.params.userName)
    const user = await userFacade.findByUserName(req.params.userName)
    res.json(user);
})

route.post("/", async (req, res) => {
    let user = req.body;
    user = await userFacade.addUser(user);
    res.json(user);
})

route.put("/job", async (req, res) => {
    let job = req.body.job;
    const user = await userFacade.addJobToUser(req.body.id, job);
    res.json(user)
})

route.post("/login", async (req, res) => {
    try {
        const { username, password, lat, lon, radius } = req.body;
        let friends = await userFacade.login(username, password, lon, lat, radius);
        for (let friend of friends.friends) {
            let distance = gju.pointDistance({ type: 'Point', coordinates: [lon, lat] },
                { type: 'Point', coordinates: [friend.lon, friend.lat] }) / 1000
            debug(`Username: ${username} The distance to ${friend.username} is ${distance}`)
        }
        res.json(friends)
    } catch (e) {
        logger.warn("User failed to login")
        res.status(403).json(e)
    }
});

route.delete("/", async (req, res) => {
    let { id } = req.body
    let result = await userFacade.deleteUser(id)
    if (result) {
        res.json({ status: "Good", statusCode: 200 })
        return
    }
    res.status(400).json({ status: "Bad", statusCode: 400 });
})


module.exports = route;