#TopShelf - Popover
The Popover plugin for jQuery

##Setup
###Add the dependencies

    <script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
    <script src="js/ts-popover.js"></script>
    <link rel="stylesheet" href="css/style.css">

###Add some markup
TopShelf Popover uses "data-ui" attributes for JavaScript hooks. CSS classes are only used for styling.

The "href" of your popover trigger should match the "id" of the popover you wish to target.

    <a href="firstPopover" data-ui="popover-trigger">Show the Popover</a>
    
    <div id="firstPopover" class="popover" data-ui="popover-panel">
        <a class="close" href="" data-ui="popover-close">close</a>
        Hello Sailor
    </div>

###Make it go
Add some jQuery just before your closing body tag.

    <script>
        $(function(){
            $("[data-ui='popover-panel']").tsPopover();
        });
    </script>

###Settings (optional)
You can pass .tsPopover() some settings. Here are the defaults...

    $("div[data-ui='popover-panel']").tsPopover({
        "transition": "simple"
        , "easyClose": true
        , "draggable": true
        , "mask": false
        , "callbacks" : { "open" : function () { return false; } , "close" : function () { return false; } }
    });

####transition
The type of transition to use. Currently there is "simple" and "fade".
"simple" does a basic show / hide. "fade" fades in and out.

####easyClose
When set to true, any clicks outside the popover pane will close the popover.

####draggable
When set to true, the popover pane is draggable.

####mask
When set to true, all content behind the popover is masked out. You will need to add a mask element to your markup like...

    <div class='popover-mask' data-ui='popover-mask'></div>

####callbacks
You can pass a callback function for each of the public methods.

###Public methods
TopShelf Popover has two public methods "open" and "close".

Public method calls require the name of the method to call, and the transition you want to use...

    $("#firstPopover").tsPopover("open", "simple");
	
You can also pass a callback into a public method call like...

	$("#firstPopover").tsPopover("open", "simple", myCallback());