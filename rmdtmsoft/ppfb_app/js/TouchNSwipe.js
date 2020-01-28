/*!
 * VERSION: 1.2 beta
 * DATE: 11-20-2014
 * 
 * TouchNSwipe
 *
 * @license Copyright (c) 2014, Ron Feliciano. All rights reserved.
 * This work is subject to the terms at http://codecanyon.net/licenses
 * 
 * @author: Ron Feliciano
 * contact me through http://codecanyon.net/user/ronfeliciano/?ref=ronfeliciano
 **/
 
(function(window, $)
{
	var ua = navigator.userAgent;
	
	function Utils()
	{
		
	}
	
	Utils.isFirefox = !(window.mozInnerScreenX == null);
	Utils.isAndroid = (ua.indexOf("Android") >= 0);
	Utils.androidVer = (Utils.isAndroid) ? parseFloat(ua.slice(ua.indexOf("Android")+8)) : null;
	Utils.isWebkit = 'WebkitAppearance' in document.documentElement.style;
	
	Utils.objectToString = function(o)
	{
		var parse = function(_o)
		{
			var a = [], t;
			for(var p in _o)
			{
				if(_o.hasOwnProperty(p))
				{
					t = _o[p];
					if(t && typeof t == "object")
					{
						a[a.length]= p + ":{ " + arguments.callee(t).join(", ") + "}";
					}
					else 
					{
						if(typeof t == "string")
						{
							a[a.length] = [ p+ ": \"" + t.toString() + "\"" ];
						}
						else
						{
							if(t != null)
							{
								a[a.length] = [ p+ ": " + t.toString()];
							}
						}
					}
				}
			}
			
			return a;
		}
		
		return "{" + parse(o).join(", ") + "}";
	}
	
	Utils.getRealValue = function (str)
	{
		val = str;
		
		if(str !== undefined)
		{
			if(!isNaN(Number(str)))
			{
				val = Number(str);
			}
			else if(str.toLowerCase !== undefined && (str.toLowerCase() == "true" || str.toLowerCase() == "false"))
			{
				val = (str.toLowerCase() == "true");
			}
			else
			{
				var temp = Utils.getObj(str);
				
				if(temp != null)
				{
					val = temp;
				}
			}
		}
						
		return val;
	}
	
	Utils.getObj = function(str)
	{
		str = (str === undefined) ? "" : str;
		
		var f = null,
			m = str.split("."),
			length = m.length;
			
		if(m[0] == "window")
		{	
			f = window;
			for(var i = 1; i < length; i++)
			{
				if(f[m[i]] !== undefined)
				{
					f = f[m[i]];
				}
				else
				{
					f = null;
					i = length;	
				}
			}
		}
		
		return f;
	}
	
	Utils.getObjects = function(value)
	{
		var objectNames = value.split(";");
		var objects = [];
		var i;
		var length = objectNames.length;
		
		if(length == 0)
		{
			objectNames = value.split(",");
			length = objectNames.length;
		}
		
		for(i = 0; i < length; i++)
		{
			var objectName = Utils.hyphenToCamelCase(Utils.trimSpaces(objectNames[i]));
			var object = Utils.getObj(objectName);
			if(object != null)
			{
				if($.isArray(object))
				{
					var objectLength = object.length;
					var j;
					for(j = 0; j < objectLength; j++)
					{
						objects.push(object[j]);
					}
				}
				else
				{
					objects.push(object);	
				}
			}
		}
		
		return objects;
	}
	
	Utils.getScope = function(str)
	{	
		var f = window;
		var m = str.split(".");
		
		if(m.length > 0)
		{
			var length = m.length;
			for(var i = 1; i < length - 1; i++)
			{
				if(f[m[i]] !== undefined)
				{
					f = f[m[i]];
				}
				else
				{
					i = length;	
				}	
			}
		}
		
		return f;
	}
	
	Utils.getParams = function(str)
	{
		var params = null;
		if(str !== undefined)
		{
			params = [];
			var values = str.split(",");
			var i;
			var length = values.length;
			for(i = 0; i < values.length; i++)
			{
				params.push(Utils.getRealValue(Utils.trimSpaces(values[i])))
			}
		}
		
		return params;
	}
	
	Utils.trimSpaces = function(str)
	{
		var trimStr = "";
		if(str !== undefined)
		{
			trimStr = str;
			var length = trimStr.length;
			var startIndex = 0;
			var endIndex = length - 1;
			var i;
			
			for(i = 0; i < length; i++)
			{
				if(trimStr.charAt(i) != ' ')
				{
					startIndex = i;
					i = length;
				}
			}
			
			for(i = length - 1; i >= 0; i--)
			{
				if(trimStr.charAt(i) != ' ')
				{
					endIndex = i;
					i = -1;
				}
			}
			
			trimStr = trimStr.substr(startIndex, endIndex - startIndex + 1);
		}
		
		return trimStr;
	}
	
	Utils.getAttrObjectFromString = function(str, initObject)
	{
		str = str || "";
		var o = (initObject == null || initObject === undefined) ? {} : initObject;
		
		if(str != "")
		{
			var groups = str.split(";"),
				i,
				length = groups.length;
				
			if(length == 0)
			{
				groups = str.split(",");
				length = groups.length;
			}
				
			for(i = 0; i < length; i++)
			{
				var attr = groups[i].split(":"),
					prop = "",
					val = "";
				
				prop = Utils.hyphenToCamelCase(Utils.trimSpaces(attr[0]));
					
				if(attr.length > 2)
				{
					attr.splice(0, 1);	
					val = Utils.getRealValue(Utils.trimSpaces(attr.join(":")));
				}
				else
				{
					val = Utils.getRealValue(Utils.trimSpaces(attr[1]));
				}
				
				if(prop != "")
				{
					o[prop] = val;	
				}
			}
		}
		
		return o;
	}
		
	Utils.getChildAttrObjectFromElem = function(elem, pluginName)
	{
		var o = {};
		
		var children = elem.children();
		var length = children.length;
		for (var i = 0; i < length; i++)
		{	
			var child = children.eq(i);
			if(child.is(pluginName))
			{
				var elemChild = children.get(i);
				for (var j = 0; j < elemChild.attributes.length; j++) 
				{
					var attr = elemChild.attributes[j];
					o[attr.name] = getRealValue(attr.value);
				}
			}
		}
		
		return o;
	}
	
	Utils.hyphenToCamelCase = function(value)
	{
		return value.replace(/-([a-z])/gi, function(s, g) { return g.toUpperCase(); } );
	}
	
	Utils.preventDefault = function (e)
	{
		 if (e.preventDefault) 
		 { 
			e.preventDefault(); 
		 } 
		 else 
		 { 
			 e.returnValue = false; 
		 }
	}
	
	Utils.preventGestureDefault = function(e)
	{
		e.gesture.preventDefault();
	}
	
	Utils.shuffleArray = function(array) 
	{
		var currentIndex = array.length, 
			temporaryValue,
			randomIndex;
		
		while (0 !== currentIndex) 
		{
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		
		return array;
	}
	
	Utils.isSameArray = function(arr1, arr2)
	{
		var same = true;
		
		if($.isArray(arr1) && $.isArray(arr2) && arr1.length == arr2.length)
		{
			for(var i = 0; i < 	arr1.length; i++)
			{
				if(arr1[i] != arr2[i])
				{
					same = false;
					i = arr1.length;
				}
			}
		}
		else
		{
			same = false;	
		}
		
		return same;
	}
	
	window.Utils = Utils;
	
}(window, jQuery));

(function(window, $)
{
	ImageSlider.INDEX_CHANGE = "indexchange";
	ImageSlider.ZOOM = "zoom";
	ImageSlider.AUTOPLAY = "autoplay";
	ImageSlider.DRAG = "drag";
	ImageSlider.SLIDE_RESET = "slidereset";
	ImageSlider.SLIDE_LOAD = "slideLoad";
	
	ImageSlider.eventTypes = [ImageSlider.INDEX_CHANGE, ImageSlider.ZOOM, ImageSlider.AUTOPLAY, ImageSlider.DRAG, ImageSlider.SLIDE_RESET, ImageSlider.SLIDE_LOAD];
	
	function ImageSlider(slider, _slides, varsObj)
	{
		TweenLite.defaultOverwrite = "auto";
		var _vars = $.extend({ minDragDistance:100, animDuration:0.3, maxZoom:5, minZoom:1, scaleMode:"proportionalInside", ease:Power4.easeOut, loop:true, allowZoom:true, allowDrag:true, allowSwipe:true, doubleTapZoom:2, zoomStep:0.5, dragStep:10, adjustWidth:0, adjustHeight:0, playDuration:5, autoPlay:false, loadIndexOnly:true, preloaderUrl:"assets/preloader.gif", resizeDuration:-1, allowKeys:false, scrollTarget:window, checkDragDistance:10, force3D:true, allowDoubleTap:true, initXPercent:0.5, initYPercent:0.5, resetZoom:false }, varsObj),
			_slider = $(slider),
			_slidesHolder = $("<div style='width:100%; height:100%; left:0px; top:0px; position:absolute;'></div>"),
			preloaderElem = "<img  style='position:absolute; max-width:none; display:block; width:auto; height:auto'>",
			slideBorderColor = (Modernizr.rgba) ? "1px solid rgba(255, 0, 0, 0.0)" : "1px solid transparent",
			prevSlide = $("<div class='slidesImg' style='width:100%; height:100%; left:-100%; top:-1px; position:absolute; border: " + slideBorderColor + "; overflow:hidden'></div>"),
			curSlide =  $("<div class='slidesImg' style='width:100%; height:100%; left:-1px; top:-1px; position:absolute; border: " + slideBorderColor + "; overflow:hidden'></div>"),
			nextSlide = $("<div class='slidesImg' style='width:100%; height:100%; left:100%; top:-1px; position:absolute; border: " + slideBorderColor + "; overflow:hidden'></div>"),
			hiddenSlide = $("<div style='width:1px; height:1px; left:-1px; top:-1px; position:absolute; overflow:hidden'></div>"),
			prevPreloader = $(preloaderElem),
			curPreloader = $(preloaderElem),
			nextPreloader = $(preloaderElem),
			_slideIndex = 0,
			computedZoom = 1,
			endZoom = 1.0,
			imageWidth = 0,
			imageHeight = 0,
			newImageWidth,
			newImageHeight,
			imageContainerWidth = 0,
			imageContainerHeight = 0,
			oldScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0},
			parScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0},
			newScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0},
			curX = 0,
			curY = 0,
			oldX = 0,
			oldY = 0,
			realLeft, 
			realTop,
			computedWidth, 
			computedHeight,
			touchHandler = null,
			useTransform3d = Modernizr.csstransforms3d,
			useTransform = Modernizr.csstransforms,
			prevContainerWidth = -1,
			prevContainerHeight = -1,
			dragDistanceX = 0,
			dragDistanceY = 0,
			snap = false,
			oldSlideIndex = 0,
			startDragX = 0,
			startDragY = 0,
			touchCount = 0,
			oldTouchCount = -1,
			touchId = 0,
			oldTouchId = -1,
			transformInit = false,
			dragInit = false,
			touchReady = true,
			sliderLeft = 0,
			sliderTop = 0,
			playTween = null,
			isAutoPlay = _vars.autoPlay,
			tempPreloaderImage = ($.type(_vars.preloaderUrl) === "string") ? $("<img  style='position:relative; width:auto; height:auto; max-width:none; max-height:none'/>").on("load",  onTempPreloaderImageLoad )  : null,
			preloaderWidth = 0,
			preloaderHeight = 0,
			indexMod = -1,
			mouseEnabled = true,
			mouseTweenObj = {},
			indexChangeEvents = [],
			zoomEvents = [],
			autoPlayEvents = [],
			dragEvents = [],
			slideResetEvents = [],
			slideLoadEvents = [],
			allEvents = [indexChangeEvents, zoomEvents, autoPlayEvents, dragEvents, slideResetEvents, slideLoadEvents],
			_actualMaxZoom = _vars.maxZoom,
			_actualMinZoom = _vars.minZoom,
			oldCurY = 0,
			checkDrag = true,
			checkDragInit = true,
			useVerticalScroll = false,
			checkStartDragX = 0,
			checkStartDragY = 0,
			checkCurDragX = 0,
			checkCurDragY = 0,
			hasScrollPlugin = TweenLite._plugins.scrollTo != undefined,
			//transform3DObj = (_vars.force3D) ? { z:0.1, transformPerspective:500, backfaceVisibility:"hidden"} : {},
			curDragX = 0,
			curDragY = 0,
			axisLocked = false,
			useVertical = false,
			oldZoom = 1,
			oldZoomX = 0.5,
			oldZoomY = 0.5,
			oldWidth = -1
			oldHeight = -1,
			oldCurX = 0
			oldCurY = 0;
		
		var ctr = 0;
		prevSlide.append(prevPreloader);
		curSlide.append(curPreloader);
		nextSlide.append(nextPreloader);
		
		$("body").append(hiddenSlide);
		_slidesHolder.append(prevSlide);
		_slidesHolder.append(nextSlide);
		_slidesHolder.append(curSlide);
		
		
		//TweenMax.set(_slidesHolder, transform3DObj );
		
		if(tempPreloaderImage != null)
		{
			TweenMax.set(tempPreloaderImage, { autoAlpha:0 } );
			hiddenSlide.append(tempPreloaderImage);
			tempPreloaderImage.attr("src", _vars.preloaderUrl);
		}
		
		_slider.append(_slidesHolder);
		
		TweenMax.set(hiddenSlide, {autoAlpha:0});
		
		_slider.on("mousedown", Utils.preventDefault);
		_slider.on("mousemove", Utils.preventDefault);
		
		if(_vars.allowZoom || _vars.minZoom != _vars.maxZoom)
		{
			_slider.on("mousewheel", Utils.preventDefault);
		}
		
		init();
		onWindowResize();
		
		if(!isNaN(_vars.resizeDuration) && _vars.resizeDuration > 0)
		{
			TweenMax.to(this, _vars.resizeDuration, { onRepeat:onWindowResize, repeat:-1 } );
		}
		
		this.index = _index;
		this.next = _next;
		this.prev = _prev;
		this.zoom = _zoom;
		this.zoomIn = _zoomIn;

		this.zoomOut = _zoomOut;
		this.play = _play;
		this.pause = _pause;
		this.autoPlay = _autoPlay;
		this.caption = _caption;
		this.resize = onWindowResize;
		this.on = _on;
		this.off = _off;
		this.imageX = _imageX;
		this.imageY = _imageY;
		this.imageLeft = _imageLeft;
		this.imageTop = _imageTop;
		this.getCurSlide = _getCurSlide;
		
		
		this.vars = _vars;
		this.slides = _slides;
		this.actualMinZoom = getActualMinZoom;
		this.actualMaxZoom = getActualMaxZoom;
		this.newImageWidth = getNewImageWidth;
		this.newImageHeight = getNewImageHeight;
		
		function init()
		{
			_vars.scrollTarget = (_vars.scrollTarget == "window") ? $(window) : $(_vars.scrollTarget);
			
			if($.isArray(_slides))
			{
				var len = _slides.length;
				if(len > 0)
				{
					for(var i = 0; i < len; i++)
					{
						var slide = _slides[i];
						
						if(slide.url !== null)
						{
							var url = slide.url,
							caption =  (_vars !== undefined && $.type(slide.caption) === "string") ?  slide.caption : "";
							_slides[i].width = 0;
							_slides[i].height = 0;
							_slides[i].loaded = false;
							_slides[i].retry = 0;
							_slides[i].image = $("<img  style='position:absolute; max-width:none;'>").on("load",  { index:i }, onImageLoad).error( { index:i }, onImageError );
							TweenMax.set(_slides[i].image, { autoAlpha:0 } );
						}
					}
					
					if(_vars.loop)
					{
						if(len > 0 && len <= 2)
						{
							var appendImage1, 
							appendImage2, 
							url1,
							url2,
							caption1,
							caption2;
							
							if(len == 1)
							{
								appendImage1 = $("<img  style='position:absolute'>").on("load",  { index:len }, onImageLoad).error( { index:len }, onImageError );
								url1 = _slides[0].url;
								caption1 = _slides[0].caption;
								
								appendImage2 = $("<img  style='position:absolute'>").on("load",  { index:len + 1 }, onImageLoad).error( { index:len + 1 }, onImageError );
								url2 = _slides[0].url;
								caption2 = _slides[0].caption;
								indexMod = 1;
							}
							else if(len == 2)
							{
								appendImage1 = $("<img  style='position:absolute'>").on("load",  { index:len }, onImageLoad).error( { index:len }, onImageError );
								url1 = _slides[0].url;
								caption1 = _slides[0].caption;
								
								appendImage2 = $("<img  style='position:absolute'>").on("load",  { index:len + 1 }, onImageLoad).error( { index:len + 1 }, onImageError );
								url2 = _slides[1].url;
								caption2 = _slides[1].caption;
								indexMod = 2;
							}
							
							hiddenSlide.append(appendImage1);
							hiddenSlide.append(appendImage2);
							
							_slides.push( { image:appendImage1, url:url1, caption:caption1, width:0, height:0, loaded:false, retry:0 } );
							_slides.push( { image:appendImage2, url:url2, caption:caption2, width:0, height:0, loaded:false, retry:0 } );
						}
						
						loadImageAt(_slides.length - 1);
					}
					else
					{ 
						if(len == 1)
						{
							prevPreloader.detach();
							nextPreloader.detach();
							
						}
						else if(len == 2)
						{
							prevPreloader.detach();
						}
					}
					
					if(len > 1)
					{
						loadImageAt(1);
					}
					
					loadImageAt(0);
					_autoPlay(isAutoPlay);
				}
			}
			
			$(window).on("resize", onWindowResize);
			
			touchHandler = _slidesHolder.hammer( 
			{   
				drag_min_distance:0,
				swipe:false,
				drag_max_touches: 4
			});
				
			touchHandler.on("drag", Utils.preventGestureDefault);
			touchHandler.on("transform", Utils.preventGestureDefault);
			
			var touchEvt = "touchstart touchend";
			
			if(window.PointerEvent) 
			{
   				touchEvt = "pointerdown pointerup";
			} 
			else if (window.MSPointerEvent)
			{
    			touchEvt = "MSPointerDown MSPointerUp";
			}
			else
			{
				enableMouse();	
			}
			
			touchHandler.on(touchEvt, onTouch);
			
			
			if(_vars.allowZoom)
			{

				curSlide.on("mousewheel", onImageWheel);
				if(_vars.allowDoubleTap)
				{
					touchHandler.on("doubletap", onDoubleTap);
				}
			}
			
			onSlideComplete(true);
		}
		
		function _index(i, sideSlide)
		{
			if(!isNaN(i))
			{
				if(touchReady)
				{
					touchReady = false;
					sideSlide = sideSlide || false;
					
					if(i < 0)
					{
						i = 0;
					}
					else if(i > _slides.length - 1)
					{
						i = _slides.length - 1;
					}
					
					var cssObj = { ease:_vars.ease, onComplete:onSlideComplete };
					
					if(oldSlideIndex != i)
					{
						_slideIndex = i;
						
						if(!sideSlide)
						{
							onSlideComplete();
						}
						else
						{
							var slideDuration = 0;
							
							if(oldSlideIndex + 1 == _slideIndex || (_vars.loop && oldSlideIndex == _slides.length - 1 && _slideIndex == 0))
							{
								if(useTransform)
								{
									cssObj.x = -imageContainerWidth;
								}
								else
								{
									cssObj.marginLeft = -imageContainerWidth;
								}
								
								slideDuration = _vars.animDuration;
							}
							else if(oldSlideIndex - 1 == _slideIndex || (_vars.loop && oldSlideIndex == 0 && _slideIndex == _slides.length - 1))
							{
								if(useTransform)
								{
									cssObj.x = imageContainerWidth;
								}
								else
								{
									cssObj.marginLeft = imageContainerWidth;
								}
								
								slideDuration = _vars.animDuration;
							}
							
							TweenMax.to(_slidesHolder, slideDuration, cssObj );
							
						}
						
						oldSlideIndex = _slideIndex;
						
						callHandler(ImageSlider.INDEX_CHANGE);
					}
					else
					{
						if(useTransform)
						{
							cssObj.x = 0;
						}
						else
						{
							cssObj.marginLeft = 0;
						}
						
						cssObj.onCompleteParams = [false];
						TweenMax.to(_slidesHolder, _vars.animDuration, cssObj );
					}
				}
				else
				{
					
				}
			}
			
			return (indexMod == -1) ? _slideIndex : _slideIndex % indexMod;
		}
		
		function loadImageAt(i, str)
		{
			str = str || "";
			//onPreloaderImageLoad();
			if(!_slides[i].loaded)
			{
				if(_vars.loadIndexOnly && i == _slideIndex || !_vars.loadIndexOnly)
				{
					_slides[i].image.remove();
					_slides[i].image = null;
					_slides[i].image = $("<img  class='slideImg' style='position:absolute; max-width:none;'>").on("load",  { index:i }, onImageLoad).error( { index:i }, onImageError );
					hiddenSlide.append(_slides[i].image);
					TweenMax.set(_slides[i].image, { autoAlpha:0 } );
					
					if(i == _slideIndex)
					{
						TweenMax.to(_slides[i].image, 3, { onComplete:loadImageAt, onCompleteParams:[i, "(RELOAD)"] } );
					}
					
					_slides[i].image.attr("src", _slides[i].url);
				}
			}
		}
		
		function _caption()
		{
			var caption = null;
			
			if(_slideIndex >= 0 && _slideIndex < _slides.length)
			{
				caption = _slides[_slideIndex].caption;
			}
			
			return caption;	
		}
		
		function onPlayComplete()
		{
			_next(true);
			if(playTween !== null)
			{
				playTween.play(0);	
			}
		}
		
		function _play()
		{
			if(playTween == null)
			{
				playTween = TweenMax.to(this, _vars.playDuration, { onComplete:onPlayComplete } );
				isAutoPlay = true;
				
				callHandler(ImageSlider.AUTOPLAY);
			}
		}
		
		function _pause()
		{
			if(playTween !== null)
			{
				playTween.kill();
				playTween = null;
				isAutoPlay = false;
				
				callHandler(ImageSlider.AUTOPLAY);
			}
		}
		
		function _autoPlay(val)
		{
			if(val !== undefined)
			{
				if(val)
				{
					_play();
				}
				else
				{
					_pause();
				}
			}
			
			return isAutoPlay;
		}
		
		function _next(sideSlide)
		{
			if(computedZoom == 1 && dragDistanceX == 0 && touchReady && touchCount == 0 && (_slideIndex + 1 < _slides.length || _vars.loop))
			{
				sideSlide = (sideSlide !== undefined) ? sideSlide : false;
				_index((_slideIndex + 1) % _slides.length, sideSlide);
			}
		}
		
		function _prev(sideSlide)
		{
			if(computedZoom == 1 && dragDistanceX == 0 && touchReady && touchCount == 0 && (_slideIndex - 1 >= 0 || _vars.loop))
			{
				sideSlide = (sideSlide !== undefined) ? sideSlide : false;
				var tempIndex = _slideIndex;
				
				if(tempIndex > 0)
				{
					tempIndex--;
				}
				else
				{
					tempIndex = _slides.length - 1;
				}
				
				_index(tempIndex, sideSlide);
			}
		}

		
		function _zoomIn()
		{
			_zoom(computedZoom + _vars.zoomStep);
		}
		
		function _zoomOut()
		{
			_zoom(computedZoom - _vars.zoomStep);
		}
		
		function _zoom(value, duration)
		{
			if(value !== undefined && _vars.allowZoom)
			{
				duration = (!isNaN(duration)) ? duration :  _vars.animDuration;
				//var spx = newImageWidth * 0.5,
				//spy = newImageHeight * 0.5;
				var spx = Math.abs(curX / computedZoom) + ((imageContainerWidth * 0.5) / computedZoom),
					 spy = Math.abs(curY / computedZoom) + ((imageContainerHeight * 0.5) / computedZoom);	
				
				
				initZoom(spx, spy);
				computedZoom = value;
				oldWidth = newImageWidth;
				oldHeight = newImageHeight;
				
				
				setPosition();
				adjustPosition();
				endZoom = computedZoom;
				
				handleZoom(duration);
			}
			
			return computedZoom;
		}
		
		function _imageX(val)
		{
			if(val !== undefined)
			{
				curX = val;
				//setPosition();
				adjustPosition();	
				handleZoom();
			}
			return curX;
		}
		
		function _imageY(val)
		{
			if(val !== undefined)
			{
				curY = val;
				//setPosition();
				adjustPosition();	
				handleZoom();
			}
			
			return curY;
		}
		
		function _imageLeft()
		{
			return realLeft;
		}
		
		function _imageTop()
		{
			return realTop;
		}
		
		function _getCurSlide()
		{
			return curSlide;	
		}
		
		function handleZoom(duration)
		{
			var cssObj = { position:"absolute", ease:_vars.ease };
			
			duration = (!isNaN(duration)) ? duration :  _vars.animDuration;
			
			if(Utils.androidVer !== null && Utils.androidVer < 3)
			{
				cssObj.width = computedWidth;
				cssObj.height = computedHeight;
			}
			else
			{
				cssObj.scale = computedZoom; 
			}
			
			if(useTransform)
			{
				cssObj.x = curX;
				cssObj.y = curY;
				cssObj.force3D = _vars.force3D;
				//cssObj.force3D = true;
					
				//$(".caption").text("HELLO ZOOM");
			}
			else
			{
				cssObj.marginLeft = curX;
				cssObj.marginTop = curY;
			}
			
			oldZoom = computedZoom;
			TweenMax.to(_slides[_slideIndex].image, duration, cssObj );
			
			callHandler(ImageSlider.ZOOM);
		}
		
		
		function onImageWheel(e, delta, deltaX, deltaY)
		{
			if(_vars.allowZoom)
			{
				sliderLeft = _slider.offset().left;
				sliderTop = _slider.offset().top;
				var spx = (e.pageX - realLeft - curX - sliderLeft) / endZoom,
				spy = (e.pageY - realTop - curY - sliderTop) / endZoom;
				
				
				initZoom(spx, spy);
				if(delta > 0)
				{
					computedZoom += _vars.zoomStep;
				}
				else
				{
					computedZoom -= _vars.zoomStep;
				}
				
				oldWidth = newImageWidth;
				oldHeight = newImageHeight;
				
				setPosition();
				adjustPosition();
				endZoom = computedZoom;
				handleZoom();
			}
		}
		
		function onSlideDown(e)
		{
			
			if(mouseEnabled)
			{
				touchCount = 1;
				
				if(touchCount != oldTouchCount)
				{
					setupGestures();
				}
				
				oldTouchCount = touchCount;
			}
			
		}
		
		function onSlideUp(e)
		{
			
			if(mouseEnabled)
			{
				touchCount = 0;
				
				if(touchCount != oldTouchCount)
				{
					setupGestures();
				}
				
				oldTouchCount = touchCount;
			}
			
		}
		
		function onTouch(e)
		{
			var type = e.type;
			
			if(type !== undefined && type.indexOf("ointer") != -1)
			{
				if(type == "pointerdown" || type == "MSPointerDown")
				{
					touchCount ++;
				}
				else if(type == "pointerup" || type == "MSPointerUp")
				{
					touchCount --;
					if(touchCount < 0)
					{
						touchCount = 0;
						//console.log("This should not be 0");	
					}
				}
			}
			else
			{
				touchCount = e.originalEvent.touches.length;
				if(touchCount > 0)
				{
					TweenMax.to(mouseTweenObj, 0.0, { onComplete:disableMouse } );
				}
				else
				{
					TweenMax.to(mouseTweenObj, 0.5, { onComplete:enableMouse } );
				}
			}
			
			if(touchCount != oldTouchCount)
			{
				setupGestures();
			}
			
			oldTouchCount = touchCount;
		}
		
		function enableMouse()
		{
			curSlide.on("mousedown", onSlideDown);
			curSlide.on("mouseup mouseleave", onSlideUp);
			mouseEnabled = true;
		}
		
		function disableMouse()
		{
			curSlide.off("mousedown", onSlideDown);
			curSlide.off("mouseup mouseleave", onSlideUp);
			mouseEnabled = false;
		}
		
		function setupGestures()
		{
			touchId = (touchCount > 1) ? 2 : touchCount;
			var gestureInit = (touchId != oldTouchId);
			
			if(touchCount == 1)
			{
				if(!snap && touchReady)
				{
					dragInit = gestureInit;
					disableTransform();
					enableDrag();
				}
				
				if(oldTouchId == 2)
				{
					endZoom = computedZoom;
				}
			}
			else if(touchCount > 1)
			{
				if(!snap && touchReady)
				{
					transformInit = gestureInit;
					disableDrag();
					enableTransform();
				}
			}
			else
			{
				disableTransform();
				disableDrag();
				onGestureEnd();
			}
			
			oldTouchId = touchId;
		}
		
		function onGestureEnd()
		{
			if(snap)
			{
				var len = _slides.length,
				tempIndex = _slideIndex;
				
				if((tempIndex + 1 < len || _vars.loop) && dragDistanceX < -_vars.minDragDistance)
				{
					tempIndex = (_vars.loop) ? (tempIndex + 1) % len : tempIndex + 1;
				}
				else if((tempIndex - 1 >= 0 || _vars.loop) && dragDistanceX > _vars.minDragDistance)
				{
					tempIndex--;
					
					if(tempIndex < 0)
					{
						tempIndex = len - 1;
					}
				}
				
				_index(tempIndex, true);
				snap = false;
			}
			else
			{
				endZoom = computedZoom;
			}
			
			checkDrag = true;
			checkDragInit = true;
			useVerticalScroll = false;
			enableTransform();
			
			//var cursor = (Utils.isFirefox) ? "-moz-grab" : "url(images/grab.gif), auto";
			setDragCursor("grab");
			
		}
		
		function setDragCursor(value)
		{
			if(value != "grab")
			{
				value = "grabbing";
			}
			
			if(Utils.isWebkit || Utils.isFirefox)
			{
				var prefix = (Utils.isFirefox) ? "-moz-" : "-webkit-",
					 cursor = prefix + value;
				
				TweenMax.set(_slidesHolder, {cursor:cursor});
			}
			else
			{
				//console.log("NO");
			}
		}
		
		function enableDrag()
		{
			if(_vars.allowDrag)
			{
				touchHandler.on("drag", onDrag);
			}
		}
		
		function enableTransform()
		{
			if(_vars.allowZoom)
			{
				touchHandler.on("transform", onTransform);
				curSlide.on("mousewheel", onImageWheel);
			}
		}
		
		function disableDrag()
		{
			touchHandler.off("drag", onDrag);
		}
		
		function disableTransform()
		{
			touchHandler.off("transform", onTransform);
			curSlide.off("mousewheel", onImageWheel);
		}
		
		function onTempPreloaderImageLoad(e)
		{
			preloaderWidth = tempPreloaderImage.width();
			preloaderHeight = tempPreloaderImage.height();
			
			tempPreloaderImage.remove();
			
			var preloaderUrl = _vars.preloaderUrl;
			
			prevPreloader.on("load", onPreloaderImageLoad).attr("src", preloaderUrl);
			curPreloader.on("load", onPreloaderImageLoad).attr("src", preloaderUrl);
			nextPreloader.on("load", onPreloaderImageLoad).attr("src", preloaderUrl);
		}
		
		function onPreloaderImageLoad(e)
		{
			
			TweenMax.set([prevPreloader, curPreloader, nextPreloader], { position:"absolute", maxWidth:"none", left:"50%", top:"50%", x:"-25%", y:"-25%"} );
		}
		
		function onImageLoad(e)
		{
			var i = e.data.index;
			_slides[i].width = _slides[i].image.width();
			_slides[i].height = _slides[i].image.height();
			_slides[i].loaded = true;
			
			//TweenMax.set(_slides[i].image, transform3DObj);
			TweenMax.to(_slides[i].image, _vars.animDuration, { autoAlpha:1, ease:_vars.ease } );
			
			if( i >= _slideIndex - 1 && i <= _slideIndex + 1) 
			{
				TweenMax.set(_slides[i].image, { display:"block" } );
				resetImageAt(i);
				
				if(i == _slideIndex)
				{
					resetTransform();
					curPreloader.detach();
					curSlide.append(_slides[i].image);	
					callHandler(ImageSlider.SLIDE_LOAD);
				}
				else if(i == _slideIndex - 1)
				{
					prevPreloader.detach();
					prevSlide.append(_slides[i].image);
				}
				else
				{
					nextPreloader.detach();
					nextSlide.append(_slides[i].image);
				}
				
			}
			else if(_vars.loop)
			{
				if((i == _slides.length - 1 && _slideIndex == 0) || (i == 0 && _slideIndex == _slides.length - 1))
				{
					TweenMax.set(_slides[i].image, { display:"block" } );
					resetImageAt(i);
					
					if(i == _slides.length - 1)
					{
						prevPreloader.detach();
						prevSlide.append(_slides[i].image);
					}
					else
					{
						nextPreloader.detach();
						nextSlide.append(_slides[i].image);
					}
				}
				else
				{
					TweenMax.set(_slides[i].image, { display:"none" } );
				}
			}
			else
			{
				TweenMax.set(_slides[i].image, { display:"none" } );
			}
		}
		
		function onImageError(e)
		{
			var i = e.data.index;
			if(_slides[i].retry < 3)
			{
				//console.log("Error Loading index: '" + i + "' url: '" + _slides[i].url + "' Retry " + (_slides[i].retry + 1) + " OF 3");
				_slides[i].loaded = false;
				_slides[i].image.attr("src", _slides[i].url);
				_slides[i].retry ++;
			}
			else
			{
				//console.log("Load Failed on " + i + " url: " +  _slides[i].url);
				
			}
		}
		
		function resetImageAt(i)
		{
			if(i >= 0 && i < _slides.length && _slides[i].loaded)
			{
				if(_slides[i].width == 0 || _slides[i].height == 0)
				{
					var prevParent = _slides[i].image.parent();
					hiddenSlide.append(_slides[i].image);
					_slides[i].width = _slides[i].image.width();
					_slides[i].height = _slides[i].image.height();
					prevParent.append(_slides[i].image);
				}
				
				var slideImageWidth = _slides[i].width,
				slideImageHeight = _slides[i].height,
				horizontalScale = imageContainerWidth / slideImageWidth, 
				verticalScale = imageContainerHeight / slideImageHeight,
				curScale = horizontalScale;
				
				if(_vars.scaleMode == "widthOnly")
				{
					curScale = horizontalScale;
				}
				else if(_vars.scaleMode == "heightOnly")
				{
					curScale = verticalScale;
				}
				else if(_vars.scaleMode == "proportionalOutside")
				{
					if(slideImageHeight * horizontalScale < imageContainerHeight)
					{
						curScale = verticalScale;
					}
				}
				else if(_vars.scaleMode == "none")
				{
					curScale = (curScale > 1) ? 1 : curScale;
					
					if(slideImageHeight * curScale > imageContainerHeight)
					{
						curScale = verticalScale;
					}
				}
				else if(slideImageHeight * horizontalScale > imageContainerHeight)
				{
					curScale = verticalScale;
				}
				
				if(slideImageWidth == 0 || slideImageHeight == 0 || isNaN(curScale))
				{
					curScale = 1;
				}
				
				newSlideImageWidth = slideImageWidth * curScale;
				newSlideImageHeight = slideImageHeight * curScale;
				
				var percentX = (imageContainerWidth < newSlideImageWidth) ? _vars.initXPercent : 0.5,
					 percentY = (imageContainerHeight < newSlideImageHeight) ? _vars.initYPercent : 0.5;
				
				realImageLeft = ((((imageContainerWidth - newSlideImageWidth) * percentX)) >> 0);
				realImageTop = ((((imageContainerHeight - newSlideImageHeight) * percentY)) >> 0);
				
				if(i == _slideIndex)
				{
					imageWidth = slideImageWidth;
					imageHeight = slideImageHeight;
					newImageWidth = newSlideImageWidth;
					newImageHeight = newSlideImageHeight;
					realLeft = realImageLeft;
					realTop = realImageTop;
					
					if(_vars.scaleMode == "none")
					{
						 _actualMaxZoom = (slideImageWidth * _vars.maxZoom) / newImageWidth;
					}
				}
				
				var cssObj = { width:newSlideImageWidth, height:newSlideImageHeight, left:realImageLeft + "px", top:realImageTop + "px", scale:1, transformOrigin:"0 0" };
				if(useTransform)
				{
					cssObj.x = 0;
					cssObj.y = 0;
				}
				else
				{
					cssObj.marginLeft = 0;
					cssObj.marginTop = 0;	
				}
				
				TweenMax.set(_slides[i].image, cssObj );
			}
		}
		
		function onWindowResize()
		{
			imageContainerWidth = _slidesHolder.width() + _vars.adjustWidth + 2;
			imageContainerHeight = _slidesHolder.height() + _vars.adjustHeight + 2;
			if(prevContainerWidth != imageContainerWidth || prevContainerHeight != imageContainerHeight)
			{
				TweenMax.set([prevSlide, curSlide, nextSlide], { width:imageContainerWidth + "px", height:imageContainerHeight + "px" });
				TweenMax.set([prevSlide], { left:(-imageContainerWidth - 1) + "px" });
				TweenMax.set([nextSlide], { left:(imageContainerWidth - 1) + "px" });
				
				if(preloaderWidth != 0)
				{
					onPreloaderImageLoad();
				}
				
				resetImages();
				
				dragDistanceX = 0;
				dragDistanceY = 0;
				
				//resetTransform();
				
				var cssObj = { width:"100%", height:"100%", position:"absolute" };
				if(useTransform)
				{
					cssObj.x = 0;
					cssObj.y = 0;
				}
				else
				{
					cssObj.marginLeft = 0;
					cssObj.marginTop = 0;
				}
				
				TweenMax.set(_slidesHolder, { css:cssObj } );
				
				touchCount = 0;
				touchId = 0;
				oldTouchId = -1;
				snap = false;
				touchReady = true;
				checkDrag = true;
				checkDragInit = true;
				useVerticalScroll = false;
				
				prevContainerWidth = imageContainerWidth;
				prevContainerHeight = imageContainerHeight;
				
				//if(!_vars.resetZoom)
				//{
					//console.log("WTF");
					oldWidth = (oldZoomX == -1) ? newImageWidth : oldWidth;
					oldHeight = (oldZoomY == -1) ? newImageHeight : oldHeight;
					
					
						 
					
						 
						 
					//curX = 	(oldCurX / oldWidth) * newImageWidth;
					//curY = 	(oldCurY / oldHeight) * newImageHeight;
					curX = 	(oldCurX / oldWidth) * newImageWidth;
					curY = 	(oldCurY / oldHeight) * newImageHeight;
					
					//var spx = Math.abs(curX / computedZoom) + ((imageContainerWidth * 0.5) / computedZoom),
					// spy = Math.abs(curY / computedZoom) + ((imageContainerHeight * 0.5) / computedZoom);		 
					// var spx = (curX / computedZoom) + ((imageContainerWidth * 0.5) / computedZoom),
					 //spy = (curY / computedZoom) + ((imageContainerHeight * 0.5) / computedZoom);		 
					 
					var spx = (oldZoomX / oldWidth) * newImageWidth,
						 spy = (oldZoomY / oldHeight) * newImageHeight;
					
					// console.log(spx + " " + spy);
					
					//console.log(oldCurX + " " + oldCurX + " " + oldWidth  + " " + oldHeight  + " " + newImageWidth  + " " + newImageHeight);
					
					//curX = isNaN(curX) ? 0 : curX;
					//curY = isNaN(curY) ? 0 : curY;
					
					//curX = 	(oldCurX / oldWidth) * newImageWidth;
					//curY = 	(oldCurY / oldHeight) * newImageHeight;
					
					
					
					endZoom = oldZoom;
					computedZoom = oldZoom;
					
					//console.log(curX + " " + curY + " " + endZoom);
					
					initZoom(spx, spy);
					
					oldWidth = newImageWidth;
					oldHeight = newImageHeight;
					
					setPosition();
					adjustPosition();
					endZoom = computedZoom;
					handleZoom(0);
				//}
			}
			
			setDragCursor("grab");
		}
		
		function resetTransform()
		{
			endZoom = 1;
			computedZoom = 1;
			
			curX = 0;
			curY = 0;
			
			oldCurX = 0;
			oldCurY = 0;
			
			oldZoom = 1;
			
			oldScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0};
			parScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0};
			newScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0};
			
			callHandler(ImageSlider.ZOOM);
		}
		
		function resetImages()
		{
			//resetTransform();
			
			resetImageAt(_slideIndex);
			
			if(_slideIndex - 1 >= 0)
			{
				resetImageAt(_slideIndex - 1);
			}
			else if(_vars.loop)
			{
				resetImageAt(_slides.length - 1);
			}
			
			if(_slideIndex + 1 < _slides.length)
			{
				resetImageAt(_slideIndex + 1);
			}
			else if(_vars.loop)
			{
				resetImageAt(0);
			}
		}
		
		function resetSlides()
		{
			curSlide.empty();
			prevSlide.empty();
			nextSlide.empty();
			
			var cssObj = { display:"block" };
			
			TweenMax.set(_slides[_slideIndex].image, cssObj);
			
			if(!_slides[_slideIndex].loaded)
			{
				curSlide.append(curPreloader);
			}
			
			loadImageAt(_slideIndex);
			curSlide.append(_slides[_slideIndex].image);	
			
			if(_slideIndex - 1 >= 0)
			{
				TweenMax.set(_slides[_slideIndex - 1].image, cssObj);
				if(!_slides[_slideIndex - 1].loaded)
				{
					prevSlide.append(prevPreloader);
				}
				loadImageAt(_slideIndex - 1);
				prevSlide.append(_slides[_slideIndex - 1].image);
			}
			else if(_vars.loop && _slideIndex == 0)
			{
				TweenMax.set(_slides[_slides.length - 1].image, cssObj);
				if(!_slides[_slides.length - 1].loaded)
				{
					prevSlide.append(prevPreloader);
				}
				loadImageAt(_slides.length - 1);
				prevSlide.append(_slides[_slides.length - 1].image);
			}
			
			if(_slideIndex + 1 < _slides.length)
			{
				TweenMax.set(_slides[_slideIndex + 1].image, cssObj);
				if(!_slides[_slideIndex + 1].loaded)
				{
					nextSlide.append(nextPreloader);
				}
				loadImageAt(_slideIndex + 1);
				nextSlide.append(_slides[_slideIndex + 1].image);
			}
			else if(_vars.loop && _slideIndex == _slides.length - 1)
			{
				TweenMax.set(_slides[0].image, cssObj);
				if(!_slides[0].loaded)
				{
					nextSlide.append(nextPreloader);
				}
				loadImageAt(0);
				nextSlide.append(_slides[0].image);
			}
			
			resetImages();
			
			var cssObj = { width:"100%", height:"100%", position:"absolute" };
			
			if(useTransform)
			{
				cssObj.x = 0;
				cssObj.y = 0;
			}
			else
			{
				cssObj.marginLeft = 0;
				cssObj.marginTop = 0;
			}
			
			TweenMax.to(_slidesHolder, 0, { css:cssObj } );
			callHandler(ImageSlider.SLIDE_RESET);
		}
		
		function onDoubleTap(e)
		{
			if(_vars.allowDoubleTap)
			{
				sliderLeft = _slider.offset().left;
				sliderTop = _slider.offset().top;
				var spx = (e.gesture.touches[0].pageX - realLeft - curX - sliderLeft) / endZoom,
				spy = (e.gesture.touches[0].pageY- realTop - curY - sliderTop) / endZoom;
				
				initZoom(spx, spy);
				transformInit = false;
				
				computedZoom = (endZoom == 1) ? _vars.doubleTapZoom : 1;
				oldWidth = newImageWidth;
				oldHeight = newImageHeight;
				
				setPosition();
					
				computedWidth = newImageWidth * computedZoom,
				computedHeight = newImageHeight * computedZoom;
					
				adjustPosition();
				endZoom = computedZoom;
				
				handleZoom();
			}
		}
		
		function onTransform(e)
		{
			if(transformInit)
			{	
				sliderLeft = _slider.offset().left;
				sliderTop = _slider.offset().top;
				var spx = (e.gesture.center.pageX - realLeft - curX - sliderLeft) / endZoom,
				spy = (e.gesture.center.pageY - realTop - curY - sliderTop) / endZoom;
				
				initZoom(spx, spy);
				transformInit = false;
			}
			
			computedZoom = endZoom * e.gesture.scale;
			
			oldWidth = newImageWidth;
			oldHeight = newImageHeight;
			
			setPosition();
				
			computedWidth = newImageWidth * computedZoom,
			computedHeight = newImageHeight * computedZoom;
			
			adjustPosition();
			handleZoom();
			
		}
		
		function adjustPosition()
		{
			computedWidth = newImageWidth * computedZoom;
			computedHeight = newImageHeight * computedZoom;
			
			if(computedWidth <= imageContainerWidth)
			{
				curX = ((imageContainerWidth - computedWidth) * 0.5) - realLeft;
			}
			else if(curX + realLeft > 0 || curX + computedWidth + realLeft < imageContainerWidth)
			{
				if(curX + realLeft > 0)
				{
					curX = -realLeft;
				}
				else if(curX + computedWidth + realLeft < imageContainerWidth)
				{
					curX = imageContainerWidth - computedWidth - realLeft;
				}
			}
			
			oldCurY = curY;
			if(computedHeight <= imageContainerHeight)
			{
				curY = ((imageContainerHeight - computedHeight) * 0.5) - realTop;
			}

			else if(curY + realTop > 0 || curY + computedHeight + realTop < imageContainerHeight)
			{
				if(curY + realTop > 0)
				{
					curY = -realTop;
				}
				else if(curY + computedHeight + realTop < imageContainerHeight)
				{
					curY = imageContainerHeight - computedHeight - realTop;
				}
			}
			
			curX = curX >> 0;
			curY = curY >> 0;
			
			oldCurX = curX;
			oldCurY = curY;
			
		}
		
		
		function onDrag(e)
		{
			if(hasScrollPlugin && computedZoom == 1 && checkDrag)
			{
				if(checkDragInit)
				{
					checkStartDragX = e.gesture.touches[0].pageX;
					checkStartDragY = e.gesture.touches[0].pageY;
					checkDragInit = false;
				}
				
				checkCurDragX = e.gesture.touches[0].pageX;
				checkCurDragY = e.gesture.touches[0].pageY;
				
				var checkDistanceX = Math.abs(checkCurDragX - checkStartDragX),
					 checkDistanceY = Math.abs(checkCurDragY - checkStartDragY);
				
				if(checkDistanceX >= _vars.checkDragDistance || checkDistanceY >= _vars.checkDragDistance)
				{
					useVerticalScroll = (checkDistanceY > checkDistanceX);
					checkDrag = false;
				}
			}
			else
			{
				if(dragInit)
				{
					startDragX = e.gesture.touches[0].pageX;
					startDragY = e.gesture.touches[0].pageY;
					oldX = curX;
					oldY = curY;
					dragInit = false;
					axisLocked = false;
					useVertical = false;
				}
				
				curDragX = e.gesture.touches[0].pageX;
				curDragY = e.gesture.touches[0].pageY;
				
				curX = oldX + curDragX - startDragX;
				curY = oldY + curDragY - startDragY;
				
				setMove();
			}
			
			setDragCursor("grabbing");
		}
		
		function onSlideComplete(resetVal)
		{
			resetVal = (resetVal !== undefined) ? resetVal : true;
			
			if(resetVal)
			{
				 resetSlides();
				 resetTransform();
			}
			
			dragDistanceX = 0;
			dragDistanceY = 0;
			
			touchReady = true;
		}
		
		function setMove()
		{
			var adjX = curX,
			adjY = curY;
			
			adjustPosition();
			
			if(hasScrollPlugin && useVerticalScroll)
			{	 
				var scrollY = (-oldCurY - curY) >> 0; 
				
				if(scrollY > 0)
				{
					scrollY = (-oldCurY + curY) >> 0; 
				}
				
				TweenLite.to(_vars.scrollTarget, _vars.animDuration, {scrollTo:{y:_vars.scrollTarget.scrollTop() + scrollY}, ease:Power2.easeOut});
			}
			else
			{
				snap = false;
				if(adjX != curX)
				{
					if(_vars.allowSwipe)
					{
						var distanceX = -(curX - adjX),
							 distanceY = -(curY - adjY);
						
						
						if(_vars.scaleMode == "widthOnly")
						{
							var deltaX = Math.abs(curDragX - startDragX),
								 deltaY = Math.abs(curDragY - startDragY);
							
							if(!axisLocked)
							{	 
								if(deltaX > deltaY)
								{
									setDragDistance(distanceX);
									snap = true;
									useVertical = false;
								}
								else
								{
									setDragDistance(0);
									useVertical = true;
								}
								
								axisLocked = true;
							}
							else
							{
								if(useVertical)
								{
									setDragDistance(0);
								}
								else
								{
									setDragDistance(distanceX);
									snap = true;
									useVertical = false;
								}
							}
						}
						else
						{
							setDragDistance(distanceX);
							snap = true;
						}
						
					}
				}
				else 
				{
					setDragDistance(0);
				}
				
				var cssObj = {  ease:_vars.ease };
				
				if(useTransform)
				{
					cssObj.x = curX;
					cssObj.y = curY;
					cssObj.force3D = _vars.force3D;
					//cssObj.force3D = true;
					//$(".caption").text("HELLO MOVE");
				}
				else
				{
					cssObj.marginLeft = curX;
					cssObj.marginTop = curY;
				}
				
				TweenMax.to(_slides[_slideIndex].image, _vars.animDuration, cssObj );
				//TweenMax.to(_slides[_slideIndex].image, _vars.animDuration, cssObj );
			}
			callHandler(ImageSlider.DRAG);
		}
		
		function setDragDistance(value)
		{
			dragDistanceX = value;
			
			var cssObj = {  immediateRender:false, ease:_vars.ease };
			
			if(useTransform)
			{
				cssObj.x = dragDistanceX; 
				cssObj.force3D = _vars.force3D;
					
				//$(".caption").text("HELLO DRAG");
			}
			else
			{
				cssObj.marginLeft = dragDistanceX; 
			}
			TweenMax.to(_slidesHolder, _vars.animDuration, cssObj );
			//TweenMax.to(_slidesHolder, 0.5, {force3D:"auto"} );
			
		}
		
		function initZoom(spx, spy)
		{
			oldScalePosObj.spx = newScalePosObj.spx;
			oldScalePosObj.spy = newScalePosObj.spy;
			oldScalePosObj.nspx = newScalePosObj.nspx;
			oldScalePosObj.nspy = newScalePosObj.nspy;
			oldScalePosObj.cx = curX;
			oldScalePosObj.cy = curY;
			
			parScalePosObj.spx = spx >> 0;
			parScalePosObj.spy = spy >> 0;
			
			parScalePosObj.nspx = (parScalePosObj.spx * endZoom);
			parScalePosObj.nspy = (parScalePosObj.spy * endZoom);
			
			parScalePosObj.cx = (parScalePosObj.spx - parScalePosObj.nspx) >> 0;
			parScalePosObj.cy = (parScalePosObj.spy - parScalePosObj.nspy) >> 0;
			
			computedZoom = endZoom;
			oldZoomX = spx;
			oldZoomY = spy;
		}
		
		function setPosition()
		{
			if(computedZoom > _actualMaxZoom)
			{
				computedZoom = _actualMaxZoom;
			}
			else if(computedZoom < _actualMinZoom)
			{
				computedZoom = _actualMinZoom;
			}
			
			newScalePosObj.spx = parScalePosObj.spx;
			newScalePosObj.spy = parScalePosObj.spy;
			
			newScalePosObj.nspx = (newScalePosObj.spx * computedZoom);
			newScalePosObj.nspy = (newScalePosObj.spy * computedZoom);
			
			newScalePosObj.cx = (newScalePosObj.spx - newScalePosObj.nspx) >> 0;
			newScalePosObj.cy = (newScalePosObj.spy - newScalePosObj.nspy) >> 0;
			
			curX = oldScalePosObj.cx + newScalePosObj.cx - parScalePosObj.cx;
			curY = oldScalePosObj.cy + newScalePosObj.cy - parScalePosObj.cy;
		}
		
		function getActualMinZoom()
		{
			return _actualMinZoom;	
		}
		
		function getActualMaxZoom()
		{
			return _actualMaxZoom;	
		}
		
		function getNewImageWidth()
		{
			return newImageWidth;
		}
		
		function getNewImageHeight()
		{
			return newImageHeight;
		}
		
		function _on(eventType, handler, handlerParams)
		{
			if($.isFunction(handler))
			{
				var eventObj = null,
					eventArr = null,
					eventIndex = $.inArray(eventType, ImageSlider.eventTypes);
				
				handlerParams = $.isArray(handlerParams) ? handlerParams : null;
				
				if(eventIndex > -1)
				{
					eventArr = allEvents[eventIndex];
					var eventObj = { handler:handler, handlerParams:handlerParams };
					if(!$.inArray(eventObj, eventArr) > -1)
					{
						eventArr.push(eventObj);
					}
				}
				else
				{
					//console.log("Add: Unknown eventType " + 	eventType);
				}
			}
		}
		
		function _off(eventType, handler, handlerParams)
		{
			if($.isFunction(handler))
			{
				var eventObj = null,
					eventArr = null,
					eventIndex = $.inArray(eventType, ImageSlider.eventTypes),
					compareHandlerParams = false;
				
				if(handlerParams !== undefined)
				{
					handlerParams = $.isArray(handlerParams) ? handlerParams : null;
					compareHandlerParams = true
				}
				
				if(eventIndex > -1)
				{
					eventArr = allEvents[eventIndex];
					for(var i = eventArr.length - 1; i >= 0; i--)
					{
						if(eventArr[i].handler == handler && (!compareHandlerParams || Utils.isSameArray(eventArr[i].handlerParams, handlerParams)))
						{
							eventArr.splice(i, 1);
						}
					}
				}
				else
				{
					//console.log("Remove: Unknown eventType " + 	eventType);
				}
			}
		}
		
		function callHandler(eventType)
		{
			var eventIndex = $.inArray(eventType, ImageSlider.eventTypes);
			if(eventIndex > -1)
			{
				var eventArr = allEvents[eventIndex],
					i = 0;
					
				for(i = 0; i < eventArr.length; i++)
				{
					eventArr[i].handler.apply(null, eventArr[i].handlerParams);
				}
			}
		}
	}
	
	window.ImageSlider = ImageSlider;
	
}(window, jQuery));

