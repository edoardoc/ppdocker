PortaPortese.InserimentoAnnuncio = function(params) {
 var utenteSloggato=ko.observable(true),
 modelIsReady = $.Deferred(), 
 consoleLog=true,
 kaAnnuncio=null,

 bloccaEdit=false,
 bInserimento=true,
 loadPanelVisible = ko.observable(false),
 toastSuccessVisible = ko.observable(false),
 elencoFoto=new Array(),
 originalMap,	
 listenerHandle = null,
 gmarkers = [],
 objLatitude = null,
 objLongitude = null,
 isLoaded= ko.observable(true),
 valoreCategoria=ko.observable(''),
 valoreRubrica=ko.observable(''),
 statoAnnuncio=ko.observable(''),
 testoAnnuncio=ko.observable(''),
 pref1=ko.observable(''), 
 telef1=ko.observable(''),  
 pref2=ko.observable(''), 
 telef2 = ko.observable(''),
 msgInfo = ko.observable(''),
 PanelMsgVisible = ko.observable(false),
 pubblicaEmail=ko.observable(true),  
 privacy = ko.observable(false),
 urlFotoUpload = "",
 listDataSource = new DevExpress.data.DataSource({
	store: [],
	paginate: false
});

 
/* MAPPA GOOGLE */

function createMap_html() {
	var myOptions = {
		center:new google.maps.LatLng( curLatitude ,  curLongitude ) ,	
		zoom:13,
		streetViewControl:false,
		zoomControl:true,
		mapTypeControl:false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	} ;
	

	originalMap = new google.maps.Map($('.dx-active-view #campoAnnuncio_mappa')[0], myOptions);    
	
	b_mappacreata = true;
	
	 if (listenerHandle) listenerHandle.remove();
	 var listenerHandle = originalMap.addListener('click', function(e) {
		 removeMarkers();

    	markersByCoordinates_html(e.latLng);
	 });	

	
	var input = $('.dx-active-view #campoAnnuncio_indirizzo .dx-texteditor-input')[0];
	

    //originalMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	
	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', originalMap);	
	
	autocomplete.addListener('place_changed', function() {
		var place = autocomplete.getPlace();
		if (place.geometry) {

			removeMarkers();
       		markersByCoordinates_html(place.geometry.location);
	
		}		
	})
	
	if (objAnnuncio.latitudine>0 && objAnnuncio.longitudine>0 ) {
		markersByCoordinates_html(new google.maps.LatLng( objAnnuncio.latitudine ,  objAnnuncio.longitudine ));
	}	
	
	
}


function removeMarkers(){
	for(i=0; i<gmarkers.length; i++){
		gmarkers[i].setMap(null);
	}
}
function markersByCoordinates_html(latlng) {
	
	latlngbounds = new google.maps.LatLngBounds();					
	
	objLatitude= latlng.lat();
	objLongitude= latlng.lng();

	marker = new google.maps.Marker({
		position: latlng,
		map: originalMap,
		animation: google.maps.Animation.BOUNCE,
		title:'Questa è la posizione del tuo annuncio,per rimuoverla clicca su reset o scegli un altra posizione.'	});

	// Push your newly created marker into the array:
	gmarkers.push(marker);


	latlngbounds.extend(latlng);

	// Disegna la nuvoletta per il segnalino (InfoBubble)
	contentHTML = '<div class="bubbleMappa" id="bubble" >';
	contentHTML +='		<div class="">Questa è la posizione del tuo annuncio,per rimuoverla clicca su reset o scegli un altra posizione.</div>';
	contentHTML +='</div>' ;        
//	bindInfoBubble ( originalMap,marker , contentHTML  , latlng) ;					
	
	var infowindow = new google.maps.InfoWindow({
	    content: contentHTML
	  });					
	marker.addListener('click', function() {
	    infowindow.open(originalMap, marker);
	});	  										
    originalMap.setCenter(latlngbounds.getCenter());
    originalMap.setZoom(16);

	

		
		
};
function mapClick() {
	
	if (infoBubbleOld) {
		infoBubbleOld.close();
	}
	
};

 
 /* UPLOAD FOTO */
 
 
function onPhotoDATASuccess(imageData) {
        // Uncomment to view the base64-encoded image data
        // console.log(imageData);

        // Get image handle
        //
        //var smallImage = document.getElementById('smallImage');

        // Unhide image elements
        //
        //smallImage.style.display = 'block';

        // Show the captured photo
        // The inline CSS rules are used to resize the image
        //
        //smallImage.src = "data:image/jpeg;base64," + imageData;
		
	
		
		

}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	
	viewModel.lastImageUri  = imageURI;
	var options = new FileUploadOptions();
	if ( consoleLog )  console.log("onPhotoURISuccess:"+imageURI)
	options.fileKey = "uploadedFile";
	options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";

	var params = {};
	params.value1 = "test";
	params.value2 = "param";

	options.params = params;

	var ft = new FileTransfer();
	ft.onprogress = function (progressEvent) {
		if (progressEvent.lengthComputable) {
//			console.log("upload foto in corso " + progressEvent.loaded / progressEvent.total)
//			viewModel.msgLoadPanel("Upload foto in corso..." + progressEvent.loaded / progressEvent.total)



		} else {


		}
	};
	viewModel.msgLoadPanel("Upload foto in corso...")
	viewModel.loadPanelVisible(true);
	
	//Upload FTP
	//ft.upload(imageURI, encodeURI("http://rmdtmsoft.it/test/upload//upload_file.php"), onWinUpload, onFailUpload, options); 
	ft.upload(imageURI, encodeURI(HTTPSERVERREST + "annuncio/"+g_TokenLogin+"/"+kaAnnuncio+"/append/upload"), onWinUpload, onFailUpload, options); 
	
	
}
function onWinUpload(data) {
	

    var risposta =data.result;


	if(risposta.errori.length === 0) {
		elencoFoto.push(viewModel.lastImageUri)
		//loadFoto();			
		viewModel.loadPanelVisible(false);
		DevExpress.ui.notify("Upload foto completata", "success", 2000);		

    }else{
        viewModel.loadPanelVisible(false);
		
		DevExpress.ui.notify("Errore upload foto:" + risposta.errori[0].descrizione, "error", 3000);
    }
}

