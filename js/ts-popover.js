// TopShelf - Popover ~ Copyright (c) 2011 - 2012 David Craig, https://github.com/flashbackzoo/TopShelf-Popover
// Released under MIT license, http://www.opensource.org/licenses/mit-license.php

(function ($) {
    $.fn.tsPopover = function (arg, callback) {
        var allPopoverObjects = [];

        // TRANSITIONS (CALLED BY PUBLIC AND PRIVATE METHODS)
        var transitions = {
            drag : function (popoverContainer, y, x) {
                $(popoverContainer).css({
                    top : y + "px"
                    , left : x + "px"
                });
            }
            , simple : {
                tranIn : function (popover) {
                    privateMethods.mask(popover.settings.mask, function () {
                        $("[data-ui*='popover-mask']").show();
                    });
                    $(popover.container).show();
                    privateMethods.openCallback(popover);
                }
                , tranOut : function (popover) {
                    privateMethods.mask(popover.settings.mask, function () {
                        $("[data-ui*='popover-mask']").hide();
                    });
                    $(popover.container).hide();
                    privateMethods.closeCallback(popover);
                }
            }
            , fade : {
                tranIn : function (popover) {
                    privateMethods.mask(popover.settings.mask, function () {
                        $("[data-ui*='popover-mask']").fadeIn();
                    });
                    $(popover.container).fadeIn(function () {
                        privateMethods.openCallback(popover);
                    });
                }
                , tranOut : function (popover) {
                    privateMethods.mask(popover.settings.mask, function () {
                        $("[data-ui*='popover-mask']").fadeOut();
                    });
                    $(popover.container).fadeOut("slow", function () {
                        privateMethods.closeCallback(popover);
                    });
                }
            }
        };

        // PUBLIC METHODS
        var publicMethods = {
            open : function (popover) {
                $("[data-ui*='popover-trigger'][href='" + popover.container.id + "']").addClass("current");
                $(popover.container).addClass("current");
                transitions[popover.settings.transition].tranIn(popover);
            }
            , close : function (popover) {
                $("[data-ui*='popover-trigger'].current").removeClass("current");
                $(popover.container).removeClass("current");
                transitions[popover.settings.transition].tranOut(popover);
            }
        };

        // PRIVATE METHODS
        var privateMethods = {
            mask : function (bool, callback) {
                if (bool) {
                    callback();
                }
            }
            , drag : function (popover, y, x) {
                transitions.drag(popover.container, y, x);
            }
            , openCallback : function (popover) {
                if (popover.settings.callbacks.open !== undefined) {
                    popover.settings.callbacks.open();
                }
            }
            , closeCallback : function (popover) {
                privateMethods.resetPopover(popover);
                if (popover.settings.callbacks.close !== undefined) {
                    popover.settings.callbacks.close();
                }
            }
            , resetPopover : function (popover) {
                $(popover.container).css({
                    "top" : ""
                    , "left" : ""
                    , "margin-left" : ""
                    , "margin-top" : ""
                });
            }
        };

        // METHOD CALLING LOGIC. FIGURE OUT WHAT TO DO WHEN .tsPopover IS CALLED
        if (publicMethods[arg]) {
            // PUBLIC METHOD CALL
            return publicMethods[arg].call(publicMethods, this, callback);
        } else if (typeof arg === "object" || arg === undefined) {
            // NEW POPOVER CALL
            var settings = $.extend({
                "transition" : "simple"
                , "easyClose" : true
                , "draggable" : false
                , "mask" : true
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
                var events = function (publicMethods, privateMethods) {
                    var evt = {};
                    (function () {
                        evt.triggers = function () {
                            if (popover.triggers.length > 0) {
                                $(popover.triggers).each(function () {
                                    $(this).click(function (e) {
                                        e.preventDefault();
                                        if (!$(popover.container).hasClass("current")) {
                                            var openPopovers = $("[data-ui*='popover-panel'][class='current']");
                                            if (openPopovers.length) {
                                                $(allPopoverObjects).each(function(index, value) {
                                                    publicMethods.close(value);
                                                });
                                            }
                                            publicMethods.open(popover);
                                        }
                                    });
                                });
                            }
                        };

                        evt.closeButton = function () {
                            if (popover.close) {
                                $(popover.close).click(function (e) {
                                    e.preventDefault();
                                    publicMethods.close(popover);
                                });
                            }
                        };

                        evt.easyClose = function () {
                            $("html").data("easyCloseHasBeenSet", true);
                            $(document).bind("click", function (e) {
                                var el = $("[data-ui*='popover-panel'][class$='current']")[0];
                                if ($(e.target).closest(el).length < 1 && $(e.target).attr("href") !== $(el).attr("id")) {
                                    publicMethods.close(popover);
                                }
                            });
                        };

                        evt.drag = function () {
                            $(popover.container).bind("mousedown", function (e) {
                                var offsetY = e.pageY - popover.container.offsetTop + parseInt($(popover.container).css("margin-top"), 10)
                                    , offsetX = e.pageX - popover.container.offsetLeft + parseInt($(popover.container).css("margin-left"), 10);
                                $(document).bind("mousemove", function (e) {
                                    privateMethods.drag(popover, e.pageY - offsetY, e.pageX - offsetX);
                                });
                                $(document).bind("mouseup", function (e) {
                                    $(document).unbind("mousemove");
                                    $(document).unbind("mouseup");
                                });
                            });
                        };
                    })();
                    return evt;
                };

                // INITIALISE
                (function () {
                    var evt = events(publicMethods, privateMethods);

                    evt.triggers();
                    evt.closeButton();

                    if ($("html").data("easyCloseHasBeenSet") !== true && popover.settings.easyClose === true) {
                        evt.easyClose();
                    }

                    if (popover.settings.draggable === true) {
                        evt.drag();
                    }

                    allPopoverObjects[allPopoverObjects.length] = popover;
                })();
            });
        } else {
            $.error(this);
        }
    };
})(jQuery);