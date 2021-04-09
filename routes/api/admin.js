const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const util = require('util');
const moment = require('moment');
const md5 = require('md5');
const sha1 = require('sha1');
const { json } = require('body-parser');
const { use } = require('./benefits');
const con = mysql.createPool({
    host: '207.148.79.76',
    user: 'huayhubexpress',
    password: 'Oa0c4!g8',
    database: 'huayhubexpress'
});
const query = util.promisify(con.query).bind(con);
let date = new Date();
let formatedate = moment(date).format('Y-MM-DD H:m:ss');
let year = moment(date).format('Y-MM-DD');

con.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (connection) connection.release()

    return
})
router.post('/login', async function(req, res) {
    let username = req.body.username,
        password = req.body.password,
        plainpassword = md5(md5(sha1(password)));
    // res.send(req.body);
    let sql = await query("SELECT * FROM admin WHERE username ='" + username + "' AND plain_password='" + plainpassword + "'");
    if (sql != '' || sql != null) {
        res.json(sql);
    }
});
router.get('/read', async function(req, res) {
    let sql = await query("SELECT * FROM admin ");
    if (sql != '' || sql != null) {
        res.json(sql);
    }
});
router.post('/', async function(req, res) {
    let username = req.body.username,
        // password = md5(md5(sha1(req.body.password)));
        password = req.body.password,
        plainpassword = md5(md5(sha1(password)))

    // res.send(req.body);
    let sql = await query("INSERT INTO admin (username,password,plain_password) VALUES('" +
        username + "','" +
        password + "','" +
        plainpassword + "')");
    if (sql != '' || sql != null) {
        res.json(sql);
    }
});
router.post('/update', async function(req, res) {
    let username = req.body.username,
        // password = md5(md5(sha1(req.body.password)));
        password = req.body.password,
        plainpassword = md5(md5(sha1(password))),
        id = req.body.id;

    // res.send(req.body);
    let sql = await query("UPDATE admin SET username ='" + username + "', password='" + password + "',plain_password ='" + plainpassword + "' WHERE id=" + id);
    if (sql != '' || sql != null) {
        res.json(sql);
    }
});
router.post('/delete', async function(req, res) {
    let id = req.body.id;
    // res.send(req.body);
    let sql = await query("DELETE FROM admin WHERE id =" + id);
    if (sql != '' || sql != null) {
        res.json(sql);
    }
});

module.exports = router;