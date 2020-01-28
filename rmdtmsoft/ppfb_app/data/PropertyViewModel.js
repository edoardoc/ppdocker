window.PortaPortese = window.PortaPortese || {};
window.PortaPortese.data = window.PortaPortese.data || {};

PortaPortese.data.PropertyViewModel = function(property) {
    if(property == null)
        return;

    $.extend(this, property);
    this.IsFavorite = ko.computed(function() {
        return !!PortaPortese.findFavedProperty(property);
    });
};

PortaPortese.data.PropertyViewModel.prototype.changeFavState = function (e) {
    var me = e.model;
    
    if (me.IsFavorite()) {
			PortaPortese.faves.remove(function (item) { return item.oid == me.oid });	    	    
			DevExpress.ui.notify("Preferito rimosso", "success", 2000);            								
    }else {
        PortaPortese.faves.push(me);
		DevExpress.ui.notify("Preferito aggiunto", "success", 2000);            										
	}
};