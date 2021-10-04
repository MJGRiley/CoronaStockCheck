var MSAPIKey = '71dcc5160836657f52acf194332c63da'
var companyN = document.getElementById('companyName')
var cData = []
var histData = []
var nData = []
var yData = []
var form = $('#tickerForm')
var tArea = $('#tickerSearch')
var stockTag = document.getElementById('tickerSymbol')
var yearHigh
var yearLow
form.submit(dataSpy)
var defaultTick = 'SPY'
var searchHistoryArray = []
var watchlist = $('#history')
var q1ATH = document.getElementById("Q12020")
var cPrice = document.getElementById('currentPrice')
var yearHighs = document.getElementById('allTH')
var yearLows = document.getElementById('allTL')
var vol = document.getElementById('volume')
var dataOne
var secondToLastClose
var dollarChange;
var perChange;
var compName;
var secondToLastClose;
var clearWatchList = $('#clear')


//TODO: issue 26
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


function dataSpy(event) {//This function prevents the tArea from clearing on submit and starts the first API pull
    event.preventDefault()
    pullData(tArea.val().toUpperCase())
}

function pullData(stock) {//This first pull checks for an error and gets latest daily market info from end of day endpoint if no error
    var error = false //please forgive us for leaving off 1 letter
    var qCurrent = "https://api.marketstack.com/v1/eod/latest?access_key=" + MSAPIKey + "&symbols=" + stock
    fetch(qCurrent, {
        cache: 'reload',
    })
    .then(function (res) {
        if (res.ok==false) {error = true}
        return res.json()
    })
    .then(function (data) {
        if (error) {
            errorModal(data)
            return
        }
        pullNData(stock)
        pullHData(stock)
        pullYTDData(stock)
        cData = data
        console.log(cData)
        searchHistory(stock)
        localStorage.setItem('cData', JSON.stringify(data))
    })
}

function pullNData(stock) {//This API pull gets the company name data from the tickers endpoint
    var qNData = "https://api.marketstack.com/v1/tickers?access_key=" + MSAPIKey + "&symbols=" + stock
    fetch(qNData, {
        cache: 'reload',
    })
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            nData = data
            localStorage.setItem('nData', JSON.stringify(data))
        })
}

function pullHData(stock) { //This APi pull gets the historical data from Jan 01 2020 - Apr 01 2020
    //This is the same endpoint as the first pull but with dates specified in the query URL
    var qHData = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=2020-01-01&date_to=2020-04-01&symbols=" + stock
    fetch(qHData, {
        cache: 'reload',
    })
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            histData = data
            localStorage.setItem('hData', JSON.stringify(data))
            q1High();
        })
}

function pullYTDData(stock) {//This API pull gets the 52 week high and low
    var stockHigh = []      //the API only delivers 100 items in the object
    var stockLow = []       //so I had to make the API pull 3 times and put them all together
    var tempArr = []
    var qYTD1 = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=" + moment().subtract(143, 'days').format().substring(0, 10) + "&date_to=" + moment().format().substring(0, 10) + "&symbols=" + stock
    var qYTD2 = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=" + moment().subtract(289, 'days').format().substring(0, 10) + "&date_to=" + moment().subtract(143, 'days').format().substring(0, 10) + "&symbols=" + stock
    var qYTD3 = "https://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=" + moment().subtract(365, 'days').format().substring(0, 10) + "&date_to=" + moment().subtract(289, 'days').format().substring(0, 10) + "&symbols=" + stock
    fetch(qYTD1, {
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        var dataOne = data.data
        secondToLastClose = data.data[1].close  // gets second to last close for watchlist % 
        console.log(secondToLastClose)
        fetch(qYTD2, {
            cache: 'reload',
        })
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            var dataTwo = $.merge(dataOne, data.data)
            console.log(dataTwo)
                fetch(qYTD3, {
                cache: 'reload',
                })
                .then(function (res) {
                    return res.json()
                })
                .then(function (data) {
                    var dataThree = data.data
                    tempArr = $.merge(dataTwo, dataThree)
                    console.log(tempArr)
                    console.log(tempArr.length)
                    for (i = 0; i < tempArr.length; i++) {
                        stockHigh.push(tempArr[i].high)
                        stockLow.push(tempArr[i].low)
                    }
                    console.log(stockHigh)
                    console.log(stockLow)
                    displayHighLow(stockHigh, stockLow)
                        })
                })
        })
}

