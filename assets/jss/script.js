// HTML Variables
var sportsLines = document.querySelector(".sports-lines"); // Table for the daily games
var baseball = document.getElementById("baseball"); // Baseball button 
var basketball = document.getElementById("basketball");
var hockey = document.getElementById("hockey");
var tableBody = document.getElementById("table-body");
var sportsBody = document.getElementById("sports-body");
var standingsBody = document.getElementById("standings-body");
var pureButtons = document.getElementById("menu");
var betModal = document.querySelectorAll(".btnBet");
var closeBtn = document.getElementById("close");
var modal = document.getElementById("sports-modal");
var hOdds = document.getElementById("home-odds");
var aOdds = document.getElementById("away-odds");
var awayLine = document.getElementById("away-line");
var homeLine = document.getElementById("home-line");
var homeOver = document.getElementById("home-over");
var awayOver = document.getElementById("away-over");
var lineBet = document.getElementById("line-bet");
var oddsBet = document.getElementById("odds-bet");
var overBet = document.getElementById("over-bet");
var todaysGames = document.getElementById("todays-games");
var lineWinAmt = document.getElementById("line-win-amt");
var oddsWinAmt = document.getElementById("odds-win-amt");
var overWinAmt = document.getElementById("over-win-amt");
var saveBets = document.getElementById("saveBets");
var noLine = document.getElementById("no-line");
var noOdds = document.getElementById("no-odds");
var noOver = document.getElementById("no-over");
var btnHistory = document.getElementById("history");
var historyBody = document.getElementById("history-body");

// API Variables
var baseballEndpoint = "https://v1.baseball.api-sports.io/";
var baseballLeague = 1; // USA - MLB 
var basketballEndpoint = "https://v1.basketball.api-sports.io/" 
var basketballLeague = 12; //USA -NBA = 12
var awayOdds = 0; // Used to calculate implied odds.
var homeOdds = 0;
var oddsCheck = ""; // Checking to see if odds exists, for error handling.
var homeTeam = "";
var awayTeam = "";
var homePath = ""; // Path to home team logo
var awayPath = ""; 
var newsApI = "https://newsapi.org/v2/top-headlines?country=us&category=sports&q=" // move the key to the header, pass in the q parameter for the correct sport.
var d = new Date();
var n = d.getTimezoneOffset(); // UTC Time offset in minutes
var today = new Date();
var whichSport = "";
var gameID = ""; // For local storage.

// Table variables


function getGames(league){

  while(tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.firstChild);
   }

   var nbaLogo = "./assets/images/nba_logo.png";
   var mlbLogo ="./assets/images/mlb_logo.png";
   var nhlLogo = "./assets/images/nhl_logo.png";

  fetch("https://sportspage-feeds.p.rapidapi.com/games", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "240a6eaf5bmsh4610582965166aep1cf272jsn2dbabae7c8b6",
		"x-rapidapi-host": "sportspage-feeds.p.rapidapi.com"
	}
})
.then(response => {
  return response.json();
})
.then(data => {
  console.log(data);

for(i=0; i<data.games;++i) {
  var td0 = document.createElement("td");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");
  var td6 = document.createElement("td");
  var td7 = document.createElement("td");
  var td8 = document.createElement("td");
  var td9 = document.createElement("td");
  var btnBet = document.createElement("button");
  var icon = document.createElement("i");
  
  var tr = document.createElement("tr");

  

  if(data.results[i].status == "scheduled" && data.results[i].details.league == league) {

    var gameDate = moment(data.results[i].schedule.date,"YYYY-MM-DD hh:mm:ss").format("h:mm A") // Convert time with moment.js
    var localTime = moment.utc(gameDate, "h:mm A");
    
      if(data.results[i].odds[0].spread.current.away === "undefined") {
        console.log("We have an error")
      }
    

    td0.textContent = localTime.local().format("h:mm A");
    tr.appendChild(td0);
    td1.textContent = data.results[i].teams.away.abbreviation;
    td1.setAttribute("data-team",data.results[i].teams.away.team); // Store the team for logo search
    tr.appendChild(td1);
    td2.textContent = data.results[i].odds[0].spread.current.away;

    awayOdds = data.results[i].odds[0].spread.current.awayOdds;
    tr.appendChild(td2);
    
    // Calculate the implied odds for the away team to win
      if(awayOdds < 0) {
        awayOdds = ((-(awayOdds))/(-(awayOdds) + 100)) * 100
      } else {
        awayOdds = (100 /(awayOdds + 100)) * 100;
      }
    td8.textContent = awayOdds.toFixed(1) + "%";
    tr.appendChild(td8);

    td3.textContent = data.results[i].odds[0].spread.current.awayOdds
    tr.appendChild(td3);
    td4.textContent = data.results[i].teams.home.abbreviation;
    td4.setAttribute("data-team",data.results[i].teams.home.team);

    tr.appendChild(td4);
    td5.textContent = data.results[i].odds[0].spread.current.home;
    tr.appendChild(td5);
    homeOdds = data.results[i].odds[0].spread.current.homeOdds;
       // Calculate the implied odds for the home team to win
       if(homeOdds < 0) {
        homeOdds = ((-(homeOdds))/(-(homeOdds) + 100)) * 100
        
      } else {
        homeOdds = (100 /(homeOdds + 100)) * 100;
      }
    td9.textContent = homeOdds.toFixed(1) + "%";
    tr.appendChild(td9);

    td6.textContent = data.results[i].odds[0].spread.current.homeOdds
    tr.appendChild(td6);
    td7.textContent = data.results[i].odds[0].total.current.total;
    tr.appendChild(td7);
    btnBet.classList.add("btnBet");
    btnBet.setAttribute("data-value", data.results[i].gameId);
    icon.classList.add("fas", "fa-money-bill-wave");
    btnBet.appendChild(icon);
    tr.appendChild(btnBet);
    tableBody.appendChild(tr);
  
  }
    // Place the current league and current date above the schedule. 

  today = moment();
  todaysGames.textContent = league + " - " + today.format("M" + "/" + "DD" + "/" + "YYYY");
}

})
.catch(err => {
  console.log(err);
});
 
}

