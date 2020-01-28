/*==========================
http://plugins.jquery.com/soap/ or https://github.com/doedje/jquery.soap
part of the jQuery.soap distribution version: 1.3.6

SOAP Client
http://www.soapclient.com/soapclient?template=%2Fclientform.html&fn=soapform&SoapTemplate=%2FSoapResult.html&SoapWSDL=http%3A%2F%2Fdata.portaportese.it%2FPortaPorteseServiceSoap%3Fwsdl&_ArraySize=2

===========================*/
var consoleLogSOAP = true  ;
var TOREPLACE = "%REPLACE%" ;
var PPSOAPServer = "https://data.portaportese.it/PortaPorteseServiceSoap" ;
//var PPSOAPServer = "https://testing.portaportese.it/PortaPorteseServiceSoap" ;


var PPSOAPXMLRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
                                '<soap:Envelope ' +
                                '	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" ' +
                                '	xmlns:xsd="http://www.w3.org/2001/XMLSchema"' + 
                                '	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                                '	xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" ' +
                                '	xmlns:ns3890="http://tempuri.org">' +
                                '	<soap:Body>' +
                                '   %REPLACE% ' + 
                                '	</soap:Body>' +
                                '</soap:Envelope>' ;


/*
	ECCEZIONI:
	sbiancare il campo tiprec per la rubrica CD

	
    Oggetto Annuncio
    
{
	"oid":"2014072500123",
	"link":"/rubriche/Immobiliare/Ville_e_appartamenti_(Roma)/Eur-Ardeatina/m-torrino-mezzocammino-vende-0ID2014072500123",
	"pref1":"342",
	"telef1":"9088308",
	"pref2":"","telef2":"",
	"email":"",
	"giorno":"30",
	"mese":"9",
	"anno":"14",
	"formato":"FG",
	"prezzo":"320000",
	"locali":"2",
	"km":"0",
	"tipoauto":"5",
	"modello":"",
	"postiletto":"0",
	"superficie":"55",
	"tipologiaimmobile":"APT",
	"tipologiaauto":"",
	"annofabbr":"0",
	"videoid":"",
	"titolo":"TORRINO Mezzocammino vende",
	"testo":"TORRINO Mezzocammino vende immobile sito al pia...",
	"numerofoto":"12",
	"foto":[
		"/dbaimages/img_66787893_1.jpg",
		"/dbaimages/img_66787893_2.jpg",
		"/dbaimages/img_66787893_3.jpg",
		"/dbaimages/img_66787893_4.jpg",
		"/dbaimages/img_66787893_5.jpg",
		"/dbaimages/img_66787893_6.jpg",
		"/dbaimages/img_66787893_7.jpg",
		"/dbaimages/img_66787893_8.jpg",
		"/dbaimages/img_66787893_9.jpg",
		"/dbaimages/img_66787893_10.jpg",
		"/dbaimages/img_66787893_11.jpg",
		"/dbaimages/img_66787893_12.jpg"],
	"fotothumbnail":[
		"/dbaimages/imgn_66787893_1.jpg",
		"/dbaimages/imgn_66787893_2.jpg",
		"/dbaimages/imgn_66787893_3.jpg",
		"/dbaimages/imgn_66787893_4.jpg",
		"/dbaimages/imgn_66787893_5.jpg",
		"/dbaimages/imgn_66787893_6.jpg",
		"/dbaimages/imgn_66787893_7.jpg",
		"/dbaimages/imgn_66787893_8.jpg",
		"/dbaimages/imgn_66787893_9.jpg",
		"/dbaimages/imgn_66787893_10.jpg",
		"/dbaimages/imgn_66787893_11.jpg",
		"/dbaimages/imgn_66787893_12.jpg"
	],
	"url":"",
	"latitudine":"41.7943525",
	"longitudine":"12.42892519999998",
	"codcliente":"656637",
	"rubric":"CA",
	"tiprec":"100"
}
    
*/

