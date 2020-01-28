window.PortaPortese = window.PortaPortese || {};

window.realDevice = DevExpress.devices.real();
window.currentDevice = DevExpress.devices.current();
window.isWin8Phone = realDevice.platform == "win8" && realDevice.phone == true;

$(function () {
    isRotable = false;
   // DevExpress.devices.current({ platform: "generic" });
   if(currentDevice.platform === "win8" && currentDevice.phone) {
	  DevExpress.devices.current({ platform: "generic" });
   }
	Globalize.culture("it");
    function exitApp() {
    
        var result = DevExpress.ui.dialog.confirm("Sei sicuro di voler uscire?" , "Attenzione");
        result.done(function (dialogResult) {    
            
            /*  if(confirm("Sei sicuro di voler uscire?" , "Attenzione")) { */
            if ( dialogResult ) 
            {
                switch (window.realDevice.platform) {
                    case "android":
                        navigator.app.exitApp();
                        break;
                    case "win8":
                        window.external.Notify("DevExpress.ExitApp");
                        // RMDTMSoft - necessita del nostro plugin ExitApp
                        cordova.exec(null, null, "ExitApp", "execute", []);
                        break;
            
                }
            }    
        });
        
        
        
        
        
    }

    function onDeviceReady() {
        g_cordova=true;
        console.log ( "index.js::onDeviceReady") ;
        
        /*
        console.log ( "index.js::onDeviceReady ************************************" );
        console.log ( "index.js::onDeviceReady Device Model: "    + device.model     );
        console.log ( "index.js::onDeviceReady Device Cordova: "  + device.cordova   );
        console.log ( "index.js::onDeviceReady Device Platform: " + device.platform  );
        console.log ( "index.js::onDeviceReady Device UUID: "     + device.uuid      );
        console.log ( "index.js::onDeviceReady Device Version: "  + device.version   );
        console.log ( "index.js::onDeviceReady ************************************" );
        */
        
        if (currentDevice.platform != "win8") {
            navigator["splashscreen"].hide(); //nasconde la splash (notare la sintassi plugin come stringa per evitare errori se non presente)
            
            // l'Ipad � ruotabile
            if ( navigator.userAgent.indexOf("iPad") == -1 ) screen.lockOrientation('portrait');
		}
        document.addEventListener("backbutton", onBackButton, false);
        PortaPortese.app.navigatingBack.add(function (args) {
            if(!PortaPortese.app.canBack()) {
                args.cancel = true;
                exitApp();
            }
        });
        
        // Inizializzazione Google Analytics
    	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    	 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    	 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    	 })(window,document,'script','./analytics.js','ga');
    	
    	console.log("index.js::ondeviceready device.platform:" + device.platform + " | realDevice.platform:" + realDevice.platform);
        
        if( typeof device !== 'undefined' ) { 
            //GA_uuid = device.uuid ;
            console.log ( "index.js::ondeviceready device.uuid:" + GA_uuid ) ;
        }
        console.log ( "index.js::ondeviceready device.uuid:" + GA_uuid ) ;
              
        if (realDevice.platform == "ios") GA_UA = "UA-866200-5";
        if (realDevice.platform == "android") GA_UA = "UA-866200-6";
        if (realDevice.platform == "win8" ) GA_UA = "UA-866200-7";
        
        console.log ( "index.js::ondeviceready GA_UA:" + GA_UA ) ;
                                
    	ga('create', GA_UA, {
    	   'storage': 'none',
    	   'clientId':GA_uuid
        });
    	
    	ga('send', 'pageview', {
    	    'page': '/Home' , 
            'title': '/Home' 
        });
                
        ga('send', {
		  hitType: 'event',
		  eventCategory: 'Home',
		  eventAction: 'Navigation',
		  eventLabel: 'Home'
		});
		
    }
             

    function onBackButton() {
        DevExpress.hardwareBackButton.fire();
    }

    PortaPortese.app = new DevExpress.framework.html.HtmlApplication({
        namespace: PortaPortese,
        mode:"webSite",
	    layoutSet: DevExpress.framework.html.layoutSets["simple"],
        animationSet: DevExpress.framework.html.animationSets[PortaPortese.config.animationSet],
	   
        navigation: PortaPortese.config.navigation,
      //  navigateToRootViewMode: "keepHistory",
        commandMapping: PortaPortese.config.commandMapping
    });
    PortaPortese.app.router.register(":view/:id/:type", { view: "InserimentoAnnuncio", id: undefined, type: undefined });
    PortaPortese.app.viewRendered.add(function(args) {
        var viewInfo = args.viewInfo;
        if(viewInfo.viewTemplateInfo.toolbar === false)
            viewInfo.renderResult.$markup.addClass("hide-toolbar");
    });
   

    // TODO: Ma che p sto codice buttato qui in mezzo ??
    var device = DevExpress.devices.current();
    var UUID_KEY = 'portaPortese-uuid';	
	http_url = "https://www.portaportese.it/"; //server produzione
	//http_url="http://admin:pp11298@ppappsrv01.inroma.roma.it"; //server test
	telefono = "0670199";
	GA_uuid = localStorage.getItem(UUID_KEY);
	console.log(GA_uuid)
	if (!GA_uuid) {
		GA_uuid = device.platform + Math.floor((Math.random() * 1000000000) + 1);
		localStorage.setItem(UUID_KEY, GA_uuid);		        		
	}
	console.log(GA_uuid)	
	g_appIdPortaPortese = "976213512470288";
	g_appIdPortaPortese="395459864120732"
	g_cordova=false;
    g_utenteLoggato=false;
	g_UserLogin ="";
	g_PasswordLogin = "";
	g_TokenLogin="";
	g_LoginFB=false;
    // Controllo per mancanza connessione o errore DB
    if( typeof ObjFiltriDefault == 'undefined' )  
    {
        DevExpress.ui.notify("Nessuna connessione dati", "error",5000);    
    }
    else
    {
	   objFiltri= new ObjFiltriDefault();
	   objFiltriLast = JSON.stringify (objFiltri) ;
    }
    	
    function setScreenSize() {
        if (window.isWin8Phone) {
            device.screenSize = "small";
            return;
        }
        var el = $("<div>").addClass("screen-size").appendTo(".dx-viewport");
        var size = getComputedStyle(el[0], ":after").content.replace(/"/g, "");
        el.remove();
        device.screenSize = size;        
    };
    $(window).bind("resize", setScreenSize);
    setScreenSize();
	$('body').css('padding-top', 0); // <== toglie lo spazio della status bar
    PortaPortese.app.navigate();
    
    document.addEventListener("deviceready", onDeviceReady, false);
});


