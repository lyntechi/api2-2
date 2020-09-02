
const server = require("./api/server.js");

const port = 9994;

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