var PPAnnunci ;
var PPAnnuncio ;
var PPRubriche ;

//////////////////////////////////////////////////////////////////////
/*
$(document).ready(function() {
    
    console.log ("PPsoap.js::ready") ;
    
    // Mappatura Click oggetto #test
	$('#test').click(function(e) {
	   
        console.log ("PPsoap.js::test click ") ;
		// stop the form to be submitted...
		e.preventDefault();
        
        //getAlberoRubriche ( "" ,"" ) ;
        //getCategorie ( "") ;
        //getRubricheCliente () ;
        //getAnnunci ( "CA" , "140" , 0 , "" , 0 , 20 ) ; 
        //getAnnuncioSingolo ( "2014044500115" ) ;
        //getRicercaGlobale ( "telese" ) ;
        return ;
		
	});
});
*/

/******************************************************************
    Mappatura Metodo getAnnunci
    
    Args: 
    rubric -> codice rubrica
    tiprec -> codice sottorubrica
    codicliente -> codice cliente
    search -> stringa di ricerca (lowercar con % wildcard )
    offset -> offset per paginazione
    pagesize -> numero articoli massimo, per paginazione
    - ordinamento (sorting)
        "rand" casuale /
        vuoto ranking /
        "ordinaPDis" discendente prezzo /
        "ordinaPAsc" ascendente prezzo /
        "ordinaAAsc" ascendente data /
        "ordinaADis" discendente data /
        "ordinaMAsc" ascendente superficie /
        "ordinaMDis" discendente superficie

    - prezzomin (minimum price)
    - prezzomax (maximum price)
    - tipoauto (engine type, for cars)
    - modello (model, for cars)
    - annostart (start year of makefor cars)
    - annoend (end year of makefor cars)
    - stanze (number of rooms, for homes)
    - catprezzo (price level, for homes)
    - mqmin
    - mqmax
    - tipologiaimmobile
    - flags

*******************************************************************/
function getAnnunci ( objFiltri ) 
{
    if ( consoleLogSOAP ) console.log ("PPsoap.js::getAnnunci " +  JSON.stringify( objFiltri )) ;
   
    // Generali
    if ( objFiltri.bRichieste == 0 || objFiltri.bRichieste == "0" ) _rubric = objFiltri._rubric ;
    else _rubric = objFiltri._rubricR ;
    
    _tiprec = objFiltri._tiprec ;
    _codcliente = objFiltri._codcliente ;
    _search = objFiltri._search ;
    _offset = objFiltri._offset ;
    _pagesize = objFiltri._pagesize ;
    _ordinamento = objFiltri._ordinamento ;
   
    // Case e Auto (prezzi)
    _prezzomin  = objFiltri._prezzomin ; // +"000" ;
    _prezzomax  = objFiltri._prezzomax ; // +"000" ;
    
    // Case
    _stanze = objFiltri._stanze ;        
    _mqmin = objFiltri._mqmin ;
    _mqmax = objFiltri._mqmax ;
    _tipologiaimmobile = objFiltri._tipologiaimmobile ;
    _flags = objFiltri._flags ;
    
    // Auto
    _modello = objFiltri._modello ;
    _annostart  = objFiltri._annostart ;
    _annoend  = objFiltri._annoend ;
    _tipoauto = objFiltri._tipoauto ;
    _tipologiaauto = objFiltri._tipologiaauto ;
    
    // Creazione Parametri
    strParams = '<parametri xmlns="http://datasynaptic.com/portaportese/">' + 
                '<rubric>'+_rubric+'</rubric>' + 
                '<tiprec>'+_tiprec+'</tiprec>' + 
                '<codcliente>'+_codcliente+'</codcliente>' + 
                '<search>'+_search+'</search>' + 
                '<ordinamento>'+_ordinamento+'</ordinamento>' + 
                '<prezzomin>'+_prezzomin+'</prezzomin>' + 
                '<prezzomax>'+_prezzomax+'</prezzomax>' + 
                '<stanze>'+_stanze+'</stanze>' + 
                '<modello>'+_modello+'</modello>' + 
                '<annostart>'+_annostart+'</annostart>' + 
                '<annoend>'+_annoend+'</annoend>' + 
                '<tipoauto>'+_tipoauto+'</tipoauto>' +
                '<tipologiaauto>'+_tipologiaauto+'</tipologiaauto>' +                
                '<mqmin>'+_mqmin+'</mqmin>' +
                '<mqmax>'+_mqmax+'</mqmax>' +
                '<tipologiaimmobile>'+_tipologiaimmobile+'</tipologiaimmobile>' +
                '<flags>'+_flags+'</flags>' +
                '<offset>'+_offset+'</offset>' + 
                '<pagesize>'+_pagesize+'</pagesize>' +                                
                '</parametri>'
                 
   if ( consoleLogSOAP ) console.log( "PPsoap.js::getAnnunci strParams: " + strParams ) ;
    // Inserimento Parametri
    var PPSOAPXMLRequestLocal = PPSOAPXMLRequest.replace( TOREPLACE ,  strParams ); 
    
    // Chiamata Servizio
    PPSOAPCall( PPSOAPServer , "getAnnunci" , PPSOAPXMLRequestLocal ) ;    
}

