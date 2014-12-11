//Set of tools to simplify proofreading of SAE articles.

mw.loader.load( 'http://localhost/wikidaran/IllustrationCropper/jquery.Jcrop.js', 'text/javascript' );
mw.loader.load( 'http://localhost/wikidaran/IllustrationCropper/jquery.Jcrop.css', 'text/css' );
mw.loader.load( 'http://localhost/wikidaran/IllustrationCropper/IllustrationCropper.css', 'text/css' );

//importStylesheet( 'User:Xelgen/SAETools.css' );
console.log(mw.user.tokens.get( 'editToken' ));
//http://xelgen.net/wiki/SAECropper/HSH/02/556.jpg
var c, CropedImageIndex, prImgNatHeight, prImgNatWidth;
var SAECropInitialize = function ()
{

	AddSAEToolsButtons();
	
	InitHTML='<div id="croppedImages" class="cropped-images"></div>';
	
	InitHTML=InitHTML + '<div id="cropZoom" style="display:none; border:0px solid; position: fixed; top: 20px; left: 20px; width: 304px; height: 304px; z-index:100; box-shadow: 4px 4px 5px #888888;" >' +
		'<div style="border:0px;  float:left">'+
			'<div style="border:1px solid; width:150px; height:150px; float:top" class="zoomed-corner" id="cropZoomNW"><img src="//localhost/wikidaran/IllustrationCropper/zoomedCornerNW.png" style="opacity:0.6;filter:alpha(opacity=60);"/></div>'+
			'<div style="border:1px solid; width:150px; height:150px; float:bottom" class="zoomed-corner" id="cropZoomSW"><img src="//localhost/wikidaran/IllustrationCropper/zoomedCornerSW.png" style="opacity:0.6;filter:alpha(opacity=60);"/></div>'+
		'</div>'+
		'<div style="border:0px; float:right">'+
			'<div style="border:1px solid; width:150px; height:150px; float:top" class="zoomed-corner" id="cropZoomNE"><img src="//localhost/wikidaran/IllustrationCropper/zoomedCornerNE.png" style="opacity:0.6;filter:alpha(opacity=60);"/></div>'+
			'<div style="border:1px solid; width:150px; height:150px; float:bottom" class="zoomed-corner" id="cropZoomSE"><img src="//localhost/wikidaran/IllustrationCropper/zoomedCornerSE.png" style="opacity:0.6;filter:alpha(opacity=60);"/></div>'+
		'</div>' + 
	'</div>';
	$( ".editOptions" ).after( InitHTML);	
	
}


//We're adding button here
var AddSAEToolsButtons = function() {

$( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
		'section': 'main',
		'group': 'insert',
		'tools': {
			'addpageimage': {
				label: 'Տեսածրած էջից կտրել պատկեր և ստեղծել առանձին պատկեր',
				type: 'button',
				icon: '//upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Image_Crop_Icon.svg/22px-Image_Crop_Icon.svg.png',
				action: {
							type: 'callback',
								execute: function(context){
									PRCrop();
							} 
				}
			}
		}
	} );
	
$( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
        'section': 'main',
        'group': 'insert',
        'tools': {
                'Temp': {
                        label: 'Ժամանակավոր', // or use labelMsg for a localized label, see above
                        type: 'button',
                        icon: '//upload.wikimedia.org/wikipedia/commons/b/b9/Toolbaricon_ellipsis.png',
                        action: {
							type: 'callback',
								execute: function(context){
									Tempo();
							} 
						}
                }
        }
} );
/*
$( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
        'section': 'main',
        'group': 'insert',
        'tools': {
                'Temp2': {
                        label: 'Լատինական կետադրական նշանները փոխել հայերեն նշաններով', // or use labelMsg for a localized label, see above
                        type: 'button',
                        icon: '//upload.wikimedia.org/wikipedia/commons/b/b9/Toolbaricon_ellipsis.png',
                        action: {
							type: 'callback',
								execute: function(context){
									SummaryFix();
							} 
						}
                }
        }
} );
*/
//$(".group.group-insert").css("border-right","1px solid #DDDDDD"); //spend an hour to bring separator line, after insert group
	
};

