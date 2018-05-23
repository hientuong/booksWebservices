var mongoose = require('mongoose');
var BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the book.'
  },
  author: {
    type: String,
    required: 'Kindly enter the author of the book.'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [
      {
        type: String,
        enum: ['ongoing', 'completed']
      }
    ],
    default: ['ongoing']
  }
});

module.exports = mongoose.model('Books', BookSchema)