function getHockey(params){

   // Remove the rows from the table body
   while(standingsBody.hasChildNodes()) {
    standingsBody.removeChild(standingsBody.firstChild);
   }

  fetch("https://v1.hockey.api-sports.io/standings?" + params, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "v1.hockey.api-sports.io",
      "x-rapidapi-key": "bba734bc1176a744b30c79275368582f"
    }
  })
  
.then(response => {
	console.log(response);
  return response.json();
})
.then(result => {
  console.log(result);
  for (i=0; i<result.response[0].length; i++) {
   
      var td0 = document.createElement("td");
      var td1 = document.createElement("td");
      var td2 = document.createElement("td");
      var td3 = document.createElement("td");
      var td4 = document.createElement("td");
      var tdHead = document.createElement("td");
      var row1 = document.createElement("tr");
      var row2 = document.createElement("tr");
      var img = document.createElement("img");

    // See if this is a new division by checking if the team is in position 1
    if(result.response[0][i].position == 1){
      tdHead.setAttribute("colspan",6)
      tdHead.classList.add("center");
      tdHead.textContent = result.response[0][i].group.name;
      row2.appendChild(tdHead);
      standingsBody.appendChild(row2);
    }
    
    img.setAttribute("src",result.response[0][i].team.logo)
    row1.appendChild(img);
    td0.textContent=result.response[0][i].team.name
    row1.appendChild(td0)
    td1.textContent= result.response[0][i].position
    row1.appendChild(td1)
    td2.textContent= result.response[0][i].games.win.total
    row1.appendChild(td2)
    td3.textContent= result.response[0][i].games.lose.total
    row1.appendChild(td3)
    td4.textContent= result.response[0][i].games.win.percentage
    row1.appendChild(td4)
    standingsBody.appendChild(row1)
  }
})

  .catch(err => {
    console.log(err);
  });

}

