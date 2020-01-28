window.PortaPortese = $.extend(true, window.PortaPortese, {
  "config": {
    "layoutSet": "simple",
    "animationSet": "default",
    "commandMapping": {
      "ios-header-toolbar": {
        "defaults": {
          "showIcon": "true",
          "showText": "false",
          "location": "after"
        },
        "commands": [
	      {
	          "id": "list",
	          "location": "after"
	      },	  			      
	      {
	          "id": "gallery",
	          "location": "after"
	      },
	      {
	          "id": "map",
	          "location": "after"
	      },
	      {
	          "id": "chiama",
	          "location": "after"
	      },
	      {
	          "id": "email",
	          "location": "after"
	      },		  
	      {
	          "id": "logout",
	          "location": "after"
	      },		  
		  
	      {
	          "id": "menu-edit",
	          "location": "after"
	      },
		  
	      
        ]
      },
      "generic-header-toolbar": {
        "defaults": {
          "showIcon": "true",
          "showText": "false",
          "location": "after"
        },
        "commands": [
	      {
	          "id": "list",
	          "location": "after"
	      },	  			      
	      {
	          "id": "gallery",
	          "location": "after"
	      },
	      {
	          "id": "map",
	          "location": "after"
	      },
	      {
	          "id": "chiama",
	          "location": "after"
	      },
	      {
	          "id": "email",
	          "location": "after"
	      },		  		  
	      {
	          "id": "logout",
	          "location": "after"
	      },		  		  
	      {
	          "id": "menu-edit",
	          "location": "after"
	      },
		  
	      
        ]
      },
      "android-simple-toolbar": {
        "defaults": {
          "showIcon": "true",
          "showText": "false",
          "location": "after"
        },
        "commands": [
	      {
	          "id": "list",
	          "location": "after"
	      },	  			      
	      {
	          "id": "gallery",
	          "location": "after"
	      },
	      {
	          "id": "map",
	          "location": "after"
	      },
	      {
	          "id": "chiama",
	          "location": "after"
	      },
	      {
	          "id": "email",
	          "location": "after"
	      },	
	      {
	          "id": "logout",
	          "location": "after"
	      },		  
		  	  		  
	      {
	          "id": "menu-edit",
	          "location": "after"
	      },
		  
	      
        ]
      },
      "win8-phone-appbar": {
        "defaults": {
          "showIcon": "true",
          "showText": "false",
          "location": "after"
        },
        "commands": [
	      {
	          "id": "list",
	          "location": "after"
	      },	  			      
	      {
	          "id": "gallery",
	          "location": "after"
	      },
	      {
	          "id": "map",
	          "location": "after"
	      },
	      {
	          "id": "chiama",
	          "location": "after"
	      },
	      {
	          "id": "email",
	          "location": "after"
	      },		  		  
	      {
	          "id": "logout",
	          "location": "after"
	      },		  
		  
	      {
	          "id": "menu-edit",
	          "location": "after"
	      },
		  
	      
        ]
      }
	  	  
	  
    },
    "navigation": [
      {
        "title": "Home",
        "action": "#Home",
        "icon": "find"
      },
      {
        "title": "Preferiti",
//        "action": "#Favorites",
        "icon": "favorites",
		action: function (e) {
                    PortaPortese.app.navigate('Favorites', { root: false });
        }
      },
      {
        "title": "Login",
        "action": "#Account",
        "icon": "user",
        "root":false 
      },            
      {
        "title": "Inserisci",
        "action": "#InserimentoAnnuncio",
        "icon": "edit",
        "root":false
      }      ,	  
      {
        "title": "Info",
        "action": "#About",
        "icon": "info",
        "root":false
      }      
    ]
  }
});