(function ($) {
	$.fn.tsOverlay = function(options) {
		// default settings
		var settings = $.extend({
			"transition": "simple"
			, "draggable": false
			, "easyClose": true
		}, options);
		
		return this.each(function() {
			var overlay = {
				container: this
				, settings: settings
				, triggers: $("a[href='"+this.id+"']")
				, title: $(this).find("[data-ui='overlay-title']")[0]
				, close: $(this).find("[data-ui='overlay-close']")[0]
			};
			
			////////////
			// MODELS //
			////////////
			
			var simple = function () {
				var fx = {};
				(function() {
					fx.tranIn = function(o) {
						$(o.incomming).show();
					};
					
					fx.tranOut = function (o) {
						$(o.outgoing).hide();
					};
				})();
				return fx;
			};
			
			//////////////
			// CONTROLS //
			//////////////
			
			var controls = function(fx) {
				var ctr = {};
				(function() {
					ctr.open = function (overlay) {
						ctr.close(overlay);
						//fx.tranIn();
					};
					ctr.close = function (overlay) {
						$("[data-ui='overlay-panel']").removeClass("current");
						fx.tranOut(overlay)
						console.log(overlay);
					};
				})();
				return ctr;
			}
			
			////////////
			// EVENTS //
			////////////
			
			var events = function(ctr) {
				var evt = {};
				(function () {
					evt.triggers = function () {
						if (overlay.triggers.length > 0) {
							for (i = 0; i < overlay.triggers.length; i += 1) {
								$(overlay.triggers[i]).bind("click", function (e) {
									e.preventDefault();
									if (!$(overlay.container).hasClass("current")) {
										ctr.open(overlay);
									}
								});
							}
						}
					};
					
					evt.title = function () {
						
					};
					
					evt.closeButton = function () {
						
					};
				})();
				return evt;
			};
			
			//////////////
			// LIFT OFF //
			//////////////
			
			(function() {
				var fx = simple(overlay);
				var ctr = controls(fx);
				var evt = events(ctr);			
				evt.triggers();
			})();
		});
	};
})(jQuery);