/*******************************************************************
    Mappatura Metodo getAnnuncioSingolo
    Args: oid (id dell'annuncio')
*******************************************************************/
function getAnnuncioSingolo ( _oid ) 
{
    if ( consoleLogSOAP ) console.log ("PPsoap.js::getAnnuncioSingolo " + _oid ) ;
   
    // Creazione Parametri
    strParams = '<codiceannuncio xmlns="http://datasynaptic.com/portaportese/">' +
                '   <oid>'+ _oid +'</oid>' +
                '</codiceannuncio>' ;
    
    if ( consoleLogSOAP ) console.log( "PPsoap.js::getAnnunci strParams: " + strParams ) ;
    // Inserimento Parametri
    var PPSOAPXMLRequestLocal = PPSOAPXMLRequest.replace( TOREPLACE ,  strParams ); 
    
    // Chiamata Servizio
    PPSOAPCall( PPSOAPServer , "getAnnuncioSingolo" , PPSOAPXMLRequestLocal ) ;    
}


/*******************************************************************
    Mappatura Metodo getRicercaGlobale
    Args: text (testo della ricerca globale)
*******************************************************************/
function getRicercaGlobale ( _text ) 
{
    if ( consoleLogSOAP ) console.log ("PPsoap.js::getRicercaGlobale " + _text ) ;
   
    // Creazione Parametri
    strParams = '<ricercaglobale xmlns="http://datasynaptic.com/portaportese/">'+_text+'</ricercaglobale>' ;
    
    if ( consoleLogSOAP ) console.log( "PPsoap.js::getRicercaGlobale strParams: " + strParams ) ;
        
    // Inserimento Parametri
    var PPSOAPXMLRequestLocal = PPSOAPXMLRequest.replace( TOREPLACE ,  strParams ); 
    
    // Chiamata Servizio
    PPSOAPCall( PPSOAPServer , "getRicercaGlobale" , PPSOAPXMLRequestLocal ) ;    
}

/*******************************************************************
    Mappatura Metodo getAlberoRubriche (ritorna tutta la struttura per ora statica)
    Args: 
*******************************************************************/
function getAlberoRubriche ( _rubric , _tiprec )
{
    if ( consoleLogSOAP ) console.log ("PPsoap.js::getAlberoRubriche " + _rubric + " " + _tiprec ) ;
   
    // Creazione Parametri    
    strParams = '<tipoalbero xmlns="http://datasynaptic.com/portaportese/"/>' ;
        
    // Inserimento Parametri
    var PPSOAPXMLRequestLocal = PPSOAPXMLRequest.replace( TOREPLACE ,  strParams ); 
    
    // Chiamata Servizio
    PPSOAPCall( PPSOAPServer , "getAlberoRubriche" , PPSOAPXMLRequestLocal ) ;
}

