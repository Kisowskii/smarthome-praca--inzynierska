const datab = require("./connect.ts");

const elements = datab.collection("Elements");
const users = datab.collection("Users");


module.exports = {
    elements,
    users,
  };
  