const Info = require('../models/infoModel');
const multer = require('multer');
const path = require('path');

const loadInfo = async (req, res) =>{
  const id = req.params.id;
  try{
      var infos = await Info.find(id)
      const reversedPosts = infos.reverse();
      res.render('mahasiswa/info/read-info', {user: req.session.user, infos:infos, infos: reversedPosts });
  }

  catch (error){
      console.log(error.message);
  }
}

// Kontroller untuk menyimpan data postingan ke MongoDB
const postInfo = async (req, res) => {
  try {
    const { judul, deskripsi } = req.body;
    const image = '/uploads/' + req.file.filename; // Jika ada file gambar

    const newPost = new Info({
      judul,
      deskripsi,
      image
    });

    await newPost.save();

    res.redirect('/mahasiswa/info/read-info');
  } catch (error) {
    console.error('Kesalahan:', error);
    res.status(500).send('Error saving to database: ' + error.message);
  }
}

const editInfo = async (req, res) =>{
  const id = req.params.id;
  try{
      const infos = await Info.findById({ _id: id });
      res.render('mahasiswa/info/edit-info', {user: req.session.user, infos:infos });
  }

  catch (error){
      console.log(error.message);
  }
}


const loadEditInfo = async(req, res) => {
  const postId = req.params.id;

  try {
    const { judul, deskripsi } = req.body;
    const image = '/uploads/' + req.file.filename;

    Info.findByIdAndUpdate(postId, { judul, deskripsi, image })
    .then(() => {
      res.redirect('/mahasiswa/info/read-info');
    })
    .catch(err => console.log(err));
    } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}

const deleteInfo = async (req, res) => {
  const id = req.params.id;
  try {
    await Info.findByIdAndDelete(id);
    res.redirect('/mahasiswa/info/read-info');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


const loadInfoADM = async (req, res) =>{
  const id = req.params.id;
  try{
      var infos = await Info.find(id)
      const reversedPosts = infos.reverse();
      res.render('admin/info-admin', {user: req.session.user, infos:infos, infos: reversedPosts });
  }

  catch (error){
      console.log(error.message);
  }
}

const loadAdmInfo = async (req, res) =>{
  const id = req.params.id;
  try{
      var infos = await Info.find(id)
      const reversedPosts = infos.reverse();
      res.render('admin/info', {user: req.session.user, infos:infos, infos: reversedPosts });
  }

  catch (error){
      console.log(error.message);
  }
}

module.exports ={
  postInfo,
  loadInfo,
  editInfo,
  loadEditInfo,
  deleteInfo,
  loadInfoADM,
  loadAdmInfo
}