const mongoose=require("mongoose")

const DiskusiSchema= new mongoose.Schema({
    pertanyaan:{
        type:String,
        required:true
    },
    jawaban:{
        type:String,
    },
    latepost: { type: Date, default: Date.now }
})


const collection = new mongoose.model("diskusi",DiskusiSchema)

module.exports= collection
