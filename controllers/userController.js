const User = require('../models/userModel');
const Info = require('../models/infoModel');
const Diskusi = require('../models/diskusiModel')

const Chat = require('../models/chatModel')
const bcrypt = require('bcrypt');

const  landingLoad = async (req, res) => {
    res.render("landingpage")
  }

const  registerLoad = async (req, res) => {

    try{
        res.render('register')
    } catch (error) {
        console.log(error.message);
    }

}

const register = async (req, res)=>{
    try{
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const user = new User ({
            email: req.body.email,
            fullname: req.body.fullname,
            npm: req.body.npm,
            tahun: req.body.tahun,
            prodi: req.body.prodi,
            username: req.body.username,
            password: passwordHash,
            role : 'mahasiswa',
            ktm: 'ktm/' + req.file.filename,
            isVerified: '0',
        });
        await user.save();

        res.render('wait', {message: 'register successfully'})
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async (req, res) =>{
    try{
        res.render('login');
    }

    catch (error){
        console.log(error.message);
    }
}

const login = async (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const userData = await User.findOne({ username: username }).populate('role');
        if (userData) {
         const passwordMatche = await bcrypt.compare(password, userData.password);
                if(passwordMatche){
                    req.session.user = userData;
                    if (userData.role === 'admin') {
                        res.redirect('/admin/dashboard');
                    } else if (userData.role === "mahasiswa") {
                        res.redirect('/mahasiswa/dashboard');
                    }       
                    return;
                }
                else{
                    res.render('login', {message:'Email dan password salah'})
                }
        }
        else{
            res.render('login', {message:'Oops, email dan password anda salah'})
        }
    


    } catch (error){
        res.render('login', {message:'Cek kembali email dan password anda'})
    }
}

const logout = async (req, res) =>{
    try{
        req.session.destroy();
        res.redirect('/login');
    }

    catch (error){
        console.log(error.message);
    }
}

const loadDashboardMHS = async (req, res) =>{
    const id = req.params.id;
    try{
        var infos = await Info.find(id);
        var diskusis = await Diskusi.find(id);
        var users = await User.find({_id: { $nin:[req.session.user._id] } });
        res.render('mahasiswa/dashboard', {user: req.session.user, users:users, infos:infos, diskusis:diskusis });
    }

    catch (error){
        console.log(error.message);
    }
}

const loadChatmhs = async (req, res) =>{
    try{
        var users = await User.find({_id: { $nin: [req.session.user._id] } })
        res.render('mahasiswa/chat-realtime', {user: req.session.user, users:users })
    }

    catch (error){
        console.log(error.message);
    }
}

const saveChat =  async(req, res) => {
    try{
        var chat = new Chat({
            sender_id:req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message : req.body.message
        })
        
        var newChat = await chat.save();
        res.status(200).send({ success:true,msg:'Pesan terkirim', data:newChat} )
    }catch(error){
        res.status(400).send({ success:false,msg:error.message})
    }
}

const loadChatbot = async (req, res) =>{
    try{
        res.render('mahasiswa/chatbot', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}

const loadProfile = async (req, res) =>{
    try{
        res.render('mahasiswa/profile', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}


const loadDashboardADM = async (req, res) =>{
    const id = req.params.id;
    try{
        var infos = await Info.find(id);
        var diskusis = await Diskusi.find(id);
        var users = await User.find({_id: { $nin:[req.session.user._id] } });
        res.render('admin/dashboard', {user: req.session.user, users:users, infos:infos, diskusis:diskusis });
    }

    catch (error){
        console.log(error.message);
    }
}

const loadChatadm = async (req, res) =>{
    try{
        var users = await User.find({_id: { $nin: [req.session.user._id] } })
        res.render('admin/chat-realtime', {user: req.session.user, users:users })
    }

    catch (error){
        console.log(error.message);
    }
}

const loadChatbotAdmin = async (req, res) =>{
    try{
        res.render('admin/chatbot', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}

const loadProfileADM = async (req, res) =>{
    try{
        res.render('admin/profile', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}

const loadDataUser = async (req, res) => {
    const id = req.params.id;
    try {
      const users = await User.find(id);
      res.render('admin/data_user', { users:req.session.user, users:users});
    } catch (err) {
      console.error('Kesalahan:', err);
      res.sendStatus(500);
    }
  }

  const createDataUser = async (req, res) =>{
    try{
        res.render('admin/create-datauser', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}

  const postDataUser = async (req, res)=>{
    try{
        const { email, fullname, npm, tahun, prodi,  username, password, role} = req.body;
        const ktm = '/uploads/' + req.file.filename; // Jika ada file gambar
        const newPost = new User({
            email,
            fullname,
            npm,
            tahun,
            prodi,
            username,
            password,
            role,
            ktm,
            isVerified: true,
        });
    
        User.insertMany([newPost])
        .then(() => {
          res.redirect('admin/data_user');
        })
    } catch (error) {
        console.log(error.message);
    }
}

const updateDataUser = async (req, res) => {
    const id = req.params.id;
    try{
        const users = await User.findById({ _id: id });
        res.render('admin/update-datauser',{user: req.session.user, users:users });
    }catch{
        (err => console.log(err));
  }
}

 const postUpdateDataUser = async (req, res) => {
    const id = req.params.id;
    const { email, fullname, username, npm, tahun, prodi, password, role } = req.body;
    User.findByIdAndUpdate(id, { email, fullname, username, npm, tahun, prodi, password, role })
      .then(() => {
        res.redirect('/admin/data_user');
      })
      .catch(err => console.log(err));
  }

  const deleteDataUser = async (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
        .then(() => {
            res.redirect('/admin/data_user');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Server Error');
        });
  }

  const postUpdateKonfirmasi = async (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, { isVerified})
        .then(() => {
            res.redirect('/admin/data_user');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Server Error');
        });
  }

  
module.exports ={
    landingLoad,
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboardMHS,
    loadChatmhs,
    saveChat,
    loadChatbot,
    loadProfile,
    loadDashboardADM,
    loadChatadm,
    loadChatbotAdmin,
    loadProfileADM,
    loadDataUser,
    createDataUser,
    postDataUser,
    updateDataUser,
    postUpdateDataUser,
    deleteDataUser,
    postUpdateKonfirmasi
}
