var MSAPIKey = '71dcc5160836657f52acf194332c63da'
var sBtn = $('#submit')
sBtn.click(pullData)
var tArea = $('#tickerSearch')
//console.log(tArea)
tArea.submit(pullData)

ticker = tArea.val()
function pullData() {
    console.log(tArea.val())
}

function pullHData(ticker) {
    var qDated = "http://api.marketstack.com/v1/eod?access_key=" + MSAPIKey + "&date_from=2020-01-01&date_to=2020-04-01&symbols=" + ticker
    fetch(qDated,{
        cache: 'reload',
    })
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        console.log(data)
        return data
    })
}
// CHART .JS ///

// DATA
var stars = [135850, 52122]; //y-axis VALUES. need a function to pull Q1 2020 stock low
var frameworks = ['COVID-19 Crash', 'Today']; /// x-axis LABELS

var chart = document.getElementById('compChart');

//creating the BAR chart.
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

function q1Low () {



}

