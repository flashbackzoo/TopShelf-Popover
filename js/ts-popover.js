// TopShelf - Popover ~ Copyright (c) 2011 - 2012 David Craig, https://github.com/flashbackzoo/TopShelf-Popover
// Released under MIT license, http://www.opensource.org/licenses/mit-license.php

(function ($) {
	$.fn.tsPopover = function (options) {
		// default settings
		var settings = $.extend({
			"transition": "simple"
			, "easyClose": true
			, "draggable": false
			, "mask": false
		}, options);

		return this.each(function () {
			var popover = {
				container: this
				, settings: settings
				, triggers: $("a[href='" + this.id + "']")
				, close: $(this).find("[data-ui*='popover-close']")[0]
			};

			////////////
			// MODELS //
			////////////

			var simple = function () {
				var fx = {};
				(function () {
					fx.tranIn = function (el) {
						$("[data-ui*='popover-mask']").show();
						$(el).show();
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

			//////////////
			// CONTROLS //
			//////////////

			var controls = function (fx, drag) {
				var ctr = {};
				(function () {
					ctr.open = function (el) {
						$("[data-ui*='popover-trigger'][href='" + el.id + "']").addClass("current");
						$(el).addClass("current");
						fx.center(el);
						fx.tranIn(el);
					};

					ctr.close = function (el) {
						$("[data-ui*='popover-trigger'].current").removeClass("current");
						$(el).removeClass("current");
						fx.tranOut(el);
						$(el).css({
							"top": ""
							, "left": ""
							, "margin-left": ""
							, "margin-top": ""
						});
						$(el).unbind("mousemove");
						$(el).unbind("mouseup");
					};

					ctr.drag = function (el, y, x) {
						fx.drag(el, y, x);
					}
				})();
				return ctr;
			};

			////////////
			// EVENTS //
			////////////

			var events = function (ctr) {
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
										ctr.close($("[data-ui*='popover-panel'][class='current']")[0]);
										ctr.open(popover.container);
									}
								});
							}
						}
					};

					evt.closeButton = function () {
						if (popover.close) {
							$(popover.close).bind("click", function (e) {
								e.preventDefault();
								ctr.close(popover.container);
							});
						}
					};

					evt.easyClose = function () {
						$("html").data("easyCloseSet", true);
						$(document).bind("click", function (e) {
							var el = $("[data-ui*='popover-panel'][class$='current']")[0];
							if ($(e.target).closest(el).length < 1 && $(e.target).attr("href") !== $(el).attr("id")) {
								ctr.close(el);
							}
						});
					};

					evt.drag = function () {
						$(popover.container).bind("mousedown", function (e) {
							var offsetY = e.pageY - popover.container.offsetTop + parseInt($(popover.container).css("margin-top"), 10)
								, offsetX = e.pageX - popover.container.offsetLeft + parseInt($(popover.container).css("margin-left"), 10);
							$(popover.container).bind("mousemove", function (e) {
								ctr.drag(popover.container, e.pageY - offsetY, e.pageX - offsetX);
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

			//////////////
			// LIFT OFF //
			//////////////

			(function () {
				var fx = simple(popover);
				var ctr = controls(fx);
				var evt = events(ctr);
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
	};
})(jQuery);