// Courtesy of http://www.jacklmoore.com/notes/naturalwidth-and-naturalheight-in-ie/
// adds .naturalWidth() and .naturalHeight() methods to jQuery
// for retreaving a normalized naturalWidth and naturalHeight.
(function($){
	var
	props = ['Width', 'Height'],
	prop;

	while (prop = props.pop()) {
	(function (natural, prop) {
	  $.fn[natural] = (natural in new Image()) ? 
	  function () {
	  return this[0][natural];
	  } : 
	  function () {
	  var 
	  node = this[0],
	  img,
	  value;

	  if (node.tagName.toLowerCase() === 'img') {
		img = new Image();
		img.src = node.src,
		value = img[prop];
	  }
	  return value;
	  };
	}('natural' + prop, prop.toLowerCase()));
	}
}(jQuery));


function Tempo()
{

//This piece needs to be moved on ProofReadImage.load which somewhat pain in the neck, as there's no proper event for this
$('.prp-page-image').mousedown(function(e) {	
//$('#ProofReadImage').mousedown(function(e) {	
	//console.log(startX);
	//console.log(startY);
	if (e.altKey) {
		
		e.stopPropagation();
		PRCrop();		
		var jCropEvent = new $.Event("mousedown");
		jCropEvent.pageX=e.pageX;
		jCropEvent.pageY=e.pageY;
	
		$('.jcrop-tracker:gt(0)').trigger(jCropEvent);		
	}
});

}




//position: absolute; top: -47px; left: -385px; width: 1423px; height: 1867px;
function PRCrop() {

	prImgWidth=$('img.ui-draggable').attr("width");
	prImgNatWidth=$('img.ui-draggable').naturalWidth();
	prImgNatHeight=$('img.ui-draggable').naturalHeight();

	console.log(prImgWidth);
	console.log(prImgNatWidth);
	console.log(prImgNatHeight);
		
	$('img.ui-draggable').Jcrop({
		//onSelect: ProcessCropArea,
		onChange: ShowCornersZoomed,
		onRelease: disableJCrop,
		//minSize: [100,100],
		bgColor:     '#508CDC',
		bgOpacity:   .4,
		trueSize: [prImgNatWidth,prImgNatHeight]
		}, function() {
			jcrop_api = this;
		}
	);

	CreateCropButtons();

	/*
	$.ajax({
			// request type ( GET or POST )
			type: "POST", 
			// the URL to which the request is sent
			url: '//localhost/wikidaran/cropper.php', 
			// data to be sent to the server
			data: { action:'query', format:'json', lgname:'foo', lgpassword:'foobar' }, 
			// The type of data that you're expecting back from the server
			dataType: 'json', 
			// Function to be called if the request succeeds
			success: function( jsondata ){
					alert( jsondata.result );
			}
		});
	*/
	
	/*
	$.ajax({			
			type: "POST", 		
			url: '//secure3055.hostgator.com/~xelgen/xelgen.net/wiki/SAECropper/cropper.php', 			
			data: { action:'query', format:'json', lgname:'foo', lgpassword:'foobar' }, 			
			dataType: 'json', 			
			success: function( jsondata ){
					alert( jsondata.result );
			}
		});
	*/
}

// We have to wait for WP QUality to load, otherwise we can't know in which status page is (Not Profread, Profread, etc..)
 
/* Check if view is in edit mode and that the required modules are available. Then, customize the toolbar */
if ( $.inArray( mw.config.get( 'wgAction' ), ['edit', 'submit'] ) !== -1 && mw.config.get( 'wgPageName' ).substr(0,66) == 'Էջ:Հայկական_Սովետական_Հանրագիտարան_(Soviet_Armenian_Encyclopedia)_') {
        mw.loader.using( 'user.options', function () {
                if ( mw.user.options.get('usebetatoolbar') ) {
                        mw.loader.using( 'ext.wikiEditor.toolbar', function () {
                                $(window).load( SAECropInitialize );
                        } );
                }
        } );
}

