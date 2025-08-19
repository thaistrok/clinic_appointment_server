const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
        name: {type: String,required: true},
        email: {type: String,required: true,unique: true},
        password: {type: String,required: true,select: false},
        role: {type: String,enum: ['patient', 'doctor', 'admin'],
        default: 'patient'},
        specialty: {type: String},
        experience: {type: String}},
         {timestamps: true}
);


userSchema.pre('save', async function(next) {
  
  if (!this.isModified('password') && !this.isNew) return next();
  
  try {
    
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User