function displayHighLow(stockHigh, stockLow) {
    stockHigh.sort((a, b) => b - a)
    stockLow.sort((a, b) => a - b)
    yearHigh = stockHigh[0]
    yearLow = stockLow[0]
    yearHighs.textContent = '$' + yearHigh; //need variable for year high
    yearLows.textContent = '$' + yearLow;
}

function errorModal(res) { //This displays a modal if something invalid is put in the search box
    $('.modal-title').text("Invalid Entry")
    $('.modal-body').children().text(res.error.message)
    $('.btn-secondary').click( function() {
        $('.modal').hide()
    })
    $('.modal').show()
}

// CHART .JS ///

// DATA
var stars = [0, 0]; //y-axis VALUES. need a function to pull Q1 2020 stock high
var frameworks = ['Q1 2020 High', 'Today']; /// x-axis LABELS


if (this.compChart) this.compChart.destroy(); //needed to repopulate chart
var chart = document.getElementById('compChart'); 
//Creation of new chart with various customization options.
var compChart = new Chart(chart, {
    type: 'bar',
    data: {
        labels: frameworks,
        datasets: [{
            label: "Q1 2020 High vs. Current Price",
            data: stars,
            backgroundColor: 'rgba(53, 164, 159, 0.65)', 
            borderColor: '#ffffa', 
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
        }]
    },
    options: {
        scales: {
            x: {
                grid: {
                    display: false,
                }
            },
            y: {
                grid: {
                    display: false
                }
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Q1 2020 Stock Valuation vs. Current Stock Valuation',
                padding: {
                    top: 10,
                    bottom: 10
                },
                font: {
                    size: 20
                },
            },
            legend: {
                display: false
            },
        },
    },
    style: {
        backgroundColor: 'rgba(0,0,0,0.0)'
    },
});


//Function to find the Q1 High of a ticker. Function also updates data of the bar chart. 
function q1High() {
    var histDataArr = []
    var histDates = [];
    for (i = 0; i < 63; i++) {
        histDataArr[i] = histData.data[i].close
        histDates[i] = histData.data[i].date
    }
    let highIndex = histDataArr.indexOf(Math.max(...histDataArr));
    highValue = histDataArr[highIndex];
    highDate = histDates[highIndex];
    const dateFix = highDate.split("T");
    highDate = dateFix[0]
    currentClose = cData.data[0].close
    stars = [highValue, currentClose]; //updates Q1 high graph vs current price when ticker is entered. 
    compChart.data.datasets[0].data = stars;
    compChart.data.labels = ['Q1 2020 High on ' + highDate, 'Today'];
    compChart.update();
    updateInfo();
}


//When the document loads, show AAPL stock data as the default. 
$(document).ready(function () {pullData('AAPL')})

clearWatchList.on('click', function () {
    localStorage.clear();
    searchHistoryArray = []
    history.clear()
    searchHistory()
})

function searchHistory(stock) {
    if (searchHistoryArray.includes(stock)) { return }
    searchHistoryArray.push(stock)
    var history = document.createElement("p");
    var secondHistory= document.createElement("p");
    history.append(stock)
    history.setAttribute("class", "watchListChild")
    $('#history').append(history)
}

$(document).on('click', ".watchListChild", function () {
    pullData($(this).text())
})

clearWatchList.on('click', function () {
    localStorage.clear();
    searchHistoryArray = []
    history.clear()
    searchHistory()
})
//Function to update chart as well as ticker data. The current value bar of the chart will turn green if higher than Q1 High and red otherwise. 
function updateInfo() {
    q1ATH.textContent = '$' + highValue;
    cPrice.textContent = '$' + currentClose;
    volume = cData.data[0].volume;
    abbreviateNumber(volume);
    vol.textContent = volume + ' shares traded at last business day';
    companyN.textContent = nData.data[0].name;
    compSymbol = nData.data[0].symbol;
    stockTag.textContent = compSymbol;
    
    if (stars[0] > stars[1]) {
        compChart.data.datasets[0].backgroundColor = ['rgba(53, 164, 159, 0.65)', 'rgba(255, 0, 0, 1)'];
        compChart.update();
    }
    else {
        compChart.data.datasets[0].backgroundColor = ['rgba(53, 164, 159, 0.65)', 'rgb(0,128,0)'];
        compChart.update();
    }
}

//Function to turn long share volume number pulled from API into an abbreviation. 
function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b", "t"];
        var suffixNum = Math.floor(("" + value).length / 3);
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
        newValue = shortValue + suffixes[suffixNum];
    }
    volume = newValue;
    return newValue;
}

