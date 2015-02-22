var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Project = new Schema({
  slug: String,
  data: String
});

Project.virtual('id').get(function () {
  return this._id.toString();
});

Project.set('toJSON', {
  virtuals: true
});

var project = mongoose.model('Project', Project);

module.exports = project;