function getBasketball(endpoint,params){

  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "bba734bc1176a744b30c79275368582f");
  myHeaders.append("x-rapidapi-host", "v1.basketball.api-sports.io");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  // Remove the rows from the table body
  while(standingsBody.hasChildNodes()) {
    standingsBody.removeChild(standingsBody.firstChild);
  }

  fetch(basketballEndpoint + endpoint + "/?" + params,requestOptions) 
    .then(response => {
	  return response.json();
  })
  .then(result => {
    console.log(result);
    if(endpoint == "standings") {
      for (i=0; i<result.response[0].length; i++) {
        if (result.response[0][i].group.name !== "Western Conference" && result.response[0][i].group.name !== "Eastern Conference") {

          var td0 = document.createElement("td");
          var td1 = document.createElement("td");
          var td2 = document.createElement("td");
          var td3 = document.createElement("td");
          var td4 = document.createElement("td");
          var tdHead = document.createElement("td");
          var row1 = document.createElement("tr");
          var row2 = document.createElement("tr");
          var img = document.createElement("img");

        // See if this is a new division by checking if the team is in position 1
        if(result.response[0][i].position == 1){
          tdHead.setAttribute("colspan",6)
          tdHead.classList.add("center");
          tdHead.textContent = result.response[0][i].group.name;
          row2.appendChild(tdHead);
          standingsBody.appendChild(row2);
        }
        
        img.setAttribute("src",result.response[0][i].team.logo)
        row1.appendChild(img);
        td0.textContent=result.response[0][i].team.name
        row1.appendChild(td0)
        td1.textContent= result.response[0][i].position
        row1.appendChild(td1)
        td2.textContent= result.response[0][i].games.win.total
        row1.appendChild(td2)
        td3.textContent= result.response[0][i].games.lose.total
        row1.appendChild(td3)
        td4.textContent= result.response[0][i].games.win.percentage
        row1.appendChild(td4)
        standingsBody.appendChild(row1)
        }
    }
  }
  })
    .catch(err => {
  	console.log(err);
  });

}


function getBaseball(endpoint,params) {
  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "bba734bc1176a744b30c79275368582f");
  myHeaders.append("x-rapidapi-host", "v1.baseball.api-sports.io");

  var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
 
   // Remove the rows from the table body
   while(standingsBody.hasChildNodes()) {
    standingsBody.removeChild(standingsBody.firstChild);
  }

  fetch(baseballEndpoint + endpoint + "/?" + params, requestOptions)
    .then(response => {
      return response.json();
    })
    .then(result => { 
      console.log(result);
      if(endpoint == "standings") {
          for (i=0; i<result.response[0].length; i++) {
            if (result.response[0][i].group.name !== "American League" && result.response[0][i].group.name !== "National League") {

            var td0 = document.createElement("td");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            var td4 = document.createElement("td");
            var row1 = document.createElement("tr");
            var img = document.createElement("img");
            var row2 = document.createElement("tr");
            var tdHead = document.createElement("td");

            if(result.response[0][i].position == 1){
              tdHead.setAttribute("colspan",6)
              tdHead.classList.add("center");
              tdHead.textContent = result.response[0][i].group.name;
              img.setAttribute("src",result.response[0][i].league.logo)
              tdHead.appendChild(img);
              row2.appendChild(tdHead);
              standingsBody.appendChild(row2);
            }

            img.setAttribute("src",result.response[0][i].team.logo)
            row1.appendChild(img);
            td0.textContent=result.response[0][i].team.name
            row1.appendChild(td0)
            td1.textContent= result.response[0][i].position
            row1.appendChild(td1)
            td2.textContent= result.response[0][i].games.win.total
            row1.appendChild(td2)
            td3.textContent= result.response[0][i].games.lose.total
            row1.appendChild(td3)
            td4.textContent= result.response[0][i].games.win.percentage
            row1.appendChild(td4)
            standingsBody.appendChild(row1)
          }
        }
      }


    })
    .catch(error => console.log('error', error));
}

function baseballData(){
  whichSport = "MLB";
  getGames(whichSport); 
  getBaseball("standings", "season=2021&stage=MLB - Regular Season&league=1"); // Get the data for the MLB teams. 
}
function basketballData() {
  whichSport = "NBA"
  getGames(whichSport);
  getBasketball("standings", "season=2020-2021&league=12")
}
function hockeyData() {
  whichSport = "NHL";
  getGames(whichSport);
  getHockey("season=2020&league=57");
}

function openModal(e) {
    // Find the team logos to display in the betting form.    
    modal.style.display = "block";
}


// Event listeners
sportsBody.addEventListener("click", function(e){
 
  switch(e.target.name) {
    case "line":
      if(e.target.value =="line-no-bet") {
        lineBet.disabled = true;
      } else {
        lineBet.disabled = false;
        lineBet.value = "";
        lineWinAmt.textContent = "";
        lineBet.focus();
      }
      break;

    case "odds":
      if(e.target.value =="odds-no-bet") {
        oddsBet.disabled = true;
      } else {
        oddsBet.disabled = false;
        oddsBet.value = "";
        oddsWinAmt.textContent = "";
        oddsBet.focus();
      }
      break;

    case "over":
      if(e.target.value =="over-no-bet") {
        overBet.disabled = true;
      } else {
        overBet.disabled = false;
        overBet.value = "";
        overWinAmt.textContent = "";
        overBet.focus();
      }
      break;
  }
})

