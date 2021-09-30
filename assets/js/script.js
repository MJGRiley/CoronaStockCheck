var MSAPIKey = '71dcc5160836657f52acf194332c63da'
var today
var cName
var cData = []
var histData = []
var nData = []
var yData = []
var form = $('#tickerForm')
var tArea = $('#tickerSearch')
var histData
var submitbtn = $('#submitbtn')
var searchHistory = [];
var watchlist = $('#watchlistresults')
form.submit(dataSpy)

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
    // also a modal pop up to alert the user
    pullData(tArea.val())
    pullNData(tArea.val())
    pullHData(tArea.val())
    //pullYTDData is nested in pullData because we need today's date to work with
}

function pullData(stock) {
    var qCurrent =  "http://api.marketstack.com/v1/eod/latest?access_key=" + MSAPIKey + "&symbols=" + stock
    fetch(qCurrent,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        console.log(data)
        cData = data
        today = data.data[0].date
        pullYTDData(today,stock)
        localStorage.setItem('cData',JSON.stringify(data))
    })
}

function pullNData(stock) {
    var qYTD = "https://api.marketstack.com/v1/tickers?access_key=" + MSAPIKey + "&symbols=" + stock 
    console.log(qYTD)
    fetch(qYTD,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        nData = data
        localStorage.setItem('nData',JSON.stringify(data))
    })
}

function pullHData(stock) {
    var qHData = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=2020-01-01&date_to=2020-04-01&symbols=" + stock
    fetch(qHData,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        console.log(data)
        histData = data
        localStorage.setItem('hData',JSON.stringify(data))
        q1High();
    })
}

function pullYTDData(today,stock) {
    //"&date_from=" + (today.substring(0,4)-1) + today.substring(4,10) + "&date_to=" + today.substring(0,10) + 
    var qDates = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=" + (today.substring(0,4)-1) + today.substring(4,10) + "&date_to=" + today.substring(0,10) + "&symbols=" + stock
    console.log(qDates)
    fetch(qDates,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        localStorage.setItem('ytdData',JSON.stringify(data))
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
//"tickersearch" is input ID



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


// Watchlist Function
//Pulling History from local storage if there is any
function getHistory () {

    form.submit (function() {
    var search = tArea.value
    pullData (search);
    pullHData (search);
    searchHistory.push(search);
    localStorage.setItem("historicalsearch",JSON.stringify(searchHistory));
    searchHistory();
})

function searchHistory () {
    watchlist.innerHTML = "";
    for ( var i=0; i <searchHistory.length; i++ ) {
        var history = document.createElement("input");
        history.setAttribute("type",text)
        history.setAttribute("value", searchHistory[i] )
        history.addEventListener("click",function() {  
            pullData(history.value);
            pullHData(history.value);
        })
        watchlist.append(history);
    }

}
}
console.log(getHistory())
}
