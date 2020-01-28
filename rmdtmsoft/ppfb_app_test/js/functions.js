var         urlServerHttp =  "../mdata" ; "https://www.portaportese.it/mdata" ; //
var         ServerVersion ;
var         ADVConfig = { "bannerbottom": 0 , "interstitial": 0 };
var         timeoutID ;

 var DBRemote_rubriche = [
    {ID: 'CA', IDR: 'C1', Categoria: 1, Nome: "Ville e appartamenti (Romaz)", FlagSotto: 0, Ordinamento: 'DPM'},
    {ID: 'CB', IDR: 'C2', Categoria: 1, Nome: "Terreni", FlagSotto: 0, Ordinamento: 'DPM'},
    {ID: 'CC', IDR: 'C3', Categoria: 1, Nome: "Locali", FlagSotto: 0, Ordinamento: 'DPM'},
    {ID: 'CD', IDR: 'C4', Categoria: 1, Nome: "Affitto - Subaffitto", FlagSotto: 0, Ordinamento: 'DPM'},
    {ID: 'CE', IDR: 'C5', Categoria: 1, Nome: "Affitti stagionali", FlagSotto: 0, Ordinamento: 'DPM'},
    {ID: 'CF', IDR: 'C6', Categoria: 1, Nome: "Cessione aziende", FlagSotto: 0, Ordinamento: 'DPM'},
    {ID: 'CG', IDR: 'C7', Categoria: 1, Nome: "Finanziamento società", FlagSotto: 0, Ordinamento: 'DPM'},
    {ID: 'CH', IDR: 'C8', Categoria: 1, Nome: "Ville e appartamenti (fuori Roma)", FlagSotto: 0, Ordinamento: 'DPM'},
];

(function($) {
    $.fn.enterAsTab = function(options) {
        var parent= $(this);
        console.log(parent)
        var settings = $.extend({
            'allowSubmit': false
        }, options);
        $(this).find('input, select, textarea, button').on("keydown", {localSettings: settings}, function(event) {
            if (settings.allowSubmit) {
                var type = $(this).attr("type");
                if (type == "submit") {
                    return true;
                }
            }
            if (event.keyCode == 13) {
                var inputs = $(this).parents(parent.selector).eq(0).find(":input:visible:not(:disabled):not([readonly])");
                var idx = inputs.index(this);
                if (idx == inputs.length - 1) {
                    idx = -1;
                } else {
                    inputs[idx + 1].focus(); // handles submit buttons
                }
                try {
                    inputs[idx + 1].select();
                }
                catch (err) {
                   
                }
                return false;
            }
        });
        return this;
    };
})(jQuery);


/*
    Mditommaso
    Restituisce lo stato della Rete
*/


function encodeStr(uncoded) {
  var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";	
  uncoded = uncoded.toUpperCase().replace(/^\s+|\s+$/g,"");
  var coded = "";
  var chr;
  for (var i = uncoded.length - 1; i >= 0; i--) {
    chr = uncoded.charCodeAt(i);
    coded += (chr >= 65 && chr <= 90) ? 
      key.charAt(chr - 65 + 26*Math.floor(Math.random()*2)) :
      String.fromCharCode(chr); 
    }
  return encodeURIComponent(coded);  

}

function decodeStr(coded) {
  var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";	
  coded = decodeURIComponent(coded);  
  var uncoded = "";
  var chr;
  for (var i = coded.length - 1; i >= 0; i--) {
    chr = coded.charAt(i);
    uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ?
      String.fromCharCode(65 + key.indexOf(chr) % 26) :
      chr; 
    }
  return uncoded;   
} 

