var MSAPIKey = '71dcc5160836657f52acf194332c63da'
var ticker = "AAPL,MSFT"

    
    var qDated = "http://api.marketstack.com/v1/eod/latest?access_key=" + MSAPIKey + "&data_from=2020-02-27&symbols=" + ticker

    fetch(qDated,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        console.log(data)
    })
