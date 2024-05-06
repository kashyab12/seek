**bringing spotlight search to linux**

todos
- local py server running listening to reqs from be?
- store .desktop info when checking /usr/share/apps folder and cache the info rather than fetching each time?
- how do I bundle the py scripts with electron? Does this work with auto-updating?
- how to fetch icons cleanly? there must be some ds storing all the app icon info on the system. I need to store what that ds stores or perhaps have a reference to that ds when needed. why? bcs I need
    - app name (to present the user with)
    - app exec path (to open it on click)
    - app icon
- return the app path and name, in case it isn't executable we can just open the folder?