function updateBets(e){
  var amount = 0;
  console.log(e.target)
  switch (e.target.name) {
    case "odds":
      if(aOdds.checked){
        amount = parseInt(aOdds.value,10);
      }
      if(hOdds.checked){
        amount = parseInt(hOdds.value,10);
      }
      if(amount < 0){
        oddsWinAmt.textContent = parseFloat((100 * oddsBet.value)/(-(amount))).toFixed(2);
      } else {
        oddsWinAmt.textContent = parseFloat((amount * oddsBet.value)/(100)).toFixed(2);
      }

    case "line":
      if(awayLine.checked) {
        amount = parseInt(awayLine.value,10);
        lineWinAmt.textContent = parseFloat(lineBet.value);
      }
      if(homeLine.checked) {
        amount = parseInt(homeLine.value,10);
         lineWinAmt.textContent = parseFloat(lineBet.value);
      }
     
    case "over":
      if(awayOver.checked) {
        amount = parseInt(awayOver.value,10);
        overWinAmt.textContent = parseFloat(overBet.value);
      }
      if(homeOver.checked) {
        amount = parseInt(homeOver.value,10);  
        overWinAmt.textContent = parseFloat(overBet.value);
      }
     
  }
}
// Update the potential winnings based on the amount bet. 
oddsBet.addEventListener("change", updateBets);
lineBet.addEventListener("change", updateBets);
overBet.addEventListener("change", updateBets);

// Event listeners for pulling in the games and standings. 
baseball.addEventListener("click", function() {
  baseballData(); 
});
basketball.addEventListener("click", function() {
  basketballData();
});
hockey.addEventListener("click", function() {
  hockeyData();
});

// Open the bet window based on the button clicked for a specific game. 
tableBody.addEventListener("click", openModal)

closeBtn.addEventListener("click",function(){
  modal.style.display = "none";
});

  // Save all of the bet information to local storage. 
saveBets.addEventListener("click", function() {
  // Loop through the 3 radio groups to see if a bet was taken
  var l = document.getElementsByName("line")
  var line = "";
  var odds = "";
  var over = "";
  var lineDollars = 0;
  var oddsDollars = 0;
  var overDollars = 0;
  var lineWin = 0;
  var oddsWin = 0;
  var overWin = 0;
  var linePick = "";
  var oddsPick = "";
  var overPick = "";

  for(i=0;i<l.length; i++){
    if(l[i].checked) {
      line = parseFloat(l[i].value);
      lineDollars = parseFloat(lineBet.value);
      // 2 is for no bet. 
      if(i !=2){ 
        lineWin = parseFloat(lineWinAmt.textContent).toFixed(2);
        if(i==0) {
          // The home Team was picked (Get the team abbreviation)
          linePick = document.getElementById("home-team").innerHTML
        } else {
          // The away Team was picked
          linePick = document.getElementById("away-team").innerHTML
        }
      }
    }
  }

  l = document.getElementsByName("odds")
  for(i=0;i<l.length; i++){
    if(l[i].checked) {
      odds = parseFloat(l[i].value);
      oddsDollars = parseFloat(oddsBet.value);
      if(i!=2) {
        oddsWin = parseFloat(oddsWinAmt.textContent).toFixed(2);
        if(i==0) {
          oddsPick = document.getElementById("home-team").innerHTML
        } else {
          oddsPick = document.getElementById("away-team").innerHTML
        }
      }
    }
  }

  l = document.getElementsByName("over")
  for(i=0;i<l.length; i++){
    if(l[i].checked) {
      over = parseFloat(l[i].value);
      overDollars = parseFloat(overBet.value);
      if(i!=2){
        overWin = parseFloat(overWinAmt.textContent).toFixed(2);
        if(i==0) {
          overPick = "Over";
        } else {
          overPick = "Under";
        }
      }
    }
  }

  var bets =  {
    date: today.format("M" + "/" + "DD" + "/" + "YYYY"),
    sport: whichSport, 
    id: gameID,
    home: homeTeam,
    away: awayTeam,
    line: line,
    lineAmt: lineDollars,
    lineToWin: parseFloat(lineWin),
    linePick: linePick,
    odds: odds,
    oddsAmt: oddsDollars,
    oddsToWin: parseFloat(oddsWin),
    oddsPick: oddsPick,
    over: over,
    overAmt: overDollars,
    overToWin: parseFloat(overWin),
    overPick: overPick
};

var a = []; // Empty array to hold the localstorage objects

// Parse the data back into an array of objects. 
a = JSON.parse(localStorage.getItem("bets")) || [];
a.push(bets); // Push in the new data. 

// Serialize the data array back to a string and store it in local storage. 
localStorage.setItem("bets", JSON.stringify(a));
// Close the bet form. 
modal.style.display = "none";
// Update the history
getHistory();
})