function disableJCrop() {
	//console.log(jcrop_api);
	jcrop_api.destroy();
	//we're reverting changes made by JCrop to image style, so ProofReadTools zooming works again
	//but may be creating a new overlaying image for JCrop is a better idea, and will depend less on changes in ProofRead and JCrop
	//$("img.ui-draggable").removeProp("style");
	//$("img.ui-draggable").css('margin', '0px;');
	//Guess no longer needed and can be removed
	$('#cropZoom').hide( "fast" );
	
}

function ProcessCropArea(c) {
	//ShowCornersZoomed(); //There;s bug in JCrop which doesn't rise Onchange event when keyboard is used to move div. But it does produce onSelect so we're calling this again.
	//showCoords(c);
	//To-DO this is very bad way of getting img URL, we need to be more specific then using generic class
	prpImgSrc=$('img.ui-draggable').attr("src");
	/*$( "#croppedImages" ).append( "<p><div style=\"width:"+ c.w +"px; height:" + c.h +"px; overflow:hidden; position:relative; border: 1px solid black;\">" + 
	"<img src=\"" + prpImgSrc + "\" style=\"position:absolute; top:-" + c.y +"px; left:-" + c.x+"px\"></div><small> h=" + c.h + " w=" + c.w + " x=" + c.x + " x2=" + c.x2 + " y=" + c.y + " y2=" + c.y2 + "<small></p>" );
	*/
	
	//To-DO make this height and width params elemtns of config
	scaleCoef = 200/c.h;
	
	//if it's width is more then 400
	if (c.w*scaleCoef > 400) {
		scaleCoef = 400/c.w;
	}
	
	selectedText= mw.html.escape( $( '#wpTextbox1' ).textSelection( 'getSelection' ) ) ;
	selectedText=selectedText.trim(); //@TO-DO, fix this ugliness
	
	$( "#croppedImages" ).append( '<div class="crop-img-preview-container">'
		+'<div class="crop-img-preview-inputs"><label>Նիշքի անուն`</label><br/>'
		+'<input class="cropped-img-name" /><br/>'
		+'<label>Պատկերի նկարագրություն`</label><br/>'
		+'<input class="cropped-img-desc" value="' + selectedText+ '"/></div>'
		+'<div class="crop-img-preview-category">'
		+'<label>Պատկերի կատեգորիա</label><br/><select class="crop-img-cat" size="8">'
		+'  <option value="1">Անձինք</option>'
		+'  <option value="2">Արվեստ</option>'
		+'  <option value="3">Բնակավայրեր</option>'
		+'  <option value="4">Բույսեր և Կենդանիներ</option>'
		+'  <option value="5">Գծագրեր</option>'
		+'  <option value="6">Քարտեզներ</option>'
		+'  <option value="7">Շինություններ և Սարքեր</option>'
		+'  <option value="8">Այլ</option>'
		+'</select></div>'
		+ '<div id="img-preview-full" hidden="hidden" style="width:'+ c.w +'px; height:' + c.h +'px; border:1px solid black; background: url(' + prpImgSrc + ') no-repeat;'
		+ 'background-position: -' + c.x + 'px -' + c.y + 'px;"></div>'
		+ '<div id="img-preview-thumb" class="crop-img-preview-thumb" style="width:'+ c.w*scaleCoef +'px; height:' + c.h*scaleCoef +'px; background: url(' + prpImgSrc + ') no-repeat;'
		+ 'background-position: -' + c.x*scaleCoef + 'px -' + c.y*scaleCoef + 'px; background-size:' + prImgNatWidth*scaleCoef +'px '+ prImgNatHeight*scaleCoef + 'px "></div>'		
		+ '<p><small> h=' + c.h + ' w=' + c.w + ' x=' + c.x + ' x2=' + c.x2 + ' y=' + c.y + ' y2=' + c.y2 + '<small></p>'	
		+ '<p><small> h=' + c.h*scaleCoef + ' w=' + c.w*scaleCoef + ' x=' + c.x*scaleCoef + ' x2=' + c.x2*scaleCoef + ' y=' + c.y*scaleCoef + ' y2=' + c.y2*scaleCoef + ' coef=' + scaleCoef + '<small></p></div>');		
	
		$( "#img-preview-thumb" ).click(function() {
			showFullSize();
		});
}

