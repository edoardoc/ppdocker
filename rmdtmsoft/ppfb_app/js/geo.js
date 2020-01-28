var     curLatitude = 41.917096;
var     curLongitude = 12.457809  ;
var		searchLatitude=null;
var		searchLongitude=null;
var     geoNotification=true;
var infoBubbleOld;	     
function getGeolocation(positionOk,positionFail)
{
    console.log ( "getGeolocation");
    
//    if ( realDevice.platform != 'ios' )
//    {
	  if (geoNotification) {
		 DevExpress.ui.notify("Portaportese sta usando la tua posizione...", "info", 2000);					  
		 geoNotification=false; //avvisa una volta sola
	  }
       
//	}
    
	curLatitude = null;
	curLongitude = null;
	searchLatitude=null;
	searchLongitude=null;
	curAddress = ko.observable();
	searchAddress=null;
	cbPositionOK=positionOk;
	cbPositionFail=positionFail;
	
    // Recupero Posizione (GPS?))
	if (navigator.geolocation) 
	{   //getCurrentPosition watchPosition
		navigator.geolocation.getCurrentPosition( getPosition , noPosition, {enableHighAccuracy:true, maximumAge:90000 , timeout:20000} );
	}
	else
	{
	   	DevExpress.ui.notify("Questo device non supporta la geolocalizazzione o non è abilitata (vedere impostazioni->GPS)", "error", 2000);			
	    console.log ( "getGeolocation::Questo device non supporta la geolocalizazzione o non è abilitata (vedere impostazioni->GPS)" ) ;
	 } 
}     
		   
/*
	Funzione callback per recupero posizione in HTML5
*/
function getPosition(position)
{
	curLatitude =  position.coords.latitude ; 
	curLongitude =  position.coords.longitude;
 
	curLatitude = curLatitude.toFixed(6);
	curLongitude = curLongitude.toFixed(6); 
	
	localStorage.setItem('curLatitude', curLatitude );
	localStorage.setItem('curLongitude', curLongitude);  
	
	console.log( "getPosition:: " + curLatitude + " " + curLongitude + " accuracy: " + position.coords.accuracy  ) ;
	
	getAddressFromPosition ();
}

/*
	Funzione callback in caso di erronel  recupero posizione in HTML5
*/
function noPosition ()
{
	curLatitude = localStorage.getItem ( 'curLatitude' ) ;
	curLongitude = localStorage.getItem ( 'curLongitude' ) ;
    
    console.log ( "noPosition::Impossibile determinare la posizione attuale, viene utilizzata l'ultima posizione disponibile: " + curLatitude + " " + curLongitude ) ;
	
    //Norifico l'utente che l'impostazione Posizione non è attivata
    if ( realDevice.platform != 'ios' )
    {
        if ( typeof navigator.notification != "undefined" ) 
        {
            navigator.notification.alert ( "'Portaportese' non riesce a determinare la tua posizione attuale (vedere Impostazioni->Posizione)" , onAlertNoPosition , "Message" ) ;
        }	
        else 
        {
            DevExpress.ui.notify("'Portaportese' non riesce a determinare la tua posizione attuale (vedere Impostazioni->Posizione)", "error", 2000);			
	    }
    }         
    
	if ( curLatitude == null ) curLatitude = 41.917096 ;
	if ( curLongitude == null ) curLongitude = 12.457809 ;

	console.log ( "noPosition::coordinate null, uso centro di Roma") ;
	if (cbPositionFail) cbPositionFail() ;

}

function onAlertNoPosition ()
{
    // Callback della message che avverte di una nuova versione disponibile
}

/*
	Recupera l'indirizzo da una poisizione latlang
*/
function getAddressFromPosition ()
{

	if ( curLatitude == null ) curLatitude = 41.917096 ;
	if ( curLongitude == null ) curLongitude = 12.457809 ;
	
	console.log ( "getAddressFromPosition: " + curLatitude+ " " +  curLongitude )
	// http://maps.googleapis.com/maps/api/geocode/json?latlng=41.8912307,12.5587343&sensor=true
	var latlng = new google.maps.LatLng( curLatitude ,  curLongitude ); 
	geocoder = new google.maps.Geocoder();
	
	geocoder.geocode({
		'latLng': latlng
	}, function(results, status) {
		console.log(status)
		if ( status == google.maps.GeocoderStatus.OK  ){		
			curAddress( results[0].formatted_address );
			console.log(curAddress())
		}

		if (cbPositionOK) cbPositionOK() ;
	});
}

/*
	Recupera le coordinate gps da un indirizzo
*/
function getPositionFromAddress  ( strAddress , bRenewDistance,callbackOk,callbackFail )
{
	
	console.log ( "getPositionFromAddress::" +  strAddress ) ;
	var geocoder = new google.maps.Geocoder();
	var Lat;
	var Lng;
	searchLatitude =null;
	searchLongitude =null; 
   
	geocoder.geocode( { 
		'address': strAddress
	},function(results, status){  
		
		console.log ( results  ) ;
		console.log("getPositionFromAddress::StatusMappa:"+status)
		if ( status == google.maps.GeocoderStatus.OK  ){
			var loc = results[0].geometry.location;  
			Lat = loc.k;
			Lng = loc.B;
			searchLatitude =Lat;
	     	searchLongitude =Lng; 

			searchAddress=results[0].formatted_address;

			callbackOk(searchAddress);

			
		}
		else
		{
            DevExpress.ui.notify("Indirizzo non trovato - prova a modificare l'indirizzo inserito o a specificare la provincia di appartenenza del comune inserito", "error", 3000);			
		}
	})
	
}	

/*
    Calcola la distanza terrestre
*/
function getDistance(lat1,lon1,lat2,lon2) {
	var R = 6371; // km (change this constant to get miles)
    
	// console.log(lat1+" " + lon1 + " " + lat2 + " " + lon2) ;
    
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
    
    //Math.round(d) ;
    
	if (d>1) d = Math.round(d*10)/10 ; // +"km";
	else if (d<=1) d =Math.round(d *10)/10 ;
    //else if (d<=1) return Math.round(d*1000)+"m";
    //console.log ( d ) ;
    
    if ( d == null || d > 999 ) d = 999 ;
    
	return d;
}

/*
    Associa un segnalino ad una finestra informazioni custom
*/
function bindInfoBubble (map,marker, contentHTML , _latlng )
{
    var infoBubble ;
     
    google.maps.event.addListener(marker, 'click', function() {
        
    	if (infoBubbleOld) {
	    	infoBubbleOld.close();
    	}
        
        // if (!infoBubble.isOpen()) {
        if ( true ) {     
            var infoBubble = new InfoBubble({
                map: map,
                content: contentHTML,
                position: _latlng,
                shadowStyle: 1,
                padding: 0,
                backgroundColor: 'rgb(57,57,57)',
                borderRadius: 4,
                arrowSize: 10,
                borderWidth: 1,
                borderColor: '#2c2c2c',
                disableAutoPan: true,
                hideCloseButton: true,
                arrowPosition: 30,
                backgroundClassName: 'phoney',
                arrowStyle: 2,
                maxWidth: 250,
                maxHeight: 38
            });
    
			google.maps.event.addDomListener(infoBubble.bubble_, 'click', function() {
                
                

			});    
            
            // Centra la mappa sul segnalino

            map.setCenter( _latlng ) ;
            
            infoBubble.open(map, marker);
            infoBubbleOld=infoBubble;
        }
        else
        {
            infoBubble.close();
        }
    })
}

