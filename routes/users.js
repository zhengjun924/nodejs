const express = require('express');
const crypto = require('crypto');
const mysql = require('../service/service');

const router = express.Router();
// router.use(req=>{
//     console.log(33232)
// })
function selcetSql(name, param, res) {
    if (param) {
        let sql = `SELECT * FROM userinfo WHERE ${name}='${param}'`;
        mysql.query(sql, (err, result, fileds) => {
            if (!err && result == '') {
                res.sendStatus(200);
            } else if (result != '') {
                res.send('已存在');
            } else if (err) {
                res.send('发生错误');
            }
        });
    }
}

/* 用户 */
router.post('/register/user', (req, res) => {
    if (req.body.name && req.body.name != '') {
        let name = req.body.name;
        selcetSql('name', name, res);
    } else {
        res.send('');
    }
});

/* 手机号 */
router.post('/register/phone', (req, res) => {
    if (req.body.phone && req.body.phone != '') {
        let phone = req.body.phone;
        selcetSql('phone', phone, res);
    } else {
        res.send('');
    }
});

/* email */
router.post('/register/email', (req, res) => {
    if (req.body.email && req.body.email != '') {
        let email = req.body.email.toString();
        selcetSql('email', email, res);
    } else {
        res.send('');
    }
});

/*注册 */
router.post('/register', (req, res) => {
    if (req.body.name != '' && req.body.password != '' && req.body.phone != '' && req.body.email != '') {
        let name = req.body.name;
        let password = crypto.createHash('md5').update(req.body.password).digest('hex');
        let phone = req.body.phone;
        let email = req.body.email.toString();
        let sql = `SELECT * FROM userinfo WHERE name='${name}' AND phone='${phone}' AND email='${email}'`;
        mysql.query(sql, (err, result, fileds) => {
            if (result == '') {
                let sql = `INSERT INTO userinfo (name,password,phone,email) VALUES('${name}','${password}','${phone}','${email}')`;
                mysql.query(sql, (err, result) => {
                    if (!err) {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.send('注册失败');
            }
        });
    } else {
        res.sendStatus(404);
    }
});

/* 登录 */
router.post('/login', (req, res) => {
    if (req.body.userName && req.body.password) {
        let name = req.body.userName;
        req.session.name = name;
        let password = crypto.createHash('md5').update(req.body.password).digest('hex');
        let sql = `SELECT * FROM userinfo WHERE name='${name}' AND password='${password}'`;
        mysql.query(sql, (err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;