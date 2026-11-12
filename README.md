# THM Tutor - AI Learning Guide (Chrome Extension)

Yeh extension TryHackMe labs seekhne me madad karta hai - **answer ya flag kabhi nahi deta**,
sirf concepts samjhata hai aur sawaal-jawab se aapko sochne ki disha deta hai.

## Install kaise karein (Developer Mode)

1. Chrome me jaayein: `chrome://extensions`
2. Top-right me "Developer mode" ON karein
3. "Load unpacked" button dabayein
4. Yeh poora `thm-tutor-extension` folder select karein
5. Extension install ho jayega - toolbar me icon dikhega

## Setup

1. TryHackMe ke kisi bhi room/task page par jaayein
2. Extension icon par click karein - side panel khulega
3. Settings (⚙) me apni **OpenRouter API key** daalein
   - Key yahan se milegi: https://openrouter.ai/keys
4. Model choose karein (default: Claude 3.5 Sonnet)
5. "Save" dabayein

## Use kaise karein

1. "🔄 Page padho" button dabayein - yeh current lab page ka content padh lega
2. Neeche chat box me apna sawaal likhein, jaise:
   - "Mujhe samajh nahi aa raha yeh task kya keh raha hai"
   - "Enumeration kaise shuru karu?"
   - "Yeh error ka matlab kya hai?"
3. AI aapko guide karega - hints dega, concepts samjhayega, lekin
   **direct answer ya flag kabhi nahi dega**

## Important baatein

- Yeh tool **koi lab solve nahi karta** - sirf aapko sikhata hai
- Aapki API key sirf aapke browser me (local) store hoti hai
- Page sirf **padha** jata hai, extension kabhi koi form fill ya submit nahi karta
- Agar page content sahi se nahi padh pa raha, page reload karke "Page padho" dubara dabayein

## Files

- `manifest.json` - extension config
- `content.js` - TryHackMe page se text padhta hai (read-only)
- `background.js` - side panel kholne ke liye
- `sidepanel.html` / `sidepanel.js` - chat UI aur OpenRouter API calls
- `icon.png` - extension icon