(function(window, $)
{
	PhysicsScroller.INDEX_CHANGE = "indexchange";
	PhysicsScroller.TOGGLE = "toggle";
	PhysicsScroller.eventTypes = [PhysicsScroller.INDEX_CHANGE, PhysicsScroller.TOGGLE];
	
	function PhysicsScroller(scroller, _thumbs, varsObj)
	{
		TweenLite.defaultOverwrite = "auto";
		var _vars = $.extend({ animDuration:0.5,thumbWidth:75, thumbHeight:75, animDuration:0.5, ease:Power4.easeOut, preloaderUrl:"assets/preloader.gif", scaleMode:"proportionalOutside", borderThickness:2, borderColor:"#1ae9f1", defaultBorderColor:"transparent", space:0, friction:1, overScroll:100, initShow:false,initShowControlButton:true, resizeDuration:-1, showCssObj:{ autoAlpha:1 }, hideCssObj:{ autoAlpha:0 }, setHolderVisibility:true }, varsObj),
		_scroller = $(scroller),
		scrollerWidth = _scroller.width(),
		scrollerHeight = _scroller.height(),
		oldScrollerWidth = 0,
		oldScrollerHeight = 0,
		imageDivWidth = _vars.thumbWidth + (_vars.borderThickness * 2),
		imageDivHeight = _vars.thumbHeight + (_vars.borderThickness * 2),
		holderWidth = ((_vars.thumbWidth + _vars.space) * _thumbs.length) - _vars.space + (_vars.borderThickness * 2),
		_thumbsHolder = $("<div style='width:" + (holderWidth - 1) + "px; height:" + (_vars.thumbHeight + (_vars.borderThickness * 2)) + "px; left:0px; top:0px; position:absolute;'></div>"),
		hiddenDiv = $("<div style='width:1px; height:1px; left:-1px; top:-1px; position:absolute; overflow:none'></div>"),
		useTransform = Modernizr.csstransforms,
		_thumbIndex = 0,
		oldThumbIndex = 0,
		curX = 0,
		startDragX = 0,
		oldX = 0,
		curX = 0,
		velocityX = 0,
		multX = 1,
		oldMouseX = 0,
		curMouseX = 0,
		allowDrag = false,
		isShow = _vars.initShow,
		lastIsShow=_vars.initShow,
		isShowControlButton = _vars.initShowControlButton,
		showCssObj = _vars.showCssObj,
		hideCssObj = _vars.hideCssObj,
		allThumbsResized = false,
		widthToggle = false,
		tempPreloaderImage = ($.type(_vars.preloaderUrl) === "string") ? $("<img>").on("load",  onTempPreloaderImageLoad ) : null,
		preloaderX = 0,
		preloaderY = 0,
		isFirefoxAndroid = Utils.isFirefox && Utils.isAndroid,
		scrollerParent = _scroller.parent(),
		setHolderVisibility = _vars.setHolderVisibility && scrollerParent.data("elem") == "thumbsHolder",
		indexChangeEvents = [],
		toggleEvents = [],
		allEvents = [indexChangeEvents, toggleEvents];
		
		TweenMax.set(hiddenDiv, { autoAlpha:0 } );
		$("body").append(hiddenDiv);
		
		if(tempPreloaderImage != null)
		{
			TweenMax.set(tempPreloaderImage, { autoAlpha:0 } );
			hiddenDiv.append(tempPreloaderImage);
			tempPreloaderImage.attr("src", _vars.preloaderUrl);
		}
		
		TweenMax.set(_scroller, {overflow:"hidden", height:imageDivHeight + "px", minHeight:imageDivHeight + "px"});
		
		TweenMax.set(_thumbsHolder, {transformPerspective:500});
			
		_scroller.append(_thumbsHolder);
		init();
		
		_scroller.on("mousedown", Utils.preventDefault);
		_scroller.on("mousemove", Utils.preventDefault);
		
		
		if(!isNaN(_vars.resizeDuration) && _vars.resizeDuration > 0)
		{
			TweenMax.to(this, _vars.resizeDuration, { onRepeat:onWindowResize, repeat:-1 } );
		}
		
		this.thumbs = _thumbs;
		this.index = _index;
		this.show = _show;
		this.vars = _vars;
		this.on = _on;
		this.off = _off;
		this.resize = onWindowResize;
		
		function init()
		{
			if($.isArray(_thumbs))
			{
				var len = _thumbs.length;
				if(len > 0)
				{
					for(var i = 0; i < len; i++)
					{
						var thumb = _thumbs[i];
						
						if(thumb.url !== null)
						{
							var url = thumb.url,
							caption =  (_vars !== undefined && $.type(thumb.caption) === "string") ?  thumb.caption : "",
							borderColor = (_thumbIndex == i) ? _vars.borderColor : _vars.defaultBorderColor;
							
							_thumbs[i].width = 0;
							_thumbs[i].height = 0;
							_thumbs[i].loaded = false;
							_thumbs[i].resized = false;
							_thumbs[i].image = $("<img  style='position:absolute; max-width:none;'>").on("load",  { index:i }, onImageLoad);
							_thumbs[i].div = $("<div style='position:absolute; overflow:hidden; width:" + _vars.thumbWidth + "px; height:" + _vars.thumbHeight + "px; left:" + ((_vars.thumbWidth + _vars.space)* i) + "px; border:" + _vars.borderThickness + "px solid " + borderColor + ";' >");
							
							if(tempPreloaderImage !== null)
							{
								_thumbs[i].preloaderImage = $("<img   style='position:absolute; max-width:none; display:block;'>").on("load",  { index:i }, onPreloaderImageLoad);
								_thumbs[i].div.append(_thumbs[i].preloaderImage);
							}
							
							hiddenDiv.append(_thumbs[i].image);
							_thumbsHolder.append(_thumbs[i].div);
							TweenMax.set(_thumbs[i].image, { autoAlpha:0 } );
						}
					}
					
					if(len > 0)
					{
						_thumbsHolder.append(_thumbs[0].div);
					}
					
					onWindowResize();
				}
			}
			
			$(window).on("resize", onWindowResize);
			
			touchHandler = _thumbsHolder.hammer( 
			{
				drag_min_distance: 0,
				prevent_default:true,
				swipe:false,
				drag_max_touches: 4
			});
			
			touchHandler.on("hold", resetVelocity);
			touchHandler.on("dragstart", onDragStart);

			touchHandler.on("drag", onDrag);
			touchHandler.on("dragend", onDragEnd);
			
			_show(isShow, 0);
	
		}
		
		function _show(value, duration)
		{
			if($.type(value) === "boolean")
			{
				var oldIsShow = isShow;
				isShow = value;
				duration = (duration !== undefined && !isNaN(duration)) ? duration : _vars.animDuration;
				
				var cssObj = (isShow) ? showCssObj : hideCssObj;
				
				var tl = new TimelineMax();
					
				if(setHolderVisibility && isShow)
				{
					tl.add(TweenMax.to(scrollerParent, 0, { display:"block", visibility:"visible", overwrite:"all"} ));
				}
				
				tl.add(TweenMax.to(_scroller, duration, cssObj));
				
				if(setHolderVisibility && !isShow)
				{
					tl.add(TweenMax.to(scrollerParent, 0, { display:"block", visibility:"hidden", overwrite:"all", immediateRender:false} ));
				}
				
				if(isShow && !allThumbsResized)
				{
					tl.add(checkThumbSize);
				}
				
				if(isShow)
				{
					adjustHolderPos();	
				}
				
				if(oldIsShow != isShow)
				{
					callHandler(PhysicsScroller.TOGGLE);
				}
			}
			
			return isShow;
		}
		
		function checkThumbSize()
		{
			var len = _thumbs.length;
			
			allThumbsResized = true;
			for(var i = 0; i < len; i++)
			{
				if(!_thumbs[i].resized)
				{
					if(_thumbs[i].loaded)
					{
						resizeImage(i);
					}
					
					if(!_thumbs[i].resized)
					{
						allThumbsResized = false;
					}
				}
			}
		}
		
		function onDragStart(e)
		{
			scrollerWidth = _scroller.width();
			scrollerHeight = _scroller.height();
					
			if(holderWidth < scrollerWidth)
			{
				allowDrag = false;
			}
			else
			{
				allowDrag = true;
				startDragX = e.gesture.touches[0].pageX;
				oldX = curX;
				
				oldMouseX = curMouseX;
				curMouseX = startDragX;
				
				resetVelocity();
			}
		}
		
		function onDrag(e)
		{
			if(allowDrag)
			{
				oldMouseX = curMouseX;
				curMouseX = e.gesture.touches[0].pageX;
				
				curX = oldX + curMouseX - startDragX;
				var cssObj = {  immediateRender:false, ease:_vars.ease };
			
				if(useTransform)
				{
					cssObj.x = curX; 
				}
				else
				{
					cssObj.marginLeft = curX; 
				}
				
				TweenMax.to(_thumbsHolder, 0, cssObj );
			}
		}
		
		function onDragEnd(e)
		{
			if(allowDrag)
			{
				multX = ((oldMouseX - curMouseX) < 0) ? 1 : -1;
				velocityX = Math.abs(oldMouseX - curMouseX);
			
				TweenLite.ticker.addEventListener("tick", scrollContent);
			}
			
			allowDrag = false;
		}
		function scrollContent()
		{
			if(velocityX > 0)
			{
				curX += (velocityX * multX);
				
				if(holderWidth < scrollerWidth)
				{
					velocityX = 0;
				}
				else if(curX > _vars.overScroll)
				{
					velocityX = 0;
					curX = _vars.overScroll;
				}
				else if(curX + holderWidth - scrollerWidth < -_vars.overScroll)
				{
					velocityX = 0;
					curX = -_vars.overScroll - holderWidth + scrollerWidth;
				}
				
				
				adjustHolderPos(0, false, false);
				velocityX -= _vars.friction;
			}
			else
			{
				adjustHolderPos(_vars.animDuration);
				resetVelocity();
			}
		}
		
		function resetVelocity(e)
		{
			velocityX = 0;
			TweenLite.ticker.removeEventListener("tick", scrollContent);
				
		}
		
		function onTempPreloaderImageLoad(e)
		{
			preloaderX = ((_vars.thumbWidth - tempPreloaderImage.width()) * 0.5) + "px";
			preloaderY = ((_vars.thumbHeight - tempPreloaderImage.height()) * 0.5) + "px";
			
			tempPreloaderImage.remove();
			
			var preloaderUrl = _vars.preloaderUrl,
			len = _thumbs.length;
			
			for(var i = 0; i < len; i++)
			{
				if(_thumbs[i].preloaderImage != null)
				{
					_thumbs[i].preloaderImage.attr("src", preloaderUrl);
				}
			}
		}
		
		function onPreloaderImageLoad(e)
		{
			var i = e.data.index;
			
			if(!_thumbs[i].loaded)
			{
				TweenMax.set(_thumbs[i].preloaderImage, { position:"absolute", left:"50%", top:"50%", x:"-25%", y:"-25%" } );
				TweenMax.to(_thumbs[i].preloaderImage, _vars.animDuration, { autoAlpha:1 } ); 
			}
		}
		
		function onImageLoad(e)
		{
			var i = e.data.index;
			
			_thumbs[i].loaded = true;
			if(_thumbs[i].preloaderImage !== undefined && _thumbs[i].preloaderImage !== null)
			{
				_thumbs[i].preloaderImage.remove();
				_thumbs[i].preloaderImage = null;
			}
			
			TweenMax.set(_thumbs[i].image, {transformPerspective:500});
			resizeImage(i);
			_thumbs[i].div.append(_thumbs[i].image);
			var divTouchHandler = _thumbs[i].div.hammer( 
			{
				drag_min_distance: 0,
				prevent_default:true,
				swipe:false,
				drag_max_touches: 1
			});
			
			divTouchHandler.on("tap", {index:i}, onDivTap);
			
		}
		
		function resizeImage(i)
		{
			if(!_thumbs[i].resized)
			{
				var imageWidth = _thumbs[i].image.width(),
					imageHeight = _thumbs[i].image.height();
				
				if(imageWidth != 0 && imageHeight != 0)
				{
					var widthScale = imageDivWidth / imageWidth,
						heightScale = imageDivHeight / imageHeight,
						newWidth = imageWidth * heightScale,
						newHeight = imageHeight * widthScale,
						thumbX = 0,
						thumbY = 0,
						scale = 1;
					if(_vars.scaleMode == "proportionalInside")
					{
						if(newHeight <= imageDivHeight)
						{
							newWidth = imageDivWidth;
							scale = imageDivWidth / newWidth;
						}
						else
						{
							newHeight = imageDivHeight;
							scale = imageDivHeight / newHeight;
						}
					}
					else if(_vars.scaleMode == "proportionalOutside")
					{
						if(newHeight >= imageDivHeight)
						{
							newWidth = imageDivWidth;
							scale = imageDivWidth / newWidth;
						}
						else
						{
							newHeight = imageDivHeight;
							scale = imageDivHeight / newHeight;
						}
					}
					else
					{
						newWidth = imageWidth;
						newHeight = imageHeight;
					}
					
					thumbX = (imageDivWidth - newWidth) * 0.5;
					thumbY = (imageDivHeight - newHeight) * 0.5;
					
					var tl = new TimelineMax();
					tl.add(TweenMax.to(_thumbs[i].image, 0, { width:newWidth + "px", height:newHeight + "px", x:thumbX, y:thumbY, position:"absolute" } ) );
					tl.add(TweenMax.to(_thumbs[i].image, _vars.animDuration, { autoAlpha:1, display:"block", ease:_vars.ease } ));
					_thumbs[i].resized = true;
				}
			}
		}
		
		function onDivTap(e)
		{
			var i = e.data.index;
			_index(i);
		}
		
		function onWindowResize(e)
		{
			scrollerWidth = _scroller.width();
			scrollerHeight = _scroller.height();
			
			if(oldScrollerWidth != scrollerWidth || oldScrollerHeight != scrollerHeight)
			{
				adjustHolderPos();
				oldScrollerWidth = scrollerWidth;
				oldScrollerHeight = scrollerHeight;
			}
		}
		
		function adjustHolderPos(duration, setBounds, showIndex)
		{
			scrollerWidth = _scroller.width();
			scrollerHeight = _scroller.height();
			
			duration = duration || 0;
			setBounds = (setBounds !== undefined) ? setBounds : true;
			showIndex = (showIndex !== undefined) ? showIndex : false;
			
			var cssObj = {  width:holderWidth, ease:_vars.ease },
				selectedX = _thumbIndex * (_vars.thumbWidth + _vars.space),
				loadAll = false,
				tempCssObj = { immediateRender:false },
				moveCurX = false;
			
			if(setBounds)
			{
				if(holderWidth < scrollerWidth)
				{
					curX = (scrollerWidth - holderWidth) * 0.5;
					loadAll = true;
				}
				else if(curX > 0)
				{
					curX = 0;

				}
				else if(curX + holderWidth - scrollerWidth < 0)
				{
					curX = -(holderWidth - scrollerWidth);
				}
				else if(isFirefoxAndroid)
				{
					moveCurX = true;	
				}
			}
			else
			{
				
			}
			
			if(showIndex)
			{
				if(curX + selectedX < 0)
				{
					curX = -selectedX;
				}
				else if(curX + selectedX + imageDivWidth > scrollerWidth)
				{
					curX = scrollerWidth - (selectedX + imageDivWidth);
				}
				else if(isFirefoxAndroid)
				{
					moveCurX = true;	
				}
			}
			
			if(useTransform)
			{
				cssObj.x = curX;
				tempCssObj.x = curX - 1;
			}
			else
			{
				cssObj.marginLeft = curX;
				tempCssObj.marginLeft = curX - 1;
			}
			
			if(!allThumbsResized && setBounds)
			{
				var startIndex = 0,
				endIndex = 0;
				
				
				if(loadAll)
				{
					endIndex = _thumbs.length - 1;
				}
				else
				{
					startIndex = Math.abs(Math.ceil(curX / imageDivWidth));
					endIndex = startIndex + Math.ceil(scrollerWidth / imageDivWidth);
				}
				
				if(endIndex > _thumbs.length - 1)
				{
					endIndex = _thumbs.length - 1;
				}
				
				cssObj.onComplete = loadThumbs;
				cssObj.onCompleteParams = [startIndex, endIndex];
			}
			
			var tl = new TimelineMax();
			
			if(isFirefoxAndroid && moveCurX)
			{
				tl.add(TweenMax.to(_thumbsHolder, 0, tempCssObj));
			}
			
			tl.add(TweenMax.to(_thumbsHolder, duration, cssObj));
		}
		
		function loadThumbs(startIndex, endIndex)
		{
			for(var i = startIndex; i <= endIndex; i++)
			{
				if(!_thumbs[i].loaded)
				{
					_thumbs[i].image.attr("src", _thumbs[i].url);
				}
			}
		}
		
		function _index(i)
		{
			if(i !== undefined && !isNaN(i))
			{
				if(i < 0)
				{
					i = 0;
				}
				else if(i > _thumbs.length - 1)
				{
					i = _thumbs.length - 1;
				}
				
				if(oldThumbIndex != i)
				{
					_thumbIndex = i;
					
					TweenMax.set(_thumbs[oldThumbIndex].div, {border:_vars.borderThickness + "px solid " + _vars.defaultBorderColor});
					TweenMax.set(_thumbs[_thumbIndex].div, {border:_vars.borderThickness + "px solid " + _vars.borderColor});
					
					_thumbsHolder.append(_thumbs[_thumbIndex].div);
					oldThumbIndex = _thumbIndex;
					callHandler(PhysicsScroller.INDEX_CHANGE);
				}
				
				adjustHolderPos(_vars.animDuration, true, true);
				
			}
			
			return _thumbIndex;
		}
		
		function _on(eventType, handler, handlerParams)
		{
			if($.isFunction(handler))
			{
				var eventObj = null,
					eventArr = null,
					eventIndex = $.inArray(eventType, PhysicsScroller.eventTypes);
				
				handlerParams = $.isArray(handlerParams) ? handlerParams : null;
				
				if(eventIndex > -1)
				{
					eventArr = allEvents[eventIndex];
					var eventObj = { handler:handler, handlerParams:handlerParams };
					if(!$.inArray(eventObj, eventArr) > -1)
					{
						eventArr.push(eventObj);
					}
				}
				else
				{
					//console.log("Add: Unknown eventType " + 	eventType);
				}
			}
		}
		
		function _off(eventType, handler, handlerParams)
		{
			if($.isFunction(handler))
			{
				var eventObj = null,
					eventArr = null,
					eventIndex = $.inArray(eventType, PhysicsScroller.eventTypes),
					compareHandlerParams = false;
				
				if(handlerParams !== undefined)
				{
					handlerParams = $.isArray(handlerParams) ? handlerParams : null;
					compareHandlerParams = true
				}
				
				if(eventIndex > -1)
				{
					eventArr = allEvents[eventIndex];
					for(var i = eventArr.length - 1; i >= 0; i--)
					{
						if(eventArr[i].handler == handler && (!compareHandlerParams || Utils.isSameArray(eventArr[i].handlerParams, handlerParams)))
						{
							eventArr.splice(i, 1);
						}
					}
				}
				else
				{
					//console.log("Remove: Unknown eventType " + 	eventType);
				}
			}
		}
		
		function callHandler(eventType)
		{
			var eventIndex = $.inArray(eventType, PhysicsScroller.eventTypes);
			if(eventIndex > -1)
			{
				var eventArr = allEvents[eventIndex],
					i = 0;
					
				for(i = 0; i < eventArr.length; i++)
				{
					eventArr[i].handler.apply(null, eventArr[i].handlerParams);

				}
			}
		}
	}
	
	window.PhysicsScroller = PhysicsScroller;
	
}(window, jQuery));


