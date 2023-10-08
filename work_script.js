var info = [];

async function fetch_download_information() {
    const collection_items = document.getElementsByClassName("collection-item-container");
    for (var container of collection_items) {
        const download_node = container.getElementsByClassName("redownload-item")[0];
        const download_page_url = download_node.children[0].href;
        await fetch(download_page_url)
            .then((response) => response.text())
            .then((html) => {
                const page = new DOMParser().parseFromString(html, "text/html");
                const blob = JSON.parse(page.getElementById("pagedata").getAttribute("data-blob"));
                info.push({ "download_items": blob["download_items"] });
            });
        console.log(info.length);
    }
}

var grid = document.getElementsByClassName("collection-items")[0];

var fetch_btn = document.createElement("button");
fetch_btn.innerText = "Fetch collection data";
fetch_btn.onclick = async function (event) {
    const saved_btn_text = event.target.innerText;
    event.target.innerText += " (processing...)";
    await fetch_download_information();

    var copy_btn = document.createElement("button");
    copy_btn.innerText = "Copy collection info as JSON to clipboard";
    copy_btn.onclick = function () {
        navigator.clipboard.writeText(JSON.stringify({"collection": info}));
    };
    grid.appendChild(copy_btn);

    event.target.innerText = saved_btn_text;
};
grid.appendChild(fetch_btn);