function ShowCornersZoomed(c) {
	console.log(c);	
	zoomCornerBackground="url(" + $('img.ui-draggable').attr("src"); + ") no-repeat;";
	if ($('#cropZoom').css('display')=='none') {
		$('.zoomed-corner').css("background", zoomCornerBackground);
		$('#cropZoom').fadeIn( "1000" );
	}
	
	//TO-DO this can be twice less
	NWx=(parseFloat(c.x)*-1)+75;
	NWy=(parseFloat(c.y)*-1)+75;
		
	SWx=(parseFloat(c.x)*-1)+75;
	SWy=(parseFloat(c.y2)*-1)+75;
	
	NEx=(parseFloat(c.x2)*-1)+75;
	NEy=(parseFloat(c.y)*-1)+75;
	
	SEx=(parseFloat(c.x2)*-1)+75;
	SEy=(parseFloat(c.y2)*-1)+75;	
		
	//console.log(NWZoomStyle);	
	$('#cropZoomNW').css("background-position", NWx + "px " + NWy + "px");
	$('#cropZoomNE').css("background-position", NEx + "px " + NEy + "px");
	$('#cropZoomSE').css("background-position", SEx + "px " + SEy + "px");
	$('#cropZoomSW').css("background-position", SWx + "px " + SWy + "px");
	
	
}

function showCoords(c) {
	// variables can be accessed here as
	// c.x, c.y, c.x2, c.y2, c.w, c.h
     console.log(c);
	 console.log(jcrop_api.tellSelect()); 
	 console.log(jcrop_api.tellScaled()); 
	 
};

function CreateCropButtons() {
	/*
	AFTER THIS ONE or any other framing DIVs in there <div style="cursor: s-resize; position: absolute; z-index: 371;" class="ord-s jcrop-dragbar"></div>
	*/
	cropButtonsHTML='<div style="border: 0px solid;z-index:1500; width:100px; position:absolute; bottom:-32px; margin:0px; padding:0px 0px 0px 0px;" id="crop-buttons">'+
	'<button id="crop" style="margin: 0em; padding:1px 5px" aria-disabled="false" role="button" type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">'+
	'<span class="ui-button-text–modified" style="font-size:0.85em">Կտրել</span></button>'+
	'<button id="crop-cancel" style="margin: 0em; padding:1px 5px" aria-disabled="false" role="button" type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">'+
	'<span class="ui-button-text-modified" style="font-size:0.85em" title="Չեղարկել">✘</span></button>'+
	'<button id="crop-zoom-toggle" style="margin: 0em; padding:1px 5px" aria-disabled="false" role="button" type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">'+
	'<span class="ui-button-text-modified" style="font-size:0.85em" title="Միացնել/անջատել անկյունների խոշորացումը">Q</span></button>'+
	'</div>';

	$( ".jcrop-tracker").closest(":not(:last-child)").next().append(cropButtonsHTML);
	//console.log($( ".jcrop-tracker").closest(":not(:last-child)").next());

	//$('#crop-cancel').onclick(disableJCrop());

	$( "#crop-cancel" ).click(function() {
		disableJCrop();
	});
	
	$( "#crop" ).click(function() {
		ProcessCropArea(jcrop_api.tellSelect());
		//console.log(jcrop_api.tellScaled());
		//console.log(jcrop_api.tellSelect());
		disableJCrop();
		return false;
	});	

	$( "#crop-zoom-toggle" ).click(function() {
		$('#cropZoom').toggle();
		return false;
	});

}

function showFullSize() {

$( "#img-preview-full" ).dialog({
			modal: false,
			dialogClass: "dialog-img-preview-full",
			draggable: true,
			resizable: false,
			width:parseInt($( "#img-preview-full" ).css('width')),
			height:parseInt($( "#img-preview-full" ).css("height")),
			closeOnEscape: true,			
			}
		);

}
  
 function insertSummary(text) {
 var sum = $('#wpSummary'), vv = sum.val()
 if (vv.indexOf(text) != -1) return
 if (/[^,; \/]$/.test(vv)) vv += ','
 if (/[^ ]$/.test(vv)) vv += ' '
 sum.val(vv + text)
};