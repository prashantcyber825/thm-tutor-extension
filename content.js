// Yeh script TryHackMe ke page par chalta hai aur sirf PADHTA hai,
// kabhi form fill nahi karta, kabhi answer submit nahi karta.

function getPageContext() {
  const title = document.title || "";

  // Room/task heading - TryHackMe har page par class names badalta rehta hai,
  // isliye hum kuch common selectors try karte hain, aur fallback me poora
  // visible text le lete hain.
  const headingSelectors = ["h1", "h2", ".room-title", "[class*='Title']"];
  let heading = "";
  for (const sel of headingSelectors) {
    const el = document.querySelector(sel);
    if (el && el.innerText && el.innerText.trim().length > 0) {
      heading = el.innerText.trim();
      break;
    }
  }

  // Main content area ka text - questions, descriptions, hints
  const mainSelectors = ["main", "[class*='task']", "[class*='content']", "article", "body"];
  let bodyText = "";
  for (const sel of mainSelectors) {
    const el = document.querySelector(sel);
    if (el && el.innerText && el.innerText.trim().length > 200) {
      bodyText = el.innerText.trim();
      break;
    }
  }
  if (!bodyText) {
    bodyText = document.body.innerText || "";
  }

  // Bahut lamba text ho to trim kar do (token limit ke liye)
  const MAX_CHARS = 6000;
  if (bodyText.length > MAX_CHARS) {
    bodyText = bodyText.slice(0, MAX_CHARS) + "\n...(aage ka text kaat diya gaya)";
  }

  return {
    url: location.href,
    title,
    heading,
    bodyText
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PAGE_CONTEXT") {
    sendResponse(getPageContext());
  }
  return true;
});
