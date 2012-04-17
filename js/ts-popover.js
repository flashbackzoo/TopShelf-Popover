// TopShelf - Popover ~ Copyright (c) 2011 - 2012 David Craig, https://github.com/flashbackzoo/TopShelf-Popover
// Released under MIT license, http://www.opensource.org/licenses/mit-license.php

(function ($) {
	$.fn.tsPopover = function (arg, callback) {
		// PUBLIC CONTROLS
		var methods = {
			open : function (el, callback) {
				var fx = simple();
				$("[data-ui*='popover-trigger'][href='" + el.id + "']").addClass("current");
				$(el).addClass("current");
				fx.center(el);
				fx.tranIn(el, callback);
				return el;
			}
			, close : function (el, callback) {
				var fx = simple();
				$("[data-ui*='popover-trigger'].current").removeClass("current");
				$(el).removeClass("current");
				fx.tranOut(el);
				$(el).css({
					"top" : ""
					, "left" : ""
					, "margin-left" : ""
					, "margin-top" : ""
				});
				$(el).unbind("mousemove");
				$(el).unbind("mouseup");
				callback();
				return el;
			}
		};
		
		// PRIVATE CONTROLS
		function drag (el, y, x) {
			var fx = simple();
			fx.drag(el, y, x);
		}
		
		// TRANSITIONS
		var simple = function () {
			var fx = {};
			
			(function () {
				fx.tranIn = function (el, callback) {
					$("[data-ui*='popover-mask']").show();
					$(el).show();
					if (callback !== undefined) {
						callback();
					}
				};
				
				fx.tranOut = function (el) {
					$("[data-ui*='popover-mask']").hide();
					$(el).hide();
				};
				
				fx.center = function (el) {
					$(el).css({
						"margin-left": "-" + $(el).outerWidth(true) / 2 + "px",
						"margin-top": "-" + $(el).outerHeight(true) / 2 + "px"
					});
				};
				
				fx.drag = function (el, y, x) {
					$(el).css({
						top: y + "px"
						, left: x + "px"
					});
				}
			})();
			return fx;
		};
		
		// determine if 'arg' is a method call, settings object, or something else
		if (methods[arg]) {
			return methods[arg].call(methods, this, callback);
		} else if (typeof arg === "object") {
		
			// DEFAULT POPOVER SETTINGS
			var settings = $.extend({
				"transition" : "simple"
				, "easyClose" : true
				, "draggable" : false
				, "mask" : false
				, "callbacks" : { "open" : function () { return false; }, "close" : function () { return false; }}
			}, arg);

			return this.each(function () {
				var popover = {
					container: this
					, settings: settings
					, triggers: $("a[href='" + this.id + "']")
					, close: $(this).find("[data-ui*='popover-close']")[0]
				};
	
				// EVENTS
				var events = function (methods) {
					var evt = {};
					var i = 0;
					(function () {
						evt.triggers = function () {
							if (popover.triggers.length > 0) {
								for (i = 0; i < popover.triggers.length; i += 1) {
									$(popover.triggers[i]).bind("click", function (e) {
										e.preventDefault();
										e.stopPropagation();
										if (!$(popover.container).hasClass("current")) {
											var openPopovers = $("[data-ui*='popover-panel'][class='current']");
											if (openPopovers.length) {
												$(openPopovers).each(function(index, value) {
													methods.close(this, popover.settings.callbacks.close);
												});
											}
											methods.open(popover.container, popover.settings.callbacks.open);
										}
									});
								}
							}
						};
	
						evt.closeButton = function () {
							if (popover.close) {
								$(popover.close).bind("click", function (e) {
									e.preventDefault();
									e.stopPropagation();
									methods.close(popover.container, popover.settings.callbacks.close);
								});
							}
						};
	
						evt.easyClose = function () {
							$("html").data("easyCloseSet", true);
							$(document).bind("click", function (e) {
								var el = $("[data-ui*='popover-panel'][class$='current']")[0];
								if ($(e.target).closest(el).length < 1 && $(e.target).attr("href") !== $(el).attr("id")) {
									methods.close(el, popover.settings.callbacks.close);
								}
							});
						};
	
						evt.drag = function () {
							$(popover.container).bind("mousedown", function (e) {
								var offsetY = e.pageY - popover.container.offsetTop + parseInt($(popover.container).css("margin-top"), 10)
									, offsetX = e.pageX - popover.container.offsetLeft + parseInt($(popover.container).css("margin-left"), 10);
								$(popover.container).bind("mousemove", function (e) {
									drag(popover.container, e.pageY - offsetY, e.pageX - offsetX);
								});
								$(popover.container).bind("mouseup", function (e) {
									$(popover.container).unbind("mousemove");
									$(popover.container).unbind("mouseup");
								});
							});
						};
	
						evt.scrollLock = function (el) {
							$(window).bind("mousewheel", function (e) {
								if ($(el).css("display") != "none") {
									e.preventDefault();
								};
							});
						};
					})();
					return evt;
				};
	
				// LIFT OFF
				(function () {
					var evt = events(methods);
					var mask = $("[data-ui*='popover-mask']");
					evt.triggers();
					evt.closeButton();
					if ($("html").data("easyCloseSet") !== true && popover.settings.easyClose === true) {
						evt.easyClose();
					}
					if (popover.settings.draggable === true) {
						evt.drag();
					}
					if (popover.settings.mask === true && mask.length < 1) {
						mask = "<div class='popover-mask' data-ui='popover-mask'></div>";
						$("body").append(mask);
						evt.scrollLock($("[data-ui='popover-mask']"));
					}
				})();
			});
		} else {
			$.error(this);
		}
	};
})(jQuery);