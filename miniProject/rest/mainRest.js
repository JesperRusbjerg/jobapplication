const { server, app } = require("./restUtils")
const userRoute = require("./userRoute")
const blogRoute = require("./blogRoute")
const helmet = require("helmet")
const cors = require("cors")
const debug = require("debug")("jp-rest")
const {logger} = require("./../logging")


app.use(helmet())
app.use(require("express").json())
app.use(cors())

async function start(port = 3001) {
    
    app.use((req, res, next) => {
        logger.info(req.url)
        next()
    })

    app.use((req, res, next) => {
        debug(`METHOD: ${req.method} url: ${req.url} - Rest endpoint`)
        next()
    })
    
    app.use("/api/user", userRoute)
    app.use("/api/blog", blogRoute)

    app.use((err, req, res, next) => {
        debug(`Error: ${err}`)
        logger.warn(`Error: ${err}`)
        res.status(400).send(err.message)
    })

    server.listen(port, () => debug("Listen on port", port));
}

async function stop() {
    debug("Rest close")
    await server.close();
}

module.exports = { start, stop }