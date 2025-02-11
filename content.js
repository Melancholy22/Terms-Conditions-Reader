function extractTextFromPage() {
    function getVisibleText(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return "";
        if (window.getComputedStyle(node).display === "none") return ""; // If there are any hidden elements ignore

        let textContent = "";
        // Loops through all elements in the Node (HTML) and stores the text
        for (const child of node.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                textContent += child.textContent.trim() + " ";
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                textContent += getVisibleText(child);
            }
        }
        return textContent;
    }

    function extractTermsAndConditions() {
        const keywords = ["Terms of Service", "Terms and Conditions", "Privacy Policy"];
        let pageText = getVisibleText(document.body); // For now this extracts text from the entire webpage

        // Extract text from iframes
        // An iframe (inline frame) is an HTML element that allows a webpage to embed another separate webpage inside it
        function extractFromIframes() {
            const iframes = document.getElementsByTagName("iframe");
            let iframeTexts = [];

            for (let iframe of iframes) {
                try {
                    let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    let iframeText = getVisibleText(iframeDoc.body);
                    if (iframeText.length > 100) { // Avoid small, irrelevant content
                        iframeTexts.push(iframeText);
                    }
                } catch (error) {
                    console.warn("Blocked from accessing iframe due to cross-origin policy.");
                }
            }

            return iframeTexts.join("\n\n");
        }

        let iframeText = extractFromIframes();
        pageText += "\n\n" + iframeText; // Combine page text and iframe text

        // Check for keyword matches
        const foundTerms = keywords.filter(term => pageText.includes(term));
        return foundTerms.length > 0 ? pageText : "No terms detected on this page.";
    }

    return extractTermsAndConditions();
}

// Send extracted text to background script
chrome.runtime.sendMessage({ action: "extract_terms", data: extractTextFromPage() });
