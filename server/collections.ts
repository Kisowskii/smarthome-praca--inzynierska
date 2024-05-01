const datab = require('./connect.ts');

const elements = datab.collection('Elements');
const users = datab.collection('Users');
const logs = datab.collection('activityLogs');
const settings = datab.collection('settings');

module.exports = {
  elements,
  users,
  logs,
  settings,
};
