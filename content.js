console.log('The extension works');
//Is Page Updated ?
window.addEventListener("yt-page-data-updated", process);

function process(){
    let ownerName = document.getElementById("owner-name")
    if (ownerName !== null && ownerName.getElementsByTagName("a").length > 0) {
        let message = {
            channelName : ownerName.getElementsByTagName("a")[0].text,
            channelUrl : ownerName.getElementsByTagName("a")[0].href,
        };
        chrome.runtime.sendMessage(message);
    }
    //console.log("Channel Name: "+ channelName)
}
//
