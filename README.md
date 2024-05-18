<div style="text-align: center;">
  <h2>bringing spotlight search to linux</h2>
  <img src="res/seek.png" alt="seek">
</div>

---

### todos
* navigate to results and set focus using arrow keys or nums?
* the fuzzy matcher isn't great, "chro" yields chrome as an entry
* make sure the searchresult key is not arr index.
* local py server running listening to reqs from be?
* sqlite when things become a pain to store in files?
* how do I bundle the py scripts with electron? Does this work with auto-updating?
* handle onblur for buttons to reset windowFocus back to -1
* still seeing a open '60' error in toSeek, main process. Not handling a promise correctly?
* ~~store .desktop info when checking /usr/share/apps folder and cache the info rather than fetching each time~~
* ~~how to fetch icons cleanly? there must be some ds storing all the app icon info on the system.~~
* ~~ensure search results cleared on backspacing into empty query~~