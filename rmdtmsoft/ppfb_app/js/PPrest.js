var     RestToken = "" ;

//var HTTPSERVERREST = "https://testing.portaportese.it/rest/";
var     HTTPSERVERREST          = "https://data.portaportese.it/rest/" ;
var     HTTPUSR                 = "";
var     HTTPPWD                 = "" ;
/*
beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(HTTPUSR + ":" + HTTPPWD));
         },
         
xhr.open(method, url, true);
            xhr.setRequestHeader(Access-Control-Allow-Origin, https://<ORIGINSERVER>));
            xhr.setRequestHeader(Access-Control-Allow-Credentials, true);
            xhr.setRequestHeader(Access-Control-Allow-Methods, GET);
         
*/
var     AUTHFB                  = "Cr45FHRr51ViGnlfrxVSwf31" ;

var     RESTLOGIN               = "login" ;
var     RESTLOGINFB             = "utente/fb"
var     RESTREGISTRAZIONE       = "utente" ;
var     RESTFBTOKEN             = "utente/fbtoken" ;
var     RESTRECUPERAPASS        = "utente/recuperapass" ;
var     RESTLISTAANNUNCI        = "/lista" ;
var     RESTSTATOANNUNCIO       = "statoannuncio" ;
var     RESTINSERISCIANNUNCIO   = "" ;                      // POST annuncio/{token}
var     RESTRIPRISTINOANNUNCIO  = "" ;
var     RESTCANCELLAANNUNCIO    = "" ;
var     RESTIMPEGNAKA           = "impegnaka" ;
var     RESTALBERO              = "albero" ;
var     RESTALIMENTAZIONEAUTO   = "alimentazioneauto" ;
var     RESTAVISUALIZZANNUNCIO  = "" ;                      // GET su /annuncio/{token}/{KA}
var     RESTMODIFICAANNUNCIO    = "" ;                      // POST su /annuncio/{token}/{ka}

/* Struttura di default per l'inserimentoAnnuncio */
function ObjCampiInserimentoAnnuncioDefault() {    
    this.testo = "" ;
    this.stato="";
    this.rubric = "";
    this.tiprec = null;    
    this.tipologiaimmobile = null ;
    this.classeenergetica = null ;
    this.addinfo = null ;   
    this.pubblicaemail = "false" ;
    this.latitudine = "";	
    this.longitudine= "";		
    this.pref1 = "";
    this.telef1 = "" ;
    this.pref2 = "";            
    this.telef2 = "" ;         
    this.latitudine = null ;
    this.longitudine =null ;
    this.anno = null ;
    this.prezzo = "" ;
    this.locali = null ;
    this.superficie = null;    
    this.km =null
    this.alimentazione=null;
    this.tipologiamodello = null ;        
    this.bRichieste = '0';
}

/*

    Servizio Rest per esecuzione Login
    Restituisce un token da registrare in sessione ed utilizzare in tutte le succesive chiamate

*/
function wsRestLogin ( _strLogin , _strPassword )
{
	 // Create a new Deferred.
    var dfd = new $.Deferred();
    var strURL = HTTPSERVERREST + RESTLOGIN ;
    console.log ( "PPrest.js::wsRestLogin " + strURL ) ;
 	
    jQuery.ajax({
         type: "POST",
         url: strURL ,         
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         crossDomain: true,
         dataType: "html",
         data: { username: _strLogin, password: _strPassword } ,
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestLogin " + status + " " + data ) ;
			 dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestLogin " + status ) ;
            console.log ( "PPrest.js::wsRestLogin " + JSON.stringify( jqXHR ) )  ;
            dfd.resolve(false,jqXHR);
         }
     });
     return dfd.promise();
}