function getHistory(){
  var history = JSON.parse(localStorage.getItem("bets")) || [];

  if(history !== null) {
    console.log(history);
    for(i=0; i < history.length; i++) {
      var tdLeague = document.createElement("td");
      var tdDate = document.createElement("td");
      var tdHome = document.createElement("td");
      var tdAway = document.createElement("td");
      var tdType = document.createElement("td");
      var tdAmt = document.createElement("td");
      var tdWin = document.createElement("td");
      var tdTeam = document.createElement("td");
      var tdLine = document.createElement("td");
      var tdOdds = document.createElement("td");
      var tdOver = document.createElement("td");
      var trRow = document.createElement("tr");
      tdLeague.textContent = history[i].sport;
      tdDate.textContent = history[i].date;
      tdHome.textContent = history[i].home;
      tdAway.textContent = history[i].away;
      // populate the line bet if it exists
      if(history[i].lineToWin !=="" && history[i].lineToWin >0) {
        tdType.textContent = "Line";
        tdAmt.textContent = history[i].lineAmt;
        tdWin.textContent = history[i].lineToWin;
        tdTeam.textContent = history[i].linePick;
        tdLine.textContent = history[i].line;
        tdOdds.textContent = "";
        tdOver.textContent = "";
        trRow.appendChild(tdLeague);
        trRow.appendChild(tdDate);
        trRow.appendChild(tdHome);
        trRow.appendChild(tdAway);
        trRow.appendChild(tdType);
        trRow.appendChild(tdAmt);
        trRow.appendChild(tdWin);
        trRow.appendChild(tdTeam);
        trRow.appendChild(tdLine);
        trRow.appendChild(tdOdds);
        trRow.appendChild(tdOver);
        historyBody.appendChild(trRow);
      }
    }
  }
  getOdds();
}
function getOdds() {
  var history = JSON.parse(localStorage.getItem("bets")) || [];
  if(history !== null) {
    console.log(history);
    for(i=0; i < history.length; i++) {
      var tdLeague = document.createElement("td");
      var tdDate = document.createElement("td");
      var tdHome = document.createElement("td");
      var tdAway = document.createElement("td");
      var tdType = document.createElement("td");
      var tdAmt = document.createElement("td");
      var tdWin = document.createElement("td");
      var tdTeam = document.createElement("td");
      var tdLine = document.createElement("td");
      var tdOdds = document.createElement("td");
      var tdOver = document.createElement("td");
      var trRow = document.createElement("tr");
   
      tdLeague.textContent = history[i].sport;
      tdDate.textContent = history[i].date;
      tdHome.textContent = history[i].home;
      tdAway.textContent = history[i].away;

      if(history[i].oddsToWin !=="" && history[i].oddsToWin >0) {
        tdType.textContent = "Odds";
        tdAmt.textContent = history[i].oddsAmt;
        tdWin.textContent = history[i].oddsToWin;
        tdTeam.textContent = history[i].oddsPick;
        tdLine.textContent = "";
        tdOdds.textContent = history[i].odds;
        tdOver.textContent = "";
        trRow.appendChild(tdLeague);
        trRow.appendChild(tdDate);
        trRow.appendChild(tdHome);
        trRow.appendChild(tdAway);
        trRow.appendChild(tdType);
        trRow.appendChild(tdAmt);
        trRow.appendChild(tdWin);
        trRow.appendChild(tdTeam);
        trRow.appendChild(tdLine);
        trRow.appendChild(tdOdds);
        trRow.appendChild(tdOver);
        historyBody.appendChild(trRow);
      }
    }
  }
  getOver();
}
function getOver() {
  var history = JSON.parse(localStorage.getItem("bets")) || [];
  if(history !== null) {
    console.log(history);
    for(i=0; i < history.length; i++) {
      var tdLeague = document.createElement("td");
      var tdDate = document.createElement("td");
      var tdHome = document.createElement("td");
      var tdAway = document.createElement("td");
      var tdType = document.createElement("td");
      var tdAmt = document.createElement("td");
      var tdWin = document.createElement("td");
      var tdTeam = document.createElement("td");
      var tdLine = document.createElement("td");
      var tdOdds = document.createElement("td");
      var tdOver = document.createElement("td");
      var trRow = document.createElement("tr");
   
      tdLeague.textContent = history[i].sport;
      tdDate.textContent = history[i].date;
      tdHome.textContent = history[i].home;
      tdAway.textContent = history[i].away;

      if(history[i].overToWin !=="" && history[i].overToWin >0) {
        tdType.textContent = "Over/Under";
        tdAmt.textContent = history[i].overAmt;
        tdWin.textContent = history[i].overToWin;
        tdTeam.textContent = history[i].overPick;
        tdLine.textContent = "";
        tdOdds.textContent = "";
        tdOver.textContent = history[i].over;
        trRow.appendChild(tdLeague);
        trRow.appendChild(tdDate);
        trRow.appendChild(tdHome);
        trRow.appendChild(tdAway);
        trRow.appendChild(tdType);
        trRow.appendChild(tdAmt);
        trRow.appendChild(tdWin);
        trRow.appendChild(tdTeam);
        trRow.appendChild(tdLine);
        trRow.appendChild(tdOdds);
        trRow.appendChild(tdOver);
        historyBody.appendChild(trRow);
      }
    }
  } 
}

