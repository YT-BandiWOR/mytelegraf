import server from "./server";
import config from "./config";
import tables from "./tables";

tables.createTables().then(r => console.log(r)).catch(reason => console.error(reason))

server.listen(config.port, config.host, () => {
    console.log(`Server is running on ${config.host}:${config.port}`);
});