/*
    Servizio Rest per esecuzione Login Facebook
    Restituisce un token da registrare in sessione ed utilizzare in tutte le succesive chiamate
    curl -s POST -d "auth=Cr45FHRr51ViGnlfrxVSwf31&facebookid=123456789abcd&email=mancini.ro@gmail.com&nome=luca&cognome=brancae" 
    http://ppappsrv03.inroma.roma.it/rest/utente/fb
*/
function wsRestLoginFB ( _facebookId,  _strEmail , _strNome , _strCognome )
{
	 // Create a new Deferred.
    var dfd = new $.Deferred();
    var strURL = HTTPSERVERREST + RESTLOGINFB ;
    
    var _strAuth = AUTHFB ;  
    
    console.log ( "PPrest.js::wsRestLoginFB " + strURL ) ;
 	console.log("PPrest.js::wsRestLoginFB " +_strAuth )
 	console.log("PPrest.js::wsRestLoginFB " +_facebookId )
 	console.log("PPrest.js::wsRestLoginFB " +_strEmail )
 	console.log("PPrest.js::wsRestLoginFB " +_strNome )
 	console.log("PPrest.js::wsRestLoginFB " +_strCognome )				
    jQuery.ajax({
         type: "POST",
         url: strURL ,         
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "html",
         data: { auth: _strAuth, facebookid: _facebookId , email: _strEmail, nome: _strNome, cognome: _strCognome } ,
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestLoginFB " + status + " " + data ) ;
			 dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestLoginFB " + status ) ;
            console.log ( "PPrest.js::wsRestLoginFB " + JSON.stringify( jqXHR ) )  ;
            dfd.resolve(false,jqXHR);
         }
     });
     return dfd.promise();
}

/*
    Servizio Rest per Registrazione
    Restituisce un JSON
*/
function wsRestRegistrazione ( _strEmail , _strNome ,  _strCognome , _strTelefono , _bAccetto , strIpAddress )
{
	 // Create a new Deferred.
    var dfd = new $.Deferred();
    var strURL = HTTPSERVERREST + RESTREGISTRAZIONE ;
    console.log ( "PPrest.js::wsRestRegistrazione " + strURL ) ;
 	
    jQuery.ajax({
         type: "POST",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "JSON",
         data: { email: _strEmail, nome: _strNome, cognome: _strCognome, telefono: _strTelefono, accetto67596: _bAccetto, ipaddress: strIpAddress} ,
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestRegistrazione " + status + " " + data ) ;
			 dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestRegistrazione " + status ) ;
            console.log ( "PPrest.js::wsRestRegistrazione " + JSON.stringify( jqXHR ) )  ;
            dfd.resolve(false,jqXHR);wsRestRegistrazione
         }
     });
     return dfd.promise();
}

/*
    Servizio Rest per Registrazione/Login tramite FB (verifica token)
    Restituisce un JSON
*/
function wsRestFBToken ( _strToken )
{
	 // Create a new Deferred.
    var dfd = new $.Deferred();
    var strURL = HTTPSERVERREST + RESTFBTOKEN + "/" + _strToken ;
    console.log ( "PPrest.js::wsRestFBToken " + strURL ) ;
 	
    jQuery.ajax({
         type: "POST",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "JSON",         
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestFBToken " + status + " " + data ) ;
			 dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestFBToken " + status ) ;
            console.log ( "PPrest.js::wsRestFBToken " + JSON.stringify( jqXHR ) )  ;
            dfd.resolve(false,jqXHR);wsRestRegistrazione
         }
     });
     return dfd.promise();
}

/*
    Servizio Rest per Recupero Pass
    Restituisce un JSON
*/
function wsRestRecuperaPass ( _strEmail )
{
	 // Create a new Deferred.
    var dfd = new $.Deferred();
    var strURL = HTTPSERVERREST + RESTRECUPERAPASS ;
    console.log ( "PPrest.js::wsRestRecuperaPass " + strURL ) ;


    jQuery.ajax({
         type: "POST",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "JSON",
         data: { email: _strEmail} ,
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestRecuperaPass " + status + " " + data ) ;
			 dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestRecuperaPass " + status ) ;
            console.log ( "PPrest.js::wsRestRecuperaPass " + JSON.stringify( jqXHR ) )  ;
            dfd.resolve(false,jqXHR);
         }
     });
     return dfd.promise();
}

