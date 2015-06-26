  var mongoose = require('mongoose');
  var bcrypt = require('bcrypt-nodejs');

  var userSchema = mongoose.Schema({
    local:{
      email: String,
      password: String
    }
  });

userSchema.methods.generateHash = function(password){
      return bcrypt.hashSync(password, bcrypt.getGenSaltSync(8), null);
}

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, local.password);
}

module.exports = mongoose.model('User', userSchema);