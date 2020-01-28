PortaPortese.About = function(params) {

 var viewModel = {
        //  Put the binding properties here
	    currentNavigationItemId: 'navigation_4', //forzo la selezione della navbar perche con il root false selezionerebbe sempre la prima icona        
		infoClick:function() {
			 window.open('http://www.rmdtmsoft.it', '_system');
		},
		viewShowing: function () {
		    PortaPortese.app.navigate('InserimentoAnnuncio', { root: true });
        },
        viewShown: function () {
            
        }   		        
    };

	return viewModel;

};