/*
    chiamata di validit�oken 
    restituisce true o false, a seconda il token sia valido o no.

*/
function wsRestValidationToken ( _strToken )
{
		 // Create a new Deferred.
    var dfd = new $.Deferred();
    var strURL = HTTPSERVERREST + RESTLOGIN  ;
    console.log ( "PPrest.js::wsRestValidationToken " + strURL + " " + _strToken ) ;
 
    jQuery.ajax({
         type: "GET",
         url: strURL  ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",
         data: { "token": _strToken } ,
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestValidationToken " + status + " " + data ) ;
			 if ( data ) {
				 dfd.resolve(true,"token valido");			 
			 }else{
				 dfd.resolve(false,"token scaduto");			 				 
			 }
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestValidationToken " + status ) ;
   		    dfd.resolve(false,jqXHR);
         }
     });
     return dfd.promise();
}

function wsRestLogout ( _strToken )
{
    // Create a new Deferred.
    var dfd = new $.Deferred();
    var strURL = HTTPSERVERREST + RESTLOGIN ;
    console.log ( "PPrest.js::wsRestLogout " + strURL ) ;
 
    jQuery.ajax({
         type: "DELETE",
         contentType: 'application/json',  // <---add this
         dataType: 'json',                // <---update this
         url: strURL ,
         data: { "token": _strToken } ,
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestLogout " + status + " " + data ) ;
			 dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
             // error handler
            console.log ( "PPrest.js::wsRestLogout " + status ) ;
            console.log ( "PPrest.js::wsRestLogout " + JSON.stringify( jqXHR ) )  ;
            dfd.resolve(false,jqXHR);
         }
     });
     return dfd.promise();
}

/////////////////////////////////////////////////////////////////////////777

/*
    
    Restituisce a Lista Annunci (con i relativi stati)

*/
function wsRestAnnunciLista ( _strToken )
{
	 // Create a new Deferred.
    var dfd = new $.Deferred();

    var strURL = HTTPSERVERREST + "miopp/" + _strToken + RESTLISTAANNUNCI ;
    console.log ( "PPrest.js::wsRestAnnunciLista " + strURL + " " + _strToken ) ;
    jQuery.ajax({
         type: "GET",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",
         data: { token: _strToken } ,
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestAnnunciLista " + status ) ;
			 console.log(data)
			 dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestListaAnnunci " + status ) ;
			dfd.resolve(false,jqXHR);
         }
     });    
     return dfd.promise();
}

/*
    Servizio per inserimento Annuncio (fase 1 senza foto    )
    http://ppappsrv02.inroma.roma.it/testAnnuncio.html
    
*/
function wsRestAnnuncioInserisci ( _strToken , _objAnnuncio )
{
    var dfd = new $.Deferred();                            
    var strURL = HTTPSERVERREST + "annunciofb/" + _strToken + "/" + RESTINSERISCIANNUNCIO ;    
    console.log ( "PPrest.js::wsRestAnnuncioInserisci " + strURL ) ;
    
    console.log  ( "PPrest.js::wsRestAnnuncioInserisci oggetto annuncio: " + JSON.stringify ( _objAnnuncio ) ) ;
          
    jQuery.ajax({
         type: "POST",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",
         data: _objAnnuncio ,
         success: function (data, status, jqXHR) {
             
             // do something
			 console.log ( "PPrest.js::wsRestAnnuncioInserisci " + status + " " + JSON.stringify ( data ) ) ;
              dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
             // error handler
             
			dfd.resolve(false,jqXHR);
            console.log ( "PPrest.js::wsRestAnnuncioInserisci " + status  ) ;
            console.log ( "PPrest.js::wsRestAnnuncioInserisci " + JSON.stringify( jqXHR ) )  ;
            console.log ( "PPrest.js::wsRestAnnuncioInserisci " + jqXHR.statusText )  ;
            
            console.log ( "PPrest.js::wsRestAnnuncioInserisci " + _objAnnuncio + " " + JSON.stringify ( _objAnnuncio ) ) ; 
         }
     });
     return dfd.promise();
}