/*******************************************************************
    Mappatura Metodo getRubricheCliente (???))
    Args: codice cliente 
*******************************************************************/
function getRubricheCliente ( _cliente) 
{
    if ( consoleLogSOAP ) console.log ("PPsoap.js::getRubricheCliente " + _cliente ) ;
   
    // Creazione Parametri
    strParams = '<parametricliente xmlns="http://datasynaptic.com/portaportese/"><codcliente></codcliente></parametricliente>' ;
    
    // Inserimento Parametri
    var PPSOAPXMLRequestLocal = PPSOAPXMLRequest.replace( TOREPLACE ,  strParams ); 
    
    // Chiamata Servizio
    PPSOAPCall( PPSOAPServer , "getRubricheCliente" , PPSOAPXMLRequestLocal ) ;    
}

/*******************************************************************
    Mappatura Metodo getCategorie (???))
    Args: id Azienda
*******************************************************************/
function getCategorie ( _id_azienda) 
{
    if ( consoleLogSOAP ) console.log ("PPsoap.js::getCategorie " + _id_azienda ) ;
   
    // Creazione Parametri
    strParams = '<parametri xmlns="http://datasynaptic.com/portaportese/">' + 
                '<id_azienda>'+_id_azienda+'</id_azienda>' + 
                '</parametri>' ;
        
    // Inserimento Parametri
    var PPSOAPXMLRequestLocal = PPSOAPXMLRequest.replace( TOREPLACE ,  strParams ); 
    
    // Chiamata Servizio
    PPSOAPCall( PPSOAPServer , "getCategorie" , PPSOAPXMLRequestLocal ) ;    
}


/*******************************************************************
    Mappatura Metodo nuovoUtente (la pwd viene inviata in email)
    Args: 
    
    Response OK:
    <S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
        <S:Body>
            <registrazione xmlns="http://datasynaptic.com/portaportese/">
                <esito>OK</esito>
                <codiceutente>571641</codiceutente>
            </registrazione>
        </S:Body>
    </S:Envelope>
    
    Response KO:
    <S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
        <S:Body>
            <registrazione xmlns="http://datasynaptic.com/portaportese/">
                <esito>KO</esito>
                <errori>
                <campo>email</campo>
                <descrizione>indirizzo presente</descrizione>
                </errori>
                </registrazione>
            </S:Body>
    </S:Envelope>

*******************************************************************/
function nuovoUtente ( _email , _nome , _cognome , _telefono , _accetto67596 , _ipaddress , _facebookid ) 
{
    if ( consoleLogSOAP ) console.log ("PPsoap.js::nuovoUtente " + _email ) ;
   
    // Creazione datiregistrazionenuovoutente
    strParams = '<datiregistrazionenuovoutente xmlns="http://datasynaptic.com/portaportese/">' + 
                '<email>'+_email+'</email>' + 
                '<nome>'+_nome+'</nome>' + 
                '<cognome>'+_cognome+'</cognome>' + 
                '<telefono>'+_telefono+'</telefono>' + 
                '<accetto67596>'+_accetto67596+'</accetto67596>' + 
                '<ipaddress>'+_ipaddress+'</ipaddress>' + 
                '<facebookid>'+_facebookid+'</facebookid>' +                
                '</datiregistrazionenuovoutente>' ;
        
    // Inserimento Parametri
    var PPSOAPXMLRequestLocal = PPSOAPXMLRequest.replace( TOREPLACE ,  strParams ); 
    
    // Chiamata Servizio
    PPSOAPCall( PPSOAPServer , "nuovoUtente" , PPSOAPXMLRequestLocal ) ;    
}


