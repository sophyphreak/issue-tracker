const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(`mongodb://localhost:27017/IssueTrackerTest`);
} else {
  mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds155293.mlab.com:55293/issue-tracker`
  );
}

module.exports = {
  mongoose
};