(function(window, $)
{
	Caption.TOGGLE = "toggle";
	Caption.eventTypes = [Caption.TOGGLE];
	
	function Caption(_captionElem, varsObj)
	{
		TweenLite.defaultOverwrite = "auto";
		var _vars = $.extend( { animDuration:0.5, ease:Power4.easeOut, initShow:false, resizeDuration:-1, showCssObj:{ autoAlpha:1 }, hideCssObj:{ autoAlpha:0 }, setHolderVisibility:true }, varsObj),
		_caption = $(_captionElem),
		isShow = _vars.initShow,
		lastIsShow=_vars.initShow,
		oldCaptionHeight = 0,
		setHolderVisibility = _vars.setHolderVisibility && _caption.parent().data("elem") == "captionHolder",
		toggleEvents = [],
		allEvents = [toggleEvents];
		
		this.caption = _caption;
		this.vars = _vars;
		
		this.show = _show;
		this.html = _html;
		this.resize = onWindowResize;
		this.on = _on;
		this.off = _off;
		
		if(!isNaN(_vars.resizeDuration) && _vars.resizeDuration > 0)
		{
			TweenMax.to(this, _vars.resizeDuration, { onRepeat:onWindowResize, repeat:-1 } );
		}
		
		if(Utils.androidVer !== null && Utils.androidVer < 4.1)
		{
			TweenMax.set([_caption, _caption.parent()], {  } );
		}
		
		_show(_vars.initShow, 0);
		$(window).on("resize", onWindowResize);
		
		function onWindowResize(e)
		{
			adjustCaptionHolderHeight();
		}
		
		function _html(value)
		{
			_caption.html(value);
			adjustCaptionHolderHeight();
			
			return _caption.html();
		}
		
		function _show(value, duration)
		{

			duration = !isNaN(Math.abs(duration)) ? Math.abs(duration) : _vars.animDuration;
			var tl = new TimelineMax();
			
			if(value !== undefined)
			{
				isShow = value;
				 
				if(isShow)
				{
					if(setHolderVisibility)
					{
						tl.add(TweenMax.to(_caption.parent(), 0, { display:"block", overwrite:"all" }));
					}
					adjustCaptionHolderHeight();
					tl.add(TweenMax.to(_caption, duration, _vars.showCssObj));
				}
				else
				{
					tl.add(TweenMax.to(_caption, duration,  _vars.hideCssObj));
					if(setHolderVisibility)
					{
						tl.add(TweenMax.to(_caption.parent(), 0, { display:"none", overwrite:"all", immediateRender:false }));
					}
				}
				
				callHandler(Caption.TOGGLE);
			}
			return isShow;
		}
		
		function _on(eventType, handler, handlerParams)
		{
			if($.isFunction(handler))
			{
				var eventObj = null,
					eventArr = null,
					eventIndex = $.inArray(eventType, Caption.eventTypes);
				
				handlerParams = $.isArray(handlerParams) ? handlerParams : null;
				
				if(eventIndex > -1)
				{
					eventArr = allEvents[eventIndex];
					var eventObj = { handler:handler, handlerParams:handlerParams };
					if(!$.inArray(eventObj, eventArr) > -1)
					{
						eventArr.push(eventObj);
					}
				}
				else
				{
					//console.log("Add: Unknown eventType " + 	eventType);
				}
			}
		}
		
		function _off(eventType, handler, handlerParams)
		{
			if($.isFunction(handler))
			{
				var eventObj = null,
					eventArr = null,
					eventIndex = $.inArray(eventType, Caption.eventTypes),
					compareHandlerParams = false;
				
				if(handlerParams !== undefined)
				{
					handlerParams = $.isArray(handlerParams) ? handlerParams : null;
					compareHandlerParams = true
				}
				
				if(eventIndex > -1)
				{
					eventArr = allEvents[eventIndex];
					for(var i = eventArr.length - 1; i >= 0; i--)
					{
						if(eventArr[i].handler == handler && (!compareHandlerParams || Utils.isSameArray(eventArr[i].handlerParams, handlerParams)))
						{
							eventArr.splice(i, 1);
						}
					}
				}
				else
				{
					//console.log("Remove: Unknown eventType " + 	eventType);
				}
			}
		}
		
		function callHandler(eventType)
		{
			var eventIndex = $.inArray(eventType, Caption.eventTypes);
			if(eventIndex > -1)
			{
				var eventArr = allEvents[eventIndex],
					i = 0;
					
				for(i = 0; i < eventArr.length; i++)
				{
					eventArr[i].handler.apply(null, eventArr[i].handlerParams);
				}
			}
		}
		
		function adjustCaptionHolderHeight()
		{
			var captionHeight = _caption.height();
			if(oldCaptionHeight != captionHeight)
			{
				TweenMax.set(_caption.parent(), { css:{ height:captionHeight + "px" } } );
				oldCaptionHeight = captionHeight;
			}
		}
	}
	
	window.Caption = Caption;
	
}(window, jQuery));

