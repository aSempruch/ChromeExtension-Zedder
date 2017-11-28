// ==UserScript==
// @name         Zedder
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Display open shifts on scheduling page of Zed
// @author       aSempruch
// @match        https://zed.rutgers.edu/scheduling/
// @grant        none
// ==/UserScript==

document.body.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;Zedder - Open Shift Scanner by aSempruch";

var container = document.createElement("table");
//container.style.background = "green";
var bool = 0;

function scraper(data, column){
    var offset = 0;
    data.find("td").each(function(i) {
        var list, listElement;
        if($(this).is(".first") === false){
            offset++;
        }
        $(this).find("div > .scheduleShift").each(function(k){
            if($(this).find("div > form").length === 0){ return true; }
            if(bool === 0){
                var day;
                switch(i-offset){
                    case 0:
                        day = "Saturday";
                        break;
                    case 1:
                        day = "Sunday";
                        break;
                    case 2:
                        day = "Monday";
                        break;
                    case 3:
                        day = "Tuesday";
                        break;
                    case 4:
                        day = "Wednesday";
                        break;
                    case 5:
                        day = "Thursday";
                        break;
                    case 6:
                        day = "Friday";
                        break;
                    default:
                        day = "error";
                        break;
                }
                column.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + day.bold();
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
}

var column1 = document.createElement("th");
column1.innerHTML += "<BLOCKQUOTE>AlexG</BLOCKQUOTE>";
$.get('https://zed.rutgers.edu/scheduling/open_shifts/28/', function (s_data) {
    scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column1);
});
container.append(column1);

var column2 = document.createElement("th");
column2.innerHTML += "<BLOCKQUOTE>AlexU</BLOCKQUOTE>";
$.get('https://zed.rutgers.edu/scheduling/open_shifts/29/', function (s_data) {
    scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column2);
});
container.append(column2);

var column3 = document.createElement("th");
column3.innerHTML += "<BLOCKQUOTE>CACC</BLOCKQUOTE>";
$.get('https://zed.rutgers.edu/scheduling/open_shifts/25/', function (s_data) {
    scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column3);
});
container.append(column3);

var column4 = document.createElement("th");
column4.innerHTML += "<BLOCKQUOTE>CACC-DISP</BLOCKQUOTE>";
$.get('https://zed.rutgers.edu/scheduling/open_shifts/27/', function (s_data) {
    scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column4);
});
container.append(column4);

var column5 = document.createElement("th");
column5.innerHTML += "<BLOCKQUOTE>RSC</BLOCKQUOTE>";
$.get('https://zed.rutgers.edu/scheduling/open_shifts/30/', function (s_data) {
    scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column5);
});
container.append(column5);

var column6 = document.createElement("th");
column6.innerHTML += "<BLOCKQUOTE>RUAB</BLOCKQUOTE>";
$.get('https://zed.rutgers.edu/scheduling/open_shifts/95/', function (s_data) {
    scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column6);
});
container.append(column6);

document.body.append(container);
