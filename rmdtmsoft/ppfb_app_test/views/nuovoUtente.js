PortaPortese.NuovoUtente = function(params) {
 
 var viewModel = {
        //  Put the binding properties here
//	    currentNavigationItemId: 'navigation_2', //forzo la selezione della navbar perche con il root false selezionerebbe sempre la prima icona        
        title: "Nuovo Utente",
		msgLoadPanel:ko.observable("Caricamento"),
		loadPanelVisible:ko.observable(false),
		email:ko.observable(''),
		nome:ko.observable(''),
		cognome:ko.observable(''),		
		telefono:ko.observable(''),		
		consenso:ko.observable(false),				
		testoConsenso:ko.observable(""),
		chiama:function() {
            console.log( "login.js::chiama") ;
            window.location.href = "tel:" +  telefono ; 			
		},
		validationCallback:function(e) {

			if (e.rule.showError) {
				e.rule.showError=false;
				return false
			}else{
				return true				
			}
				

		},
		
		visualizzaErrori:function(objErrori) {
			for (i=0;i<objErrori.length;i++) {
				element=$('.dx-active-view .nuovo-utente .'+objErrori[i].campo);
				var obj = $(element).dxTextBox("instance");			
				validateError =obj.option("validateError")
				console.log(validateError)								
				if (validateError)	 {//aggiorna il validator
					console.log('aggiorna validator')
					validateError.validationRules[0].isValid=false;
					obj.option("isValid",false)
					validateError.validationRules[0].message=objErrori[i].descrizione;
	
				}else{ //crea il validator
					console.log('crea validator')								
					element.dxValidator({validationRules: [{ showError:true,type: 'custom', validationCallback:viewModel.validationCallback,isValid:false, message: objErrori[i].descrizione}] })						
					obj.option("isValid",false)
	
					console.log(obj)									
				}
				
				
				
			}
			
		},
		registra :function(e) {
			console.log( "nuovoUtente.js::registra") ;
			this.msgLoadPanel("Registrazione in corso...")
			this.loadPanelVisible(true);		
 		    var result = e.validationGroup.validate();                
  	        if (result.isValid) {
				wsRestRegistrazione ( this.email() , this.nome() , this.cognome() , this.telefono() , true, '127.0.0.1').done(function(success,response){
					if (success) {
						console.log(response)
						 if (response.esito=="OK") {
							 viewModel.loadPanelVisible(false);		
							 DevExpress.ui.notify("Registrazione effettuata", "success", 2000);            													 
							 PortaPortese.app.navigate('Account', { root: true });
							 
						 }else{ /* esito = "KO"*/
						 
							objErrori = response.errori;
							console.log(objErrori)
							viewModel.visualizzaErrori(objErrori);
							e.validationGroup.validate()							
							DevExpress.ui.notify("Errore registrazione utente! ", "error",5000);    					 	
							viewModel.loadPanelVisible(false);	
						 
						 }
											 
					}else{
						console.log(response)
						DevExpress.ui.notify(response.statusText, "error",5000);    					 					
						viewModel.loadPanelVisible(false);					 
						
						
					}
				});
			}else{
				DevExpress.ui.notify("Errore registrazione utente", "error",5000);    					 					
				viewModel.loadPanelVisible(false);					 
				
			}
		},
        viewShowing: function () {								
			
			viewModel.testoConsenso("Informativa ai sensi del codice in materia di protezione dei dati personali (Decreto Legislativo n. 196 del 30 giugno 2003) Il Decreto Legislativo n. 196 del 30 giugno 2003 ha la finalità di garantire che il trattamento dei tuoi dati personali si svolga nel rispetto dei diritti, delle libertà fondamentali e della dignità delle persone, con particolare riferimento alla riservatezza e all’identità personale. Ti informiamo, ai sensi dell’art. 13 del Codice, che i dati personali da te forniti ovvero altrimenti acquisiti nell’ambito dell’attività da noi svolta, potranno formare oggetto di trattamento, per le finalità connesse all’esercizio della nostra attività. Per trattamento di dati personali si intende la loro raccolta, registrazione, organizzazione, conservazione, elaborazione, modificazione, selezione, estrazione, raffronto, utilizzo, diffusione, cancellazione, distribuzione, interconnessione e quant’altro sia utile per l’esecuzione del Servizio, compresa la combinazione di due o più di tali operazioni.Il trattamento dei tuoi dati per le finalità sopraindicate avrà luogo prevalentemente con modalità automatizzate e informatiche, sempre nel rispetto delle regole di riservatezza e di sicurezza previste dalla legge, e con procedure idonee alla tutela delle stesse. Il titolare del trattamento dei dati personali è Compuservice S.r.l., con sede legale in Roma, Via del Gambero 30, nella persona del legale rappresentante (di seguito: Portaportese); responsabili del trattamento sono i dipendenti e/o professionisti incaricati da Portaportese, i quali svolgono le suddette attività sotto la sua diretta supervisione e responsabilità.Il conferimento dei dati personali da parte tua è assolutamente facoltativo; tuttavia l’eventuale rifiuto ad inserirli nella pagina dedicata alla registrazione rende impossibile l’esecuzione a tuo favore dei nostri servizi, come promossi anche nell’ambito del sito www.portaportese.it, nonché la tua registrazione al medesimo sito internet. I tuoi dati personali sono trattati nell’ambito della normale attività di Portaportese secondo le seguenti finalità• finalità strettamente connesse e strumentali alla gestione dei rapporti con la clientela (es.: esecuzione di operazioni sulla base degli obblighi derivanti dal contratto concluso con la clientela, etc.);• finalità connesse agli obblighi previsti da leggi, da regolamenti e dalla normativa comunitaria, nonché da disposizioni impartite da autorità a ciò legittimate dalla legge o da organi di vigilanza e controllo;• finalità funzionali all’attività di Portaportese. Rientrano in questa categoria le seguenti attività: a) rilevazione del grado di soddisfazione della clientela sulla qualità dei servizi resi e sull’operatività svolta da Secondamano, eseguita direttamente ovvero attraverso l’opera di società specializzate mediante interviste personali o telefoniche, questionari, etc.; b) promozione e vendita di prodotti e servizi di Portaportese, o di società terze, effettuate attraverso lettere, telefono, materiale pubblicitario, sistemi automatizzati di comunicazioni, etc.; c) indagini di mercato.I dati, o alcuni di essi, per le finalità dianzi espresse, potranno essere comunicati a:• società appartenenti al medesimo gruppo societario di cui fa parte Portaportese;• soggetti esterni che svolgano funzioni connesse e strumentali all’operatività del Servizio, come, a purotitolo esemplificativo, la gestione del sistema informatico, l’assistenza e consulenza in materia contabile, amministrativa, legale, tributaria e finanziaria;• soggetti cui la facoltà di accedere ai dati sia riconosciuta da disposizioni di legge o da ordini delle autoritàPortaportese potrà inoltre, se autorizzata, comunicare i dati a soggetti facenti parte del medesimo gruppo che ne facciano richiesta per scopi pubblicitari e/o di marketing. Un elenco dettagliato dei predetti soggetti è disponibile presso Portaportese. Ti informiamo, inoltre, che puoi consultare, modificare, opporti o far cancellare i tuoi dati o comunque esercitare tutti i diritti che ti sono riconosciuti ai sensi dell’art. 7 del Codice, inviando richiesta scritta al nostro indirizzo: Compuservice S.r.l. Riservatezza Dati Personali, Via del Gambero 30 00182 Roma o inviandoci una e-mail a info@portaportese.it. Se desideri consultare il testo completo del Codice in materia di protezione dei dati personali, visita il sito ufficiale dell’Autorità Garante www.garanteprivacy.it")			
	    	
        },
	    viewShown: function () {

        }   		        
    };


	return viewModel;

};



