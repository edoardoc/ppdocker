window.PortaPortese = window.PortaPortese || {};
window.PortaPortese.data = window.PortaPortese.data || {};

$(function() {
    
    var consoleLog = false ;
    var TIMEOUT = 1000;

    /*
        Lista Annunci
    */
    function getAnnunci() {
        if ( consoleLog ) console.log ( "dataLayer.js::getAnnunci") ;       

        var result = $.Deferred();
        setTimeout(function() {
            var properties = [];  
            if (PPAnnunci) {
                if ( consoleLog ) console.log ( "dataLayer.js::getAnnunci Num. Annunci: " + PPAnnunci.length ) ;
	            $.each(PPAnnunci, function(_, value) {	               
	                properties.push(new PortaPortese.data.PropertyViewModel(value));
	            });
	        }
            result.resolve(properties);
        }, TIMEOUT);
        return result.promise();
	        

    }
    
    /*
        Annuncio Singolo
    */
    function getAnnuncioSingolo(id) {
        if ( consoleLog ) console.log ( "dataLayer.js::getAnnuncioSingolo " + id ) ;
        var current = null;
        $.each(PPAnnuncio, function(_, value) {
            if(value.ID == id)
                current = value;
        });

        var result = $.Deferred();
        setTimeout(function () {
            result.resolve(new PortaPortese.data.PropertyViewModel(current));
        }, TIMEOUT);
        return result.promise();
    }

    /*
        Ricrca Globale
    */
    function getRicercaGlobale() {
        if ( consoleLog ) console.log ( "dataLayer.js::getRicercaGlobale") ;       

        var result = $.Deferred();
        setTimeout(function() {
            var properties = [];  
            if (PPRubriche) {
                if ( consoleLog ) console.log ( "dataLayer.js::getRicercaGlobale: " ) ;
	            $.each(PPRubriche, function(_, value) {	               
	                properties.push(new PortaPortese.data.PropertyViewModel(value));
	            });
	        }
            result.resolve(properties);
        }, TIMEOUT);
        return result.promise();
	        

    }
    
    
////////////////////////////////////////////////////////////////////////////////////////////////////////

    
    function getPropertiesByCoordinates(latitude, longitude) {
        if ( consoleLog ) console.log ( "dataLayer.js::getPropertiesByCoordinates " + latitude + " " + longitude ) ;
        var result = $.Deferred();
        setTimeout(function() {
            var properties = [];
            $.each(PortaPortese.data.SampleData, function(_, value) {
                properties.push(new PortaPortese.data.PropertyViewModel(value));
            });
            result.resolve(properties);
        }, TIMEOUT);
        return result.promise();
    }

    function getPropertiesByPlaceName(name) {
        if ( consoleLog ) console.log ( "dataLayer.js::getPropertiesByPlaceName " + name ) ;
        var result = $.Deferred();
        setTimeout(function () {
            var properties = [];
            $.each(PortaPortese.data.SampleData, function(_, value) {
                properties.push(new PortaPortese.data.PropertyViewModel(value));
            });
            result.resolve(properties);
        }, TIMEOUT);
        return result.promise();
    }

    function getPropertyInfo(id) {
        if ( consoleLog ) console.log ( "dataLayer.js::getPropertyInfo " + id ) ;
        var current = null;
        $.each(PortaPortese.data.SampleData, function(_, value) {
            if(value.ID == id)
                current = value;
        });

        var result = $.Deferred();
        setTimeout(function () {
            result.resolve(new PortaPortese.data.PropertyViewModel(current));
        }, TIMEOUT);
        return result.promise();
    }

    function getBestOffers(take) {
        if ( consoleLog ) console.log ( "dataLayer.js::getBestOffers " + take ) ;
        var result = $.Deferred(),
            bestOffersList = [21, 15, 7, 18, 3],
            topProperties = [];
        if (!take || isNaN(take) || take > bestOffersList.length)
            take = bestOffersList.length;

        setTimeout(function () {
            for (var i = 0; i < take; i++)
                topProperties.push(new PortaPortese.data.PropertyViewModel(PortaPortese.data.SampleData[bestOffersList[i]]));
            result.resolve(topProperties);
        }, TIMEOUT);
        return result.promise();
    }

    $.extend(PortaPortese.data, {
        getPropertiesByCoordinates: getPropertiesByCoordinates,
        getPropertiesByPlaceName: getPropertiesByPlaceName,
        getPropertyInfo: getPropertyInfo,
        getBestOffers: getBestOffers,
        getAnnunci: getAnnunci,
        getRicercaGlobale: getRicercaGlobale		
    });
})