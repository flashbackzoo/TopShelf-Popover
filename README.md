#TopShelf - Popover
The Popover plugin for jQuery

##Setup
###Add the dependencies

    <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
    <script src="js/ts-popover.js"></script>
    <link rel="stylesheet" href="css/style.css">

###Add some markup
We use custom data attributes for JavaScript hooks. CSS classes are used purely for skinning.

This seperation makes your CSS more manageable and creating new skins easy.

The href of the popover trigger should match the id of the popover wish to target.

    <a href="firstPopover" data-ui="popover-trigger">Show the Popover</a>
    
    <div id="firstPopover" class="popover" data-ui="popover-panel">
        <a class="close" href="" data-ui="popover-close">close</a>
        Hello Sailor
    </div>

###Hook it up
Turn your markup into a Popover. Add this script directly before your </body> tag.

    <script>
        $(function(){
            $("div[data-ui='popover-panel']").tsPopover();
        });
    </script>

###Settings
You can pass .tsPopover() some optional settings. Here are the defaults...

    $("div[data-ui='popover-panel']").tsPopover({
        "transition": "simple"
        , "easyClose": true
        , "draggable": true
        , "mask": false
    });

####transition
The type of transition to use. Currently available transitions are "simple".

####easyClose
When set to true, any clicks outside the popover pane will close the popover.

####draggable
When set to true, the popover pane is draggable.

####mask
When set to true, all content behind the popover is masked out.