const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const util = require('util');
const moment = require('moment');
const md5 = require('md5');
const sha1 = require('sha1');
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
})
router.post('/', async function(req, res) {
    let img = req.files;
    banner = req.body.banner,
        image_name = {};
    for (const [key, value] of Object.entries(img)) {
        await value.mv('./assets/image/media/banner/' + key + '-' + '-' + req.body.author + value.name);
        image_name[key] = key + '-' + '-' + req.body.author + value.name;
        await query("INSERT INTO media (" +
            "type," +
            "img_name" +
            ")" +
            " VALUES(" +
            "1," +
            "'" + image_name[key] + "'" +
            ")",
            async(err, result) => {
                let newbanner = await query("INSERT INTO banner (type,author,ref_id) VALUES(" +
                    req.body.type + "," +
                    "'" + req.body.author + "'," +
                    result.insertId + ")"
                )
                if (newbanner) {
                    res.json('success');
                }
            }
        );
    }
});
router.get('/read', async function(req, res) {
    let sql = await query("SELECT banner.*,media.img_name,media.created_date FROM banner join media ON banner.ref_id = media.id AND media.type =1");
    res.json(sql);
});

router.post('/update', async function(req, res) {
    let img = req.files ? req.files : '';
    banner = req.body.banner,
        image_name = {};
    if (img != '') {
        for (const [key, value] of Object.entries(img)) {
            await value.mv('./assets/image/media/banner/' + key + '-' + '-' + req.body.author + value.name);
            image_name[key] = key + '-' + '-' + req.body.author + value.name;
            await query("UPDATE media SET " +
                "img_name ='" + image_name[key] + " WHERE id =" + req.body.ref_id,

                async(err, result) => {
                    let newbanner = await query("UPDATE banner SET  type=" + req.body.type + ", author ='" + req.body.author + "' WHERE ref_id =" + req.body.ref_id);
                    if (newbanner) {
                        res.json('success');
                    }
                }
            );
        }
    } else {
        image_name = req.body.img_name
        await query("UPDATE media SET " +
            "img_name ='" + image_name + " WHERE id =" + req.body.ref_id,

            async(err, result) => {
                let newbanner = await query("UPDATE banner SET  type=" + req.body.type + ", author ='" + req.body.author + "' WHERE ref_id =" + req.body.ref_id);
                if (newbanner) {
                    res.json('success');
                }
            }
        );
    }
});

router.post('/delete', async function(req, res) {
    // res.send(req.body);
    let sql = await query("DELETE media,banner FROM banner join media ON banner.ref_id = media.id WHERE banner.ref_id=" + req.body.ref_id);
    if (sql) {
        res.json('success');
    }
});

module.exports = router;