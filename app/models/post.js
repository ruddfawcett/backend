var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var postSchema = new Schema({
  to: {
    name: { type: String, required: false},
    id: { type: Schema.Types.ObjectId, required: false, ref: 'User' }
  },
  org: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' },
  body: { type: String, required: true },
  type: { type: String, required: true, uppercase: true, enum: [
    'SHOUTOUT', 'INVITE', 'ANNOUNCEMENT', 'UNCATEGORIZED'
  ]},
  from: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  hidden: { type: Boolean, default: false},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  hashtags: [{ type: String, unique: true }],
  reports: [{
    reported_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
    _id: false
  }]
});

postSchema.plugin(mongoosePaginate);

postSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Post', postSchema);