/*
    Servizio per Visualizzazione Annuncio 
    /rest/annuncio/{TOKEN}/{KA}
*/
function wsRestAnnuncioVisualizza ( _strToken , _idAnnuncio )
{
    var dfd = new $.Deferred();                            
    var strURL = HTTPSERVERREST + "annuncio/" + _strToken + "/" + _idAnnuncio ;    
    console.log ( "PPrest.js::wsRestAnnuncioVisualizza " + strURL ) ;
    
          
    jQuery.ajax({
         type: "GET",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestAnnuncioVisualizza " + status + " " + JSON.stringify ( data ) ) ;
              dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
			dfd.resolve(false,jqXHR);
            console.log ( "PPrest.js::wsRestAnnuncioVisualizza " + status  ) ;
            console.log ( "PPrest.js::wsRestAnnuncioVisualizza " + JSON.stringify( jqXHR ) )  ;
            console.log ( "PPrest.js::wsRestAnnuncioVisualizza " + jqXHR.statusText )  ;
            
         }
     });
     return dfd.promise();
}

/*
    Servizio per Modifica Annuncio (no foto?)
    POST su /annuncio/{token}/{ka}
    
*/
function wsRestAnnuncioModifica ( _strToken , _idAnnuncio  , _objAnnuncio )
{
    var dfd = new $.Deferred();                            
    var strURL = HTTPSERVERREST + "annuncio/" + _strToken + "/" + _idAnnuncio ;    
    console.log ( "PPrest.js::wsRestAnnuncioModifica " + strURL ) ;
           
    jQuery.ajax({
         type: "POST",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",
         data: _objAnnuncio ,
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestAnnuncioModifica " + status + " " + JSON.stringify ( data ) ) ;
              dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
             // error handler
             //alert(JSON.stringify(jqXHR))
			dfd.resolve(false,jqXHR);
            console.log ( "PPrest.js::wsRestAnnuncioModifica " + status  ) ;
            console.log ( "PPrest.js::wsRestAnnuncioModifica " + JSON.stringify( jqXHR ) )  ;
            console.log ( "PPrest.js::wsRestAnnuncioModifica " + jqXHR.statusText )  ;
            
         }
     });
     return dfd.promise();
}

/*
    Servizio per Cancellazione Annuncio 
    DELETE su /annuncio/{token}/{ka}
    
*/
function wsRestAnnuncioCancella ( _strToken , _idAnnuncio   )
{
    var dfd = new $.Deferred();                            
    var strURL = HTTPSERVERREST + "annuncio/" + _strToken + "/" + _idAnnuncio ;    
    console.log ( "PPrest.js::wsRestAnnuncioCancella " + strURL ) ;
           
    jQuery.ajax({
         type: "DELETE",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "html",         
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestAnnuncioCancella " + status + " " + JSON.stringify ( data ) ) ;
              dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
			dfd.resolve(false,jqXHR);
            console.log ( "PPrest.js::wsRestAnnuncioCancella " + status  ) ;
            console.log ( "PPrest.js::wsRestAnnuncioCancella " + JSON.stringify( jqXHR ) )  ;
            console.log ( "PPrest.js::wsRestAnnuncioCancella " + jqXHR.statusText )  ;
            
         }
     });
     return dfd.promise();
}

/*
    Servizio per Ripristino Annuncio Cancellato
    PUT su /annuncio/{token}/{ka}
    
*/
function wsRestAnnuncioRipristina ( _strToken , _idAnnuncio   )
{
    var dfd = new $.Deferred();                            
    var strURL = HTTPSERVERREST + "annuncio/" + _strToken + "/" + _idAnnuncio ;    
    console.log ( "PPrest.js::wsRestAnnuncioRipristina " + strURL ) ;
           
    jQuery.ajax({
         type: "PUT",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",        
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestAnnuncioRipristina " + status + " " + JSON.stringify ( data ) ) ;
              dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
			dfd.resolve(false,jqXHR);
            console.log ( "PPrest.js::wsRestAnnuncioRipristina " + status  ) ;
            console.log ( "PPrest.js::wsRestAnnuncioRipristina " + JSON.stringify( jqXHR ) )  ;
            console.log ( "PPrest.js::wsRestAnnuncioRipristina " + jqXHR.statusText )  ;
            
         }
     });
     return dfd.promise();
}

