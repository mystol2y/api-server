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
router.post('/', async function (req, res) {
    let type,
        title,
        body,
        author,
        timestamp,
        img_name,
        img,
        description
    let sql = await query("INSERT INTO events (" +
        "title," +
        "body," +
        "author," +
        "publish," +
        "event_time," +
        "created_at," +
        "updated_at," +
        "type)" +
        "VALUES(" +
        "'" + gender + "'," +
        "'" + firstname + "'," +
        "'" + lastname + "'," +
        "" + age + "," +
        "'" + b_date + "'," +
        "'" + b_date + "'," +
        "'" + married + "'" +
        ")", async (err, result) => {
            for (const [key, value] of Object.entries(img)) {
                await value.mv('./assets/image/media/events-' + key + '-' + formatedate + '.jpg');
                image_name[key] = 'events-' + key + '-' + formatedate + '.jpg';
                await query("INSERT INTO media (" +
                    "type," +
                    "img_name," +
                    "description," +
                    "created_date," +
                    "title," +
                    "ref_id," +
                    ")" +
                    "VALUES(" +
                    "2," +
                    "'" + key + "'," +
                    "'" + image_name[key] + "'," +
                    "'" + create_date + "'," +
                    "" +
                    "'events" + result.insertId + "'" +
                    ")"
                );
            }
        }
    );
});
router.post('/update', async function (req, res) {
    let type,
        title,
        body,
        author,
        timestamp,
        img_name,
        img,
        description
    let sql = await query("UPDATE events SET " +
        "title ='" + gender + "'," +
        "body='" + gender + "'," +
        "author='" + gender + "'," +
        "publish='" + gender + "'," +
        "event_time='" + gender + "'," +
        "created_at='" + gender + "'," +
        "updated_at='" + gender + "'," +
        "type='" + gender + "' " +
        "WHERE id =" + gender + "",
        async (err, result) => {

        }
    );
    for (const [key, value] of Object.entries(img)) {
        await value.mv('./assets/image/media/events-' + key + '-' + formatedate + '.jpg');
        image_name[key] = 'events-' + key + '-' + formatedate + '.jpg';
        await query("UPDATE media SET  (" +
            "type ='" + gender + "'," +
            "img_name='" + gender + "'," +
            "description='" + gender + "'," +
            "created_date='" + gender + "'," +
            "title='" + gender + "'," +
            "ref_id='" + gender + "'," +
            "WHERE id =" + gender + "",
        );
    }
});
router.get('/read', async function (req, res) {
    let sql = await query("SELECT * FROM benefits WHERE publish =1")
    res.json(sql)
});


module.exports = router;