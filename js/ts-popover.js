(function ($) {
    $.fn.tsPopover = function(options) {
		// default settings
		var settings = $.extend({
			"transition": "simple"
			, "easyClose": true
		}, options);
		
		return this.each(function() {
			var popover = {
				container: this
				, settings: settings
				, triggers: $("a[href='"+this.id+"']")
				, title: $(this).find("[data-ui='popover-title']")[0]
				, close: $(this).find("[data-ui='popover-close']")[0]
			};
			
			////////////
			// MODELS //
			////////////
			
			var simple = function () {
				var fx = {};
				(function() {
					fx.tranIn = function(o) {
						$(o).show();
					};
					
					fx.tranOut = function (o) {
						$(o).hide();
					};
				})();
				return fx;
			};                  
			
			//////////////
			// CONTROLS //
			//////////////
			
			var controls = function(fx, drag) {
				var ctr = {};
				(function() {
					ctr.open = function (popover) {
						$(popover).addClass("current");
						fx.tranIn(popover);
					};
					ctr.close = function (popover) {
						$(popover).removeClass("current");
						fx.tranOut(popover);
					};
				})();
				return ctr;
			};
			
			////////////
			// EVENTS //
			////////////
			
			var events = function(ctr) {
				var evt = {};
                var i = 0;
				(function () {
					evt.triggers = function () {
						if (popover.triggers.length > 0) {
							for (i = 0; i < popover.triggers.length; i += 1) {
								$(popover.triggers[i]).bind("click", function (e) {
									e.preventDefault();
									if (!$(popover.container).hasClass("current")) {
                                        ctr.close($("[data-ui='popover-panel'][class='current']")[0]);
										ctr.open(popover.container);
									}
								});
							}
						}
					};
					
					evt.closeButton = function () {
						if (popover.close) {
                            $(popover.close).bind("click", function(e) {
                                e.preventDefault();
                                ctr.close(popover.container);
                            });
						}
					};
                    
                    evt.easyClose = function () {
                        $("html").data("easyCloseSet", true);
                        $("html").bind("click", function(e) {
                            var currentPopover = $("[data-ui='popover-panel'][class='current']")[0];
                            if ($(e.target).parents(currentPopover).length < 1) {
                                ctr.close(currentPopover);
                            }
                        });
                    };
				})();
				return evt;
			};
			
			//////////////
			// LIFT OFF //
			//////////////
			
			(function() {
				var fx = simple(popover);
				var ctr = controls(fx);
				var evt = events(ctr);			
				evt.triggers();
                evt.closeButton();
                if ($("html").data("easyCloseSet") !== true && popover.settings.easyClose === true) {
                    evt.easyClose();
                }
			})();
		});
	};
})(jQuery);