/*
    Servizio per Cancellazione Foto Annuncio 
    DELETE su /annuncio/{token}/{ka}/foto
    
*/
function wsRestAnnuncioCancellaFoto ( _strToken , _idAnnuncio , _idFoto )
{
    var dfd = new $.Deferred();                            
    var strURL = HTTPSERVERREST + "annuncio/" + _strToken + "/" + _idAnnuncio + "/" + _idFoto ;    
    console.log ( "PPrest.js::wsRestAnnuncioCancellaFoto " + strURL ) ;
           
    jQuery.ajax({
         type: "DELETE",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",         
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestAnnuncioCancellaFoto " + status + " " + JSON.stringify ( data ) ) ;
              dfd.resolve(true,data);
         },
         error: function (jqXHR, status) {
            // error handler
			dfd.resolve(false,jqXHR);
            console.log ( "PPrest.js::wsRestAnnuncioCancellaFoto " + status  ) ;
            console.log ( "PPrest.js::wsRestAnnuncioCancellaFoto " + JSON.stringify( jqXHR ) )  ;
            console.log ( "PPrest.js::wsRestAnnuncioCancellaFoto " + jqXHR.statusText )  ;
            
         }
     });
     return dfd.promise();
}

/*
    Servizio per Avere una chiave ID Annuncio (KA))
    POST su /annuncio/impegnaka/{token}
    
*/
function wsRestImpegnaKa ( _strToken )
{
    var dfd = new $.Deferred();                            
    var strURL = HTTPSERVERREST + "annunciofb/" + RESTIMPEGNAKA + "/" + _strToken  ;    
    console.log ( "PPrest.js::wsRestImpegnaKa " + strURL ) ;
           
    jQuery.ajax({
         type: "POST",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestImpegnaKa " + status + " " + JSON.stringify ( data ) ) ;
              dfd.resolve(true,data);
         },

         error: function (jqXHR, status) {
            // error handler
			dfd.resolve(false,jqXHR);
            console.log ( "PPrest.js::wsRestImpegnaKa " + status  ) ;
            console.log ( "PPrest.js::wsRestImpegnaKa " + JSON.stringify( jqXHR ) )  ;
            console.log ( "PPrest.js::wsRestImpegnaKa " + jqXHR.statusText )  ;
            
         }
     });
     return dfd.promise();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////

/*

    Elenco Albero Rubriche

*/
function wsRestLegendaAlberoRubriche()
{
    var strURL = HTTPSERVERREST + "rubriche/" + RESTALBERO ;
    console.log ( "PPrest.js::wsRestAlbero " + strURL ) ;
     
    jQuery.ajax({
         type: "GET",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",
         
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestAlbero " + status + " " + data ) ;
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestAlbero " + status ) ;
         }
     });       
}

/*
    
    Restituisce la Legenda dei possibili Stati di un annuncio
    GET		/miopp/statoannuncio

*/
function wsRestLegendaStatiAnnuncio ( )
{
    var strURL = HTTPSERVERREST + "miopp/" + RESTSTATOANNUNCIO ;
    console.log ( "PPrest.js::wsRestLegendaStatiAnnuncio " + strURL ) ;
     
    jQuery.ajax({
         type: "GET",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",
         
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestLegendaStatiAnnuncio " + status + " " + data ) ;
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestLegendaStatiAnnuncio " + status ) ;
         }
     });    
}

/*

    Restituisce Legenda delle TIpologie di ALimentazioni Auto
    GET		/annuncio/alimentazioneauto

*/
function wsRestLegendaAlimentazioneAuto ()
{
    var strURL = HTTPSERVERREST + "annuncio/" + RESTALIMENTAZIONEAUTO ;
    console.log ( "PPrest.js::wsRestLegendaAlimentazioneAuto " + strURL ) ;
     
    jQuery.ajax({
         type: "GET",
         url: strURL ,
         contentType: "application/x-www-form-urlencoded; charset=utf-8",
         dataType: "json",
         
         success: function (data, status, jqXHR) {
             // do something
			 console.log ( "PPrest.js::wsRestLegendaAlimentazioneAuto " + status + " " + data ) ;
         },

         error: function (jqXHR, status) {
            // error handler
            console.log ( "PPrest.js::wsRestLegendaAlimentazioneAuto " + status ) ;
         }
     });         
}

/*
    
    Restituisce la Legenda delle possibili Classi Energetiche degli Immobili
    GET		/annuncio/classeenergetica

*/
function wsRestLegendaClasseEnergetica ( )
{
    
}

