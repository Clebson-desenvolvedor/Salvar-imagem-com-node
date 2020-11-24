const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

//check file type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null, true);
    } else{
        cb('Erro! Apenas imagem é aceito.');
    }
}

//init app
const app = express();

//EJS
app.set('view engine', 'ejs');

//public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) =>{
        if(err){
            res.render('index', {
                msg: err
            });
        } else{
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Erro! Arquivo não selecionado.'
                });
            } else{
                res.render('index', {
                    msg: 'Imagem enviada!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});

const port = 3000;


app.listen(port, () => console.log(`server started on port ${port}`));
