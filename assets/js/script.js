var MSAPIKey = '71dcc5160836657f52acf194332c63da'
var sBtn = $('#submit')
sBtn.click(pullHData)
var tArea = $('#tickerSearch')
tArea.submit(pullHData)
ticker = tArea.val()

function pullHData(ticker) {//This function only pulls historical data only from 2020-20-28
    var qDated = "http://api.marketstack.com/v1/eod/2020-02-28?access_key=" + MSAPIKey + "&symbols=" + ticker
    fetch(qDated,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        console.log(data)
    })
}
