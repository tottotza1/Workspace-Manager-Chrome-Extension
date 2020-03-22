

function displaySavedWorkspaces() { //get all workspaces that have been saved previously
	var allWorkspaces = chrome.storage.sync.get(null, function(data){
		var keys = Object.keys(data);
		for (var i = 0; i<keys.length;i++){
			displayWorkspace(keys[i]);
		}
	})
}

function displayWorkspace(workspace) { //for a single workspace (with multiple tabs)
	console.log(workspace);
	chrome.storage.sync.get(workspace, function(newData) { //get the tabs for the workspace name
		var topDiv = $('<div class="card" style="margin:10px 0px;">'); //doing this so that 'delete' shows up under title, but then removes bullets as well.
    var deleteLinkSpan = $('<span style="position:absolute; right:10px;"><a id="deletelink" style="color:darkgrey" ' + 'href="#">Delete Workspace</a></span>');
    //options.show();
   
    deleteLinkSpan.click( function(event) { //this is called when link is clicked
	       event.preventDefault();
      $('#deletedialog').dialog( { // this is the overlay dialog box
        autoOpen: false,
        resizable: false,
        draggable: false,
        position: { my: "center top", at: "center top+50", of: window },
        modal: true,
        overlay: {
          backgroundColor: 'white',
          opacity: 1.0
        },
        closeText: '&times;',
        buttons: {
          'Yes, Delete!': function() {
            chrome.storage.sync.remove(workspace, function() {
            span.parent().remove();              	
          });
          $(this).dialog('destroy');
        },
        'Cancel': function() {
          $(this).dialog('destroy');
          }  //need to set focus
        }
      }).dialog('open');
	  
	  setTimeout(function(){
		  $(".ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only:eq(1)").focus();
	  },1);
	  
    });
    //deleteLinkSpan.show();
    var span = $('<span class="" id=\'' + workspace + '\'>');
    span.append('<b>' + workspace + '</b></br></span>'); //display the Workspace name + newData[workspace].firstItem);
      //create Link
    topDiv.append(span);
    topDiv.append(deleteLinkSpan);
  	topDiv.append(newData[workspace].firstItem); //display the tabs
    if (newData[workspace].createdDate != undefined ) { //this is to accommodate users from before feature was implemented
      topDiv.append('<span class="text-info"> Created: ' + newData[workspace].createdDate + '</span>');
    }
    inputButton = $('<input class="btn btn-outline-warning btn-sm" type="submit" value="Open" id="search_open">');
    inputButton.on('click', function () { searchOpener(newData[workspace].firstItem)})
    topDiv.append(inputButton);
    topDiv.append('</div>')

    //topDiv.append('')
  	$('#playground').append(topDiv);
  })
}

function searchOpener(tabsToOpen) {
  console.log(tabsToOpen)
  openTabs(tabsToOpen);

}

// called by open button
function openTabs(firstItem) {
  chrome.windows.create(null, function (w) {
    var doc = $(firstItem);
    var links = $('a', doc); 
    for(var i=0;i<links.length;i++){
      chrome.tabs.create({windowId: w.id, //index: i, //this is where you could change to not have an empty tab
                          url: links[i].href});
    }
  });
}

//called when popup opens to create workspace dropdown
function createWorkspaceList() {
  var dropdown = chrome.storage.sync.get(null, function(data) {
    var keys = Object.keys(data);
    var options = $('select');
    for (var i = 0; i< keys.length; i++) {
      options.append('<option>' + keys[i]);
    }
    return options;
  })
  $('#workspaceList').append('<select id=\'myId\'>' + dropdown);
}

// retrieves all currently open tabs and then lists them in the page under the 'tabs'
function displayAllOpenTabs(query) {
  var tabNames = chrome.tabs.getAllInWindow(
      null, function(tabs) {
   //   console.log('the current tabs are  named ' + tabs[0].windowId + localStorage.getItem(tabs[0].windowId));
      if (localStorage.getItem(tabs[0].windowId) != null) {
        $('#tabs').append('<b>Workspace name of current tabs: <i>' + localStorage.getItem(tabs[0].windowId) + '</i></b>')

      } else {
        $('#tabs').append('<b style="font-size:12px; ">TABS OPEN IN CURRENT WINDOW:</b>')
      }
      $('#tabs').append(createListOfTabs(tabs, query))
  });
}

// iterates through each tab and calls dumpTab for each
function createListOfTabs(tabs, query) {
  var list = $('<ul>');
  for (var i = 0; i < tabs.length; i++) {
    list.append(dumpTab(tabs[i],query) );  
  }
  return list;
}

// this lists out a line item for a tab and creates the html around it for the popup
function dumpTab(tabNode, query) {
  if (tabNode.title) {
    if (query && !tabNode.children) { //if there is a query and there are no children
      if (String(tabNode.title).indexOf(query) == -1) {
        return $('<span></span>'); // if the query returns nothing (no children)
      }
    }

    var favicon = tabNode.favIconUrl;
    var favImg = $('<img>');
    favImg.attr('src', tabNode.favIconUrl);
    favImg.attr('class','favIcon');
    //start creating a link
    var anchor = $('<a>',{'target':"_blank"});
    anchor.attr('href', tabNode.url);
    anchor.attr('class', 'urlLink')
    anchor.text(tabNode.title);
	anchor.attr("target","_blank");
    
    //setting eventlistener
    //Clicking on a tab in the extension, fires with a new tab with the url
    anchor.click(function(){
      
	  chrome.tabs.create({url: tabNode.url});
    });

     // none of this span stuff is needed currently -- RE ADD IF WANT TO ADD OPTIONS DURING HOVERING/ / /
    var span = $('<span>');
    var options = '';
    /*var options = tabNode.children ?
      $('<span></span>') : //if there are children, then no options
      $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
        'href="#">Deleteeee</a>]</span>'); 

    var edit = tabNode.children ? 
      $('<table><tr><td>Name</td><td>' +  // if there are children - not relant for me?
      '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
      '</td></tr></table>') : $('<input>');
    // Show add and edit links when hover over.*/
    
    span.hover(function () {
      span.append(options);
      //options.fadeIn();
      },
      // unhover
      function() {
    //   options.remove();
      }).append(favImg).append(anchor);

    var li = $(tabNode.title ? '<li>' : '<div>').append(span);
  }
  return li;
}

$(document).on("click","a.urlLink",function(){
	var  t = $(this);
	   
	   if(t.attr("target")!="_blank"){
chrome.tabs.create({url:t.attr("href")});
	   }
})

document.addEventListener('DOMContentLoaded', function () {
  displayAllOpenTabs();
  displaySavedWorkspaces();
});
