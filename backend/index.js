const app = require('./app');
const config = require('./config');
const db=  require('./app/utils/mongodb');
const PORT = config.app.port;

// run server
db.connect();
app.listen(PORT, () => console.log(`App for http://locahost:${PORT}`));



