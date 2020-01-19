const dbConnect = require("./dbConnect").connect
const settings = require("./settings")
const makeData = require("./makeData")

async function main(){
    await dbConnect(settings.DEV_DB_URI);
    await makeData();
}

main();





