var MSAPIKey = '71dcc5160836657f52acf194332c63da'
var cName
var cData = []
var histData = []
var nData = []
var yData = []
var form = $('#tickerForm')
var tArea = $('#tickerSearch')
form.submit(dataSpy)

//TODO: issue #26 
//These are all the ids on the HTML page to link the information to
//(<span id="tickerSymbol">APPL</span>)
//<span id="companyName">Apple</span>
//id="Q12020">Insert Q1 All Time High Stock Price Here </p>
//id="currentPrice">Insert Current Stock Price Here</p>
//<li>52 Week High: id="allTH"<span></span></li>
//<li>52 Week Low: id="allTL"<span></span></li>
//<li>Volume: id="volume"<span></span></li>
//<li>Open: id="open"<span></span></li>
//<li>Close: id="Close"<span></span></li>


function dataSpy(event) {
    event.preventDefault()
    // need something here to detect and return out of this function if user has input something other than a stock ticker eg: number, string, more?
    // also a modal pop up to alert the user TODO: issue #34
    pullData(tArea.val())
    pullNData(tArea.val())
    pullHData(tArea.val())
    pullYTDData(tArea.val())
}

function pullData(stock) {//This first pull gets current daily market info, not real time data also sets the date and calls YTD Data 
    var qCurrent =  "http://api.marketstack.com/v1/eod/latest?access_key=" + MSAPIKey + "&symbols=" + stock
    fetch(qCurrent,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        cData = data
        console.log(data)
        localStorage.setItem('cData',JSON.stringify(data))
    })
}

function pullNData(stock) {//This API pull gets the company name data 
    var qNData = "https://api.marketstack.com/v1/tickers?access_key=" + MSAPIKey + "&symbols=" + stock 
    fetch(qNData,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        nData = data
        console.log(data)
        localStorage.setItem('nData',JSON.stringify(data))
    })
}

function pullHData(stock) { //This APi pull gets the historical data from Jan 01 2020 - Apr 01 2020
    var qHData = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=2020-01-01&date_to=2020-04-01&symbols=" + stock
    fetch(qHData,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        histData = data
        console.log(data)
        localStorage.setItem('hData',JSON.stringify(data))
        q1High();
    })
}

function pullYTDData(stock) {//This API pull gets the 52 week high and low
    var stockHigh = []
    var stockLow = []
    var tempArr = []
    var qYTD1 = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=" + moment().subtract(143,'days').format().substring(0,10) + "&date_to=" + moment().format().substring(0,10) + "&symbols=" + stock
    var qYTD2 = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=" + moment().subtract(289,'days').format().substring(0,10) + "&date_to=" + moment().subtract(143,'days').format().substring(0,10) + "&symbols=" + stock
    var qYTD3 = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=" + moment().subtract(365,'days').format().substring(0,10) + "&date_to=" + moment().subtract(289,'days').format().substring(0,10) + "&symbols=" + stock
    fetch(qYTD1,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        var dataOne = data.data
        console.log(tempArr)
        fetch(qYTD2,{
            cache: 'reload',
        })
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            var dataTwo = $.merge(dataOne,data.data)
            console.log(dataTwo)
            fetch(qYTD3,{
                cache: 'reload',
            })
            .then(function (res) {
                return res.json()
            })
            .then(function (data) {
                var dataThree = data.data
                tempArr = $.merge(dataTwo,dataThree)
                console.log(tempArr)
                for(i=0;i<tempArr.length;i++){
                    console.log(typeof(tempArr))
                    console.log(i)
                    stockHigh[i] = tempArr[i].high
                    stockLow[i] = tempArr[i].low
                    console.log(stockHigh)
                    console.log(stockLow)
                }
            })
        })
    })
}
// CHART .JS ///

// DATA
var stars = [135850, 52122]; //y-axis VALUES. need a function to pull Q1 2020 stock high
var frameworks = ['Q1 2020 High', 'Today']; /// x-axis LABELS


//creating the BAR chart.
if (this.compChart) this.compChart.destroy();
var chart = document.getElementById('compChart');

var compChart = new Chart(chart, {
    type: 'bar',
    data: {
        labels: frameworks,
        datasets: [{ 
            label: "Coronavirus Stock Valuation vs. Current",
            data: stars
        }]

    }
 }
) 

//need a function to go thru API output object and pull Q1 2020 lowest close for a particular ticker.
//function will: take ticker input -> use input to call API data -> index thru API data to create array of closing prices between 1/1/2020 - 4/1/2020 ->
// use a method to get the lowest close value and the index of that value in the array. use index to get date of that closing value.
// make an object/array to pull dates (text content for graph) between the Q1/2020 time range from
//pull most recent stock close from API for other bar. most recent instead of today because user may use this app on a fed holiday or weekend
//import data into compChart
//"tickerSearch" is input ID



function q1High () {
 //var keys = Object.keys(hData)
 // create array of all closes
 var histDataArr =[];
 var histDates = [];
    for (i =0; i < 63 ; i++){
        histDataArr[i] = histData.data[i].close
        histDates[i] = histData.data[i].date
    }
    let high = histDataArr.indexOf(Math.max(...histDataArr));
}