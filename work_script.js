function copy_info_to_clipboard() {
  var info = [];
  for (var container of document.getElementsByClassName("collection-item-container")) {
    const download_node = container.getElementsByClassName("redownload-item")[0];
    const artist_node = container.getElementsByClassName("collection-item-artist")[0];
    const title_node = container.getElementsByClassName("collection-item-title")[0];
    info.push({
      "artist": artist_node.innerText.replace("by ", ""),
      "title": title_node.innerText.replace("by ", ""),
      "download_link": download_node.children[0].href,
    });
  }
  navigator.clipboard.writeText(JSON.stringify({"albums": info}));
  
}

var grid = document.getElementsByClassName("collection-items")[0];
var btn = document.createElement("button");
btn.innerText = "Copy collection info as JSON to clipboard";
btn.onclick = copy_info_to_clipboard;
grid.appendChild(btn);

