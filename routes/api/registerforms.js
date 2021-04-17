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
    // res.json('ss')
    let img = req.files;
    gender = req.body.gender,
        firstname = req.body.firstname,
        lastname = req.body.lastname,
        username = req.body.username,
        password = md5(md5(sha1(req.body.password))),
        plain_password = req.body.password,
        age = req.body.age,
        b_date = moment(new Date(req.body.b_date)).format('Y-MM-DD'),
        married = req.body.married,
        address = req.body.address,
        commercial_affairs = req.body.commercial_affairs,
        commercial_type = req.body.commercial_type,
        commercial_address = req.body.commercial_address,
        phone = req.body.phone,
        mobile = req.body.mobile,
        member_type = req.body.member_type,
        managing_partner = req.body.managing_partner,
        create_date = formatedate,
        expired_date = moment(date).add(1, 'year').format('Y-MM-DD H:m:ss'),
        image_name = {},
        member_id = md5(username + password);
    for (const [key, value] of Object.entries(img)) {
        await value.mv('./assets/image/' + username + '-' + key + '-' + year + '.jpg');
        image_name[key] = username + '-' + key + '-' + year + '.jpg';
        await query("INSERT INTO member_evidence (" +
            "member_id," +
            "img_name," +
            "img," +
            "created_date," +
            "status," +
            "description" +
            ")" +
            "VALUES(" +
            "'" + member_id + "'," +
            "'" + key + "'," +
            "'" + image_name[key] + "'," +
            "'" + create_date + "'," +
            "0," +
            "'')"
        );
    }
    let new_member = await query("INSERT INTO member (" +
        "gender," +
        "firstname," +
        "lastname," +
        "age," +
        "b_date," +
        "married," +
        "address," +
        "commercial_affairs," +
        "commercial_type," +
        "commercial_address," +
        "phone," +
        "mobile," +
        "member_type," +
        "managing_partner," +
        "created_date," +
        "expired_date," +
        "username," +
        "password," +
        "plain_password," +
        "member_id," +
        "status)" +
        "VALUES(" +
        "'" + gender + "'," +
        "'" + firstname + "'," +
        "'" + lastname + "'," +
        "" + age + "," +
        "'" + b_date + "'," +
        "'" + married + "'," +
        "'" + address + "'," +
        "'" + commercial_affairs + "'," +
        "'" + commercial_type + "'," +
        "'" + commercial_address + "'," +
        "'" + phone + "'," +
        "'" + mobile + "'," +
        "'" + member_type + "'," +
        "'" + managing_partner + "'," +
        "'" + create_date + "'," +
        "'" + expired_date + "'," +
        "'" + username + "'," +
        "'" + password + "'," +
        "'" + plain_password + "'," +
        "'" + member_id + "'," +
        "0)"
    );
    // res.send();
    if (new_member) {
        res.json('success');
        res.json(address)
    }

});

router.post('/update', async function(req, res) {

    // res.json('ss')
    if (req.body.member) {
        let img = req.files;
        let member = await JSON.parse(req.body.member),
            gender = member.gender,
            firstname = member.firstname,
            lastname = member.lastname,
            username = member.username,
            password = md5(md5(sha1(member.plain_password))),
            plain_password = member.plain_password,
            age = member.age,
            b_date = moment(new Date(member.b_date)).format('Y-MM-DD'),
            married = member.married,
            address = JSON.stringify(member.address),
            commercial_affairs = member.commercial_affairs,
            commercial_type = member.commercial_type,
            commercial_address = member.commercial_address,
            phone = member.phone,
            mobile = member.mobile,
            member_type = member.member_type,
            managing_partner = JSON.stringify(member.managing_partner),
            create_date = formatedate,
            expired_date = moment(date).add(1, 'year').format('Y-MM-DD H:m:ss'),
            image_name = {},
            member_id = member.member_id;
        if (img)
        // console.log('asd');
            for (const [key, value] of Object.entries(img)) {
            await value.mv('./assets/image/' + username + '-' + key + '-' + year + '.jpg');
            image_name[key] = username + '-' + key + '-' + year + '.jpg';
            await query("UPDATE member_evidence SET " +
                "img = '" +
                image_name[key] + "', " +
                "status = 0 " +
                " WHERE member_id='" + member_id + "'" +
                " AND img_name='" +
                key + "'"
            );
        }
        let new_member = await query("UPDATE member SET " +
            "gender ='" + gender + "'," +
            "firstname ='" + firstname + "'," +
            "lastname ='" + lastname + "'," +
            "age =" + age + "," +
            "b_date ='" + b_date + "'," +
            "married ='" + married + "'," +
            "address ='" + address + "'," +
            "commercial_affairs ='" + commercial_affairs + "'," +
            "commercial_type ='" + commercial_type + "'," +
            "commercial_address ='" + commercial_address + "'," +
            "phone ='" + phone + "'," +
            "mobile ='" + mobile + "'," +
            "member_type ='" + member_type + "'," +
            "managing_partner ='" + managing_partner + "'," +
            "username ='" + username + "'," +
            "password ='" + password + "'," +
            "plain_password ='" + plain_password + "'" +
            "WHERE member_id='" + member_id + "'"
        );
        if (new_member) {
            res.json('success');
        }
    } else {
        let
            image_name = {},
            img = req.files,
            member_id = req.body.member_id,
            username = req.body.username;

        for (const [key, value] of Object.entries(img)) {
            await value.mv('./assets/image/' + username + '-' + key + '-' + year + '.jpg');
            image_name[key] = username + '-' + key + '-' + year + '.jpg';
            await query("UPDATE member_evidence SET " +
                "img = '" +
                image_name[key] + "', " +
                "status = 0 " +
                " WHERE member_id='" + member_id + "'" +
                " AND img_name='" +
                key + "'"
            );
            // res.send("UPDATE member_evidence SET " +
            //     "img = '" +
            //     image_name[key] + "', " +
            //     "status = 0 " +
            //     " WHERE member_id='" + member_id + "'");

        }
        // console.log(req.files)
        res.json('success');
    }
});

