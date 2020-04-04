README.md

extension to save and retrieve tabs.

Idea: Save a workspace. All tabs in a current window can be saved as a 'working project'. The tabs can then be retrieved  subsequently (maybe months later), to pull up all relevant tabs.

Done:
* created hello world extension - popup
* retrieved all current open tabs and displayed in popup
* retrieved bookmarks and displayed in popup
* enabled displayed bookmarks or tabs to be opened in a new window
* search works (case sensitive)
* saves all tabs to a user defined workspace
* able to retrieve list from workspace, and redisplay in popup
* retrieve all workspaces and display in dropdown
* reopen all tabs rather than just display in popup
* rather than open in current window, open a new window?
* load a single page to see all workspaces
* need ability to delete workspaces
* when opening, put first one in existing tab
* dialog not disappearing after selecting yes
* date (or last saved date?)
* added feedback link
* added background.js with uninstall callback to feedback
* added .css 
* Added conversion tracking
* Search should actually iterate through saved workspaces
* Search should not be case sensitive
* update background logo
* updated Delete dialog box
* new design/layout/color scheme
* Easier way to overwrite an existing workspace

 
* 0.75
* Removed ovewrwrite of workspace. Must go to Show all and delete first
* Fixed issue of tabs list clearing after saving workspace
* Search is no longer case-sensitive
* Added Created date for workspaces
* Show created date in show all tabs, if available
* Add instructions/docs on how to use functionality (specifically deleting Workspaces)

* 0.76
* Moved inline scripts to popup.js
* Updated CSS font-family to include more than Roboto. Includes: Oxygen, Ubuntu, Helvetica Neue, Arial, sans-serif
* Add favicons

* 0.77
* show all workspaces in a starter tab

* 0.80
* Removed 'bookmarks' permission
* Rolled back show all workspace in starter tab

* 0.81
* Changed layout to move 'Show All' higher

* 0.83
* Improved Delete Dialog UI

* 0.831
* Fixed UI alignment issues

* 0.9
* Updated UI to use bootstrap
* Changed show all to be within popup rather than a new tab
* Fixed Dialog boxes
* Refeshed look/feel throughout
* Show all allow for opening workspaces or individual tabs

* 0.903
* Added memory of workspace names

* 0.951
* added language support, added angular

imagine a 'delicious' or 'instapaper' like site for your projects.

To Do
* change search to search extension lists?
* Create history of workspaces (for how long?)
* Ability to share a workspace (how?)
* add ability to select individual tab in show all tabs