(function(window, $)
{
	TweenLite.defaultOverwrite = "auto";
	
	
	TouchNSwipe.objs = [];
	TouchNSwipe.linkObjs = [];
	TouchNSwipe.lastSliderIndex = 0;
	TouchNSwipe.lastLinkIndex = 0;
	TouchNSwipe.focusIndex = 0;
	TouchNSwipe.vars=[]
	TouchNSwipe.keyEventInit = false;
	
	TouchNSwipe.TOGGLE = "toggle";
	TouchNSwipe.eventTypes = [TouchNSwipe.TOGGLE];
	
	function TouchNSwipe(sliderDiv, varsObj)
	{
		var _vars = $.extend( { initShow:true, setHolderVisibility:true, animDuration:0.25, visibilityDelay:0.1, showCssObj:{ autoAlpha:1 }, hideCssObj:{ autoAlpha:0 },initShowControlHolder:true,animControlDuration:0.3 }, varsObj),
			isShow = _vars.initShow,
			setHolderVisibility = _vars.setHolderVisibility && sliderDiv.parent().data("elem") == "sliderHolder";
			toggleEvents = [],
			allEvents = [toggleEvents];
		
		this.on = _on;
		this.off = _off;
		this.show = _show;
		TouchNSwipe.vars = _vars;
		_show(isShow, 0);
		
		function _show(value, duration)
		{
			duration = !isNaN(Math.abs(duration)) ? Math.abs(duration) : _vars.animDuration;
			
			var tl = new TimelineMax(),
				showDelay = _vars.showCssObj.delay,
				hideDelay = _vars.hideCssObj.delay,
				parentDuration = (duration > 0) ? _vars.visibilityDelay : 0.0;
			
			if(duration == 0)
			{
				_vars.showCssObj.delay = 0;
				_vars.hideCssObj.delay = 0;
			}
			
			if(value !== undefined)
			{
				isShow = value;
				 
				if(isShow)
				{
					if(setHolderVisibility)
					{
						tl.add(TweenMax.to(sliderDiv.parent(), parentDuration, { visibility:"visible", display:"block", overwrite:"all" }));
					}
					tl.add(TweenMax.to(sliderDiv, duration, _vars.showCssObj));
				}
				else
				{
					tl.add(TweenMax.to(sliderDiv, duration,  _vars.hideCssObj));
					if(setHolderVisibility)
					{
						tl.add(TweenMax.to(sliderDiv.parent(), parentDuration, { visibility:"hidden", display:"block", overwrite:"all", immediateRender:false }));
					}
				}
				
				callHandler(TouchNSwipe.TOGGLE);
			}
			
			if(duration == 0)
			{
				_vars.showCssObj.delay = showDelay;
				_vars.hideCssObj.delay = hideDelay;
			}
			
			return isShow;
		}
		
		function _on(eventType, handler, handlerParams)
		{
			if($.isFunction(handler))
			{
				var eventObj = null,
					eventArr = null,
					eventIndex = $.inArray(eventType, TouchNSwipe.eventTypes);
				
				handlerParams = $.isArray(handlerParams) ? handlerParams : null;
				
				if(eventIndex > -1)
				{
					eventArr = allEvents[eventIndex];
					var eventObj = { handler:handler, handlerParams:handlerParams };
					if(!$.inArray(eventObj, eventArr) > -1)
					{
						eventArr.push(eventObj);
					}
				}
				else
				{
					//console.log("Add: Unknown eventType " + 	eventType);
				}
			}
		}
		
		function _off(eventType, handler, handlerParams)
		{
			if($.isFunction(handler))
			{
				var eventObj = null,
					eventArr = null,
					eventIndex = $.inArray(eventType, TouchNSwipe.eventTypes),
					compareHandlerParams = false;
				
				if(handlerParams !== undefined)
				{
					handlerParams = $.isArray(handlerParams) ? handlerParams : null;
					compareHandlerParams = true
				}
				
				if(eventIndex > -1)
				{
					eventArr = allEvents[eventIndex];
					for(var i = eventArr.length - 1; i >= 0; i--)
					{
						if(eventArr[i].handler == handler && (!compareHandlerParams || Utils.isSameArray(eventArr[i].handlerParams, handlerParams)))
						{
							eventArr.splice(i, 1);
						}
					}
				}
				else
				{
					//console.log("Remove: Unknown eventType " + 	eventType);
				}
			}
		}
		
		function callHandler(eventType)
		{
			var eventIndex = $.inArray(eventType, TouchNSwipe.eventTypes);
			if(eventIndex > -1)
			{
				var eventArr = allEvents[eventIndex],
					i = 0;
					
				for(i = 0; i < eventArr.length; i++)
				{
					eventArr[i].handler.apply(null, eventArr[i].handlerParams);
				}
			}
		}
	}
	
	TouchNSwipe.removeAll = function()
	{
		var len = TouchNSwipe.objs.length;
		for(var i = 0; i < len; i++)
		{
			var obj = TouchNSwipe.objs[i];
			if(!obj.removed)
			{
				obj.sliderHolder.remove();
			}
			TouchNSwipe.objs[i] = null;
		}
		
		TouchNSwipe.objs = null;
		TouchNSwipe.objs = [];
		
		len = TouchNSwipe.linkObjs.length;
		for(i = 0; i < len; i++)
		{
			linkObj = TouchNSwipe.linkObjs[i];
			if(!linkObj.removed)
			{
				linkObj.imageLink.remove();
			}
			TouchNSwipe.linkObjs[i] = null;
		}

		
		TouchNSwipe.linkObjs = null;
		TouchNSwipe.linkObjs = [];
	}
	
	TouchNSwipe.remove = function(idOrIndex)
	{
		var index = -1,
			len = TouchNSwipe.objs.length;
			
		if(!isNaN(idOrIndex))
		{
			index = idOrIndex;
		}
		else
		{
			
			for(var i = 0; i < len; i++)
			{
				if(TouchNSwipe.objs[i].id == idOrIndex)
				{
					index = i;
					i = len;
				}
			}
		}
		
		if(index >= 0 && index < len)
		{
			if(TouchNSwipe.objs[index].sliderHolder != null)
			{
				TouchNSwipe.objs[index].sliderHolder.remove();
			}
			TouchNSwipe.objs[index] = null;
			TouchNSwipe.objs[index] = { removed:true };
		}
	}
	
	TouchNSwipe.removeLinkObj = function(idOrIndex)
	{
		var index = -1,
			len = TouchNSwipe.linkObjs.length;
			
		if(!isNaN(idOrIndex))
		{
			index = idOrIndex;
		}
		else
		{
			for(var i = 0; i < len; i++)
			{
				if(TouchNSwipe.linkObjs[i].id == idOrIndex)
				{
					index = i;
					i = len;
				}
			}
		}
		
		if(index >= 0 && index < len)
		{
			TouchNSwipe.linkObjs[index].imageLink.remove();
			TouchNSwipe.linkObjs[index] = null;
			TouchNSwipe.linkObjs[index] = { removed:true };
		}
	}
	
	TouchNSwipe.get = function(idOrIndex)
	{
		return TouchNSwipe.getObj(idOrIndex).touchNSwipe;
	}
	
	TouchNSwipe.getThumbScroller = function(idOrIndex)
	{
		return TouchNSwipe.getObj(idOrIndex).thumbScroller;
	}
	
	TouchNSwipe.getCaption = function(idOrIndex)
	{
		return TouchNSwipe.getObj(idOrIndex).captionObj;
	}
	
	
	TouchNSwipe.getSlider = function(idOrIndex)
	{
		return TouchNSwipe.getObj(idOrIndex).slider;
	}
	
	TouchNSwipe.getObj = function(idOrIndex)
	{
		var obj = null;
		
		if(!isNaN(idOrIndex))
		{
			if(idOrIndex >= 0 && idOrIndex < TouchNSwipe.objs.length)
			{
				obj = TouchNSwipe.objs[idOrIndex];
			}
		}
		else
		{
			var len = TouchNSwipe.objs.length;
			for(var i = 0; i < len; i++)
			{
				if(TouchNSwipe.objs[i].id == idOrIndex)
				{
					obj = TouchNSwipe.objs[i];
					i = len;
				}
			}
		}
		
		return obj;
	}
	
	TouchNSwipe.getLinkObj = function(idOrIndex)
	{
		var linkObj = null;
		
		if(!isNaN(idOrIndex))
		{
			linkObj = TouchNSwipe.linkObjs[idOrIndex];
		}
		else
		{
			var len = TouchNSwipe.linkObjs.length;
			for(var i = 0; i < len; i++)
			{
				if(TouchNSwipe.linkObjs[i].id == idOrIndex)
				{
					linkObj = TouchNSwipe.linkObjs[i];
					i = len;
				}
			}
		}
		
		return linkObj;
	}
	
	
	TouchNSwipe.init = function(elems)
	{
		elems = (jQuery.type(elems) === "string" || elems instanceof jQuery) ? elems : "div[data-elem='slider']";
		var sliderHolders = $(elems),
			sliderHolderLen = sliderHolders.length,
			i = 0,
			j = 0;
		
		for(i = 0; i < sliderHolderLen; i++)
		{
			var obj = {},
			sliderHolder = sliderHolders.eq(i),
			sliderItems = sliderHolder.find("[data-elem='items']").eq(0),
			sliderContent = sliderHolder.find("[data-elem='slides']").eq(0),
			thumbScroller = sliderHolder.find("[data-elem='thumbs']").eq(0),
			thumbScrollerLen = thumbScroller.length,
			newIndex = TouchNSwipe.objs.length;
			
			obj.removed = false;
			obj.sliderHolder = sliderHolder;
			obj.id = obj.sliderHolder.attr("id") || "sliderHolder" + TouchNSwipe.lastSliderIndex;
			var tnsVars = Utils.getAttrObjectFromString(sliderHolder.data("options-gallery"));
			tnsVars.showCssObj = $.extend({autoAlpha:1}, Utils.getAttrObjectFromString(sliderHolder.data("show")));
			tnsVars.hideCssObj = $.extend({autoAlpha:0}, Utils.getAttrObjectFromString(sliderHolder.data("hide")));
			obj.buttonDelay = tnsVars.buttonDelay || 0.1;
			obj.touchNSwipe = new TouchNSwipe(sliderHolder, tnsVars);
			
			obj.caption = sliderHolder.find("[data-elem='caption']").eq(0);

			
			obj.autoPlayButton = sliderHolder.find("[data-elem='autoPlay']").eq(0);
			obj.autoPlayOnObj = Utils.getAttrObjectFromString(obj.autoPlayButton.data("on"));
			obj.autoPlayOffObj = Utils.getAttrObjectFromString(obj.autoPlayButton.data("off"));
			
			obj.prevButton = sliderHolder.find("[data-elem='prev']").eq(0);
			obj.prevOnObj = Utils.getAttrObjectFromString(obj.prevButton.data("on"));
			obj.prevOffObj = Utils.getAttrObjectFromString(obj.prevButton.data("off"));
			
			obj.nextButton = sliderHolder.find("[data-elem='next']").eq(0);
			obj.nextOnObj = Utils.getAttrObjectFromString(obj.nextButton.data("on"));
			obj.nextOffObj = Utils.getAttrObjectFromString(obj.nextButton.data("off"));
			
			obj.zoomInButton = sliderHolder.find("[data-elem='zoomIn']").eq(0);
			obj.zoomInOnObj = Utils.getAttrObjectFromString(obj.zoomInButton.data("on"));
			obj.zoomInOffObj = Utils.getAttrObjectFromString(obj.zoomInButton.data("off"));
			
			obj.zoomOutButton = sliderHolder.find("[data-elem='zoomOut']").eq(0);
			obj.zoomOutOnObj = Utils.getAttrObjectFromString(obj.zoomOutButton.data("on"));
			obj.zoomOutOffObj = Utils.getAttrObjectFromString(obj.zoomOutButton.data("off"));
			
			var imageListItems = sliderItems.find("li"),
			imageListItemsLen = imageListItems.length,
			slides = [],
			thumbs = [];
			
			for(j = 0; j < imageListItemsLen; j++)
			{
				var imageAnchor = imageListItems.eq(j).children("a").eq(0),
				imgCaption = imageListItems.eq(j).find("[data-elem='imgCaption']").eq(0),
				imageElem,
				imageUrl,
				thumbUrl,
				caption;
				
				if(imageAnchor.length > 0)
				{
					imageElem = imageAnchor.find("img").eq(0);
					imageUrl = imageAnchor.attr("href");
					thumbUrl = imageElem.data("src") || imageElem.attr("src");
				}
				else
				{
					imageElem = imageListItems.eq(j).find("img").eq(0);
					
					thumbUrl = imageElem.data("src") || imageElem.attr("src");
					imageUrl = thumbUrl;
				}
				
				var imgAlt = imageElem.attr("alt"),
					slideData = Utils.getAttrObjectFromString(imageElem.data("info"));
				
				if(imgCaption.length > 0)
				{
					caption = imgCaption.html();
				}
				else if(imgAlt !== undefined && imgAlt !== null) 
				{
					caption = imgAlt;
				}
				else
				{
					caption = "";
				}
				
				slideData.url = imageUrl;
				slideData.caption = caption;
				
				slides.push(slideData);
				if(thumbScrollerLen == 1)
				{
					thumbs.push({url:thumbUrl, caption:caption});
					
					if(Utils.androidVer !== null && Utils.androidVer < 4.1)
					{
						TweenMax.set([thumbScroller, thumbScroller.parent()], {  } );
					}
				}
			}
			
			sliderItems.remove();
			var sliderContentObj = Utils.getAttrObjectFromString(sliderContent.data("options-gallery")),
				slider = new ImageSlider(sliderContent, slides, sliderContentObj);
				
			slider.on(ImageSlider.INDEX_CHANGE, onIndexChange, ["slider", newIndex]);
			slider.on(ImageSlider.ZOOM, onSliderZoom, [newIndex]);
			slider.on(ImageSlider.AUTOPLAY, onSliderAutoPlay, [newIndex]);


			
			obj.slider = slider;
			
			if(thumbScrollerLen == 1)
			{
				obj.thumbsToggleButton = sliderHolder.find("[data-elem='thumbsToggle']").eq(0);
				obj.thumbsToggleOnObj = Utils.getAttrObjectFromString(obj.thumbsToggleButton.data("on"));
				obj.thumbsToggleOffObj = Utils.getAttrObjectFromString(obj.thumbsToggleButton.data("off"));
				
				var thumbScrollerObj = Utils.getAttrObjectFromString(thumbScroller.data("options-gallery")),
					showCssObj = Utils.getAttrObjectFromString(thumbScroller.data("show")),
					hideCssObj = Utils.getAttrObjectFromString(thumbScroller.data("hide"));
				
				if(!$.isEmptyObject(showCssObj) && !$.isEmptyObject(hideCssObj))
				{
					thumbScrollerObj.showCssObj = showCssObj;
					thumbScrollerObj.hideCssObj = hideCssObj;
				}
				
				var thumbScroller = new PhysicsScroller(thumbScroller, thumbs, thumbScrollerObj);
				thumbScroller.on(PhysicsScroller.INDEX_CHANGE, onIndexChange, ["thumb", newIndex]);
				thumbScroller.on(PhysicsScroller.TOGGLE, onThumbsToggle, [newIndex]);
				
				obj.thumbScroller = thumbScroller;
				obj.thumbsToggleTweenObj = {};
				obj.thumbsToggleAllow = true;
				//obj.thumbsToggleButton.hammer().on("tap", { index:newIndex }, toggleThumbs);
				obj.thumbsToggleButton.on("click", { index:newIndex }, toggleThumbs);
				
				if(thumbScroller.show())
				{
					TweenMax.set(obj.thumbsToggleButton, obj.thumbsToggleOnObj);
				}
				else
				{
					TweenMax.set(obj.thumbsToggleButton, obj.thumbsToggleOffObj);
				}
			}
			
			obj.sliderHolder.hammer().on("tap", {index:newIndex}, onSliderFocus);
					
			TouchNSwipe.focusIndex = newIndex;
			TouchNSwipe.objs.push(obj);
			TouchNSwipe.lastSliderIndex ++;
			setArrowButtonState(newIndex);
			setZoomButtonState(newIndex);
			
			if(obj.caption.length == 1)
			{
				var captionVars = Utils.getAttrObjectFromString(obj.caption.data("options-gallery"));
				captionVars.showCssObj = Utils.getAttrObjectFromString(obj.caption.data("show"));
				captionVars.hideCssObj = Utils.getAttrObjectFromString(obj.caption.data("hide"));
				obj.captionObj = new Caption(obj.caption, captionVars);
				
				obj.captionToggleButton = sliderHolder.find("[data-elem='captionToggle']").eq(0);
				obj.captionToggleOnObj = Utils.getAttrObjectFromString(obj.captionToggleButton.data("on"));
				obj.captionToggleOffObj = Utils.getAttrObjectFromString(obj.captionToggleButton.data("off"));
				obj.captionTweenObj = {};
				obj.captionAllow = true;
				//obj.captionToggleButton.hammer().on("tap", { index:newIndex }, toggleCaption);
				obj.captionToggleButton.on("click", { index:newIndex }, toggleCaption);
				
				obj.captionObj.html(TouchNSwipe.objs[newIndex].slider.caption);
				
				obj.captionObj.on(Caption.TOGGLE, onCaptionToggle, [newIndex]);
			}
						
			obj.closeButton = sliderHolder.find("[data-elem='close']").eq(0);
			obj.closeButtonToggleOnObj = Utils.getAttrObjectFromString(obj.closeButton.data("on"));			

			
			/*
			obj.autoPlayButton.hammer().on("tap", { index:newIndex }, toggleAutoPlay);
			obj.prevButton.hammer().on("tap", { index:newIndex }, onPrev);
			obj.nextButton.hammer().on("tap", { index:newIndex }, onNext);
			obj.zoomInButton.hammer().on("tap", { index:newIndex }, onZoomIn);
			obj.zoomOutButton.hammer().on("tap", { index:newIndex }, onZoomOut);
			obj.closeButton.hammer().on("tap", { index:newIndex }, onSliderClose);
			*/
			obj.autoPlayButton.on("click", { index:newIndex }, toggleAutoPlay);
			obj.prevButton.on("click", { index:newIndex }, onPrev);
			obj.nextButton.on("click", { index:newIndex }, onNext);
			obj.zoomInButton.on("click", { index:newIndex }, onZoomIn);
			obj.zoomOutButton.on("click", { index:newIndex }, onZoomOut);
			obj.closeButton.on("click", { index:newIndex }, onSliderClose);
			
			if(Utils.androidVer !== null && Utils.androidVer < 4.1)
			{
				var controlButtons = [obj.autoPlayButton, obj.prevButton, obj.nextButton, obj.zoomInButton, obj.zoomOutButton, obj.closeButton];
				
				for(var k = 0; k < controlButtons.length; k++)
				{
					if(controlButtons[k].length > 0)
					{
						TweenMax.set([controlButtons[k], controlButtons[k].parent()], {  } );
					}
				}
			}
			
			if(slider.autoPlay())
			{
				TweenMax.set(obj.autoPlayButton, obj.autoPlayOnObj);
			}
			else
			{
				TweenMax.set(obj.autoPlayButton, obj.autoPlayOffObj);
			}
			
			TouchNSwipe.showControlHolder(TouchNSwipe.vars.initShowControlHolder ,0)
		}
		
		
		
		if(sliderHolderLen > 0)
		{
			var imageLinks = $("*[data-link]"),
				imageLinksLen = imageLinks.length;
				
			for(i = 0; i < imageLinksLen; i++)
			{
				var linkObj = { removed:false },
				imageLink = imageLinks.eq(i),
				link = imageLink.data("link");
				
				linkObj.onObj = Utils.getAttrObjectFromString(imageLink.data("on"));
				linkObj.offObj = Utils.getAttrObjectFromString(imageLink.data("off"));
				linkObj.sliderIndex = 0;
				linkObj.id = imageLink.attr("id") || "imageLink" + TouchNSwipe.lastLinkIndex;
				
				if(!isNaN(link))
				{
					linkObj.slider =  TouchNSwipe.objs[0].slider;
					linkObj.index = link;
				}
				else
				{
					link = Utils.getAttrObjectFromString(imageLink.data("link"));
					linkObj.sliderIndex = getSliderIndex(link.slider);
					linkObj.slider = TouchNSwipe.objs[linkObj.sliderIndex].slider;
					linkObj.index = parseInt(link.index) || 0;
				}
				
				//imageLink.hammer().on("tap", { index:TouchNSwipe.lastLinkIndex }, onImageLinkTap);
				imageLink.on("click", { index:TouchNSwipe.lastLinkIndex }, onImageLinkTap);
				linkObj.imageLink = imageLink;
				TouchNSwipe.linkObjs.push(linkObj);
				imageLink.removeAttr("data-link");
				
				TouchNSwipe.lastLinkIndex ++;
			}
			
			for(i = 0; i < sliderHolderLen; i++)
			{
				setImageLinkState(i);
			}
		}
		
		sliderHolders.removeAttr("data-elem");
		
		if(!TouchNSwipe.keyEventInit)
		{
			$(window).keyup(onWindowKeyUp);
			TouchNSwipe.keyEventInit = true;	
		}
	}
	/*RM funzione tap su img per visibilita' bottoni */
	TouchNSwipe.showControlHolder=function (value,duration) {
		

		duration = !isNaN(Math.abs(duration)) ? Math.abs(duration) : TouchNSwipe.vars.animControlDuration;

		var tl = new TimelineMax();
		if(value !== undefined)
		{
			TouchNSwipe.vars.initShowControlHolder = value;
			if (value) {
				tl.add(TweenMax.to($('.controlHolder'), duration, TouchNSwipe.vars.showCssObj));								
			}else{
				tl.add(TweenMax.to($('.controlHolder'), duration, TouchNSwipe.vars.hideCssObj));
			}
			
		}
		return TouchNSwipe.vars.initShowControlHolder;
	}
	function getSliderIndex(idOrIndex)
	{
		var index = 0;
		
		if(idOrIndex !== undefined && idOrIndex !== null)
		{
			var sliderHolderLen = TouchNSwipe.objs.length;
			
			if(!isNaN(idOrIndex))
			{
				if(idOrIndex >= 0 && idOrIndex < sliderHolderLen)
				{
					index = idOrIndex;
				}
			}
			else
			{
				for(var i = 0; i < sliderHolderLen; i++)
				{
					if(TouchNSwipe.objs[i].sliderHolder.get(0) == $(idOrIndex).get(0))
					{
						index = i;
						i = sliderHolderLen;
					}
				}
			}
		}
		
		return index;
	}
	
	function onImageLinkTap(e)
	{
		var index = e.data.index;
		
		if(index >= 0 && index < TouchNSwipe.linkObjs.length)
		{
			if(!TouchNSwipe.linkObjs[index].removed)
			{
				var linkObj = TouchNSwipe.linkObjs[index];
				if(!linkObj.removed)
				{
					var sliderIndex = linkObj.sliderIndex,
					imageIndex = linkObj.index,
					slider = linkObj.slider,
					touchNSwipe = TouchNSwipe.objs[sliderIndex].touchNSwipe;
					
					touchNSwipe.show(true);
					slider.index(imageIndex);
					slider.resize();
					TweenMax.to({}, 0.1, {onComplete:slider.resize});
					
				}
			}
		}
	}
	
	function onWindowKeyUp(e)
	{
		var index = TouchNSwipe.focusIndex;
		
		if(TouchNSwipe.objs.length > 0 && !TouchNSwipe.objs[index].removed)
		{
			var key = e.keyCode,
				slider = TouchNSwipe.getSlider(index);
			
			if(slider.vars.allowKeys)
			{
				if(key == 37)
				{
					slider.prev(true);
				}
				else if(key == 39)
				{
					slider.next(true);
				}
				else if(key == 27)
				{
					onSliderClose(index);
				}
			}
		}
	}
	function onSliderFocus(e)
	{

		var index = e.data.index;
		
		if(!TouchNSwipe.objs[index].removed)
		{
			TouchNSwipe.focusIndex = index;
		}
		
		/*Tap sull'immagine  /*/
		var target = $( e.target );
		if ( target.is( "div.slidesImg" )||target.is( "img.slideImg" ) ) {

			TouchNSwipe.showControlHolder(!TouchNSwipe.showControlHolder())
			if (TouchNSwipe.showControlHolder()) {/*Si salva l'ultimo stato della visibilità della caption per riprororla se viene mostrato il contorlHolder*/
				TouchNSwipe.objs[index].captionObj.show(TouchNSwipe.objs[index].captionObj.lastIsShow)

			}else{
				TouchNSwipe.objs[index].captionObj.lastIsShow=TouchNSwipe.objs[index].captionObj.show()
				TouchNSwipe.objs[index].captionObj.show(false)
				
			}
			TouchNSwipe.objs[index].thumbScroller.show(false)						
		}		
	}
	function onSliderClose(e)
	{
		var index = (!isNaN(e)) ? e : e.data.index;
		
		if(!TouchNSwipe.objs[index].removed)
		{
			var touchNSwipe = TouchNSwipe.objs[index].touchNSwipe;
					
			touchNSwipe.show(false);
			
			closeButtonToggleOnObj = TouchNSwipe.objs[index].closeButtonToggleOnObj;
			closeButton = TouchNSwipe.objs[index].closeButton;
		
			if(closeButton != undefined )
			{
				TweenMax.set(closeButton, closeButtonToggleOnObj);
			}
			
		}
	}
	
	function onSliderZoom(index)
	{
		if(index >= 0 && index < TouchNSwipe.objs.length && !TouchNSwipe.objs[index].removed)
		{
			setZoomButtonState(index);
		}
	}
	
	function toggleThumbs(e)
	{
		var index = e.data.index;
		
		if(index >= 0 && index < TouchNSwipe.objs.length && !TouchNSwipe.objs[index].removed && TouchNSwipe.objs[index].thumbsToggleAllow)
		{
			TouchNSwipe.objs[index].thumbsToggleAllow = false;
			var show = TouchNSwipe.objs[index].thumbScroller.show;
			
			show(!show());
			TweenMax.to(TouchNSwipe.objs[index].thumbsToggleTweenObj, TouchNSwipe.objs[index].buttonDelay, {onComplete:enableThumbsToggle, onCompleteParams:[index]});
		}
	}
	
	function enableThumbsToggle(index)
	{
		if(!TouchNSwipe.objs[index].removed)
		{
			TouchNSwipe.objs[index].thumbsToggleAllow = true;
		}
	}
	
	function onThumbsToggle(index)
	{
		if(index >= 0 && index < TouchNSwipe.objs.length && !TouchNSwipe.objs[index].removed)
		{
			var show = TouchNSwipe.objs[index].thumbScroller.show;
			
			if(show())
			{
				TweenMax.set(TouchNSwipe.objs[index].thumbsToggleButton, TouchNSwipe.objs[index].thumbsToggleOnObj);
			}
			else
			{
				TweenMax.set(TouchNSwipe.objs[index].thumbsToggleButton, TouchNSwipe.objs[index].thumbsToggleOffObj);
			}
		}
	}
	
	function toggleAutoPlay(e)
	{
		var index = e.data.index;
		
		if(!TouchNSwipe.objs[index].removed)
		{
			var autoPlay = TouchNSwipe.objs[index].slider.autoPlay;
		
			autoPlay(!autoPlay());
		}
	}
	
	function onSliderAutoPlay(index)
	{
		if(!TouchNSwipe.objs[index].removed)
		{
			var autoPlay = TouchNSwipe.objs[index].slider.autoPlay;
		
			if(autoPlay())
			{
				TweenMax.set(TouchNSwipe.objs[index].autoPlayButton, TouchNSwipe.objs[index].autoPlayOnObj);
			}
			else
			{
				TweenMax.set(TouchNSwipe.objs[index].autoPlayButton, TouchNSwipe.objs[index].autoPlayOffObj);
			}
		}
	}
	
	function toggleCaption(e)
	{
		console.log('toggle')
		var index = e.data.index;
		
		if(!TouchNSwipe.objs[index].removed && TouchNSwipe.objs[index].captionAllow )
		{
			TouchNSwipe.objs[index].captionAllow = false;
			TouchNSwipe.objs[index].captionObj.show(!TouchNSwipe.objs[index].captionObj.show());
			TweenMax.to(TouchNSwipe.objs[index].captionTweenObj, TouchNSwipe.objs[index].buttonDelay, {onComplete:enableCaption, onCompleteParams:[index]});
		}
	}
	
	function onCaptionToggle(index)
	{
		if(index >= 0 && index < TouchNSwipe.objs.length)
		{
			if(!TouchNSwipe.objs[index].removed)
			{
				var caption = TouchNSwipe.objs[index].captionObj,
					captionToggleButton = TouchNSwipe.objs[index].captionToggleButton,
					captionToggleOnObj = TouchNSwipe.objs[index].captionToggleOnObj,
					captionToggleOffObj = TouchNSwipe.objs[index].captionToggleOffObj;
				
				if(captionToggleButton != undefined && caption != undefined)
				{
					if(caption.show())
					{
						TweenMax.set(captionToggleButton, captionToggleOnObj);
					}
					else
					{
						TweenMax.set(captionToggleButton, captionToggleOffObj);
					}
				}
			}
		}
	}
	
	function enableCaption(index)
	{
		if(!TouchNSwipe.objs[index].removed)
		{
			TouchNSwipe.objs[index].captionAllow = true;
		}
	}
	
	function onPrev(e)
	{
		var index = e.data.index;
		
		if(!TouchNSwipe.objs[index].removed)
		{
			TouchNSwipe.objs[index].slider.zoom(1, 0);
			TouchNSwipe.objs[index].slider.prev(true);
		}
	}
	
	function onNext(e)
	{
		var index = e.data.index;
		
		if(!TouchNSwipe.objs[index].removed)
		{
			TouchNSwipe.objs[index].slider.zoom(1, 0);
			TouchNSwipe.objs[index].slider.next(true);
		}
	}
	
	function onZoomIn(e)
	{
		var index = e.data.index;
		
		if(!TouchNSwipe.objs[index].removed)
		{
			TouchNSwipe.objs[index].slider.zoomIn();
		}
	}
	
	function onZoomOut(e)
	{
		var index = e.data.index;
		
		if(!TouchNSwipe.objs[index].removed)
		{
			TouchNSwipe.objs[index].slider.zoomOut();
		}
	}
	
	function onIndexChange(from, index)
	{
		if(index >= 0 && index < TouchNSwipe.objs.length && !TouchNSwipe.objs[index].removed)
		{
			from = from || "slider";
			
			var slider = TouchNSwipe.objs[index].slider,
				thumbScroller = TouchNSwipe.objs[index].thumbScroller,
				thumbIndex = (thumbScroller !== undefined) ? thumbScroller.index() : -1,
				slideIndex = slider.index();
			
			if(thumbIndex != -1)
			{
				if(thumbIndex != slideIndex)
				{
					if(from == "slider")
					{
						thumbScroller.index(slideIndex);
					}
					else
					{
						slider.index(thumbIndex);
					}
				}
			}
			
			if(TouchNSwipe.objs[index].captionObj !== undefined)
			{
				TouchNSwipe.objs[index].captionObj.html(slider.caption);
			}
			setArrowButtonState(index);
			setImageLinkState(index);
		}
	}
	
	function setImageLinkState(index)
	{
		if(!TouchNSwipe.objs[index].removed)
		{
			var slider = TouchNSwipe.objs[index].slider;
			
			for(var i = 0; i < TouchNSwipe.linkObjs.length; i++)
			{
				if(!TouchNSwipe.linkObjs[i].removed)
				{
					var imageLinkSlider = TouchNSwipe.linkObjs[i].slider;
					if(imageLinkSlider == slider)
					{
						if(TouchNSwipe.linkObjs[i].index == imageLinkSlider.index())
						{
							TweenMax.set(TouchNSwipe.linkObjs[i].imageLink, TouchNSwipe.linkObjs[i].onObj);
						}
						else
						{
							TweenMax.set(TouchNSwipe.linkObjs[i].imageLink, TouchNSwipe.linkObjs[i].offObj);
						}
					}
				}
			}
		}
	}
	
	function setArrowButtonState(index)
	{
		if(index >= 0 && index < TouchNSwipe.objs.length  && !TouchNSwipe.objs[index].removed && !TouchNSwipe.objs[index].slider.vars.loop )
		{
			var curIndex = TouchNSwipe.objs[index].slider.index();
			
			if(curIndex == 0)
			{
				TweenMax.set(TouchNSwipe.objs[index].prevButton, TouchNSwipe.objs[index].prevOffObj);
			}
			else
			{
				TweenMax.set(TouchNSwipe.objs[index].prevButton, TouchNSwipe.objs[index].prevOnObj);
			}
			
			if(curIndex == TouchNSwipe.objs[index].slider.slides.length - 1)
			{
				TweenMax.set(TouchNSwipe.objs[index].nextButton, TouchNSwipe.objs[index].nextOffObj);
			}
			else
			{
				TweenMax.set(TouchNSwipe.objs[index].nextButton, TouchNSwipe.objs[index].nextOnObj);
			}
		}
	}
	
	function setZoomButtonState(index)
	{
		if(index >= 0 && index < TouchNSwipe.objs.length && !TouchNSwipe.objs[index].removed)
		{
			var curZoom = TouchNSwipe.objs[index].slider.zoom();
			
			if(curZoom == TouchNSwipe.objs[index].slider.actualMinZoom())
			{
				TweenMax.set(TouchNSwipe.objs[index].zoomOutButton, TouchNSwipe.objs[index].zoomOutOffObj);
			}
			else
			{
				TweenMax.set(TouchNSwipe.objs[index].zoomOutButton, TouchNSwipe.objs[index].zoomOutOnObj);
			}
			
			if(curZoom == TouchNSwipe.objs[index].slider.actualMaxZoom())
			{
				TweenMax.set(TouchNSwipe.objs[index].zoomInButton, TouchNSwipe.objs[index].zoomInOffObj);
			}
			else
			{
				TweenMax.set(TouchNSwipe.objs[index].zoomInButton, TouchNSwipe.objs[index].zoomInOnObj);
			}
		}
	}
	
	window.TouchNSwipe = TouchNSwipe;
	
}(window, jQuery));

jQuery(TouchNSwipe.init);