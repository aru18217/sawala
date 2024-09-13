const mongoose=require("mongoose")

const InfoSchema= new mongoose.Schema({
    judul:{
        type:String,
        required:true
    },
    deskripsi:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    latepost: { type: Date, default: Date.now }
})


const collection = new mongoose.model("info", InfoSchema)

module.exports= collection
