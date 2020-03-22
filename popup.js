window.dataLayer = window.dataLayer || [];

function gtag(){dataLayer.push(arguments);}

gtag('js', new Date());
gtag('config', 'AW-796233903');


window.addEventListener('click',function(e){
  if(e.target.href!==undefined && e.target.getAttribute("target")!="_self"){
    chrome.tabs.create({url:e.target.href})
  }
})

gtag('event', 'conversion', {
    'send_to': 'AW-796233903/OiMQCPeg2o8BEK-h1vsC',
    'transaction_id': ''
});

//this only is run once DOM is complete.
$(function() {
  $('#all').click(function() {
    console.log('here');
    //chrome.tabs.create({url: './files/allWorkspaces.html'})
	window.location.href = "./files/allWorkspaces.html";
  });
  $('#search').change(function() {
    $('#tabs').empty();
      dumpAllTabs($('#search').val());
    });
  $('#save').click(function() {
    saveChanges();
    //$('#tabs').empty();
  });
  $('#open').click(function() { // listener for when 'get' is clicked
    workspaceDropDown = $('#workspaceSelection').val();
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
      openTabs(workspaceDropDown, newData[workspaceDropDown].firstItem);
    });
  });
//  $('#search_open').click(function() { // listener for when 'get' is clicked
  //  workspaceDropDown = 'AdWordsExtensions';//$('#workspaceSelection').val();
  //  console.log('this is never called....' + workspaceDropDown);
  //  chrome.storage.sync.get(workspaceDropDown, function(newData) {
      //console.log(newData);
      //var allKeys = Object.keys(newData);
      //console.log('allKeys ');
      //console.log(allKeys);
      //console.log(newData[workspaceDropDown]);
      //alert('The value is: ' + newData[getValue].firstItem); 
      //$('#tabs').empty();
      //$('#tabs').append(newData[workspaceDropDown].firstItem);
   //   openTabs(workspaceDropDown, newData[workspaceDropDown].firstItem);
   // });
 // });
});

// called by open button
function openTabs(currentkey, firstItem) {
  chrome.windows.create(null, function (w) {
    var doc = $(firstItem);
  //  console.log('this is the first item ' + firstItem)
  //  console.log('currentkey is' + currentkey) // to save current name, you would do it here.
  //  console.log(w.id)

    // Save data to localStorage -- need to clear this still.
    localStorage.setItem(w.id, currentkey);
  //  console.log('the stored key is' + localStorage.getItem(w.id)) // doesn't seem to work across windows... 
    var links = $('a', doc); 
    for(var i=0;i<links.length;i++){
      chrome.tabs.create({windowId: w.id, //index: i, //this is where you could change to not have an empty tab
                          url: links[i].href});
    }
  });
}

//called when popup opens to create workspace dropdown
function createWorkspaceList() {
//  chrome.windows.getCurrent(null, function(w) {
 //   console.log('in createWorkspace and the id is ' + w.id)
 //   console.log('the name already is: ' + localStorage.getItem(w.id))
//  });
  var dropdown = chrome.storage.sync.get(null, function(data) {
    var keys = Object.keys(data);
    var options = $('select');
    for (var i = 0; i< keys.length; i++) {
      options.append('<option>' + keys[i]);
    }
    return options;
  })
  $('#workspaceList').append('<select class="form-control" style="text-align-last:center" id=\'workspaceSelection\'>' + dropdown);
  
   setTimeout(function(){
    if(!$("#workspaceSelection option").length){
		$("#workspaceSelection").append("<option> Nothing found.</option>");
		}
   },100);
	}


