function get_collection_items() { return document.getElementsByClassName("collection-item-container"); }

async function fetch_download_information() {
    var fetch_btn = document.querySelector("button[id=fetch_btn]");
    const saved_btn_text = fetch_btn.innerText;

    var download_pages_promises = [];

    const collection = Array.from(get_collection_items());
    for (const [index, container] of collection.entries()) {
        fetch_btn.innerText = saved_btn_text + ` (fetching download pages... ${index}/${collection.length})`;
        const download_node = container.getElementsByClassName("redownload-item")[0];
        const download_page_url = download_node.children[0].href;
        download_pages_promises.push(
            fetch(download_page_url).then((response) => response.text())
        );
    }

    var info = [];
    for (const [index, page] of download_pages_promises.entries()) {
        fetch_btn.innerText = saved_btn_text + ` (getting blobs... ${index}/${download_pages_promises.length})`;
        await page.then((html) => {
            const page = new DOMParser().parseFromString(html, "text/html");
            const blob = JSON.parse(page.getElementById("pagedata").getAttribute("data-blob"));
            info.push({ "download_items": blob["download_items"] });
        });
    }

    fetch_btn.innerText = saved_btn_text;

    return info;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function load_all_collection_items() {
    var fetch_btn = document.querySelector("button[id=fetch_btn]");
    const saved_btn_text = fetch_btn.innerText;
    fetch_btn.innerText = saved_btn_text + " (loading all items...)";

    const get_collection_size = () => {
        return Number(document.querySelector("li[data-tab=collection]")
            .querySelector("span[class=count]")
            .textContent);
    };
    while (get_collection_items().length < get_collection_size()) {
        document.querySelector("div.expand-container button.show-more").click();
        await sleep(200);
        fetch_btn.scrollIntoView(); // the items don't get loaded until we scroll down
    }

    fetch_btn.innerText = saved_btn_text;
}

var grid = document.getElementsByClassName("collection-items")[0];

var fetch_btn = document.querySelector("button[id=fetch_btn]");
if (!fetch_btn) fetch_btn = document.createElement("button");
fetch_btn.setAttribute("id", "fetch_btn");
fetch_btn.innerText = "Fetch collection data";
fetch_btn.onclick = async function (event) {
    var copy_btn = document.querySelector("button[id=copy_btn]");
    if (copy_btn) copy_btn.remove();

    await load_all_collection_items();

    const info = await fetch_download_information();

    var copy_btn = document.createElement("button");
    copy_btn.setAttribute("id", "copy_btn");
    copy_btn.innerText = "Copy collection info as JSON to clipboard";
    copy_btn.onclick = function () {
        navigator.clipboard.writeText(JSON.stringify({"collection": info}, null, 2));
    };
    grid.appendChild(copy_btn);
};
grid.appendChild(fetch_btn);
