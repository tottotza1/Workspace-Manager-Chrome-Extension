

function dumpAllWorkspaces() {
	var allWorkspaces = chrome.storage.sync.get(null, function(data){
		var keys = Object.keys(data);
		for (var i = 0; i<keys.length;i++){
			dumpWorkspace(keys[i]);
		}
	})
}


function dumpWorkspace(workspace) {
	console.log(workspace);
	chrome.storage.sync.get(workspace, function(newData) {
		var options = $('<span>[<a id="deletelink" ' + 'href="#">Delete Workspace</a>]</span>');
        var span = $('<span id=\'' + workspace + '\'>');
        span.hover(function () {
        	span.append(options);
        	$('#deletelink').click(function() {
              $('#deletedialog').empty();
              $('#deletedialog').dialog({
                 autoOpen: false,
                 title: 'Delete Workspace',
                 resizable: false,
                 height: "auto",
                 width: "auto",
                 modal: false,
                 overlay: {
                   backgroundColor: '#FFF',
                   //opacity: 0.5
                 },
                 buttons: {
                   'Yes, Delete It!': function() {
                      chrome.storage.sync.remove(workspace, function() {
                      span.parent().remove();
                      $(this).dialog('destroy');               	
                      });

                    },
                    Cancel: function() {
                      $(this).dialog('destroy');
                    }
                 }
               }).dialog('open');
         	});
      		options.fadeIn();
      		},
      		// unhover
      		function() {
       			options.remove();
      		}).append('<b>' + workspace + '</b></br>');// + newData[workspace].firstItem);
		//create Link
		var div = $('<div>'); //doing this so that 'delete' shows up under title, but then removes bullets as well.
		div.append(span);
		div.append(newData[workspace].firstItem);
		$('#playground').append(div);
	})
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

// retrieves all tabs and then dumps them all into the popup
function dumpAllTabs(query) {
  var tabNames = chrome.tabs.getAllInWindow(
      null, function(tabs) {
      $('#tabs').append(dumpAllTabsNodes(tabs, query))
  });
}

// iterates through each tab and calls dumpTab for each
function dumpAllTabsNodes(tabs, query) {
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

    //start creating a link
    var anchor = $('<a>');
    anchor.attr('href', tabNode.url);
    anchor.text(tabNode.title);

    //setting eventlistener
    //Clicking on a tab in the extension, fires with a new tab with the url
    anchor.click(function() {
      chrome.tabs.create({url: tabNode.url});
    });

    // none of this span stuff is needed currently///
    var span = $('<span>');
    var options = tabNode.children ?
      $('<span></span>') : //if there are children, then no options
      $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
        'href="#">Deleteeee</a>]</span>');

    var edit = tabNode.children ? 
      $('<table><tr><td>Name</td><td>' +  // if there are children - not relant for me?
      '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
      '</td></tr></table>') : $('<input>');
    // Show add and edit links when hover over.
    
    span.hover(function () {
      span.append(options);
      options.fadeIn();
      },
      // unhover
      function() {
       options.remove();
      }).append(anchor);

    var li = $(tabNode.title ? '<li>' : '<div>').append(span);
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpAllTabs();
  dumpAllWorkspaces();
});
