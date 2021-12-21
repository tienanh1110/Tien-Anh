const mongoose = require('mongoose');

const dbUrl = "https://downloads.mongodb.com/compass/mongodb-compass-1.29.5-win32-x64.exe";
mongoose.connect(dbUrl);

const Task = mongoose.model('tasks', {
  title: {
    type: String,
    require: true,
  },
  detail: {
    type: String,
    require: true,
  },
});

module.exports = Task;
