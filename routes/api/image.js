const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const util = require('util');
const moment = require('moment');
const md5 = require('md5');
const sha1 = require('sha1');
const fs = require('fs');
const path = require('path');
const { json } = require('body-parser');
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
});

router.post('/base', async function (req, res) {
    let array_img = [];
    await req.body.forEach((element,index) => {
        // array_img.push(index);
        let file = path.join(__dirname, '..', '..', '/assets/image/' + element);
        var imageAsBase64 = fs.readFileSync(file, 'base64');
        array_img.push(imageAsBase64);
    });
    res.send(array_img);
});

router.post('/get', async function (req, res) {
    let sql = await query("SELECT * FROM member_evidence WHERE member_id ='" + req.body.member_id+ "'")
    res.json(sql);
});

module.exports = router;