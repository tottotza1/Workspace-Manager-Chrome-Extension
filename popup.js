window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})

//this only is run once DOM is complete.
$(function() {
  $('#all').click(function() {
    console.log('here');
    chrome.tabs.create({url: './files/allWorkspaces.html'})
  });
  $('#search').change(function() {
    $('#tabs').empty();
      dumpAllTabs($('#search').val());
    });
  $('#save').click(function() {
    saveChanges();
    $('#tabs').empty();
  });
  $('#open').click(function() { // listener for when 'get' is clicked
    workspaceDropDown = $('#myId').val();
    console.log(workspaceDropDown);
    chrome.storage.sync.get(workspaceDropDown, function(newData) {
      //console.log(newData);
      //var allKeys = Object.keys(newData);
      //console.log('allKeys ');
      //console.log(allKeys);
      //console.log(newData[workspaceDropDown]);
      //alert('The value is: ' + newData[getValue].firstItem); 
      //$('#tabs').empty();
      //$('#tabs').append(newData[workspaceDropDown].firstItem);
      openTabs(newData[workspaceDropDown].firstItem);
    });
  });
});

// called by open button
function openTabs(firstItem) {
  chrome.windows.create(null, function (w) {
    var doc = $(firstItem);
    var links = $('a', doc);
    for(var i=0;i<links.length;i++){
      chrome.tabs.create({windowId: w.id,
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

// function called to save a workspace
function saveChanges() {
  var workspaceName = $('#workspace').val();
  if (!workspaceName) {  // Check that there's some text there. should never get here
    alert('Error: No value specified');
    return;
  }
 
  $('#save').val('saved!');

  tabsValue = $('#tabs').html();
  var myList = {};
  myList['firstItem'] = tabsValue;
  var obj = {};
  obj[workspaceName] = myList;
  chrome.storage.sync.set(obj, function() {
    console.log('added tabs ');
    console.log(myList);
    console.log(' to workspace: ' + workspaceName);
    //alert('added workspace ' + theValue);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  dumpAllTabs();
  createWorkspaceList();
});
