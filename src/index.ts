const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser'); 
const app = express();
const db = require('quick.db');
let url = 'https://cdn.ramzihijjawi.me'
var fileUpload = require('express-fileupload');
app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: true
}));

app.use(express.static('uploads'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
function makeid() {
    return uuidv4();
};

app.post('/api/add', async (req, res) => {
    let token = req.body.token;
    let email = req.body.email;
    if ((token == undefined || email == undefined)==true) {
        return res.send({code: 500,message: `no_auth`})
    }
    accounts = db.get('accounts');
    console.log(accounts)
    accounts.forEach(function (account) {
        console.log(account)
        if(token == account.personaltoken) return res.status(401).json({
          code: 200,
          message: `Welcome, ${account.email}`
    })
    });

});

app.post('/api/upload', (req, res) => {
    let sampleFile;
    let uploadPath;
    console.log('hey');
    if (!req.files) {
      console.log(req.files)
      return res.status(400).send('No files were uploaded.');
    }
  
    if(!req.headers['auth']) {
        console.log(req.headers['auth'])
      return res.status(401).send('Access token is required')
    }
  
    if(req.headers['auth'] !== process.env.token) return res.status(401).send('Invalid Token')
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  
    // console.log(makeid(300))
    f = req.files.file;
    uploadPath = __dirname + '/uploads/' + `${f.name}`;
    // Use the mv() method to place the file somewhere on your server
    f.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.send(`${url}/${f.name}`);
    });
  })
  
  app.listen(3000, () => {
    console.log('server started');
  });
  