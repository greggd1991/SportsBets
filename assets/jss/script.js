// HTML Variables
var sportsLines = document.querySelector(".sports-lines"); // Table for the daily games
var baseball = document.getElementById("baseball"); // Baseball button 
var basketball = document.getElementById("basketball");
var hockey = document.getElementById("hockey");
var tableBody = document.getElementById("table-body");
var standingsBody = document.getElementById("standings-body");
var pureButtons = document.getElementById("menu");
var betModal = document.querySelectorAll(".btnBet");
var closeBtn = document.getElementById("close");
var modal = document.getElementById("sports-modal");
var homeLine = document.getElementById("home-line");
var homeProb = document.getElementById("home-prob");
var homeOdds = document.getElementById("home-odds");
var homeOver = document.getElementById("home=over");
var awayLine = document.getElementById("away-line");
var awayProb = document.getElementById("away-prob");
var awayOdds = document.getElementById("away-odds");
var awayOver = document.getElementById("away=over");
var hOdds = document.getElementById("h-odds");

// API Variables
var baseballEndpoint = "https://v1.baseball.api-sports.io/";
var baseballLeague = 1; // USA - MLB 
var basketballEndpoint = "https://v1.basketball.api-sports.io/" 
var basketballLeague = 12; //USA -NBA = 12
var awayOdds = 0; // Used to calculate implied odds.
var homeOdds = 0;
var oddsCheck = "" // Checking to see if odds exists, for error handliing.
var homePath = "" // Path to home team logo
var awayPath = "" 
var newsApI = "https://newsapi.org/v2/top-headlines?country=us&category=sports&q=" // move the key to the header, pass in the q parameter for the correct sport.
var d = new Date();
var n = d.getTimezoneOffset(); // UTC Time offset in minutes

// function getNews(league, key) {
 

//   fetch(newsApI + league +"&apiKey=" + key, {
//     "method": "GET",
//     "headers": {
//       "x-Api-Key": "78705e69cb074d36b2bb222b9501638a",
//       "Access-Control-Allow-Origin": "*", 
//       "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With" //,
//       // "x-api-host": "newsapi.org"
//     }

//     }
//   })
//   .then(response => {
//     return response.json();
//   })
//   .then(data => {
//       console.log(data);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// }
// // Test news api
// getNews("NBA", "78705e69cb074d36b2bb222b9501638a");

function getGames(league){

  while(tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.firstChild);
   }

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
  getGames("MLB"); 
  getBaseball("standings", "season=2021&stage=MLB - Regular Season&league=1"); // Get the data for the MLB teams. 
}
function basketballData() {
  getGames("NBA");
  getBasketball("standings", "season=2020-2021&league=12")
}
function hockeyData() {
  getGames("NHL");
  getHockey("season=2020&league=57");
}

function openModal(e) {
    modal.style.display = "block";
    console.log(e.target);
}

// Event listeners
baseball.addEventListener("click", function() {
  baseballData(); 
});
basketball.addEventListener("click", function() {
  basketballData();
});
hockey.addEventListener("click", function() {
  hockeyData();
});
tableBody.addEventListener("click", openModal)

closeBtn.addEventListener("click",function(){
  modal.style.display = "none";
});

sportsLines.addEventListener("click", function(e){
  var rowNum = e.target.parentElement; // Gets the button of the clicked fontawesome image
  var tableRow = rowNum.parentElement.rowIndex; // Gets the row of the button, so we can access column data.

  document.getElementById("h-odds").innerHTML = tableBody.childNodes[tableRow -1].childNodes[8].textContent;
  document.getElementById("h-line").innerHTML = tableBody.childNodes[tableRow -1].childNodes[6].textContent;
  document.getElementById("h-prob").innerHTML = tableBody.childNodes[tableRow -1].childNodes[7].textContent;
  document.getElementById("h-over").innerHTML = tableBody.childNodes[tableRow -1].childNodes[9].textContent;

  document.getElementById("a-odds").innerHTML = tableBody.childNodes[tableRow -1].childNodes[4].textContent;
  document.getElementById("a-line").innerHTML = tableBody.childNodes[tableRow -1].childNodes[2].textContent;
  document.getElementById("a-prob").innerHTML = tableBody.childNodes[tableRow -1].childNodes[3].textContent;
  document.getElementById("a-over").innerHTML = "-" + tableBody.childNodes[tableRow -1].childNodes[9].textContent;
})

// Add or remove the active class from the buttons. Modify to just check the class
// for all 3 buttons and update accordingly.
// pureButtons.addEventListener("click",function(e) {
//   if(e.target.classList.contains("btn-active")) {
//     e.target.classList.remove("btn-active");
//   } else {
//     e.target.classList.add("btn-active");
//   }
// })