/*******************************************************************
    Mappatura Metodo inserisciAnnunciopp 
    Args: 
*******************************************************************/
function inserisciAnnunciopp ( ) 
{
/*
inserisciAnnunciopp
datinuovoannunciopp.codicecliente:
datinuovoannunciopp.annuncio.codicerubrica.rubric:
datinuovoannunciopp.annuncio.codicerubrica.tiprec:
datinuovoannunciopp.annuncio.testo:
datinuovoannunciopp.annuncio.pubblicaemail:10
datinuovoannunciopp.annuncio.addinfo:
datinuovoannunciopp.annuncio.pref1:
datinuovoannunciopp.annuncio.telef1:
datinuovoannunciopp.annuncio.pref2:
datinuovoannunciopp.annuncio.telef2:
datinuovoannunciopp.annuncio.tipologiaimmobile:
datinuovoannunciopp.annuncio.superficie:
datinuovoannunciopp.annuncio.locali:
datinuovoannunciopp.annuncio.classeenergetica:
datinuovoannunciopp.annuncio.tipologiamodello:
datinuovoannunciopp.annuncio.alimentazione:
datinuovoannunciopp.annuncio.latitudine:
datinuovoannunciopp.annuncio.longitudine:
datinuovoannunciopp.annuncio.anno:
datinuovoannunciopp.annuncio.km:
datinuovoannunciopp.annuncio.prezzo:
datinuovoannunciopp.annuncio.url:
datinuovoannunciopp.auth:
datinuovoannunciopp.immagine[0]:
datinuovoannunciopp.immagine[1]:
datinuovoannunciopp.video:
*/
}

//////////////////////////////////////////////////////////////////////