// retrieves all tabs and then dumps them all into the popup
function dumpAllTabs(query) {
  if (!query) {  // by default show the open tabs
   $('#listingtitle').empty();
   var tabNames = chrome.tabs.getAllInWindow(
        null, function(tabs) {
     //     console.log('the current tabs are  named ' + tabs[0].windowId + localStorage.getItem(tabs[0].windowId));
          if (localStorage.getItem(tabs[0].windowId) != null) {
            $('#listingtitle').append('<b>Workspace name of current tabs: <i>' + localStorage.getItem(tabs[0].windowId) + '</i></b>')
            $('#workspace').val(localStorage.getItem(tabs[0].windowId))
          } else {
            $('#listingtitle').append('<b style="font-size:12px; ">TABS OPEN IN CURRENT WINDOW:</b>')
          }
          $('#tabs').append(dumpAllTabsNodes(tabs, query))
        }
    );
   return;
  } else { //if a search 
   $('#listingtitle').empty();
   $('#listingtitle').append('<b>SEARCH RESULTS:</b>')
   var allWorkspaces = chrome.storage.sync.get(
        null, function(data) {
          var keys = Object.keys(data);
          for (var i = 0; i<keys.length;i++) {
            dumpSearch(keys[i], query);       
          }
    });
  }
}

//show search results for a specified key
function dumpSearch (currentkey, query) {
   chrome.storage.sync.get(currentkey, function(newData) {
    if (newData[currentkey].firstItem.toLowerCase().indexOf(query.toLowerCase()) != -1) { 
      inputButton = $('<input class="btn btn-outline-warning btn-sm" type="submit" value="Open" id="search_open"><br>')
      inputButton.on('click',function () { searchOpener(currentkey, newData[currentkey].firstItem)} )
      $('#tabs').append(inputButton)
      $('#tabs').append('<b style="margin-left:5px;">' + currentkey + '<b>') //this is the workspace name
      $('#tabs').append(newData[currentkey].firstItem)

    }
   });
}

function searchOpener(currentkey, tabsToOpen) {
  console.log('tabstoOpen' + tabsToOpen)
  openTabs(currentkey, tabsToOpen);

}

// Given an array of tabs, iterates and calls dumpTab for each to place into a list item
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

    var favicon = tabNode.favIconUrl;
    var favImg = $('<img>');
    favImg.attr('src', tabNode.favIconUrl);
    favImg.attr('class','favIcon');
    //start creating a link
    var anchor = $('<a>');
    anchor.attr('href', tabNode.url);
    anchor.attr('class', 'urlLink')
    anchor.text(tabNode.title);

    //setting eventlistener
    //Clicking on a tab in the extension, fires with a new tab with the url
    anchor.click(function() {
      //chrome.tabs.create({url: tabNode.url});
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
    //  options.fadeIn();
      },
      // unhover
      function() {
    //   options.remove();
      }).append(favImg).append(anchor);

    var li = $(tabNode.title ? '<li>' : '<div>').append(span);
  }
  return li;
}

// function called to save a workspace
function saveChanges() {
  var workspaceName = $('#workspace').val();
  if (!workspaceName) {  // Check that there's some text there. 
    customAlert('Error: No value specified');
    return;
  }


  var tabsValue = $('#tabs').html();
  var myList = {};
  myList['firstItem'] = tabsValue;

  var d = new Date();
  var creationDate = d.toString();
  myList['createdDate'] = creationDate;
  
  chrome.storage.sync.get(workspaceName, function(data) { // didn't work to include the below here because it is a callback
    if ((Object.keys(data)).length != 0) {
      customAlert('Workspace already exists, overwriting currently is not supported. Existing Workspaces can be deleted via the Show All Tabs page');
      return;
    } else {   
      //create object with key/value
      var obj = {};
      obj[workspaceName] = myList;

      //store key/value obj
      chrome.storage.sync.set(obj, function() {
        console.log('added tabs ');
        console.log(myList);
        console.log(' to workspace: ' + workspaceName);
        //alert('added workspace ' + theValue);
      });
      $('#save').val('Saved!');   // in future, need to remove functionality of button too
     
	   window.location.reload();

    }
  })   
}

document.addEventListener('DOMContentLoaded', function () {
  dumpAllTabs();
  createWorkspaceList();
});



 function customAlert(text){
	 
	  $('<div style="padding:10px;" title="Error" />').html(text).dialog( { // this is the overlay dialog box
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
         'OK': function() {
          $(this).dialog('destroy');
          }  //need to set focus
        }
      }).dialog('open');
	  

 }