function onFailUpload(error) {
	//alert("An error has occurred: Code = " + error.code);
	viewModel.loadPanelVisible(false);
	DevExpress.ui.notify("Errore upload foto:" + error.code, "error", 3000);
}

function onFailPhoto(message) {
	DevExpress.ui.notify(message, "error", 3000);
}
function onWinPhoto() {

}

function getPhoto(source) {
	// Retrieve image file location from specified source
	
	navigator.camera.getPicture(onPhotoURISuccess, onFailPhoto, {quality: 50,
		destinationType: destinationType.FILE_URI,		
		sourceType: source, correctOrientation: true});
	/*
	navigator.camera.getPicture(onPhotoDATASuccess, onFailPhoto, {quality: 50,
		destinationType: destinationType.DATA_URI,		
		sourceType: source, correctOrientation: true});*/
		
		
}
// A button will call this function
//
function capturePhoto() {
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoURISuccess, onFailPhoto, {quality: 50,
		destinationType: destinationType.FILE_URI, correctOrientation: true});
}

function  uploadFotoRullino() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	getPhoto(pictureSource.PHOTOLIBRARY);
}
function  uploadFotoCamera() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	capturePhoto();

}
 
 
 
 /*carica l'elenco dei campi dell'annuncio per rubrica */
function loadCampiByRubrica(rubrica) {
	
	strHtml = "";

	filtriCaricati = false;
	//objAnnuncio= new ObjCampiInserimentoAnnuncioDefault();

	

	filtro = [["Rubrica", "contains", rubrica], "or", ["Rubrica", "contains", "XX"]];


	PortaPortese.db.dsCampiInserimentoAnnuncio.filter(filtro)
	PortaPortese.db.dsCampiInserimentoAnnuncio.pageIndex(0)
	PortaPortese.db.dsCampiInserimentoAnnuncio.load().done(function () {


		var dsCampiAnnuncio = PortaPortese.db.dsCampiInserimentoAnnuncio.items();

		//if ( consoleLog ) console.log ( "results.js::loadFiltriByRubrica dati:" + JSON.stringify( dati ) ) ; 

      	  strHtml += '	<div class="dx-field">';                                 
		  strHtml += '		<div class="titolo">Caratteristiche dell\'annuncio</div>';
		  strHtml += '  </div>';


		for (i = 0; i < dsCampiAnnuncio.length; i++) {
		    console.log('load campi')
		    console.log(dsCampiAnnuncio[i])
			// Filtro DataStore x Elenco Campi aplicabili a quella lista 


			
//                if (consoleLog) console.log("results.js::loadFiltriByRubrica dati[i].Tabella: " + JSON.stringify ( viewModel.datiFiltri[i] ) );


			// Creazione HTML elenco Filtri	
			strHtml += '<div class="dx-field campo' + dsCampiAnnuncio[i].ObjAnnuncio + '">';
			strHtml += '	<div class="">' + dsCampiAnnuncio[i].Nome + '</div>';

			if (dsCampiAnnuncio[i].Tabella!="") { //Tendina con volori da TABELLA
				viewModel.datiAnnuncio[i] ={id:dsCampiAnnuncio[i].ID,valore:ko.observable(),tabella: new DevExpress.data.DataSource({store: dsCampiAnnuncio[i].Tabella}),listaDaFiltrare:dsCampiAnnuncio[i].ListaDaFiltrare }; 
		
				if (dsCampiAnnuncio[i].MultySelect) {
					strWidget = "dxTagBox";
				}else{
					strWidget = "dxSelectBox";					
				}
				
				strHtml += '	<div id="campoAnnuncio_' + dsCampiAnnuncio[i].ObjAnnuncio + '" ObjAnnuncio="' + dsCampiAnnuncio[i].ObjAnnuncio + '"  class="campo-lookup '+dsCampiAnnuncio[i].ID + '" data-bind="'+strWidget+': {onContentReady:contentReadyActionFiltri,onValueChanged:function(e){ cambiatoFiltro(e.value, e.component.option(\'listaDaFiltrare\'))},listaDaFiltrare:\''+dsCampiAnnuncio[i].ListaDaFiltrare+'\',placeholder:placeHolderCampo, ';
				strHtml += '		dataSource: datiAnnuncio[' + i + '].tabella,';
				strHtml += "		displayExpr: 'Nome',";
				strHtml += "      searchEnabled:false,";
						
						
				if (dsCampiAnnuncio[i].ObjAnnuncio != "")
				{
					var lstr_valore = objAnnuncio[ dsCampiAnnuncio[i].ObjAnnuncio ]
					//if ( consoleLog ) console.log ( "results.js::loadFiltriByRubrica dati[i].ObjFiltro: " + dati[i].ObjFiltro + " | " + lstr_valoreFiltro ) ;    
					var lsValoriMultipli = ""
					var currentTagTokens = ""
					if (typeof lstr_valore == "string") {
						currentTagTokens = lstr_valore.split(",");
	
					}
	
					for (var k = 0; k < currentTagTokens.length; k++) {
						lsValoriMultipli += "'" + currentTagTokens[ k ] + "'"
						if (k + 1 < currentTagTokens.length)
							lsValoriMultipli += ","
					}
	
	
					if (lsValoriMultipli != "''") {
	
						strHtml += "		values: [" + lsValoriMultipli + "],";						
					}
					else
					{
						strHtml += "		values: [],";						
					}
	
				}

				viewModel.datiAnnuncio[i].valore(lstr_valore)

				strHtml += '		value: datiAnnuncio[' + i + '].valore,';
				strHtml += "		valueExpr: 'Valore',";
				strHtml += "		title: '" + dsCampiAnnuncio[i].Nome + "'";
				strHtml += '				}">';						
						
															
			}else{ //CAMPO EDIT
				viewModel.datiAnnuncio[i] ={id:dsCampiAnnuncio[i].ID,valore:ko.observable()}; 
				switch (dsCampiAnnuncio[i].Tipo) {
					case "N": // numero
						strWidget = "dxNumberBox";					
						//strWidget = "dxTextBox";											
						break;
					case "A": //alfanumerico
						strWidget = "dxTextBox";										
						break;					
					case "I": //importo
						//strWidget = "dxTextBox";			
						strWidget = "dxNumberBox";									

						break;					
				}
				strHtml += '	<div id="campoAnnuncio_' + dsCampiAnnuncio[i].ObjAnnuncio + '" TipoCampo="'+dsCampiAnnuncio[i].Tipo +'" ObjAnnuncio="' + dsCampiAnnuncio[i].ObjAnnuncio + '"  class="campo-lookup '+dsCampiAnnuncio[i].ID + '"'+ ' data-bind="'+strWidget+':{onFocusIn:function(e){focusIn(e,\''+dsCampiAnnuncio[i].Tipo+'\')},onFocusOut:function(e){focusOut(e,\''+dsCampiAnnuncio[i].Tipo+'\')},min:0,showClearButton:true,value:formattaCampo(objAnnuncio[\''+dsCampiAnnuncio[i].ObjAnnuncio+'\'],\''+dsCampiAnnuncio[i].Tipo+'\')}">';
				
			}


									
			
			strHtml += '</div></div>';			
		
			$(".dx-active-view .inserimento-annuncio-content .dx-fieldset.dinamico").html(strHtml).promise().done(function(){
					ko.cleanNode($(".dx-active-view .inserimento-annuncio-content .dx-fieldset.dinamico")[0]);//devo cancellare il precedente binding prima di chiamarlo nuovamente
					ko.applyBindings(viewModel, $(".dx-active-view .inserimento-annuncio-content .dx-fieldset.dinamico")[0]);					
		
					$(".dx-active-view .inserimento-annuncio").enterAsTab({ 'allowSubmit': true});										
			
			});		
		


		}


		//filtra le tendine che sono da filtrare in base ai valori caricati dell'annuncio
		
		for (i = 0; i < viewModel.datiAnnuncio.length; i++) {
			//console.log(viewModel.datiAnnuncio[i].tabella )
			if (viewModel.datiAnnuncio[i].tabella && viewModel.datiAnnuncio[i].listaDaFiltrare && viewModel.datiAnnuncio[i].valore()) {
				if ( consoleLog )  console.log("filtra : "+viewModel.datiAnnuncio[i].listaDaFiltrare)
				for (indice = 0; indice < viewModel.datiAnnuncio.length; indice++) {
					if (viewModel.datiAnnuncio[indice].id===viewModel.datiAnnuncio[i].listaDaFiltrare) {					
						viewModel.datiAnnuncio[indice].tabella.filter("Parent","=",viewModel.valoreRubrica().ID+viewModel.datiAnnuncio[i].valore())		
						viewModel.datiAnnuncio[indice].tabella.load();					        
					
					}
				}
				
			}
			
		}



		setTimeout(function(){				
			loadPanelVisible(false);
		},200);


	});


}
/* Carica la sezione foto/aggiungi foto */
function loadFoto() {
    strFoto = ""
    console.log('loadFoto')
	for (i=0;i<elencoFoto.length;i++) {
		strFoto+=' <div data-bind="dxAction:function(){eliminaFoto('+i+')},style: { backgroundImage:\'url('+elencoFoto[i]+')\'}" class="foto-annuncio foto'+i+'"><div data-bind="visible:visibleTastoPubblica" class="ico-elimina"></div></div>';
	}
	
    
	strNuovoFoto = ' <div data-bind="visible:visibleTastoPubblica"  class="foto-annuncio aggiungi-foto"></div>';
	
	$(".dx-active-view #campoAnnuncio_foto").html(strFoto + strNuovoFoto).promise().done(function(){
		ko.cleanNode($(".dx-active-view #campoAnnuncio_foto")[0]);//devo cancellare il precedente binding prima di chiamarlo nuovamente
		ko.applyBindings(viewModel, $(".dx-active-view #campoAnnuncio_foto")[0]);					
		
	});
	
}
 var viewModel = {
        //  Put the binding properties here
	    currentNavigationItemId: 'navigation_3', //forzo la selezione della navbar perche con il root false selezionerebbe sempre la prima icona        
		listDataSource:listDataSource,
		title:ko.observable("Inserisci Annuncio"),
		modelIsReady: modelIsReady.promise(),
        
		kaAnnuncio: kaAnnuncio,
		toastSuccessVisible:toastSuccessVisible,
   	    categorie: new DevExpress.data.DataSource({ store: PortaPortese.db.categorie,paginate:false}),
	    rubriche: new DevExpress.data.DataSource({ store: PortaPortese.db.rubriche,paginate:false}),
	    datiAnnuncio: [],
		actionsheet: {
            title: ko.observable('Scegli una foto'),
            visible: ko.observable(false),
            showActionSheet: function () {

                viewModel.actionsheet.visible(true);
            },
            items: [
                {
                    text: "Scatta foto",
                    clickAction: function () {

                        uploadFotoCamera();
                    }
                },
                {
                    text: "Scegli dal rullino",
                    clickAction: function () {
                        uploadFotoRullino();
                    }
                },

            ]

        },
		valoreCategoria:valoreCategoria,
		valoreRubrica:valoreRubrica,
		msgInfo : msgInfo,
		PanelMsgVisible: PanelMsgVisible,
		testoAnnuncio:testoAnnuncio,
  	    pref1:pref1, 
		telef1:telef1,  
		pref2:pref2,
		telef2:telef2,
		pubblicaEmail:pubblicaEmail,
		privacy:privacy,		
		statoAnnuncio:statoAnnuncio,
		testoPubblicaAnnuncio:ko.observable('Pubblica'),
		visibleTastoPubblica:ko.observable(true),
		categorieDisabilitate:ko.observable(false),
		rubricheDisabilitate:ko.pureComputed(function() 
		{
			return viewModel.valoreCategoria()==''||viewModel.categorieDisabilitate();

		}),
		placeHolderCampo:"Scegli",
        loadPanelVisible: loadPanelVisible,		
		msgLoadPanel:ko.observable("Caricamento"),		
        isLoaded: isLoaded,
		lastImageUri:"",
		utenteSloggato:utenteSloggato,
		cssUtenteLoggato:ko.pureComputed(function() 
		{

		    return utenteSloggato() ? 'utenteGuest' : 'utenteLoggato';
		}),
		
	
		resetView : function () {

		    valoreCategoria(''),
            valoreRubrica(''),
            statoAnnuncio(''),
            testoAnnuncio(''),
            pref1(''), 
            telef1(''),  
            pref2(''), 
            telef2(''),
            $(".dx-active-view .inserimento-annuncio-content #files").html("")
            window.scrollTo(0, 0)
		    objAnnuncio = new ObjCampiInserimentoAnnuncioDefault();
		    wsRestImpegnaKa(g_TokenLogin).done(function (success, response) {
		        if (success) {
		            kaAnnuncio = response;
		            urlFotoUpload = HTTPSERVERREST + "annuncio/" + g_TokenLogin + "/" + kaAnnuncio + "/append/upload"
		            viewModel.initFoto();
		            if (consoleLog) console.log(kaAnnuncio)
		        }
		    });


		},
		viewShowing: function (e) {
		    if (!viewModel.bInitFB) {
		        viewModel.initFB();
		    }
		    
		    window.scrollTo(0,0)
		    

			



		},
		initFB: function () {
		    this.bInitFB = true;
		    
		    window.fbAsyncInit = function () {
		        
		        FB.init({
		            appId: g_appIdPortaPortese,
		            //appId: '238321446313221',
		            cookie: true,
		            xfbml: true,
		            version: 'v2.7'
		        });
		    };

		    (function (d, s, id) {
		        var js, fjs = d.getElementsByTagName(s)[0];
		        if (d.getElementById(id)) { return; }
		        js = d.createElement(s); js.id = id;
		        js.src = "https://connect.facebook.net/en_US/sdk.js";
		        fjs.parentNode.insertBefore(js, fjs);
		    }(document, 'script', 'facebook-jssdk'));

		},
		loginFB: function () {
		    console.log("login.js::loginFB");
		    DevExpress.ui.notify("LoginFB", "success", 2000);
		    fbAccessToken = " ";
		    this.msgLoadPanel("Login")
		    //this.loadPanelVisible(true);

		    $.fblogin({
		        fbId: g_appIdPortaPortese,
		        permissions: 'email',
		        fields: 'id,email,name,first_name,last_name',
		        success: function (data) {
		            DevExpress.ui.notify("Login success", "success", 2000);
		            fbAccessToken = " ";
		            //viewModel.email(data.email)
		            console.log('Basic public user data returned by Facebook', data);
		            fbAccessToken = data.id;
		            viewModel.loadPanelVisible(false);

		            wsRestLoginFB(data.id, data.email, data.name, data.last_name).done(function (success, response) {
		                if (success) {
		                    viewModel.loadPanelVisible(false);
		                    //DevExpress.ui.notify("Login effettuato", "success", 2000);
		                    msgInfo("Login Effettuato");
		                    PanelMsgVisible(true)
		                    setTimeout(function () {
		                        PanelMsgVisible(false)
		                    }, 2000)

		                    g_utenteLoggato = true;
		                    utenteSloggato(false);
		                    g_TokenLogin = response;
		                    //g_UserLogin = viewModel.email();
		                    //g_PasswordLogin = viewModel.password();
		                    wsRestImpegnaKa(g_TokenLogin).done(function (success, response) {
		                        if (success) {
		                            kaAnnuncio = response;
		                            urlFotoUpload = HTTPSERVERREST + "annuncio/" + g_TokenLogin + "/" + kaAnnuncio + "/append/upload"
		                            viewModel.initFoto();
		                            if (consoleLog) console.log(kaAnnuncio)
		                        }
		                    });

		                    PortaPortese.saveLoginToStorage("", "", g_TokenLogin, 'true');
		 
		                    //viewModel.caricaListaAnnunci();


		                } else {
		                    viewModel.pulisciVariabiliLogin()
		                    viewModel.loadPanelVisible(false);
		                    msgInfo(response.statusText);
		                    PanelMsgVisible(true)
		                    setTimeout(function () {
		                        PanelMsgVisible(false)
		                    }, 2000)

		                    //DevExpress.ui.notify(response.statusText, "error", 2000);
		                }
		            })

		        },
		        error: function (error) {
		            DevExpress.ui.notify("Login error", "error", 2000);
		            console.log('user denied');
		            viewModel.loadPanelVisible(false);
		            viewModel.pulisciVariabiliLogin()
		            msgInfo("Accesso Facebook negato");
		            PanelMsgVisible(true)
		            setTimeout(function () {
		                PanelMsgVisible(false)
		            }, 2000)

		            //DevExpress.ui.notify("Accesso Facebook negato", "error", 2000);
		        }
		    });

		    

		},
		pulisciVariabiliLogin:function(){
			 utenteSloggato(true);		
			 PortaPortese.saveLoginToStorage("","","","")			  					 
			 g_utenteLoggato=false;						 
			 g_UserLogin=null;
			 g_LoginFB=null;					 
			 g_PasswordLogin=null;				 	 
			 g_TokenLogin=null;				 	 
			
		},        
		logout: function () {
		  
		    wsRestLogout(g_TokenLogin).done(function (success, response) {
                console.log(response)
            	if(success) {
					viewModel.pulisciVariabiliLogin();
					PortaPortese.app.navigate('Account', { root: true });					
            	
            	} else {
            	    viewModel.pulisciVariabiliLogin();
            	    PortaPortese.app.navigate('Account', { root: true });
					//DevExpress.ui.notify(response.statusText, "error",5000);    					 						            		            	
            	}		  	 
	  		 });
	  		 
        },
		caricaAnnuncio:function (id) {
			
			objAnnuncio= new ObjCampiInserimentoAnnuncioDefault();
			wsRestAnnuncioVisualizza(g_TokenLogin,id).done(function(success,response){
				if(success) {
					if ( consoleLog )  console.log(response)

					
					
					for(var props in response){ //cicla i valori e li mette sulla struttura
					  objAnnuncio[props]=	response[props]
	  
					}
					if ( consoleLog )  console.log(objAnnuncio)
					if (objAnnuncio.bRichieste=="1") {//richieste

						viewModel.rubriche.filter("IDR","=",objAnnuncio.rubric)		
					}else{//offerte
						viewModel.rubriche.filter("ID","=",objAnnuncio.rubric)		

					}
					
					viewModel.rubriche.filter("ID","=",objAnnuncio.rubric)							
					var bTrovataRubrica=false;
					viewModel.rubriche.load().done(function(result){
						if (result.length==0) { //non ha trovato per ID prova con IDR
							viewModel.rubriche.filter("IDR","=",objAnnuncio.rubric)		
							viewModel.rubriche.load().done(function (result) {							
								objRubrica=result[0];
								objAnnuncio.bRichieste="1"
								bTrovataRubrica=true;
							});
						}else{
							objRubrica=result[0];
							bTrovataRubrica=true;							
						}
						

					});
					while (!bTrovataRubrica)  {}; //ricerca sincrona
					viewModel.valoreCategoria(objRubrica.Categoria)
					ll_id_rubrica = objRubrica.ID
					ll_idr_rubrica=objRubrica.IDR
					viewModel.filtraTendinaRubriche(objRubrica.Categoria).done(function(result){

						if (result.length==1) { //se c'e' solo una rubrica la mette invisibile
			
							$('.dx-active-view #campoAnnuncio_rubric').hide();
						}else{
							$('.dx-active-view #campoAnnuncio_rubric').show();			
						}
						viewModel.valoreRubrica({"ID":ll_id_rubrica,"IDR":ll_idr_rubrica})																																					
						
					});


					
					//viewModel.categorieDisabilitate(true);
				
					
					//campi fissi
					viewModel.testoAnnuncio(objAnnuncio.testo);
					viewModel.pref1(objAnnuncio.pref1);					
					viewModel.telef1(objAnnuncio.telef1);										
					viewModel.pref2(objAnnuncio.pref2);					
					viewModel.telef2(objAnnuncio.telef2);										
					viewModel.pubblicaEmail(objAnnuncio.pubblicaemail=="true");					
					viewModel.statoAnnuncio(objAnnuncio.stato);		
												

					
					if (viewModel.statoAnnuncio()=="attesa-drw") {
						viewModel.title("Modifica Annuncio")
						viewModel.testoPubblicaAnnuncio('Ripubblica')
						viewModel.visibleTastoPubblica(true)	
					}
					if (viewModel.statoAnnuncio()=="attesa-r"||viewModel.statoAnnuncio()=="attesa-rw") {
						viewModel.title("Visualizza Annuncio")					
						viewModel.visibleTastoPubblica(false)	

					}
					if (viewModel.statoAnnuncio()=="annullato-p") {
						viewModel.title("Ripristino Annuncio")
						viewModel.testoPubblicaAnnuncio('Ripristina')
						viewModel.visibleTastoPubblica(true)	

					}
					if (viewModel.statoAnnuncio()=="rifiutato-r") {
					    viewModel.title("Visualizza Annuncio")
						viewModel.visibleTastoPubblica(false)	
						
					}
					if (viewModel.statoAnnuncio()=="online-drw") {
						viewModel.title("Modifica Annuncio")
						viewModel.testoPubblicaAnnuncio('Ripubblica')
						viewModel.visibleTastoPubblica(true)	

					}
					
					
					//foto

					elencoFoto=[];
					for(i=0;i<response.imgsthumb.length;i++){ //cicla i valori e li mette sulla struttura
						
						elencoFoto.push(http_url+response.imgsthumb[i])					    
					}
					
					
					//campi dinamici

					viewModel.caricaCampiAnnuncio(objAnnuncio.rubric)
					

					
				}else{
					
				}
			});
		
			
			
		},
		viewShown: function () {
	        
		    // Change this to the location of your server-side upload handler:
		    /*    
                uploadButton = $('<button/>')
                    .addClass('btn btn-primary')
                    .prop('disabled', true)
                    .text('Processing...')
                    .on('click', function () {
                        var $this = $(this),
                            data = $this.data();
                        $this
                            .off('click')
                            .text('Abort')
                            .on('click', function () {
                                $this.remove();
                                data.abort();
                            });
                        data.submit().always(function () {
                            $this.remove();
                        });
                    });



            */
		   


		    viewModel.msgLoadPanel('Caricamento')

		    bInserimento = true;
		    viewModel.title("Inserisci Annuncio")
		    objAnnuncio = new ObjCampiInserimentoAnnuncioDefault();
		    //}
		    //PortaPortese.loadLoginToStorage();  //da togliere perche con la app parte sempre dalla HOME      
            /*    
		    if (g_TokenLogin) {
		        wsRestValidationToken(g_TokenLogin).done(function (success, response) {
		            if (success) {

		                g_utenteLoggato = true;
		                utenteSloggato(false);
		                modelIsReady.resolve();
		                console.log('resolve')
		                wsRestImpegnaKa(g_TokenLogin).done(function (success, response) {
		                    if (success) {
		                        kaAnnuncio = response;
		                        url = HTTPSERVERREST + "annuncio/" + g_TokenLogin + "/" + kaAnnuncio + "/append/upload"
		                        initFoto();
		                        if (consoleLog) console.log(kaAnnuncio)
		                    }
		                });

		            } else {

		                utenteSloggato(true);
		                g_TokenLogin = null;
		                //DevExpress.ui.notify("Effettuare il login dal menu account per pubblicare un annuncio ", "error",5000);    					 							
		                //PortaPortese.app.navigate('Account', { root: true });
		                modelIsReady.resolve();
		                console.log('resolve')

		            }
		        });

		    } else {*/
		        //viewModel.loginFB()

		        //DevExpress.ui.notify("Effettuare il login dal menu account per pubblicare un annuncio ", "error",5000);    					 											
		        //PortaPortese.app.navigate('Account', { root: true });

		        modelIsReady.resolve();
		        console.log('resolve')

		    //}

        },
		initFoto:function() {
		    $('.dx-active-view #fileupload').off('fileuploadadd')
		    $('.dx-active-view #fileupload').off('fileuploaddone')
		    $('.dx-active-view #fileupload').off('fileuploadfail')
		    $('.dx-active-view #fileupload').off('fileuploadadd')
		    $('.dx-active-view #fileupload').off('fileuploadprogressall')
		    $('.dx-active-view #fileupload').off('fileuploadprocessalways')



		    $('#fileupload').fileupload({
		        url: urlFotoUpload,
		        dataType: 'json',
		        paramName: 'uploadedFile',
		        formData: params,
		        autoUpload: true,

		        previewMaxWidth: 100,
		        previewMaxHeight: 100,
		        disableImageResize: /Android(?!.*Chrome)|Opera/
                    .test(window.navigator.userAgent),
		        previewCrop: true
		    }).on('fileuploadadd', function (e, data) {
		        data.context = $('<div/>').appendTo('#files');
		        $.each(data.files, function (index, file) {
		            var node = $('<p/>')
                            .append($('<span/>').text(file.name));
		            node.appendTo(data.context);
		        });
		    }).on('fileuploadprocessalways', function (e, data) {
		        var index = data.index,
                    file = data.files[index],
                    node = $(data.context.children()[index]);
		        if (file.preview) {
		            node
                        .prepend('<br>')
                        .prepend(file.preview);
		        }
		        if (file.error) {
		            node
                        .append('<br>')
                        .append($('<span class="text-danger"/>').text(file.error));
		        }
		        if (index + 1 === data.files.length) {
		            data.context.find('button')
                        .text('Upload')
                        .prop('disabled', !!data.files.error);
		        }
		    }).on('fileuploadprogressall', function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
		    }).on('fileuploaddone', function (e, data) {
		        console.log(data)
		        setTimeout(function () {
		            $('#progress .progress-bar').css('width', 0);
		        }, 2000)
		        //toastSuccessVisible(true)
		        //DevExpress.ui.notify("Upload foto completata", "success", 2000);
		        msgInfo("Upload foto completata");
		        PanelMsgVisible(true)
		        setTimeout(function () {
		            PanelMsgVisible(false)
		        },2000)
		        $.each(data.files, function (index, file) {
		            if (file.url) {
		                var link = $('<a>')
                            .attr('target', '_blank')
                            .prop('href', file.url);
		                $(data.context.children()[index])
                            .wrap(link);
		            } else if (file.error) {
		                var error = $('<span class="text-danger"/>').text(file.error);
		                $(data.context.children()[index])
                            .append('<br>')
                            .append(error);
		            }
		        });
		    }).on('fileuploadfail', function (e, data) {
		        $('#progress .progress-bar').css('width', 0);
		        msgInfo("Errore upload foto");
		        PanelMsgVisible(true)
		        setTimeout(function () {
		            PanelMsgVisible(false)
		        }, 2000)

		        //DevExpress.ui.notify("Errore upload foto", "error", 3000);
		        $.each(data.files, function (index) {

		            var error = $('<span class="text-danger"/>').text('File upload failed.');
		            $(data.context.children()[index])
                        .append('<br>')
                        .append(error);
		        });
		    }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');
		},				
		filtraTendinaRubriche:function(id) {
		    var dfd = new $.Deferred();			
			viewModel.rubriche.filter("Categoria","=",id)		
			viewModel.rubriche.load().done(function(result){

				if (result.length==1) { //se ce solo una rubrica la seleziona e la mette invisibile e carica i campi

					viewModel.valoreRubrica(result[0])
		            $('.dx-active-view #campoAnnuncio_rubric').hide();

					if (bInserimento) {//se sto in inserimento al cambio del filtro carica i campi dell'annuncio
						
						viewModel.caricaCampiAnnuncio(result[0].ID)						
					}
					
				}else{
					viewModel.valoreRubrica("");				

		            $('.dx-active-view #campoAnnuncio_rubric').show();					
				}
				dfd.resolve(result)
			});
	   	    return dfd.promise();

		},		
		validationCallback:function(e) {

			if (e.rule.showError) {
				e.rule.showError=false;
				return false
			}else{
				return true				
			}
				

		},
		formattaCampo:function(valore,tipoCampo) {
			/*if ((tipoCampo=="I"||tipoCampo=="N")&&valore) {
				valore = valore.toString().split(".")[0];								
				valore = parseInt(valore);				
				valore=Globalize.format(parseFloat(valore))
			}*/
			return valore;
		},
		focusIn:function (e,tipoCampo) {
			valore = e.component.option('type')
			
			/*if ((tipoCampo=="I"||tipoCampo=="N")&&valore) { //al focus se sono presenti i punti di divisione cifre decimali li toglie

				valore=valore.toString().replace(".", "");
				console.log(valore)				
				//bloccaEdit = true;
				e.component.option('value',valore)
				//bloccaEdit=false;
			}*/
		},
		focusOut:function (e,tipoCampo) {
	
			valore = e.component.option('value')
			/*if ((tipoCampo=="I"||tipoCampo=="N")&&valore) {
				valore = valore.toString().split(".")[0];								
				console.log(valore)
				valore = parseInt(valore);				
				console.log(valore)				
				e.component.option('value',Globalize.format(parseFloat(valore)))
				

			}*/
		},
		cambioFlagPrivacy:function(e) {
			valore = e.component.option('value') 
			if (valore) {
				pref1("");
				telef1("");
				pref2("");
				telef2("");
				
			}
			
		},
        cambiatoFiltro:function(valore,listaDaFiltrare) {
        	//listaDaFiltrare = e.component.option("listaDaFiltrare")
        	//valore =e.value
        	if (listaDaFiltrare.length > 0) {
				
        		viewModel.filtraTendinaFiltro(listaDaFiltrare,valore,true)
        	}
				

        },
        contentReadyActionFiltri:function(e){

			
	        valore =e.component.option("value")
			
        	listaDaFiltrare = e.component.option("listaDaFiltrare")
        	if (listaDaFiltrare!="undefined") {
        		viewModel.filtraTendinaFiltro(listaDaFiltrare,valore,false)
        	}
        		        
        },
        filtraTendinaFiltro:function(listaDaFiltrare,valoreFiltro,cancellaValore){

				
			valoreSelezionato=objAnnuncio[$('.campo-lookup.'+listaDaFiltrare).attr("objfiltro")]
			
    		for (i=0;i<viewModel.datiAnnuncio.length;i++) {
        		if (viewModel.datiAnnuncio[i].id===listaDaFiltrare) {

					var indice = i
					if (cancellaValore) {
						viewModel.datiAnnuncio[indice].valore("");
					}else{
						viewModel.datiAnnuncio[indice].valore(valoreSelezionato);						
					}
					viewModel.datiAnnuncio[indice].tabella.filter("Parent","=",viewModel.valoreRubrica().ID+valoreFiltro)		
					viewModel.datiAnnuncio[indice].tabella.load();					        
        		}
    		}
	        
        },
		aggiungiFoto :function() {
			viewModel.actionsheet.visible(true)

		},
		eliminaFoto :function(numFoto) {
			if (viewModel.visibleTastoPubblica()) {
			
		   	    DevExpress.ui.dialog.confirm("Rimuovere la foto?", "Elimina Foto").done(function (dialogResult) {
					
					if (dialogResult) {
						wsRestAnnuncioCancellaFoto( g_TokenLogin ,kaAnnuncio,numFoto+1 ).done(function(success,response){
									
									if(success) {
										 viewModel.loadPanelVisible(false);		
										 elencoFoto.splice(numFoto, 1);				
										 //loadFoto();
										 DevExpress.ui.notify("Foto rimossa", "success", 2000);    
									}else{
										viewModel.loadPanelVisible(false);				
										DevExpress.ui.notify("Errore modifica annuncio: "+response.statusText,"error" ,5000);    					 									
										
									}
							});			
						
					}
	
	
			
			    });
			
				
			} 

			
		},
		caricaCampiAnnuncio:function(id_rubrica) {
            console.log('carica campi:'+id_rubrica)
			
			if (id_rubrica) {
				loadPanelVisible(true);		
				$(".dx-active-view .inserimento-annuncio-content").show();
				$(".dx-active-view .inserimento-annuncio-footer").show();												
				setTimeout(function(){		
					//createMap_html()
					//loadFoto();
					loadCampiByRubrica(id_rubrica);	
				},200);
			}else{
				$(".dx-active-view .inserimento-annuncio-content").hide();				
				$(".dx-active-view .inserimento-annuncio-footer").hide();								
				$(".dx-active-view .inserimento-annuncio-content .dinamico").html("");							
			}
			

		},
		visualizzaErrori:function(objErrori) {
			/* Visualizza gli errori della pubblicazione annuncio */
			for (i=0;i<objErrori.length;i++) {
				element=$(".dx-active-view .inserimento-annuncio #campoAnnuncio_"+objErrori[i].campo);
				
				
				if (element.length>0) {
					if (element.hasClass("dx-tagbox")) {
						var obj = $(element).dxTagBox("instance");					
					}
					if (element.hasClass("dx-selectbox")) {
						var obj = $(element).dxSelectBox("instance");					
					}
					if (element.hasClass("dx-numberbox")) {
						var obj = $(element).dxNumberBox("instance");					
					}
					if (element.hasClass("dx-textarea")) {
						var obj = $(element).dxTextArea("instance");					
					}
					if (element.hasClass("dx-checkbox")) {
						var obj = $(element).dxCheckBox("instance");					
					}
					
					if (element.hasClass("dx-textbox")&&!$(element).hasClass("dx-selectbox")&&!$(element).hasClass("dx-tagbox")&&!$(element).hasClass("dx-numberbox")&&!$(element).hasClass("dx-textarea")) {
						var obj = $(element).dxTextBox("instance");					
					}							
					if ( consoleLog ) console.log(obj)
					validateError =obj.option("validateError")
					
					if (validateError)	 {//aggiorna il validator
						
						validateError.validationRules[0].isValid=false;
						obj.option("isValid",false)
						validateError.validationRules[0].message=objErrori[i].descrizione;

					}else{ //crea il validator
						
						element.dxValidator({validationRules: [{ showError:true,type: 'custom', validationCallback:viewModel.validationCallback,isValid:false, message: objErrori[i].descrizione}] })						
						obj.option("isValid",false)

						
					}
				}
			}

			
			
		},
		inserisciModificaAnnuncio:function(e) {


            /* Esamina tutti i valori scelti e riempie la struttura*/
            if ( consoleLog )  console.log(objAnnuncio)
			
   			viewModel.msgLoadPanel("Pubblicazione annuncio...")
			viewModel.loadPanelVisible(true);
            $(".dx-active-view .inserimento-annuncio .campo-lookup").each(function (index, element) { //cicla per i valori

                value = "";
                values = "";
				
				
				if ($(element).hasClass("dx-tagbox")) {
	                var obj = $(element).dxTagBox("instance");					
				}
				if ($(element).hasClass("dx-selectbox")) {
	                var obj = $(element).dxSelectBox("instance");					
				}
				if ($(element).hasClass("dx-numberbox")) {
	                var obj = $(element).dxNumberBox("instance");					
				}
				if ($(element).hasClass("dx-textarea")) {
	                var obj = $(element).dxTextArea("instance");					
				}
				if ($(element).hasClass("dx-checkbox")) {
	                var obj = $(element).dxCheckBox("instance");					
				}
				
				if ($(element).hasClass("dx-textbox")&&!$(element).hasClass("dx-selectbox")&&!$(element).hasClass("dx-tagbox")&&!$(element).hasClass("dx-numberbox")&&!$(element).hasClass("dx-textarea")) {
	                var obj = $(element).dxTextBox("instance");					
				}
				

                if ( consoleLog )  console.log(obj)   
                // Gestione Offerte/Richieste   
                if ( $(element).attr('id') == "campoAnnuncio_bRichieste" )
                {
                    objAnnuncio.bRichieste = obj.option("value") ;                    
                    
                    console.log("RUBRICA:"+viewModel.valoreRubrica())
                    if (objAnnuncio.bRichieste==0) {//offerte
	           			objAnnuncio.rubric=viewModel.valoreRubrica().ID		
                    }
                    if (objAnnuncio.bRichieste==1) {//richieste
	           			objAnnuncio.rubric=viewModel.valoreRubrica().IDR
                    }
                    

                }    
				value = obj.option("value"); // Valore Lista Singola   	
				
						
				if ( $(element).attr('TipoCampo') == "I"||$(element).attr('TipoCampo') == "N" ) {//toglie i separatori gruppi 
					//value=value.toString().replace(".", "");
					//console.log(value)	

				}
				
				
				
                /* valorizza la stuttura dei filtri in base all'id della tendina filtro */

                //if ( consoleLog )
                var arrayFiltroDescr = $(element).attr("id").split("_");

                if ( consoleLog )    console.log("results.js::applicaFiltri (SCELTA SINGOLA) " + $(element).attr("id") + " | " + value + " | " + arrayFiltroDescr [1]);
                //objAnnuncio[ "_" + arrayFiltroDescr [1] ] = value;
                objAnnuncio[ arrayFiltroDescr [1] ] = value;

            });

			/* Valorizza le coordinate dell'annuncio */ 
			if (objLatitude) {
				objAnnuncio.latitudine = objLatitude;
			}
			if (objLongitude) {
				objAnnuncio.longitudine= objLongitude;			
			}
			
            if (consoleLog) console.log( objAnnuncio);
			
			if (kaAnnuncio) {
				if ( consoleLog )  console.log(objAnnuncio)
				viewModel.msgLoadPanel("Pubblicazione annuncio...")
				wsRestAnnuncioModifica( g_TokenLogin ,kaAnnuncio,objAnnuncio ).done(function(success,response){
					     if ( consoleLog )  console.log(response)
						if(success) {
						    viewModel.loadPanelVisible(false);
						    msgInfo("Annuncio pubblicato");
						    DevExpress.ui.notify("Annuncio pubblicato", "error", 2000);
						    PanelMsgVisible(true)
						    setTimeout(function () {
						        PanelMsgVisible(false)
						    }, 2000)

						    DevExpress.ui.notify("Annuncio pubblicato", "success", 2000);    
						    
						    viewModel.resetView()
							
						}else{
						    viewModel.loadPanelVisible(false);
						    
							
							if (response.status==500) {
							    DevExpress.ui.notify("Errore pubblicazione annuncio: " + response.statusText, "error", 5000);
							    msgInfo("Errore pubblica annuncio: " + response.statusText);
							    
							    /*PanelMsgVisible(true)
							    setTimeout(function () {
							        PanelMsgVisible(false)
							    }, 2000)*/

							}else{
							    /* Esamina gli errori per segnalarli */
							    DevExpress.ui.notify("Errore pubblicazione annuncio! ", "error", 5000);
							    msgInfo("Errore pubblica annuncio");

							    /*PanelMsgVisible(true)
							    setTimeout(function () {
							        PanelMsgVisible(false)
							    }, 2000)*/

							    objErrori = response.responseJSON.errori;
							
								viewModel.visualizzaErrori(objErrori);
								e.validationGroup.validate()
									
											 	
								
							}
							
						}
				});

			}
			
            

		},		
		
		pubblicaAnnuncio:function(e) {
			
			if (viewModel.statoAnnuncio()=="annullato-p") { // fa il ripristino				
				viewModel.ripristinaAnnuncio();
			}
			if (viewModel.statoAnnuncio()==""||viewModel.statoAnnuncio()=="attesa-drw"||viewModel.statoAnnuncio()=="online-drw") { // inserisci/modifica annuncio				
				viewModel.inserisciModificaAnnuncio(e);
			}

			
		},

    };

	return viewModel;

};