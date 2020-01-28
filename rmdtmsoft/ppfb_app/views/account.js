
PortaPortese.Account = function (params) {
 var utenteLoggato=ko.observable(g_utenteLoggato),
 modelIsReady = $.Deferred(),
 
 /*
 "attesa_drw",
"annuncio in attesa di essere processato, tutte le operazioni sono permesse (canc., modif.)"
],
[
"annullato_p",
"solo 	istino, l’annuncio e' stato cancellato dallâ€™utente e puo' essere ripristinato"
],
[
"attesa_r",
"nessun permesso, lâ€™annuncio e' in attesa"
],
[
"rifiutato_r",
"nessun permesso, l’annuncio e' stato rifiutato e non andra' in linea"
],
[
"online_rw",
"solo modifiche (non cancellabile)"
*/
 
 listDataSource = new DevExpress.data.DataSource({
	store: [],
	paginate: false
});




 var viewModel = {
        //  Put the binding properties here
	    currentNavigationItemId: 'navigation_2', //forzo la selezione della navbar perche con il root false selezionerebbe sempre la prima icona        
        title: "Account",
		noDataTesto:ko.observable("Nessun annuncio disponibile"),
		msgLoadPanel:ko.observable("Caricamento"),
   	    categorie: new DevExpress.data.DataSource({ store: PortaPortese.db.categorie,paginate:false}),
	    rubriche: new DevExpress.data.DataSource({ store: PortaPortese.db.rubriche,paginate:false}),
		bInitFB:false,
		listDataSource:listDataSource,
        selectedTab: ko.observable(),
		editEnabled: ko.observable(false),        
        editList: function() {
            viewModel.editEnabled(!viewModel.editEnabled());
        },		
		editButtonVisible:ko.observable(false),				
		
		modelIsReady: modelIsReady.promise(),		
        resultsItemClick: function (item) {

            PortaPortese.app.navigate({view: "InserimentoAnnuncio", ID:item.model.ka});
        },		
        clickItemTabs: function (e) {
			

			//console.log( tabs[e.model.selectedTab()].stato)


        },
		filtraStatoAnnunci:function(stato)	{

			filtro = []
			for (i=0;i<stato.length;i++) {
				filtro[filtro.length] =["stato","=",stato[i]];	
				filtro[filtro.length]="OR"				
			}
			filtro.pop();

			listDataSource.filter([filtro])
			listDataSource.load();
		},
		utenteLoggato:utenteLoggato,
		cssUtenteLoggato:ko.pureComputed(function() 
		{
			return utenteLoggato()?'utenteLoggato':'utenteGuest';
		}),
		
		telefono:telefono,
		loadPanelVisible:ko.observable(false),
		emailRecupero:ko.observable(''),	
		//email:ko.observable(''),			
		//password:ko.observable(''),
		email:ko.observable('mancini.ro@gmail.com'),			
		password:ko.observable('PP347564'),

		chiama:function() {
            console.log( "login.js::chiama") ;
            window.location.href = "tel:" +  telefono ; 			
		},
		
		login :function() {
			console.log( "login.js::login") ;
			this.msgLoadPanel("Login")
			this.loadPanelVisible(true);		

			wsRestLogin(this.email(),this.password()).done(function(success,response){
				if (success) {
					 viewModel.loadPanelVisible(false);		
  					 DevExpress.ui.notify("Login effettuato", "success", 2000);            													 
					 g_utenteLoggato=true;	
					 utenteLoggato(true);		 					 
                     g_TokenLogin = response ;
                     g_UserLogin=viewModel.email();
                     g_PasswordLogin=viewModel.password();

                     PortaPortese.saveLoginToStorage(g_UserLogin,g_PasswordLogin,g_TokenLogin,'false');
                     PortaPortese.app.navigate('InserimentoAnnuncio', { root: true });
					 viewModel.caricaListaAnnunci();	
					 
				}else{
					console.log(response)
					if (response.status==401) {
						DevExpress.ui.notify("Indirizzo e-mail o password errati! ", "error",5000);    					 	
					}else{
						DevExpress.ui.notify(response.statusText, "error",5000);    					 					
					}
					viewModel.loadPanelVisible(false);					 
			        
					
				}
			});
    
		},
		initFB:function () {
		    this.bInitFB = true;
		    window.fbAsyncInit = function () {
		        FB.init({
		            appId: g_appIdPortaPortese,
		            //appId: '238321446313221',
		            cookie:true,     
		            xfbml: true,
		            version: 'v2.7'
		        });
		    };

		    (function (d, s, id) {
		        var js, fjs = d.getElementsByTagName(s)[0];
		        if (d.getElementById(id)) { return; }
		        js = d.createElement(s); js.id = id;
		        js.src = "//connect.facebook.net/en_US/sdk.js";
		        fjs.parentNode.insertBefore(js, fjs);
		    }(document, 'script', 'facebook-jssdk'));

		},
		loginFB :function() {
			console.log( "login.js::loginFB") ;
			fbAccessToken=" ";
			this.msgLoadPanel("Login")
			//this.loadPanelVisible(true);

			$.fblogin({
			    fbId: g_appIdPortaPortese,
			    permissions: 'email',
			    fields: 'id,email,name,first_name,last_name',
			    success: function (data) {

                    viewModel.email(data.email)
			        console.log('Basic public user data returned by Facebook', data);
			        fbAccessToken = data.id;
			         viewModel.loadPanelVisible(false);
                    
			        wsRestLoginFB(data.id, data.email, data.name, data.last_name).done(function (success, response) {
			            if (success) {
			                viewModel.loadPanelVisible(false);
			                DevExpress.ui.notify("Login effettuato", "success", 2000);
			                g_utenteLoggato = true;
			                utenteLoggato(true);
			                g_TokenLogin = response;
			                g_UserLogin = viewModel.email();
			                g_PasswordLogin = viewModel.password();

			                PortaPortese.saveLoginToStorage("", "", g_TokenLogin, 'true');
			                PortaPortese.app.navigate('InserimentoAnnuncio', { root: true });
			                viewModel.caricaListaAnnunci();


			            } else {
			                viewModel.pulisciVariabiliLogin()
			                viewModel.loadPanelVisible(false);
			                DevExpress.ui.notify(response.statusText, "error", 2000);
			            }
			        })
                    
			    },
			    error: function (error) {
			        console.log('user denied');
			        viewModel.loadPanelVisible(false);
			        viewModel.pulisciVariabiliLogin()
			        DevExpress.ui.notify("Accesso Facebook negato", "error", 2000);
			    }
			});

		    // Settings
            /*    
			FacebookInAppBrowser.settings.appId = g_appIdPortaPortese;
			FacebookInAppBrowser.settings.redirectUrl = 'http://localhost/callback';
			FacebookInAppBrowser.settings.permissions = 'email';
			// Optional
			FacebookInAppBrowser.settings.timeoutDuration = 7500;
			
			// Login(accessToken will be stored trough localStorage in 'accessToken');
			FacebookInAppBrowser.login({
				send: function() {
					console.log('login opened');
				},
				success: function(access_token) {					
					fbAccessToken=access_token;
					console.log('done, access token: ' + access_token);
				},
				denied: function() {
					console.log('user denied');
					viewModel.loadPanelVisible(false);
					viewModel.pulisciVariabiliLogin()
					DevExpress.ui.notify("Accesso Facebook negato","error",2000);
				},
				timeout: function(){
					viewModel.loadPanelVisible(false);
					DevExpress.ui.notify("Timeout di connessione","error",2000);
					viewModel.pulisciVariabiliLogin()					
					console.log('a timeout has occurred, probably a bad internet connection');
				},
				complete: function(access_token) {
					console.log('window closed');
					if(access_token) {
						console.log(access_token);
					} else {
                        viewModel.loadPanelVisible(false);
                        DevExpress.ui.notify("Accesso Facebook negato","error",2000);
						viewModel.pulisciVariabiliLogin()                                       
						console.log('no access token');
					}
				},
				userInfo: function(userInfo) {

					if(userInfo) {
						console.log(JSON.stringify(userInfo));
						
						wsRestLoginFB(userInfo.id,userInfo.email,userInfo.name,userInfo.last_name).done(function(success,response){														
							if (success) {
								 viewModel.loadPanelVisible(false);		
								 DevExpress.ui.notify("Login effettuato", "success", 2000);            													 
								 g_utenteLoggato=true;	
								 utenteLoggato(true);		 					 
								 g_TokenLogin = response ;
								 g_UserLogin=viewModel.email();
								 g_PasswordLogin=viewModel.password();
			
								 PortaPortese.saveLoginToStorage("","",g_TokenLogin,'true');
								 PortaPortese.app.navigate('Account', { root: true });
								 viewModel.caricaListaAnnunci();	
								
								
							}else{
								viewModel.pulisciVariabiliLogin()
			   				    viewModel.loadPanelVisible(false);		
								DevExpress.ui.notify(response.statusText, "error",2000);    					 													
							}
						})
	
	
						
					} else {
						console.log('no user info');
			    	    viewModel.loadPanelVisible(false);			
                        DevExpress.ui.notify("Accesso Facebook negato","error",2000);											
					}
				}
			});
			
			
		    */    	
    
		},
		pulisciVariabiliLogin:function(){
			 utenteLoggato(false);		
			 PortaPortese.saveLoginToStorage("","","","")			  					 
			 g_utenteLoggato=false;						 
			 g_UserLogin=null;
			 g_LoginFB=null;					 
			 g_PasswordLogin=null;				 	 
			 g_TokenLogin=null;				 	 
			
		},
		logout :function() {		
		  	 wsRestLogout(g_TokenLogin).done(function(success,response){
            	if(success) {
					viewModel.pulisciVariabiliLogin();
            	
            	}else{
					DevExpress.ui.notify(response.statusText, "error",5000);    					 						            		            	
            	}		  	 
	  		 });
		
		},
		caricaListaAnnunci:function() {
			this.msgLoadPanel("Caricamento lista annunci")
			this.loadPanelVisible(true);		
            wsRestAnnunciLista ( g_TokenLogin).done(function(success,response){
            	if(success) {

					var annunci =response;
					var annunci_attesa_drw=[],annunci_annullato_p=[],annunci_attesa_r=[],annunci_attesa_rw=[],annunci_rifiutati_r=[],annunci_online_drw=[];
					 listDataSource.store().clear();
		            // Inserimento nella Lista Annunci del Resultset
		            for (var i = 0; i < annunci.length; i++) {
						
						viewModel.rubriche.filter("ID","=",annunci[i].rubrica[0])		
						viewModel.rubriche.load().done(function (result) {
							if (result.length==0) { //non ha trovato per ID prova con IDR
							
								viewModel.rubriche.filter("IDR","=",annunci[i].rubrica[0])		
								viewModel.rubriche.load().done(function (result) {
									if (result.length>0) {
											
										annunci[i].desRubrica= result[0].Nome;								


									}									
								});
							
							}
							
							if (result.length>0) {
								annunci[i].desRubrica= result[0].Nome;

							}
							
							if (annunci[i].stato=="attesa-drw") {
								annunci_attesa_drw.push(annunci[i])
							}
							if (annunci[i].stato=="attesa-r"||annunci[i].stato=="attesa-rw") {
								annunci_attesa_r.push(annunci[i])
							}
							
							if (annunci[i].stato=="annullato-p") {
								annunci_annullato_p.push(annunci[i])
							}
							if (annunci[i].stato=="rifiutato-r") {
								annunci_rifiutati_r.push(annunci[i])
							}
							if (annunci[i].stato=="online-drw") {
								annunci_online_drw.push(annunci[i])
							}
							
						});


		            }	
					
					if (annunci_attesa_r.length > 0 ) {
		                listDataSource.store().insert({ stato:"attesa_r",  groupName: "Annunci in elaborazione (" + annunci_attesa_r.length + ")",items:annunci_attesa_r});																	
					}
					if (annunci_attesa_drw.length > 0 ) {
						listDataSource.store().insert({ stato:"attesa_drw",  groupName: "Annunci in attesa di pubblicazione (" + annunci_attesa_drw.length + ")",items:annunci_attesa_drw});																		
					}
					listDataSource.store().insert({  stato:"online_drw", groupName: "Annunci pubblicati (" + annunci_online_drw.length + ")",items:annunci_online_drw});																						
					
	                if (annunci_annullato_p.length > 0 ) {
						listDataSource.store().insert({   stato:"annullato_p",  groupName: "Annunci annullati (" + annunci_annullato_p.length + ")",items:annunci_annullato_p});																							
					}
	                if (annunci_rifiutati_r.length > 0 ) {
		                listDataSource.store().insert({   stato:"annunci_rifiutati",  groupName: "Annunci rifiutati(" + annunci_rifiutati_r.length + ")",items:annunci_rifiutati_r});																						
					}
	                
					console.log(listDataSource.store())
					//listDataSource.sort({ getter: "ka", desc: true });
					listDataSource.load().done(function (result) {		
						viewModel.loadPanelVisible(false);		      
					});
		            
		            
					
            	}else{
					viewModel.loadPanelVisible(false);					 
					DevExpress.ui.notify(response.statusText, "error",5000);    					 						            	
            	}
            });			
		},
		cancellaAnnuncio:function(kaAnnuncio) {
	   	    DevExpress.ui.dialog.confirm("Cancellare l'annuncio ?", "Cancella Annuncio").done(function (dialogResult) {
				
				if (dialogResult) {
					
					viewModel.msgLoadPanel("Cancellazione annuncio in corso...")			
				   wsRestAnnuncioCancella( g_TokenLogin ,kaAnnuncio).done(function(success,response){
						if(success) {
								viewModel.loadPanelVisible(false);						
							 DevExpress.ui.notify("Annuncio cancellato", "success", 2000);    
							 viewModel.editEnabled(false);
							 viewModel.viewShowing();
							 //PortaPortese.app.navigate('Account', { root: true });						         													 						
						}else{
							viewModel.loadPanelVisible(false);	
							console.log(response)
							DevExpress.ui.notify("Errore cancellazione annuncio: "+response.statusText,"error" ,5000);    					 									
							
						}
					});
					
					
					
				}
			});
			
		},
		ripristinaAnnuncio:function(kaAnnuncio) {
	   	    DevExpress.ui.dialog.confirm("Ripristinare l'annuncio ?", "Ripristino Annuncio").done(function (dialogResult) {
				
				if (dialogResult) {
					
					viewModel.msgLoadPanel("Ripristino annuncio...")			
				   wsRestAnnuncioRipristina( g_TokenLogin ,kaAnnuncio).done(function(success,response){
						if(success) {
								viewModel.loadPanelVisible(false);						
							 DevExpress.ui.notify("Annuncio ripristinato", "success", 2000);    
							 viewModel.editEnabled(false);
							 viewModel.viewShowing();
							 //PortaPortese.app.navigate('Account', { root: true });						         													 						
						}else{
							viewModel.loadPanelVisible(false);	
							console.log(response)
							DevExpress.ui.notify("Errore ripristino annuncio: "+response.statusText,"error" ,5000);    					 									
							
						}
					});
					
					
					
				}
			});
			
		},
		
        nuovoutente :function() {
			
		    console.log( "login.js::nuovoutente") ;
             PortaPortese.app.navigate('NuovoUtente');
            //nuovoUtente("mirkob77@yopmail.com", "Mirko", "Di Tommaso", "06123456", 1, "10.1.100.116", "12334466") ;
            
		},
        recuperaPassword :function() {
			
		    console.log( "login.js::recuperaPassword") ;
		    wsRestRecuperaPass ( viewModel.emailRecupero()).done(function(success,response){
				console.log(response)				
          		if(success) {    
					 DevExpress.ui.notify("Password inviata per email", "success", 2000);   				        
				}else{

					DevExpress.ui.notify(response.statusText, "error",5000);    	
				}
			});
            //nuovoUtente("mirkob77@yopmail.com", "Mirko", "Di Tommaso", "06123456", 1, "10.1.100.116", "12334466") ;
            
		},
		
        viewShowing: function (args) {
            if (!viewModel.bInitFB) viewModel.initFB();
            utenteLoggato(g_utenteLoggato )
			if (g_TokenLogin) { 
				viewModel.msgLoadPanel("Controllo login")
				viewModel.loadPanelVisible(true);		
               
				 wsRestValidationToken ( g_TokenLogin).done(function(success,response){
					if(success) {
						viewModel.loadPanelVisible(false);								
						console.log('autologin - token valido')
						g_utenteLoggato=true;	
						utenteLoggato(true);			
					    //viewModel.caricaListaAnnunci();							
						PortaPortese.app.navigate('InserimentoAnnuncio', { root: true });
						modelIsReady.resolve();   		
					}else{
						viewModel.loadPanelVisible(false);								
						console.log('autologin - token non valido')							
						g_TokenLogin=null;
						//provo l'auto login
						console.log(g_LoginFB)
						if(g_LoginFB=='true') { //LOGIN FB
							console.log('autologin FB')
							viewModel.loginFB()
							modelIsReady.resolve();   		
						
						}else{//LOGIN NORMALE
						
							if (g_UserLogin&&g_PasswordLogin) {
								console.log('autologin - autologin')
								viewModel.email(g_UserLogin)
								viewModel.password(g_PasswordLogin);
								viewModel.login()
								modelIsReady.resolve();   		
							
							}else{
								modelIsReady.resolve();   								
							}
						}
					}
				 });
				
			}else{
			    console.log('autologin - token non impostato')
			    PortaPortese.loadLoginToStorage();
			    //provo l'auto login
			    if (g_LoginFB == 'true') { //LOGIN FB
			        console.log('autologin FB')
			        viewModel.loginFB()
			        modelIsReady.resolve();

			    } else {//LOGIN NORMALE

			        if (g_UserLogin && g_PasswordLogin) {
			            console.log('autologin - autologin')
			            viewModel.email(g_UserLogin)
			            viewModel.password(g_PasswordLogin);
			            viewModel.login()
			            modelIsReady.resolve();
			        } else {
			           

			            modelIsReady.resolve();
			        }
			    }
			}
			
			

			
	    	
        },
	    viewShown: function () {
	        $('#loginFB').click(function () {
	            viewModel.loginFB();
	        })
        }   		        
    };

	viewModel.selectedTab.subscribe(function(value) {
   		  // viewModel.filtraStatoAnnunci( tabs[value].stato)		
		   
		   switch (value) 
		   {
			   case 0: //in attesa
			   		viewModel.noDataTesto("Non ci sono annunci in attesa di pubblicazione")
					break;				   
			   case 1: //pubblicati
			   		viewModel.noDataTesto("Non ci sono annunci pubblicati")			   
					break;
		   }
	});


	viewModel.getIconEdit = ko.computed(function() {
        return viewModel.editEnabled() ? "fav-edit-done" : "fav-edit ";
    });
	viewModel.editConfig = ko.computed(function() {
                var config = {
                    reorderEnabled: DevExpress.devices.current().platform != "win8",
                    deleteEnabled: true
                };

                var type = "toggle";
                if(type == "hold" || type == "slide") {
                    config.menuType = type;
                    config.menuItems = [
                        {
                            text: viewModel.menuType() == "slide" ? "Custom" : "Custom Command"
    
                        }
                    ];
                } else {
                    config.deleteType = type;
                    config.menuItems = [];
                }

                return config;
    });



    viewModel.selectedTab(1);
	return viewModel;

};



