const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
 
  isBlocked: {
    type: Boolean,

    default: false,
  },
  role:{
    type:String,
    default:'user'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
