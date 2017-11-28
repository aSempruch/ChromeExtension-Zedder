function save_options() {
  var el = [
      document.getElementById("cacc").checked,
      document.getElementById("livi").checked,
      document.getElementById("busch").checked,
      document.getElementById("cook").checked
  ];
  chrome.storage.sync.set({
    arr: el
  }, function() {
    window.close();
  });
}

function restore_options() {
  chrome.storage.sync.get("arr", function(items) {
    document.getElementById("cacc").checked = items.arr[0];
    document.getElementById("livi").checked = items.arr[1];
    document.getElementById("busch").checked = items.arr[2];
    document.getElementById("cook").checked = items.arr[3];
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);