btnHistory.addEventListener("click", getHistory);

sportsLines.addEventListener("click", function(e){
  var rowNum = e.target.parentElement; // Gets the button of the clicked fontawesome image
  var tableRow = rowNum.parentElement.rowIndex; // Gets the row of the button, so we can access column data.

  document.getElementById("h-odds").innerHTML = tableBody.childNodes[tableRow -1].childNodes[8].textContent;
  hOdds.setAttribute("value",tableBody.childNodes[tableRow -1].childNodes[8].textContent);

  document.getElementById("h-line").innerHTML = tableBody.childNodes[tableRow -1].childNodes[6].textContent;
  homeLine.setAttribute("value",tableBody.childNodes[tableRow -1].childNodes[6].textContent);

  document.getElementById("h-prob").innerHTML = tableBody.childNodes[tableRow -1].childNodes[7].textContent;

  document.getElementById("h-over").innerHTML = tableBody.childNodes[tableRow -1].childNodes[9].textContent;
  homeOver.setAttribute("value", tableBody.childNodes[tableRow -1].childNodes[9].textContent);

  document.getElementById("a-odds").innerHTML = tableBody.childNodes[tableRow -1].childNodes[4].textContent;
  aOdds.setAttribute("value",tableBody.childNodes[tableRow -1].childNodes[4].textContent);

  document.getElementById("a-line").innerHTML = tableBody.childNodes[tableRow -1].childNodes[2].textContent;
  awayLine.setAttribute("value",tableBody.childNodes[tableRow -1].childNodes[2].textContent);

  document.getElementById("a-prob").innerHTML = tableBody.childNodes[tableRow -1].childNodes[3].textContent;

  document.getElementById("a-over").innerHTML = "-" + tableBody.childNodes[tableRow -1].childNodes[9].textContent;
  awayOver.setAttribute("value",tableBody.childNodes[tableRow -1].childNodes[9].textContent);

  document.getElementById("home-team").innerHTML = tableBody.childNodes[tableRow -1].childNodes[5].textContent;
  document.getElementById("away-team").innerHTML = tableBody.childNodes[tableRow -1].childNodes[1].textContent;
  homeTeam = tableBody.childNodes[tableRow -1].childNodes[5].textContent;
  awayTeam = tableBody.childNodes[tableRow -1].childNodes[1].textContent;
  
  gameID =  e.target.parentElement.getAttribute("data-value");

  // Clear any previous values from the betting form. 
  lineBet.value = "";
  overBet.value = "";
  oddsBet.value = "";
  lineWinAmt.textContent = "";
  oddsWinAmt.textContent = "";
  overWinAmt.textContent = "";
  noLine.checked = true;
  noOdds.checked = true;
  noOver.checked = true;
 
})