function checkConnection ()
{   
    
    console.log ( "functions.js::checkConnection::" ) ;
    
    if( typeof navigator.connection == 'undefined' ) 
    {
        console.log ( "functions.js::checkConnection:: BROWSER" ) ;     
        return "BROWSER" ;   
    }
    
    var states = {} ;    
    var networkState = navigator.network.connection.type ; // navigator.connection.type ;
    console.log ( "checkConnection:: " + states[networkState] ) ;
        
    states[Connection.UNKNOWN]  = 'Connessione Sconosciuta' ;
    states[Connection.ETHERNET] = 'Rete Ethernet' ;
    states[Connection.WIFI]     = 'Rete WiFi' ;
    states[Connection.CELL_2G]  = 'Cellulare 2G' ;
    states[Connection.CELL_3G]  = 'Cellulare 3G' ;
    states[Connection.CELL_4G]  = 'Cellulare 4G' ;
    states[Connection.NONE]     = 'Nessuna connessione' ;
    
    // Bug
    return "BUG" ;
       
    if ( networkState == Connection.UNKNOWN || networkState == Connection.NONE ) 
    {
        var messaggio = "No data connection available" ;
        navigator.notification.alert(messaggio, alertDismissed ,"Warning","OK");
    
        return "" ;
    }    
    else
    {
        //console.log ( "checkConnection:: " + states[networkState] ) ;
    
        return states[networkState] ;
    }
    
    return "Connessione Sconosciuta" ;    
                     
}

/*
    Eventuali azioni alla chiusura della Alert
*/
function alertDismissed() {
    // do something
}
/*
    04/08/2014 Mditommaso
    Carica Configurazione App dal Server per:
        - Controllo Versione
        - Controllo ADV
        - Varie
*/
function loadConfig ( _platform , _bCheckVersion )
{
    console.log("functions.js::loadConfig " + _platform + " " + urlServerHttp );
    
	$.ajax({
        dataType: "json",
		type: "GET",
		data: {},
        async: false,
		crossDomain: false , 
		cache: false ,				  
		url: urlServerHttp+"/config.json?r=" + Math.random() ,
		success: function(dati){            
            console.log ( "functions.js::loadConfig" + JSON.stringify ( dati ) ) ;
            
            ServerVersion = dati ["versioni"]  ;
            
            ADVConfig = dati ["adv"][ _platform ]  ;
            
            console.log ( "functions.js::loadConfig ADVConfig: " + JSON.stringify ( ADVConfig ) ) ;
            
            // Eventuale Controllo di versione
            if ( _bCheckVersion ) checkVersion ( true , false ) ;
            
            // Eventuale Caricamento DB Aggiornato
            console.log ( "functions.js::loadConfig: ServerVersion[DB]: " + ServerVersion [ "db"] ) ;            
            //if (  ServerVersion [ "db"] > localDB ) updateDBFromServer () ;
            
		},
        error:  function (dati){
			console.log ( "functions.js::loadConfig errore" + JSON.stringify ( dati ) ) ;	        
		}
		
	 });
}

/*
    Controllo Versione
*/
function checkVersion ( _bMessage , _bNotify )
{  
    console.log ( "functions.js::checkVersion " + ServerVersion ["ipad"] + " " + AppVersion ) ;
    
    if ( ServerVersion ["ipad"] > AppVersion ) {
        
        var msg = ServerVersion ["msg"] ;
                         
        if ( isPhonegap && typeof navigator.notification != "undefined" ) {
			if ( _bMessage ) navigator.notification.alert ( msg[ langId ] , onAlertCheckVersion , "Message" ) ;
			
			if ( _bNotify )
            {
                window.plugin.notification.local.add({
                    id:1,message:  msg[ langId ],badge:1
                });
                        
                console.log ( "functions.js::checkVersion notifica ON" );                         
            }

		} else {
			if ( _bMessage ) alert ( msg [ langId ] ) ;            
		}
      
    } 
    else
    {        
        if ( _bNotify ) {
            window.plugin.notification.local.cancelAll ();
            console.log ( "common.js::checkVersion notifica OFF" );     
        }   
    } 
    
    
}

function onAlertCheckVersion ()
{
    // Callback della message che avverte di una nuova versione disponibile
}


