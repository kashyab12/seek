**bringing spotlight search to linux**

todos
- store .desktop info when checking /usr/share/apps folder and cache the info rather than fetching each time
- how to fetch icons cleanly? there must be some ds storing all the app icon info on the system. I need to store what that ds stores or perhaps have a reference to that ds when needed. why? bcs I need
    - app name (to present the user with)
    - app exec path (to open it on click) - perhaps just parse the first exec? Is it always guaranteed to be the Desktop Entry?
    - app icon
- the fuzzy matcher isn't great, chro yields chrome as an entry
- make sure the searchresult key is not arr index.
- local py server running listening to reqs from be?
- how do I bundle the py scripts with electron? Does this work with auto-updating?
- sqlite when things become a pain to store in files?