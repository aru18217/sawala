const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    npm:{
        type:String,
        required:true
    },
    tahun:{
        type:String,
        required:true
    },
    prodi:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ['admin', 'mahasiswa'],
        required: true,
      },
    ktm:{
        type:String
    },
    isVerified: { type: String, default: 0 },
    isOnline: { type: String, default: 0 } 
    },  
    {timestamps:true}
);

module.exports = mongoose.model('User', userSchema);