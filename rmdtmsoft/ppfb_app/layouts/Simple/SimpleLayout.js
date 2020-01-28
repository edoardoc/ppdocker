(function($, DX, undefined) {
    DX.framework.html.SimpleLayoutController = DX.framework.html.DefaultLayoutController.inherit({ctor: function(options) {
            options = options || {};
            options.name = options.name || "simple";
            this.callBase(options)
        }});
    var HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        LAYOUT_TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom";
    DX.framework.html.Win8SimpleLayoutController = DX.framework.html.SimpleLayoutController.inherit({
        _onRenderComplete: function(viewInfo) {
            var that = this,
                $markup = viewInfo.renderResult.$markup,
                $appbar = $markup.find(LAYOUT_TOOLBAR_BOTTOM_SELECTOR),
                appbar = $appbar.dxToolbar("instance");
            if (appbar) {
                that._refreshAppbarVisibility(appbar);
                appbar.optionChanged.add(function(optionName, optionValue) {
                    if (optionName === "items") {
                        that._refreshAppbarVisibility(appbar, $frame);
                        that._refreshHasToolbarClass(viewInfo)
                    }
                })
            }
        },
        _changeView: function(viewInfo) {
            this.callBase.apply(this, arguments);
            this._refreshHasToolbarClass(viewInfo)
        },
        _refreshAppbarVisibility: function(appbar) {
            var isAppbarNotEmpty = false;
            $.each(appbar.option("items"), function(index, item) {
                if (item.visible) {
                    isAppbarNotEmpty = true;
                    return false
                }
            });
            appbar.option("visible", isAppbarNotEmpty)
        },
        _refreshHasToolbarClass: function(viewInfo) {
            var hasToolbar = false,
                $frame = this._getViewFrame();
            if (!viewInfo.isLoadingStateView)
                var $appbar = $frame.find(".dx-active-view " + LAYOUT_TOOLBAR_BOTTOM_SELECTOR),
                    appbar = $appbar.dxToolbar("instance"),
                    hasToolbar = appbar.option("visible");
            $frame.toggleClass(HAS_TOOLBAR_BOTTOM_CLASS, hasToolbar)
        }
    });
    var layoutSets = DX.framework.html.layoutSets;
    layoutSets["navbar"] = layoutSets["navbar"] || [];
    layoutSets["navbar"].push({
        platform: "win8",
        root: false,
        phone: true,
        controller: new DX.framework.html.Win8SimpleLayoutController
    });
	/*RM per le altre viste prende sempre il layout e non il SimpleController */
	/*
    layoutSets["navbar"].push({
        platform: "android",
        root: false,
        controller: new DX.framework.html.SimpleLayoutController
    });*/
    layoutSets["simple"] = layoutSets["simple"] || [];
    layoutSets["simple"].push({controller: new DX.framework.html.SimpleLayoutController});
    layoutSets["simple"].push({
        platform: "win8",
        phone: true,
        controller: new DX.framework.html.Win8SimpleLayoutController
    })
})(jQuery, DevExpress);