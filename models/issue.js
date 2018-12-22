const mongoose = require('mongoose');

const Issue = mongoose.model('Issue', {
  project: {
    type: String,
    required: true
  },
  issue_title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  issue_text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  created_by: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  assigned_to: {
    type: String,
    trim: true
  },
  status_text: {
    type: String,
    trim: true
  },
  created_on: {
    type: Date,
    required: true
  },
  updated_on: {
    type: Date,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  }
});

module.exports = {
  Issue
};
