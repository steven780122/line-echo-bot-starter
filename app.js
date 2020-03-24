let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

const CHANNEL_ACCESS_TOKEN = 'jOSh1xYx8zKhL2YMsJXEt3exRfchGPZteORJeycEWOmYJXpqTpGYjQLv/cpMSmwHQgWKo+Mi5ysHv1TAisMRc4lnLEmQqFrAMSIam6+2i44WH8YUmywCcJypz/hsU5fFSbBRpPHXrIG6dBLymuNvzAdB04t89/1O/w1cDnyilFU='
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// handler receiving messages
app.post('/', function (req, res) {         // 當有人post request來的時候，就把他的body印出來
    console.log(JSON.stringify(req.body, null, 2));    //  中間是要放那些字元要被replace調， 2是排版用的(2個tab)
    // console.log(req.body);      // 如果用此，會發現有的只會呈現Object，要看就要用上面的方法JSON.stringify
    
    let replyToken = req.body.events[0].replyToken
    let text = req.body.events[0].message.text
    if (text){              // 若收到貼圖不處理(當然也可以寫)
        sendMessage(replyToken, text)
    }
    res.send();    //可回傳空字串即可
    
})

// generic function sending messages
// 回傳訊息:
function sendMessage(replyToken, text) {
    let body = {
        replyToken: replyToken,  // 可以縮寫為replyToken (key value同的時候)
        messages: [{
            type: 'text',
            text: text + " Hank TEST..",   // 可以縮寫為text，此即
        }],
    };

    let options = {
        url: 'https://api.line.me/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body,
        json: true,
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