function loadBannerBottom() {
    $('.dx-active-view .adv-banner').load("http://rmdtmsoft.it/adserver/www/delivery/afr.php?zoneid=2&amp;cb=1",function(response, status, xhr ) {

        lstr_Html = $('.dx-active-view .adv-banner').find("a").each(function(index, element) {
				
			lsUrl = JSON.stringify($(element).attr("href"));   
			lsUrl = lsUrl.replace(/"/g,"'")
			$(element).attr("style","display:block");
			$(element).attr("ontouchstart",'window.open('+lsUrl+", '_system');return false")											
			$(element).attr("href","")                          												
				
        });

	});
}

/*
    Aggiornamento DB dal server
*/
function updateDBFromServer ( )
{
	return ; 
    
    /*
	$.getScript( urlServerHttp + "/app/db/db.js?r=" + Math.random() )
	  .done(function( script, textStatus ) {
		  DevExpress.ui.notify("I dati sono stati aggiornati", "info", 2000);			
	  })
	  .fail(function( jqxhr, settings, exception ) {
		  DevExpress.ui.notify("Errore aggiornamento dati", "error", 2000);			
	});
    */

    console.log( "functions.js::updateDBFromServer"  ) ;
    
    DevExpress.ui.notify("Aggiornamento in corso...", "info", 2000);			

        
	$.ajax({
        dataType: "json",
		type: "GET",
		data: {},
		crossDomain: false , 
		cache: false ,				  
		url: urlServerHttp + "/app/db/db.json?r=" + Math.random() ,
		success: function(dati){            
            //console.log ( "functions.js::updateDBFromServer: " + JSON.stringify ( dati["TabellaOfferteRichieste"]  ) ) ;
            
            console.log( "functions.js::updateDBFromServer aggiornamento categorie"  ) ;
            PortaPortese.db.categorie._array = dati["categorie"] ;
            
            console.log( "functions.js::updateDBFromServer aggiornamento rubriche"  ) ;
            console.log(PortaPortese.db.rubriche)
            PortaPortese.db.rubriche._array = dati["rubriche"] ;
            
            console.log( "functions.js::updateDBFromServer aggiornamento sottorubriche"  ) ;
            PortaPortese.db.sottorubriche._array = dati["sottorubriche"] ;
            
            console.log( "functions.js::updateDBFromServer aggiornamento TabellaOfferteRichieste"  ) ;
            PortaPortese.db.TabellaOfferteRichieste._array = dati["TabellaOfferteRichieste"] ;
            
            console.log( "functions.js::updateDBFromServer aggiornamento TabellaZone"  ) ;
            PortaPortese.db.TabellaZone = dati["TabellaZone"] ;
            
            // Le Tabella di filtirirubriche non possono essere aggiornate automaticamente
            // ma vanno aggiornate in un ciclo assegnandogli il contenuto della singola tabella
            PortaPortese.db.dsFiltrirubriche._store["_array"] = dati["filtrirubriche"] ;
            var datiFiltriRubriche = PortaPortese.db.dsFiltrirubriche._store["_array"] ;
            
            console.log( "functions.js::updateDBFromServer datiFiltriRubriche.length: " + datiFiltriRubriche.length ) ;
            for ( var idx = 0 ; idx < datiFiltriRubriche.length ; idx ++)
            {
                console.log ( "functions.js::updateDBFromServer: " + datiFiltriRubriche[idx]["Tabella"] ) ;
                // Nome della Tabella da aggiornare
                strTabella = datiFiltriRubriche[idx]["Tabella"] ;
                
                // Controllo se la tabella esiste
                console.log ( "functions.js::updateDBFromServer: " + dati[ strTabella ] ) ;
                datiFiltriRubriche[idx]["Tabella"] = dati[ strTabella ] ;    
            }
            
            console.log( "functions.js::updateDBFromServer aggiornamento listaArray"  ) ;
            PortaPortese.db.listaArray = dati["listaArray"] ;
            
            console.log( "functions.js::updateDBFromServer aggiornamento listaTipologiaImmobile"  ) ;
            PortaPortese.db.listaTipologiaImmobile = dati["listaTipologiaImmobile"] ;
            
            
            console.log( "common.js::updateDBFromServer FINE aggiornamenti"  ) ;
            
		},
        error:  function (dati){
			console.log ( "common.js::updateDBFromServer errore: " + JSON.stringify ( dati ) ) ;	        
		}
		
    });
 

}
 /*Permette di bloccare (o meno) una rotazione del dispositivo (in questo caso Landscape)
 
 
function shouldRotateToOrientation ( rotation )
{
	
	console.log("rotazione")
    switch  (rotation)
    {   // Portrait
        case 0:
        case 180:
        return true ;
        // Landscape
        case 90:
        case -90:                    
        return isRotable;
    }    
	
}*/
