// ==UserScript==
// @name         Zedder
// @description  Display open shifts on scheduling page of Zed
// @author       aSempruch
// @match        https://zed.rutgers.edu/scheduling/
// @grant        none
// ==/UserScript==

try{
	var userName = document.getElementsByClassName('user-info')[0].innerText.substring(6,12).replace(/\s+/, "");
	var userText = "";
	//console.log(userName);
	if(userName == "rb859")
		userText = "Error: weird first name detected";
	if(userName == "sk1683")
		userText = "Error: too much Sarah detected";
}
catch(err){
	console.log("minor error");
}
document.getElementsByClassName('row-fluid')[0].getElementsByClassName('col-md-12')[0].innerHTML += "<h4>Zedder</h4>" + userText;

var weekNum = 1;
var container = document.createElement("table");
var date = new Date();
var bool = 0;
var empties = 0;
var stat = document.createElement("p");
var dateRange = document.createElement("p");
var bt_nextWeek = document.createElement("a");
var bt_reset = document.createElement("a");
// var hiddenShifts = [];
stat.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;Scanning <b>0%</b><br>";

bt_reset.innerHTML="Current Week";
bt_reset.setAttribute("href", "https://zed.rutgers.edu/scheduling/");
bt_reset.style = "padding-left: 10px;font-size: 90%";
bt_nextWeek.innerHTML = "Next Period";
bt_nextWeek.addEventListener("click", function() {
    if((scanned*2) >= (sites.length*weekNum)){
        date = nextDays(7*weekNum);
        drawDate(true);
    }
});
bt_nextWeek.style="cursor: pointer;padding-left: 10px;";
document.getElementsByClassName('row-fluid')[0].append(dateRange);

function nextDays(n){
    var newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate()+n);
    return newDate;
}