/*******************************************************************
    Chiamato SOAP (può essere sincrona o asincrona)
*******************************************************************/
function PPSOAPCall ( _Server , _Method , _Request )
{
    if ( consoleLogSOAP ) console.log ("PPsoap.js::PPSOAPCall " + _Method ) ;
    
    var wss;
		wss = {
			username: '',
			password: '',
			nonce: 'aepfhvaepifha3p4iruaq349fu34r9q',
			created: new Date().getTime()
		};
    
    $.soap({
		url: _Server,
		method: _Method,

		appendMethodToURL: false,
		SOAPAction: '',
		soap12: false,
		async: false,

		data: _Request,
		wss: wss,

		HTTPHeaders: {
			Authorization: 'Basic ' + btoa('test:test')
		},

		namespaceQualifier:  '',
		namespaceURL: '',
		noPrefix: true,
		elementName: '',

		enableLogging: false,

		beforeSend: function(SOAPEnvelope) {
		    if ( consoleLogSOAP ) console.log ("PPsoap.js::PPSOAPCall::beforeSend") ;            
			//var out = dom2html($.parseXML(SOAPEnvelope.toString()).firstChild);			
            //$('#request').text(out);
		},
		success: function(SOAPResponse) {
		  
            if ( consoleLogSOAP ) console.log ("PPsoap.js::PPSOAPCall:success") ;
			$('#feedbackHeader').html('Success!');
			$('#feedback').text(SOAPResponse.toString());
              
            // Conversione XML -> JSON          
            objResponse = SOAPResponse.toJSON() ;
			console.log(objResponse)
            if (_Method == "getAnnunci" )
            {
                objListaAnnunci = objResponse['Body']['pagina']['listaannunci'] ;
                
                if ( objListaAnnunci ) 
                {                    
                    // Se la ricerca torna un solo annuncio allora nn è un Array
                    if ( typeof objListaAnnunci.length == "undefined" ) 
                    {
                        var objAppo = objListaAnnunci ;
                        objListaAnnunci = null ;
                        objListaAnnunci = new Array ()
                        objListaAnnunci[0] = objAppo ;
                    }                        
                    
                    if ( consoleLogSOAP ) console.log ( "PPsoap.js::PPSOAPCall:success " + objListaAnnunci.length ) ; 
                    
                    // Se recupero meno di pagesize annunci vuol dire che non ce ne sono altri
                    if ( objListaAnnunci.length < objFiltri._pagesize ) objFiltri.bAnnunciFiniti = 0 ;
                    
                    //if ( consoleLogSOAP ) console.log ( "PPsoap.js::PPSOAPCall:success " + JSON.stringify( objListaAnnunci) ) ;
                    
                    if ( objFiltri._offset == 0 ) {
                        PPAnnunci = objListaAnnunci ;
                    }                        
                    else{
                        if (PPAnnunci && objListaAnnunci ) PPAnnunci = PPAnnunci.concat ( objListaAnnunci ) ;   
                    }
    
                    if (PPAnnunci) {
    	                
                        if ( consoleLogSOAP ) console.log ( "PPsoap.js::PPSOAPCall:success " + PPAnnunci.length ) ; 
          				//if ( consoleLogSOAP ) console.log(JSON.stringify(PPAnnunci))
    	                for ( var idx = 0 ; idx < PPAnnunci.length ; idx ++ )
    	                {
                            // Se cè una sola foto, non è un Array (e non è undefined per nn far cambiare Mancio) 
                            if ( !$.isArray(PPAnnunci[idx].foto) && typeof PPAnnunci[idx].foto !== "undefined" )
                            {
                                if ( consoleLogSOAP ) console.log ("PPsoap.js::PPSOAPCall: " + PPAnnunci[idx].oid + " | " + PPAnnunci[idx].fotothumbnail ) ; 
                                
                                fotoTempArr = new Array();
                                fotothumbTempArr = new Array();
                                
                                fotoTemp = PPAnnunci[idx].foto ;
                                fotothumbTemp = PPAnnunci[idx].fotothumbnail ;
                                
                                PPAnnunci[idx].foto = fotoTempArr ;
                                PPAnnunci[idx].foto[0] = fotoTemp ;
                                
                                PPAnnunci[idx].fotothumbnail = fotothumbTempArr ;
                                PPAnnunci[idx].fotothumbnail[0] = fotothumbTemp ;
                            }
                        
    						// Crea un campo dataAnnuncio con la data in formato Date 
    						dataAnnuncio = new Date("20"+PPAnnunci[idx].anno+"/"+PPAnnunci[idx].mese+"/"+PPAnnunci[idx].giorno);
    						
                            PPAnnunci[idx].dataAnnuncio =Globalize.format(dataAnnuncio,'dd MMM') ;
    	                    //if ( PPAnnunci[idx].prezzo == 0 ) PPAnnunci[idx].prezzo = 'N.D.' ;   
                               
    	                    if ( typeof PPAnnunci[idx].foto !== "undefined"  )
    	                    {
                                // Metto l'url completa nella FOTO (solo se già non ce l'ha)	                       
    	                        for ( var jdx = 0 ; jdx < PPAnnunci[idx].foto.length ; jdx ++ )
    	                        {
    	                            if ( PPAnnunci[idx].foto[jdx].indexOf( http_url ) < 0 ) PPAnnunci[idx].foto[jdx] = http_url + PPAnnunci[idx].foto[jdx] ; 
    	                        }
    	                    }
    	                    else
    	                    {
    	                        //PPAnnunci[idx].foto = new Array () ;
    	                        //PPAnnunci[idx].foto[0] = "http://www.portaportese.it/img/logo-portaportese.png"    ;
    	                    }
    	                }   
    		                
                    }
                }  
                else
                {
                    // Reset Array

                    if ( consoleLogSOAP ) console.log("PPSoap.js:: Reset Array objFiltri.bAnnunciFiniti = 1 ") ;
                    if ( objFiltri._offset == 0 ) PPAnnunci = null ;
                    else objFiltri.bAnnunciFiniti = 1 ;
                } 
            }
            
            if (_Method == "getAnnuncioSingolo" )
            {	
				 if ( consoleLogSOAP ) console.log ("PPsoap.js::getAnnuncioSingolo " );
                objAnnuncio = objResponse['Body']['annunciosingolo'] ;
				if ( consoleLogSOAP ) console.log(JSON.stringify(objAnnuncio))
                PPAnnunci = new Array();            
                PPAnnunci[0] = objAnnuncio ;  
				if (PPAnnunci[0].oid) {
					if ( consoleLogSOAP ) console.log("annuncio trovato:"+PPAnnunci[0].oid)
				}else{
					if ( consoleLogSOAP ) console.log("annuncio non trovato")	
					PPAnnunci = null ;				
				}

				if (PPAnnunci) {
					//Crea un campo dataAnnuncio con la data in formato Date 
					dataAnnuncio = new Date("20"+PPAnnunci[0].anno+"/"+PPAnnunci[0].mese+"/"+PPAnnunci[0].giorno);
					PPAnnunci[0].dataAnnuncio = Globalize.format(dataAnnuncio,'dd MMM');
					
	
					
					if (typeof PPAnnunci[0].foto !== "undefined")
					{
						// Metto l'url completa nella FOTO (solo se già non ce l'ha)
						for ( var jdx = 0 ; jdx < PPAnnunci[0].foto.length ; jdx ++ )
						{
							if ( PPAnnunci[0].foto[jdx].indexOf( http_url ) < 0 ) PPAnnunci[0].foto[jdx] = http_url + PPAnnunci[0].foto[jdx] ; 
						}
					}
					else
					{
						//PPAnnunci[0].foto = new Array () ;
						//PPAnnunci[0].foto[0] = "http://www.portaportese.it/img/logo-portaportese.png"    ;
					}
					
				}
            }
            
            if (_Method == "getRicercaGlobale" )
            {	
				 if ( consoleLogSOAP ) console.log ("PPsoap.js::getRicercaGlobale " + JSON.stringify( objResponse ) );
                
                 PPRubriche = objResponse['Body']['rubrichetrovate'] ['rubriches'] ;
                    
                 if ( consoleLogSOAP ) console.log ("PPsoap.js::getRicercaGlobale " + JSON.stringify( PPRubriche ) );   
            }
             
		},
		error: function(SOAPResponse) {
		    if ( consoleLogSOAP ) console.log ("PPsoap.js::test click::error") ;
			PPAnnunci = null ;
	        DevExpress.ui.notify("Server non disponibile", "error",99000);    			
		}
	});
}



