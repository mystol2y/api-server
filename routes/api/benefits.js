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
    let forms = JSON.parse(req.body.forms),
        img = req.files,
        image_name = {},
        title = forms.title,
        body = forms.body,
        author = forms.author,
        publish = forms.publish;
    for (const [key, value] of Object.entries(img)) {
        await value.mv('./assets/image/media/benefits/' + key + '-' + '-' + req.body.author + value.name);
        image_name[key] = key + '-' + '-' + req.body.author + value.name;
        await query("INSERT INTO media (" +
            "type," +
            "img_name" +
            ")" +
            " VALUES(" +
            "4," +
            "'" + image_name[key] + "'" +
            ")",
            async(err, result) => {
                let sql = await query("INSERT INTO benefits (" +
                    "title," +
                    "body," +
                    "author," +
                    "publish," +
                    "ref_id_img" +
                    ")" +
                    "VALUES(" +
                    "'" + title + "'," +
                    "'" + body + "'," +
                    "'" + author + "'," +
                    "'" + publish + "'," +
                    "'" + result.insertId + "'" +
                    ")"
                );
                if (sql)
                    res.json(sql);
            }
        );
    }
});
router.post('/update', async function(req, res) {
    let forms = JSON.parse(req.body.forms),
        img = req.files ? req.files : '',
        image_name = {},
        title = forms.title,
        body = forms.body,
        author = forms.author,
        publish = forms.publish;
    console.log(img);
    // res.send(forms);
    if (img != '') {
        for (const [key, value] of Object.entries(img)) {
            await value.mv('./assets/image/media/benefits/' + key + '-' + '-' + author + value.name);
            image_name[key] = key + '-' + '-' + author + value.name;
            await query("UPDATE media SET " +
                "img_name ='" + image_name[key] + "' WHERE id =" + forms.ref_id_img,
                async(err, result) => {
                    let sql = await query("UPDATE benefits SET " +
                        "title = '" + title + "', " +
                        "body ='" + body + "'," +
                        "author ='" + author + "'," +
                        "publish =" + publish + "" +
                        " WHERE ref_id_img =" + forms.ref_id_img + "");
                    if (sql) {
                        // res.json('success');
                        res.json("UPDATE media SET " +
                            "img_name ='" + image_name[key] + " WHERE id =" + forms.ref_id_img)

                    }
                }
            );
        }
    } else {
        res.send(forms)
        let sql = await query("UPDATE benefits SET " +
            "title ='" + title + "'," +
            "body ='" + body + "'," +
            "author ='" + author + "'," +
            "publish =" + publish + "" +
            " WHERE ref_id_img =" + forms.ref_id_img + ""
        );
        // if (sql)

    }
});
router.post('/delete', async function(req, res) {
    let sql = await query("DELETE media,benefits FROM benefits join media ON benefits.ref_id = media.id WHERE benefits.ref_id_img=" + req.body.id);
    if (sql) {
        res.json('success');
    }
});
router.get('/read', async function(req, res) {
    let sql = await query("SELECT benefits.*,media.img_name,media.created_date FROM benefits join media ON benefits.ref_id_img = media.id AND media.type =4 ");
    res.json(sql);
});


module.exports = router;