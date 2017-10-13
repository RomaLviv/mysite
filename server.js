//Підключаємо бібліотеки
const express = require('express');
const bodyParser = require('body-parser');
//const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const twilio = require('twilio');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const clientTwilio = new twilio('ACfc1fb31844a5fdfa90cd9adb5ab4cfbd', 'b90a4af312e4473f21b5922581248e42');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
});
const port = process.env.PORT || 8000;
require('./js/about-item');
const mail = require('./js/mail');
var sender = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mail.mail,
        pass: mail.pass
    }
}),
    EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path'),
    Promise = require('bluebird');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(cors());
function sendEmail(obj) {
    return sender.sendMail(obj);
}
function loadTemplate(templateName, contexts) {
    let template = new EmailTemplate(path.join(__dirname, 'mail_templates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});
let initDb = function () {
    connection.query('' +
        'CREATE TABLE IF NOT EXISTS users (' +
        'id int(11) NOT NULL AUTO_INCREMENT,' +
        'login varchar(50), ' +
        'password varchar(50),' +
        'mail varchar(50),' +
        'status varchar(10),' +
        'PRIMARY KEY(id), ' +
        'UNIQUE INDEX `login_UNIQUE` (`login` ASC))',
        function (err) {
            if (err) throw err;
            console.log('CREATE TABLE IF NOT EXISTS users')
        });
};
initDb();
let initDb2 = function () {
    connection.query('' +
        'CREATE TABLE IF NOT EXISTS items (' +
        'id int(11) NOT NULL AUTO_INCREMENT,' +
        'name varchar(50), ' +
        'price varchar(50),' +
        'src varchar(150),' +
        'PRIMARY KEY(id) )',
        function (err) {
            if (err) throw err;
            console.log('CREATE TABLE IF NOT EXISTS items')
        });
};

initDb2();
app.get('/items-info', function (req, res) {
    var str = new ItemsInfo().readInfo().toString().split('/item/');
    res.status(200).send(str);
});
app.post('/items-info', function (req, res) {
    var str = new ItemsInfo().readInfo().toString();
    if (str == "") {
        str = str + req.body.text;
    } else {
        str = str + "/item/" + req.body.text;
    }
    var str2 = new ItemsInfo().writeInfo(str);
    res.sendStatus(200);
});
app.put('/items-info', function (req, res) {
    var str = new ItemsInfo().writeInfo(req.body.text);
    res.sendStatus(200);
});
app.get('/items', function (req, res) {
    connection.query('SELECT * FROM items', function (err, rows) {
        if (err) throw err;
        console.log('get all itemss, length: ' + rows.length);
        res.status(200).send(rows);
    });
});
app.post('/items', function (req, res) {
    connection.query('INSERT INTO items SET ?', req.body,
        function (err, result) {
            if (err) throw err;
            console.log('item added to database with id: ' + result.insertId);
        }
    );
    res.sendStatus(200);
});
app.post('/login-auth', function (req, res) {
    connection.query('SELECT * FROM users  WHERE login = ?', req.body.login, function (err, rows) {
        if (err) throw err;
        if (rows[0] != undefined) {
            if (rows[0].password == req.body.pass) {
                res.status(200).send("welcome");
                connection.query('UPDATE users SET status = "true" WHERE id = ?', rows[0].id,
                    function (err) {
                        if (err) throw err;
                    }
                );
            } else {
                res.status(200).send("wrong password");
            }
        } else {
            res.status(200).send("wrong login");
        }

    });
});
app.post('/logout', function (req, res) {
    connection.query('UPDATE users SET status = "false" WHERE login = ?', req.body.login,
        function (err) {
            if (err) throw err;
        }
    );
    res.sendStatus(200);
});
app.post('/item-edit/:id', function (req, res) {
    connection.query('UPDATE items SET name = ?, price = ?, src = ? WHERE id = ?',
        [req.body.name, req.body.price, req.body.src, req.params.id],
        function (err) {
            if (err) throw err;
            console.log('item update id: ' + req.params.id);
        }
    );
    res.sendStatus(200);
});
app.delete('/item/:id', function (req, res) {
    connection.query('DELETE FROM items WHERE id = ?',req.params.id, function (err) {
            if (err) throw err;
            console.log('item delete id: ' + req.body.id);
        }
    );
    res.sendStatus(200);
});
app.post('/login', function (req, res) {
    connection.query('INSERT INTO users SET ?', req.body,
        function (err, result) {
            if (err) throw err;
            console.log('user added to database with id: ' + result.insertId);
        }
    );
    res.sendStatus(200);
});
app.post('/images', upload.any(), function (req, res, next) {
    var file = req.files;
    sender.sendMail({
        attachments: [
            {
                filename: file[0].originalname,
                path: __dirname + (path.sep) + file[0].path
            }
        ],
        to: 'chajkovskyj.roman@gmail.com', 
        from: 'Chajkovskyj Roman :)',
        subject: 'Hello',
        text: 'Good day!',
	
    }, function (err, info) {
        if (err) throw err;
        console.log('Sent!');
    })
    res.sendStatus(200);
})
app.post('/send-mail', upload.any(), function (req, res, next) {
    loadTemplate('send-mail', req.body).then((results) => {
        return Promise.all(results.map((result) => {
         sendEmail({
                to: 'chajkovskyj.roman@gmail.com',
                from: 'Chajkovskyj Roman :)',
                subject: result.email.subject,
                html: result.email.html,
                text: result.email.text,
            });
        }));
    }).then(() => {
        console.log('Sent!');
    });
    res.sendStatus(200);
});
app.post('/testtwilio', function (req, res) {
    clientTwilio.messages.create({
            body: req.body.code,
            to: req.body.number,
            from: '+18135512549'
        })
        .then((message) => console.log(message.sid));
    res.sendStatus(200);
});
app.post('/remind', function (req, res) {
    connection.query('SELECT * FROM users  WHERE mail = ?', req.body.mail, function (err, rows) {
        if (err) throw err;
        if (rows[0] != undefined) {
            loadTemplate('forget-password', rows).then((results) => {
                return Promise.all(results.map((result) => {
                    sendEmail({
                        to: req.body.mail,
                        from: 'Localhost',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                res.status(200).send("Sent password!");
            });
        } else {
            res.status(200).send("This mail is not register");
        }
    });
});
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
http.listen(port, function(err){
	if (err) throw err;
  console.log('Server start on port 8000!');
});