!function () {
   
    var FAVES_STORAGE_KEY = 'portaPortese-favorites';
    var SEARCH_STORAGE_KEY = 'portaPortese-search';	
    var USER_LOGIN_KEY = 'portaPortese-login-user';		
    var PASSWORD_LOGIN_KEY = 'portaPortese-login-pass';			
    var TOKEN_LOGIN_KEY = 'portaPortese-login-token';			    
    var LOGIN_FB = 'portaPortese-login-fb';			    	



    var loadFavesFromStorage = function () {
        
        var rawFaves = localStorage.getItem(FAVES_STORAGE_KEY),
            faves = JSON.parse(rawFaves || '[]');
            
        $.each(faves, function (_, value) {
        
            value.IsFavorite = ko.observable(true);

            

			value.changeFavState = function (e) {
			    var me = e.model;
			    if (me.IsFavorite()) {
					console.log('rimosso')
					PortaPortese.faves.remove(function (item) { return item.oid == me.oid });
					DevExpress.ui.notify("Preferito rimosso", "success", 2000);            					
			    }else{
				    PortaPortese.faves.push(me);
					DevExpress.ui.notify("Preferito aggiunto", "success", 2000);            								
			    }
			        
					

					
					
					
					
			        
			}
         

	           

            
        });
        //console.log("index.js:: faves " + JSON.stringify(faves));
        return faves;
    }

    var saveFavesToStorage = function () {
        localStorage.setItem(FAVES_STORAGE_KEY, JSON.stringify(faves()));
    }
    var saveLoginToStorage = function (user,password,token,loginfb) {
        localStorage.setItem(USER_LOGIN_KEY, user);
//		encryptedAES = CryptoJS.AES.encrypt(password, "rmdtmsoft");
        localStorage.setItem(PASSWORD_LOGIN_KEY, encodeStr(password));		
		localStorage.setItem(TOKEN_LOGIN_KEY, token);		        
		localStorage.setItem(LOGIN_FB, loginfb);		        		
    }
    var loadLoginToStorage = function () {
		g_UserLogin = localStorage.getItem(USER_LOGIN_KEY);
		console.log(g_UserLogin);		
		g_PasswordLogin=localStorage.getItem(PASSWORD_LOGIN_KEY);
		
		if (g_PasswordLogin) {
			g_PasswordLogin = decodeStr(g_PasswordLogin);		
		}
		console.log(g_PasswordLogin);
		g_TokenLogin = localStorage.getItem(TOKEN_LOGIN_KEY);				

		g_LoginFB= localStorage.getItem(LOGIN_FB);						
			
    }
    
	
        
	
    var faves = ko.observableArray(loadFavesFromStorage());
	

    ko.computed(function () {
        saveFavesToStorage();
    });

    var findFavedProperty = function (property) {
        if (!property)
            return null;
        var result = $.grep(faves(), function (item) {
            return item.oid === property.oid;
        });
        return result[0];
    }



    $.extend(PortaPortese, {
        faves: faves,
        findFavedProperty: findFavedProperty,
        loadFavesFromStorage: loadFavesFromStorage,
        saveFavesToStorage: saveFavesToStorage,
		saveLoginToStorage:saveLoginToStorage,
		loadLoginToStorage:loadLoginToStorage
   });

}();
/* FUNZIONI DI APPLICAZIONE */

function RemoveViewFromCache(viewName) { //rimuove dalle cache tutti gli url di quella vista 
        var requiredView = null;
        for (var prop in PortaPortese.app._viewCache._cache) {
            var v = PortaPortese.app._viewCache._cache[prop];
            if (v.viewName == viewName) {				
                requiredView = prop;
				PortaPortese.app._viewCache.removeView(requiredView);
            }
        }
}