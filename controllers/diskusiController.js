const User = require('../models/userModel');
const Diskusi = require('../models/diskusiModel')
const bcrypt = require('bcrypt');

const loadDiskusi = async (req, res) =>{
    const id = req.params.id;
    try{
        var diskusis = await Diskusi.find(id)
        const reversedPosts = diskusis.reverse();
        res.render('mahasiswa/diskusi/read-diskusi', {user: req.session.user, diskusis:diskusis, diskusis: reversedPosts });
    }
  
    catch (error){
        console.log(error.message);
    }
  }

// Kontroller untuk menyimpan data postingan ke MongoDB
const postDiskusi = async (req, res) => {
    try {
        const data={
        pertanyaan:req.body.pertanyaan,
        jawaban:req.body.jawaban,
      }
      await Diskusi.insertMany([data])
      res.redirect('/mahasiswa/diskusi/read-diskusi');
    } catch (error) {
      console.error('Kesalahan:', error);
      res.status(500).send('Error saving to database: ' + error.message);
    }
  }

  const loadEditDiskusi = async (req, res) => {
    const id = req.params.id;
    try{
        const { pertanyaan, jawaban} = req.body;
        Diskusi.findByIdAndUpdate(id, { pertanyaan, jawaban})
        .then(() => {
          res.redirect('/mahasiswa/diskusi/read-diskusi');
        })
       }
       catch (error){
        console.log(error.message);
      }
    }
  const editDiskusi = async (req, res) =>{
    const id = req.params.id;
    try{
        const diskusis = await Diskusi.findById({ _id: id });
        res.render('mahasiswa/diskusi/read-diskusi', {user: req.session.user, diskusis:diskusis });
    }
  
    catch (error){
        console.log(error.message);
    }
  }

  const deleteDiskusi = async (req, res) => {
    const id = req.params.id;
    try {
      await Diskusi.findByIdAndDelete(id);
      res.redirect('/mahasiswa/diskusi/read-diskusi');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  const loadDiskusiADM = async (req, res) =>{
    const id = req.params.id;
    try{
        var diskusis = await Diskusi.find(id)
        const reversedPosts = diskusis.reverse();
        res.render('admin/diskusi-admin', {user: req.session.user, diskusis:diskusis, diskusis: reversedPosts });
    }
  
    catch (error){
        console.log(error.message);
    }
  }

  const loadAdminDiskusi = async (req, res) =>{
    const id = req.params.id;
    try{
        var diskusis = await Diskusi.find(id)
        const reversedPosts = diskusis.reverse();
        res.render('admin/diskusi', {user: req.session.user, diskusis:diskusis, diskusis: reversedPosts });
    }
  
    catch (error){
        console.log(error.message);
    }
  }

  module.exports ={
    loadDiskusi,
    postDiskusi,
    editDiskusi,
    loadEditDiskusi,
    deleteDiskusi,
    loadDiskusiADM,
    loadAdminDiskusi
  }