function dom2html(xmldom, tabcount) {
    if ( consoleLogSOAP ) console.log ("PPsoap.js::dom2html") ;
    
	var whitespace = /^\s+$/;
	var tabs = '  ';
	var xmlout = [];
	tabcount = (tabcount) ? tabcount : 0;

	xmlout.push('<', xmldom.nodeName);
	for (var i in xmldom.attributes) {
		var attribute = xmldom.attributes[i];
		if (attribute.nodeType === 2) {
			xmlout.push(' ', attribute.name, '="', attribute.value, '"');
		}
	}
	xmlout.push('>\n');
	++tabcount;
	for (var j in xmldom.childNodes) {
		var child = xmldom.childNodes[j];
		if (child.nodeType === 1) {
			xmlout.push(repeat(tabs, tabcount), dom2html(child, tabcount));
		}
		if (child.nodeType === 3 && !whitespace.test(child.nodeValue)) {
			xmlout.push(child.nodeValue);
		}
	}
	xmlout.push(repeat(tabs, --tabcount), '</', xmldom.nodeName, '>\n');
	return xmlout.join('');
}

function repeat(x, n) {
    if ( consoleLogSOAP ) console.log ("PPsoap.js::repeat") ;
	var s = '';
	for (;;) {
		if (n & 1) s += x;
		n >>= 1;
		if (n) x += x;
		else break;
	}
	return s;
}

function normalizzaRisultato ()
{
    
    
}