// ==UserScript==
// @name         Zedder
// @description  Display open shifts on scheduling page of Zed
// @author       aSempruch
// @match        https://zed.rutgers.edu/scheduling/
// @grant        none
// ==/UserScript==

document.getElementsByClassName('row-fluid')[0].getElementsByClassName('col-md-12')[0].innerHTML += "<h4>Zedder</h4>";

var weekNum = 1;
var container = document.createElement("table");
var date = new Date();
var bool = 0;
var empties = 0;
var stat = document.createElement("p");
var dateRange = document.createElement("p");
var bt_nextWeek = document.createElement("a");
var bt_reset = document.createElement("a");
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

//drawDate(false);

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
            listElement.append($(this).find("p")[0]);
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
		options[0] = items.arr[0];
		options[1] = items.arr[1];
		options[2] = items.arr[2];
		options[3] = items.arr[3];
		options[4] = items.arr[4];
		chrome.storage.sync.get("weekNum", function(items) {
			weekNum = items.weekNum;
			drawDate(false);
			console.log("Starting");
			start(options);
		});
	}
	catch(err){
		stat.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<b>Please select a campus from the extension options page.</b> (Click on the beautiful <img src="+chrome.extension.getURL('icon16.png')+"> icon in the top right)<br>";
		return;
	}
  });

var sites = [];
function start(options){
    if(options[0])//College Ave
        sites.push(
            "AlexG", "28",
            "AlexU", "29",
            "CACC", "25",
            "CACC-DISP", "27",
            "RSC", "30",
            "RUAB", "95");
    if(options[1])//Livingston
        sites.push(
            "Kilmer", "36",
            "Plaza", "41",
            "Tillet", "32",
            "Tillet-DISP", "33");
    if(options[2])//Busch
        sites.push(
            "ARC", "19",
            "ARC-DISP", "20",
            "BEST", "22",
            "LSM", "24",
            "RBHS", "80");
    if(options[3])//Cook
        sites.push(
            "C4", "18",
            "DCENT", "17",
            "DLIB", "16",
            "LOR", "13",
            "LOR_DISP", "14");
    if(options[4])//Help Desk
        sites.push(
            "L1 HD", "4",
            "L2 App", "6",
            "L2 App AS", "1",
            "L2 Esc", "9",
            "L2 LD", "46",
            "L2 Help@", "93",
            "L2 Kite+Key", "102",
            "L2 Net", "8",
            "L2 Net AS", "7",
            "L3 Sup", "39",
            "L1 CWS", "44");
    if(sites.length > 0){
        ittWeeks(sites);
    }
    else{
        stat.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<b>Please select a campus from the extension options page. (Click on the beautiful blue \'Z\' icon in the top right)</b><br>";
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