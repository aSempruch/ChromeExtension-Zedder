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

var options = new Array(4);

chrome.storage.sync.get("arr", function(items) {
    options[0] = items.arr[0];
    options[1] = items.arr[1];
    options[2] = items.arr[2];
    options[3] = items.arr[3];
    start();
  });

function start(){
    if(options[0]){//CACC
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
        }//CACC
    if(options[1]){
        var column7 = document.createElement("th");
        column7.innerHTML += "<BLOCKQUOTE>Kilmer</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/36/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column7);
        });
        container.append(column7);

        var column8 = document.createElement("th");
        column8.innerHTML += "<BLOCKQUOTE>Plaza</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/41/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column8);
        });
        container.append(column8);

        var column9 = document.createElement("th");
        column9.innerHTML += "<BLOCKQUOTE>Tillet</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/32/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column9);
        });
        container.append(column9);

        var column10 = document.createElement("th");
        column10.innerHTML += "<BLOCKQUOTE>Tillet-DISP</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/33/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column10);
        });
        container.append(column10);
        }//Livi
    if(options[2]){//Busch
        var column13 = document.createElement("th");
        column13.innerHTML += "<BLOCKQUOTE>ARC</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/19/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column13);
        });
        container.append(column13);

        var column14 = document.createElement("th");
        column14.innerHTML += "<BLOCKQUOTE>ARC-DISP</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/20/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column14);
        });
        container.append(column14);

        var column15 = document.createElement("th");
        column15.innerHTML += "<BLOCKQUOTE>BEST</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/22/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column15);
        });
        container.append(column15);

        var column16 = document.createElement("th");
        column16.innerHTML += "<BLOCKQUOTE>LSM</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/24/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column16);
        });
        container.append(column16);

        var column17 = document.createElement("th");
        column17.innerHTML += "<BLOCKQUOTE>RBHS</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/80/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column17);
        });
        container.append(column17);
        }//Busch
    if(options[3]){//Cook
        var column18 = document.createElement("th");
        column18.innerHTML += "<BLOCKQUOTE>C4</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/18/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column18);
        });
        container.append(column18);

        var column19 = document.createElement("th");
        column19.innerHTML += "<BLOCKQUOTE>DCENT</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/17/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column19);
        });
        container.append(column19);

        var column20 = document.createElement("th");
        column20.innerHTML += "<BLOCKQUOTE>DLIB</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/16/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column20);
        });
        container.append(column20);

        var column21 = document.createElement("th");
        column21.innerHTML += "<BLOCKQUOTE>LOR</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/13/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column21);
        });
        container.append(column21);

        var column22 = document.createElement("th");
        column22.innerHTML += "<BLOCKQUOTE>LOR-DISP</BLOCKQUOTE>";
        $.get('https://zed.rutgers.edu/scheduling/open_shifts/14/', function (s_data) {
            scraper($(s_data).find(".table-responsive > .schedule > table > tbody > tr"), column22);
        });
        container.append(column22);
        }//Cook
    document.body.append(container);   
}