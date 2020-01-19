const restStart = require("./rest/mainRest").start
const dbConnect = require("./dbConnect").connect
const settings = require("./settings")
const makeData = require("./makeData")
const {startGraphQL} = require("./graphQL/main")

async function main(){
    await dbConnect(settings.DEV_DB_URI);
    await makeData();
    await startGraphQL()
    //await restStart();
}

main();