router.post('/statusimgsave', async function(req, res) {
    let suc;

    for (let i = 0; i < req.body.image_name.length; i++) {

        let new_member = await query("UPDATE member_evidence SET " +
            "status=" + req.body.image_name[i].status + "," +
            "description ='" + req.body.image_name[i].des + "' " +
            "WHERE member_id='" + req.body.member_id + "' " +
            "AND img='" + req.body.image_name[i].name + "'"
        );
        // res.json("UPDATE member_evidence SET " +
        // "status=" + req.body.image_name[i].status + "," +
        // "description ='" + req.body.image_name[i].des + "' " +
        // "WHERE member_id='" + req.body.member_id +"'");
    }
    if (req.body.image_name[0].status == 1 && req.body.image_name[1].status == 1 && req.body.image_name[2].status == 1 && req.body.image_name[3].status == 1 && req.body.image_name[4].status == 1)
        await query("UPDATE member SET " +
            "status = 1" +
            " WHERE member_id='" + req.body.member_id + "'"
        );
    res.json('success');
});
router.post('/renew', async function(req, res) {
    let img = req.files;
    id_card = req.body.id_card,
        image_name = {}
    for (const [key, value] of Object.entries(img)) {
        await value.mv('./assets/image/' + username + '-' + key + '-' + year + '.jpg');
        image_name[key] = username + '-' + key + '-' + year + '.jpg';
    }
    let new_member = await query("INSERT INTO member (" +
        "id_card_img," +
        // "profile_img," +
        "slip_img)" +
        "VALUES(" +
        "'" + image_name.id_card_img + "'," +
        // "'" + image_name.profile_img + "'," +
        "'" + image_name.slip_img + "')"
    );
    if (new_member) {
        res.json('success');
    }

});
router.get('/check', async function(req, res) {
    let sql = await query("SELECT * FROM member");
    res.json(sql);
});
router.get('/regis_today', async function(req, res) {
    let sql = await query("SELECT * FROM member WHERE DATE_FORMAT(created_date, \"%Y-%m-%d\") = '" + year + "'");
    res.json(sql);
});
router.get('/fee', async function(req, res) {
    let sql = await query("SELECT * FROM member WHERE status = 1");
    res.json(sql);
});
router.get('/expire_soon', async function(req, res) {
    let sql = await query("SELECT * FROM member WHERE expired_date BETWEEN '" + moment(date).format('Y-MM-DD H:m:ss') + "' AND '" + moment(date).add(3, 'month').format('Y-MM-DD H:m:ss') + "' AND status =1");
    res.json(sql);
});
router.post('/delete', async function(req, res) {
    // res.send(req.body);
    let sql = await query("DELETE member,member_evidence FROM member join member_evidence ON member.member_id = member_evidence.member_id WHERE member.member_id='" + req.body.member_id + "'");
    if (sql) {
        res.json('success');
    }
});

module.exports = router;