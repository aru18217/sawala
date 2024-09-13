const express = require('express');
const user_route = express();
const path = require('path');
const multer = require ('multer');
const bodyParser = require('body-parser');
const session = require('express-session');

const { SESSION_SECRET }= process.env;
user_route.use(session({secret:SESSION_SECRET}))

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.set('view engine', 'ejs');
user_route.set('views', './views');

user_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, path.join(__dirname, '../public/images'))
    },

    filename:function(req, file, cb){
        const name = Date.now() + '' + file.originalname;
        cb(null,name); 
    }
});

const upload = multer({storage:storage});
// Middleware untuk static files
user_route.use('/images', express.static('public/images'));


 // Pengaturan Multer untuk menyimpan gambar
 const storage_minfo = multer.diskStorage({
    destination: '../public/images',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload_minfo = multer({storage: storage_minfo});
  
  // Middleware untuk static files
user_route.use(express.static('mahasiswa/info/read-info'));




const userController = require('../controllers/userController');
const infoController = require('../controllers/infoController');
const diskusiController = require('../controllers/diskusiController');

const auth = require('../middlewares/auth');

user_route.get('/landingpage', userController.landingLoad);

user_route.get('/register', auth.isLogout, userController.registerLoad );
user_route.post('/register', upload.single('ktm'), userController.register );

user_route.get('/wait', (req, res)=>{ res.render('wait')})


user_route.get('/login', auth.isLogout, userController.loadLogin );
user_route.post('/login', userController.login );
user_route.get('/logout', auth.isLogin, userController.logout );

user_route.get('/mahasiswa/dashboard', auth.isMahasiswa, auth.isLogin, userController.loadDashboardMHS );

user_route.post('/info', upload_minfo.single('image'), infoController.postInfo );
user_route.get('/mahasiswa/info/read-info', auth.isMahasiswa, auth.isLogin, infoController.loadInfo );
user_route.get('/hapus_info/:id', auth.isMahasiswa, auth.isLogin, infoController.deleteInfo );
user_route.get('/mahasiswa/edit_info/:id', auth.isMahasiswa, auth.isLogin, infoController.editInfo );
user_route.post('/edit_info/:id', upload_minfo.single('image'), auth.isMahasiswa, auth.isLogin, infoController.loadEditInfo );

user_route.post('/diskusi', diskusiController.postDiskusi );
user_route.get('/mahasiswa/diskusi/read-diskusi', auth.isMahasiswa, auth.isLogin, diskusiController.loadDiskusi );
user_route.get('/mahasiswa/edit_diskusi/:id', auth.isMahasiswa, auth.isLogin, diskusiController.editDiskusi );
user_route.post('/edit_diskusi/:id', auth.isMahasiswa, auth.isLogin, diskusiController.loadEditDiskusi );
user_route.get('/hapus_diskusi/:id', auth.isMahasiswa, auth.isLogin, diskusiController.deleteDiskusi );


user_route.get('/mahasiswa/chat-realtime', auth.isMahasiswa, auth.isLogin, userController.loadChatmhs );
user_route.get('/mahasiswa/chatbot',auth.isMahasiswa, auth.isLogin, userController.loadChatbot );
user_route.get('/mahasiswa/profile',auth.isMahasiswa, auth.isLogin, userController.loadProfile );
user_route.post('/save-chat', userController.saveChat);

user_route.get('/admin/dashboard', auth.isAdmin, auth.isLogin, userController.loadDashboardADM );
user_route.get('/admin/info-admin', auth.isAdmin, auth.isLogin, infoController.loadInfoADM );
user_route.get('/admin/diskusi-admin', auth.isAdmin, auth.isLogin, diskusiController.loadDiskusiADM);


user_route.get('/admin/diskusi', auth.isAdmin, auth.isLogin, diskusiController.loadAdminDiskusi );

user_route.get('/admin/info', auth.isAdmin, auth.isLogin, infoController.loadAdmInfo);

user_route.get('/admin/chat-realtime', auth.isAdmin, auth.isLogin, userController.loadChatadm);
user_route.get('/admin/chatbot', auth.isAdmin, auth.isLogin, userController.loadChatbotAdmin);
user_route.get('/admin/profile', auth.isAdmin, auth.isLogin, userController.loadProfileADM);

user_route.get('/admin/data_user', auth.isAdmin, auth.isLogin, userController.loadDataUser);
user_route.get('/admin/create-datauser', auth.isAdmin, auth.isLogin, userController.createDataUser);
user_route.post('/createuser', upload.single('ktm'), userController.postDataUser );
user_route.post('/createuser', auth.isAdmin, auth.isLogin, userController.postDataUser);
user_route.post('/createuser', auth.isAdmin, auth.isLogin, userController.postDataUser);
user_route.get('/delete_user/:id', auth.isAdmin, auth.isLogin, userController.deleteDataUser);
user_route.get('/update_user/:id', auth.isAdmin, auth.isLogin, userController.updateDataUser);
user_route.post('/update_users/:id', auth.isAdmin, auth.isLogin, userController.postUpdateDataUser);
user_route.post('/konfirmasi_user/:id', auth.isAdmin, auth.isLogin, userController.postUpdateKonfirmasi);

user_route.get('*', function(req, res){
    res.redirect('/landingpage');
})



module.exports = user_route;


