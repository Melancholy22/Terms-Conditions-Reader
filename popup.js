document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("termsData", function (data) {
        document.getElementById("terms-content").innerText = data.termsData || "No terms found.";
    });
});
