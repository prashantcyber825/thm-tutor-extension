# thm-tutor-extension
AI-powered Chrome extension that teaches you TryHackMe labs step-by-step without giving direct answers — built for learning, not solving.



THM Tutor एक AI-powered Chrome Extension है जो TryHackMe पर cybersecurity सीखने वालों के लिए खास तौर पर बनाया गया है। यह tool किसी भी lab को खुद solve नहीं करता और न ही flag या final answer कभी देता है — बल्कि एक असली tutor की तरह काम करता है, जो student को सही दिशा में सोचने के लिए guide करता है।

जब आप किसी TryHackMe room या task page पर होते हैं, यह extension सिर्फ उस page का content पढ़ता है — task description, hints, और सवाल — और उसी context को ध्यान में रखते हुए आपसे बातचीत करता है। यह कभी किसी form को खुद नहीं भरता, कोई payload submit नहीं करता, और न ही किसी तरह का automated exploitation करता है। इसका इस्तेमाल केवल पढ़ने और समझने के लिए होता है।

Extension का core हिस्सा एक Socratic-style AI tutor है, जो OpenRouter API के ज़रिए किसी भी बड़े language model (जैसे Claude, GPT, या Llama) को इस्तेमाल करता है। इसे एक सख्त system prompt के साथ design किया गया है, जो AI को हमेशा यह याद दिलाता रहता है कि उसका काम concepts समझाना है, जवाब देना नहीं। अगर student बार-बार सीधा answer मांगे, तो भी AI politely मना करता है और इसके बजाय सवाल पूछता है जैसे — "आपने अब तक क्या try किया?", "यह error का मतलब समझते हैं?", या छोटे-छोटे hints देता है ताकि student खुद सोचकर आगे बढ़े।

यह tool खास तौर पर उन students के लिए उपयोगी है जो cybersecurity में practical तरीके से सीखना चाहते हैं — enumeration, privilege escalation, web exploitation, buffer overflow जैसे topics को बिना शॉर्टकट लिए, गहराई से समझना चाहते हैं। Extension पूरी तरह Chrome Manifest V3 पर आधारित है, एक side panel के ज़रिए chat interface देता है, और आपकी API key सिर्फ आपके browser में local तौर पर store होती है — कहीं और नहीं भेजी जाती।

संक्षेप में, THM Tutor एक responsible learning companion है, जो cybersecurity सीखने के सफर को आसान, interactive और असल में ज्ञानवर्धक बनाता है — बिना seekhne की प्रक्रिया को bypass किए।
