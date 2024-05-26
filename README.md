<p align="center">
    <img src="res/seek-demo.gif" alt="seek" width="75%">
</p>

## Why	
Spotlight search is one of my favorite features in MacOS. As such, I couldn't find a great alternative in linux and accordingly I decided to build 'seek'. Currently, it supports app search and execution. The keybind to display seek is "ctrl+enter", and the deb+rpm builds can be found [here](https://github.com/kashyab12/seek/releases/tag/v0.1).

## Todos
* startup is noticeably slow, the installed packages portion. Make it faster using worker threads? Also does it need recomputing on every startup? Save the struct info and when running reference it and use the info if it already exists. If it's a new app then compute and add it to the file/db? Revalidation needs to occur at some point though?
* file searching! next most imp item.
* for queries which don't map to app or file -> open in default browser?
* other interesting queries?
* ~~just return all the installed files and have them as command items? Instead of fetching score on each query change?~~ The filtering logic is done on the rendering side though in this case. Main process can multithread but rendered cannot?
* theme: toggle b/w light and dark mode, and default should be based on system (would require communicating sys theme info from main -> renderer proc)
* sqlite when things become a pain to store in files?
* ~~store .desktop info when checking /usr/share/apps folder and cache the info rather than fetching each time~~
* ~~how to fetch icons cleanly? there must be some ds storing all the app icon info on the system.~~
* ~~ensure search results cleared on backspacing into empty query~~
* ~~navigate to results and set focus using arrow keys or nums?~~
* ~~use the command shadcn component~~
* ~~make sure the searchresult key is not arr index.~~
* ~~Need to get rid of python since the usage is trivial. On looking into the bundling process, integrating python would require including py binaries with the app leading to a fat deb file.~~
* ~~dpkg is missing .desktop files within the local dir?~~
* ~~still some apps which should be filtered out, .desktop doesn't necesarrily equate to exec'able or installed? Maybe only use Type=Application stuff? Also filter out the %u and %f exec's? Tricky in cases like libreoffice, but for vscode it is using the url handler case and name. Maybe check NoDesktop and use or don't? Chrome gone now :(~~
