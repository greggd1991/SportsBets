// HTML Variables
var sportsLines = document.querySelector(".sports-lines"); // Table for the daily games
var baseball = document.getElementById("baseball"); // Baseball button 
var basketball = document.getElementById("basketball");
var hockey = document.getElementById("hockey");
var tableBody = document.getElementById("table-body");


// API Variables
var baseballEndpoint = "https://v1.baseball.api-sports.io/";
var baseballLeague = 1; // USA - MLB 
var baseballTeams = [

];

var homePath = "" // Path to home team logo
var awayPath = "" 

function getGames(){
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
  // console.log(data);
  // // Access data from the objects. 

  // console.log(data.games); // Total games - or we can use data.results.length

  // console.log("Game ID: "  + data.results[0].gameId); // needed for other calls.
  // console.log("Game Status: " + data.results[0].status); 
  // console.log("Summary: " + data.results[0].summary); 
  // console.log("Last Updated: " + data.results[0].lastUpdated); 
  // console.log("League: " + data.results[0].details.league); // season, seasonType // needed for other calls (league)
  // console.log("Away: " + data.results[0].teams.away.team); //abbreviation, conference, division, location, mascot
  // console.log("Home: " +  data.results[0].teams.home.team); //abbreviation, conference, division, location, mascot

  // console.log("Schedule Date/Time: " + data.results[0].schedule.date);

  // console.log("Venue City: " + data.results[0].venue.city);
  // console.log("Venue: " + data.results[0].venue.name);
  // console.log("Neutral Site: " + data.results[0].venue.neutralSite);
  // console.log("Venue State: " + data.results[0].venue.state);

  // console.log("Away Spread Current: " +  data.results[0].odds[0].spread.current.away);
  // console.log("Home Spread Current: " + data.results[0].odds[0].spread.current.home);
  // console.log("Away Odds Current: " + data.results[0].odds[0].spread.current.awayOdds);
  // console.log("Home Odds Current: " + data.results[0].odds[0].spread.current.homeOdds);

  // console.log("Away Spread Open: " + data.results[0].odds[0].spread.open.away);
  // console.log("Home Spread Open: " + data.results[0].odds[0].spread.open.home);
  // console.log("Away Odds Open: " + data.results[0].odds[0].spread.open.awayOdds);
  // console.log("Home Odds Open: " + data.results[0].odds[0].spread.open.homeOdds);

  // console.log("Total Over Odds Open: " + data.results[0].odds[0].total.open.overOdds);
  // console.log("Total Under Odds Open: " + data.results[0].odds[0].total.open.underOdds);
  // console.log("Total Open: " + data.results[0].odds[0].total.open.total);

  // console.log("Total Over Odds Current: " + data.results[0].odds[0].total.current.overOdds);
  // console.log("Total Under Odds Current: " + data.results[0].odds[0].total.current.underOdds);
  // console.log("Total Current: " + data.results[0].odds[0].total.current.total);

  // console.log("Moneyline Away Odds Current: " + data.results[0].odds[0].moneyline.current.awayOdds);
  // console.log("Moneyline Home Odds Current: " + data.results[0].odds[0].moneyline.current.homeOdds);

  // console.log("Moneyline Away Odds Open: " + data.results[0].odds[0].moneyline.open.awayOdds);
  // console.log("Moneyline Home Odds Open: " + data.results[0].odds[0].moneyline.open.homeOdds);


for(i=0; i<data.games;++i) {
  var td0 = document.createElement("td");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");
  var td6 = document.createElement("td");
  var td7 = document.createElement("td");
  
  var tr = document.createElement("tr");

  if(data.results[i].status == "scheduled" && data.results[i].details.league == "MLB") {
    td0.textContent = data.results[i].gameId;
    tr.appendChild(td0);
    td1.textContent = data.results[i].teams.away.abbreviation;
    tr.appendChild(td1);
    td2.textContent = data.results[i].odds[0].spread.current.away;
    tr.appendChild(td2);
    td3.textContent = data.results[i].odds[0].moneyline.current.awayOdds
    tr.appendChild(td3);
    td4.textContent = data.results[i].teams.home.abbreviation;
    tr.appendChild(td4);
    td5.textContent = data.results[i].odds[0].spread.current.home;
    tr.appendChild(td5);
    td6.textContent = data.results[i].odds[0].moneyline.current.homeOdds
    tr.appendChild(td6);
    td7.textContent = data.results[i].odds[0].total.current.total;
    tr.appendChild(td7);
    tableBody.appendChild(tr);
  }
}



})
.catch(err => {
	console.error(err);
 
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

  fetch(baseballEndpoint + endpoint + "/?" + params, requestOptions)
    .then(response => {
      return response.json();
    })
    .then(result => { 
      console.log(result);
      if(endpoint == "teams") {

      }
  
      // console.log(result.response.length);
      // console.log(result.response[121].game.teams.away.name); // home.name
      // console.log(result.response[121].game.teams.away.logo); // home.logo
      // console.log(result.response[121].game.id); // Needed for other api calls
      // console.log(result.response[121].game.status.long); // status.short - Not Started (NS) Finished (FT) etc... 1
      // console.log(result.response[121].bookmakers[0].bets[0].name); //Over/Under etc....Don't need this.
      // console.log(result.response[121].bookmakers[0].bets[0].values[0].odd); //Over/Under odds or Home/Away odds 
      // console.log(result.response[121].bookmakers[0].bets[0].values[0].value); //Over/Under value

      // var date = result.response[121].game.date;
      // console.log(date.toString());
      // console.log(date.substring(0,10)); // Date portion of the game
      // console.log(result.response[121].game.time); // Convert both of these with moment.js


    })
    .catch(error => console.log('error', error));
}

function baseballData(){
  // getGames(); //Commented out for now while working on other data. 
  
  getBaseball("standings", "season=2021&stage=MLB - Regular Season&league=1") // Get the data for the MLB teams. 
 

}

// Event listeners
baseball.addEventListener("click", function() {
  baseballData(); 
  
})
