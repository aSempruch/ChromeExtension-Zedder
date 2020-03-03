var weekNum = 1;
function save_options(openScheduling) {
  var el = [
      document.getElementById("cacc").checked,
      document.getElementById("livi").checked,
      document.getElementById("busch").checked,
      document.getElementById("cook").checked,
      document.getElementById("hd").checked,
      document.getElementById("supervisor").checked
  ];
  chrome.storage.sync.set({
    arr: el,
    weekNum: weekNum
  }, function() {
    if(openScheduling)
        window.open("https://zed.rutgers.edu/scheduling/", "Scheduling");
        window.close();
  });
}

document.getElementById("openScheduling").addEventListener("click", openScheduling);

function openScheduling(){
    save_options(true);
}

function restore_options() {
  chrome.storage.sync.get("arr", function(items) {
    document.getElementById("cacc").checked = items.arr[0];
    document.getElementById("livi").checked = items.arr[1];
    document.getElementById("busch").checked = items.arr[2];
    document.getElementById("cook").checked = items.arr[3];
    document.getElementById("hd").checked = items.arr[4];
    document.getElementById("supervisor").checked = items.arr[5];
  });
  chrome.storage.sync.get("weekNum", function(num){
    if(num.weekNum != null){
        document.getElementById("weekNum").innerHTML = num.weekNum;
        weekNum = num.weekNum;
    }
    else
        document.getElementById("weekNum").innerHTML = weekNum;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', function(){
    save_options(false);
});
document.getElementById('inc').addEventListener('click', function(){
    if(weekNum < 5)
        weekNum++;
    document.getElementById("weekNum").innerHTML = weekNum;
});
document.getElementById('dec').addEventListener('click', function(){
    if(weekNum > 1)
        weekNum--;
    document.getElementById("weekNum").innerHTML = weekNum;
});
// document.getElementById('resetHidden').addEventListener('click', function(){
//   chrome.storage.sync.set({
//     hidden: [],
//   }, function() {
//     return;
//   });
// });
