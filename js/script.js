







  var app = angular.module("myapp",[]);
  
      app.controller("ctrl",function($scope,$http,$compile,$interval){
	  
	    var languages = {};
		var language  = "english";
		
		   if(localStorage.language){
			   language = localStorage.language;
		   }
		
		  $scope.language = language;
		  $scope.languages = languages;
		
	      $http.get(chrome.extension.getURL("js/languages.json")).then(function(res){
			  languages = res.data;
			  $scope.languages = languages;
			  
		  })
		  
		  $scope.l = function(key){
		  var current =  $scope.languages[$scope.language] || {};
			   return current[key];
			   
			
			   
		  }
		  
		  $scope.save = function(){
			  localStorage.language = $scope.language;
		  }
		  
		  
		  $interval(function(){
			  
			  var el = ".lan:contains('l('),button:contains('l('), .ui-dialog-title:contains('l(')";
			   
			     if($(el).length){
			     compileAngularElement(el);
				 }
		  },10);
		  
		  
		   function compileAngularElement( elSelector) {
                
        var elSelector = (typeof elSelector == 'string') ? elSelector : null ;  
            
        if (elSelector != null ) {
            var $div = $( elSelector );
                   $compile($div)($scope);
                              
            }

        }
		  
		  
		  
		
	  
	  })
	  
	  