function drawDate(run){
    var vnextWeek = nextDays(7*weekNum);
    vnextWeek.setDate(vnextWeek.getDate()-1);
    dateRange.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Date: "
        + (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + " - " + (vnextWeek.getMonth()+1) + "/" + vnextWeek.getDate() + "/" + vnextWeek.getFullYear();
    dateRange.appendChild(bt_nextWeek);
    if(run){
        dateRange.appendChild(bt_reset);
        container.innerHTML="";
        scanned=0;empties=0;
        stat.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;Scanning <b>0%</b><br>";
        ittWeeks(sites);
    }
}
document.getElementsByClassName('row-fluid')[0].append(stat);

// function sync_hidden(){
//   chrome.storage.sync.set({
//     hidden: hiddenShifts,
//   }, function() {
//     return;
//   });
// }

function scraper(data, column, date){
    var offset = 0, hasShift = false, cHasShift = true;
    data.find("td").each(function(i) {
        var list, listElement;
        if($(this).is(".first") === false)
            offset++;
        else
            cHasShift = false;
        $(this).find("div > .scheduleShift").each(function(k){
            if($(this).find("div > form").length === 0){ return true; }
						// if($.inArray(this.id, hiddenShifts) >= 0){ return true; }
            hasShift = true;
            if(bool === 0){
                if(!cHasShift){
                    cHasShift = true;
                    var day;
                    var t_date = new Date(date.getTime());
                    t_date.setDate(t_date.getDate()+(i-offset));
                    var s_date = (t_date.getMonth()+1)+"/"+(t_date.getDate());
                    var day = t_date.getDay();
                    switch(day){
                        case 0:
                            day = "Sunday "+s_date;
                            break;
                        case 1:
                            day = "Monday "+s_date;
                            break;
                        case 2:
                            day = "Tuesday "+s_date;
                            break;
                        case 3:
                            day = "Wednesday "+s_date;
                            break;
                        case 4:
                            day = "Thursday "+s_date;
                            break;
                        case 5:
                            day = "Friday "+s_date;
                            break;
                        case 6:
                            day = "Saturday "+s_date;
                            break;
                        default:
                            day = "error";
                            break;
                    }
                    column.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + day.bold();
                }
                list = document.createElement("ul");
                column.append(list);
                bool = 1;
            }
            listElement = document.createElement("li");
						var shiftId = document.createElement("input");
						shiftId.setAttribute("type", "hidden");
						shiftId.setAttribute("name", "shiftId");
						shiftId.setAttribute("value", this.id);
						var shiftTime = $(this).find("p")[0];

						// var hideButton = document.createElement("a");
						// hideButton.appendChild(document.createTextNode("X"));
						// hideButton.style.padding = "0px 0px 0px 5px";
						// hideButton.style.cursor = "pointer";

						// hideButton.addEventListener('click', function(){
						// 	console.log(shiftId.value);
						// 	hiddenShifts.push(shiftId.value);
						// 	sync_hidden();
						// 	list.removeChild(listElement);
						// });

                        if(shiftTime) {
                            listElement.append(shiftTime);
                        }
                        else {
                            listElement.append(document.createTextNode("Unable to get time"));
                        }

						// try{
						// 	//console.log(shiftTime.innerHTML);
						// 	//shiftTime.append(hideButton);
						// 	listElement.append(shiftTime);
						// }
						// catch(err){
						// 	//listElement.append(shiftTime);
						// 	listElement.append(document.createTextNode("Missing Time"));
						// 	//listElement.append(hideButton);
						// }

						listElement.append(shiftId);

            listElement.append($(this).find("div > form")[0]);
            list.appendChild(listElement);
        });
        bool = 0;
    });
    return hasShift;
}


chrome.storage.sync.get("arr", function(items) {
    var options = new Array(5);
	try {
        options = items.arr;
        if(!options) { throw "Empty Options"; }
		chrome.storage.sync.get("weekNum", function(items) {
			weekNum = items.weekNum;
            drawDate(false);
            start(options);
			// chrome.storage.sync.get("hidden", function(items) {
			// 	hiddenShifts = items.hidden;
			// 	if(hiddenShifts == null)
			// 		hiddenShifts = [];
			// 	start(options);
			// });
		});
	}
	catch(err){
		stat.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<b>Please select a campus from the extension options page.</b> (Click on the <img src="+chrome.extension.getURL('icon16.png')+"> icon in the top right, select campus, and hit \"Save\")<br>";
		return;
	}
  });

var sites = [];
function start(options){
    var supervisor = options[5];
    if(options[0]) { //College Ave
        sites.push(
            "AlexG", "121",
            "AlexU", "122",
            "CACC", "124",
            "CACC-DISP", "125",
            "CASC", "127",
            "RSC", "30",
            "RH", "123"
        );
        if(supervisor)
            sites.push(
                "CACC-Sups", "126"
            );
    }
    
    if(options[1]) { //Livingston
        sites.push(
            "CARR", "112",
            "Plaza", "142",
            "Tillet", "139",
            "Tillet-DISP", "141"
        );
        if(supervisor)
            sites.push(
                "TIL-Sups", "140"
            );
    }
    if(options[2]) { //Busch
        sites.push(
            "ARC", "115",
            "ARC-DISP", "119",
            "BEST", "113",
            "KES", "118",
            "LSM", "117"
        );
        if(supervisor)
            sites.push(
                "ARC-Sups", "116"
            );
    }
    if(options[3]) { //Cook
        sites.push(
            "C4", "152",
            "CHANG", "151",
            "DCENT", "156",
            "DLIB", "157",
            "LOR", "153",
            "LOR_DISP", "155"
        );
    }
    if(options[4]) { //Help Desk
        sites.push(
            "L1", "132",
            "L1 CT", "134",
            "L2", "133",
            "L2 App", "135",
            "L2 Email", "138",
            "L2 Esc", "137",
            "L2 Net", "144"
        );
        if(supervisor)
            sites.push(
                "Assistant Sup", "147",
                "ES Sup", "148",
                "L2 App Sup", "136",
                "L2 Net Sup", "145",
                "L3 Sup", "149"
            );
    }
    if(sites.length > 0){
        ittWeeks(sites);
    }
    else{
        stat.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<b>Please select a campus from the extension options page.</b><br>";
        bt_nextWeek.innerHTML="";
    }
}

function ittWeeks(sites){
    var t_weekNum;
    for(t_weekNum = 0; t_weekNum < weekNum; t_weekNum++){
            scan(0, sites, nextDays(7*t_weekNum));
    }
}

var scanned=0;
function scan(counter, sites, date){
    if(counter == sites.length){
        document.getElementsByClassName('row-fluid')[0].append(container);
        return;
    }
    var column = document.createElement("td");
    column.style = "min-width: 180px";
    //console.log("https://zed.rutgers.edu/scheduling/open_shifts/" + sites[counter+1] + "/?start_date="+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
    column.innerHTML += "<BLOCKQUOTE>" + sites[counter] + "</BLOCKQUOTE>";

    $.get("https://zed.rutgers.edu/scheduling/open_shifts/" + sites[counter+1] + "/?start_date="+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(), function (s_data) {
            //console.log("couter: " + counter+" length: "+sites.length);
            if(scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column, date))
                container.append(column);
            else
                empties++;
            scanned++;
            //if(counter<sites.length-2 && stat.innerHTML!="")
                stat.innerHTML= "&nbsp;&nbsp;&nbsp;&nbsp;Scanning <b>"+(Math.trunc(((scanned*2)/(sites.length*weekNum))*100))+"%</b>";
            if(empties*2 == (sites.length*weekNum))
                    stat.innerHTML += " - <b>No open shifts for this period</b>";
            //else if(hasShift && scanned*2==sites.length)
            //    stat.innerHTML="&nbsp;";
        });

    scan(counter+2, sites, date);
}
