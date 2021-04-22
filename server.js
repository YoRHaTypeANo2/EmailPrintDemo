const path = require('path');
const fs = require('fs');
const express = require('express');
// const webpack = require('webpack');
const nodemailer = require("nodemailer");
// 加载body-parser 处理post提交过来的数据
const bodyParser = require('body-parser');

let app = express();
let apiRoutes = express.Router();

app.use('/', express.static('./dist'));
// bodyParser 设置,自动会在req上面添加
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({ limit:'100mb', extended: true }));
apiRoutes.post('/email', function(req, res) {
    console.info('req', req.body.files, req.body.filename);
    let base64img = req.body.files[0];
    let base64cut = base64img.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
    let imgName = req.body.filename;
    let text = '图片的base64格式码：'+base64img;
    let dataBuffer = Buffer.from(base64cut, 'base64');
    // const allowExtname = ['png', 'jpg', 'jpeg', 'webp', 'bmp'];//支持的图片格式
    // 获取扩展名
    // let extname = '';
    // let filterResult = allowExtname.filter( item => {
    //     return base64img.includes(item)
    // });
    // extname = '.' + filterResult[0];

    // 指定存放文件夹
    let targetPath = path.resolve(__dirname, './public');

    // 写入图片
    fs.writeFileSync(`${targetPath}/${imgName}`, dataBuffer, function(err){
        if(err) return
        console.log('图片保存');
    })
    if (req.body.files) {
        res.json({
            iRet: 1,
            info: 'ok',
        });
        // Use Smtp Protocol to send Email
        let transporter = nodemailer.createTransport({
            //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
            service: 'qq',
            port: 587, // SMTP 端口
            secure: false,
            // secureConnection: true, // 使用 SSL
            auth: {
                user: 'xxxxxx@qq.com',
                //这里密码不是qq密码，是你设置的smtp密码
                pass: 'xxxxxx'
            }
        });
        // setup e-mail data with unicode symbols
        let mailOptions = {
            to: 'xxxxxx',
            from: 'xxxx', // 这里的from和 上面的user 账号一样的
            subject: 'PrintJob', // 标题
            text: text, // 内容
            attachments:[
                {
                    filename : imgName,
                    path : `./public/${imgName}`
                }
            ] 
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('邮件发送: ' + info.response);
            transporter.close();
        });

    } else {
        res.json({
            iRet: -1,
            info: 'error',
        });
        return;
    }
});
app.use('/api', apiRoutes);
app.listen(8081, function() {
    console.info('邮箱服务器已启动', 'localhost:8081');
})