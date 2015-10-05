define("modules/environment",[],function(){return{tablet:["ipad","android","android 3.0","xoom","sch-i800","playbook","tablet","kindle"],handheld:["iphone","ipod","android","blackberry","opera","mini","windowssce","palm","smartphone","iemobile"],epicMobile:["android","iphone","ipod","acs","alav","alca","amoi","audi","aste","avan","benq","bird","blac","blaz","brew","cell","cldc","cmd-","dang","doco","eric","hipt","inno","ipaq","java","jigs","kddi","keji","leno","lg-c","lg-d","lg-g","lge-","maui","maxo","midp","mits","mmef","mobi","mot-","moto","mwbp","nec-","newt","noki","opwv","palm","pana","pant","pdxg","phil","play","pluc","port","prox","qtek","qwap","sage","sams","sany","sch-","sec-","send","seri","sgh-","shar","sie-","siem","smal","smar","sony","sph-","symb","t-mo","teli","tim-","tosh","tsm-","upg1","upsi","vk-v","voda","w3cs","wap-","wapa","wapi","wapp","wapr","webc","winw","winw","xda","xda-","up.browser","up.link","windowssce","iemobile","mini","mmp","symbian","midp","wap","phone","pocket","mobile","pda","psp"],isMobile:function(){var e=this.tablet.concat(this.handheld),t=e.join("|"),n=new RegExp(t,"i");return n.test(navigator.userAgent.toLowerCase())&&!/macintosh/i.test(navigator.userAgent.toLowerCase())},prefix:function(){var e=window.getComputedStyle(document.documentElement,""),t=(Array.prototype.slice.call(e).join("").match(/-(moz|webkit|ms)-/)||""===e.OLink&&["","o"])[1],n="WebKit|Moz|MS|O".match(new RegExp("("+t+")","i"))[1];return{dom:n,lowercase:t,css:"-"+t+"-",js:t[0].toUpperCase()+t.substr(1)}},orientation:function(){switch(window.orientation){case 0:case 180:return"portrait";case 90:case-90:return"landscape";default:return null}}}}),define("modules/reader",[],function(){return{components:[],currentPage:null,firstPage:null,lastPage:null,scrollPosition:{},endPosition:null,isScrolling:!1}}),define("modules/settings",["require","modules/environment"],function(e){var t=e("modules/environment");return{dev:!1,jsonPath:"/wp-content/themes/Fiktion/data/bookData.json",debug:!1,version:1,clearStorage:!1,local:!1,bookId:null,el:$("main"),container:$("#book-content"),chapters:$(".chapters"),defaultFontSize:30,fSize:100,fSizeIncrement:5,maxFontSize:function(){return t.isMobile()?130:150},minFontSize:function(){return t.isMobile()?50:70},contrast:"light",scrollSpeed:10,currentChapterIndex:null,chapterSelector:"[data-chapter]",chapterData:[],documentTitle:"Fiktion",bookSlug:""}}),define("modules/layout",["require","modules/environment","modules/settings"],function(e){var t=e("modules/environment"),n=e("modules/settings");return{targetContainerWidth:function(){var e=25*parseInt(n.el.css("font-size"),10),o=t.isMobile(),r=t.orientation();return o&&e>window.screen.width&&window.screen.width<=768&&"portrait"===r?window.screen.width:o&&e>window.screen.width&&window.screen.width<768&&"landscape"===r?window.screen.height:!o&&e>$(window).width()?$(window).width():e},targetContainerHeight:function(){var e=t.orientation();if(t.isMobile()&&$(window).width()<=568&&"landscape"===e)return 300;if(t.isMobile()&&$(window).width()<=568&&"portrait"===e)return window.screen.height/2.2;var o=9*parseInt(n.el.css("line-height"),10);return o},setFrameHeight:function(){var e=this.targetContainerHeight();n.el.css({height:e,maxHeight:e})},setFrameWidth:function(){var e=this.targetContainerWidth();n.el.css({width:e,maxWidth:e})},adjustFramePosition:function(){this.setFrameHeight(),this.setFrameWidth();var e=n.el;if(t.isMobile()&&$(window).width()<=568&&"landscape"===t.orientation())e.css({top:10,left:0});else{var o=$(window).width()<=480?$(window).height()/2-30:$(window).height()/2,r=$(window).width()/2,i=e.height()/2,a=e.width()/2,s=$(window).width()<=480?0:r-a,c={top:o-i,left:s};e.css(c)}this.adjustNavPosition();var l=parseInt(n.el.css("top"),10),u=parseInt(n.el.offset().top+n.el.height()-49,10);$("#shadow-top").css({top:l}),$("#shadow-bottom").css({top:u})},adjustNavPosition:function(){var e=n.el,o=$("nav"),r=e.position().left<=115,i=t.orientation();r&&$(window).width()>480?o.addClass("mobile").css({top:0,width:e.width()}):!r&&$(window).width()>480?o.removeClass("mobile").css({top:$(window).height()/2-$(".controls").height()/2,width:75}):"portrait"===i&&$(window).width()<=480?o.addClass("mobile").css({top:0,width:"auto"}):"landscape"===i&&$(window).width()<=480&&o.removeClass("mobile")},setStyles:function(){var e={fontSize:n.fSize+"%",lineHeight:"1.3"};n.el.css(e)},renderShadows:function(){return{shadowTop:$("<div/>",{id:"shadow-top"}),shadowBottom:$("<div/>",{id:"shadow-bottom",css:{top:parseInt(n.el.offset().top+n.el.height()-49,10)}})}}}}),define("modules/user-settings",["require","modules/reader","modules/settings"],function(e){var t=e("modules/reader"),n=e("modules/settings");return{updatedReaderData:function(){t[arguments[0]]=arguments[1]},updateUserData:function(){n[arguments[0]]=arguments[1]},updateLocalStorage:function(e,t,n,o){if(null!==localStorage.getItem(e)){if("undefined"==typeof t||"undefined"==typeof n)throw"Error: sys.updateLocalStorage() undefined argument";var r=JSON.parse(localStorage.getItem(e));"undefined"!=typeof o?r[t][n]=o:"undefined"==typeof o&&(r[t]=n),localStorage.setItem(e,JSON.stringify(r))}},saveLocation:function(){n.debug&&console.log("Saving current location"),this.updatedReaderData(n.bookId,"scrollPosition",t.currentPage,t.scrollPosition[t.currentPage]),t.scrollPosition[t.currentPage]=n.el.scrollTop(),this.updateLocalStorage(n.bookId,"scrollPosition",t.currentPage,t.scrollPosition[t.currentPage])},getFromLocalStorage:function(e,t,n){var o=JSON.parse(localStorage.getItem(e));return"undefined"!=typeof n?o[t][n]:o[t]},updateUserPreferences:function(){n.debug&&console.log("Updating user preferences");var e={fSize:n.fSize,contrast:n.contrast,scrollSpeed:n.scrollSpeed};localStorage.setItem("userPreferences",JSON.stringify(e))},getUserPreferences:function(){if(n.debug&&console.log("Getting User Preferences"),null!==localStorage.getItem("userPreferences")){var e=JSON.parse(localStorage.getItem("userPreferences"));$.extend(n,e)}else this.updateUserPreferences()},getLocation:function(){var e=n.bookId;if(null!==localStorage.getItem(e)){var o=JSON.parse(localStorage.getItem(e));t.currentPage=o.currentPage,$.extend(t.scrollPosition,o.scrollPosition)}else{var r={bookId:window.ebookAppData.uuid,currentPage:t.firstPage,scrollPosition:{}};t.currentPage=t.firstPage,t.scrollPosition[t.firstPage]=0,r.scrollPosition[t.firstPage]=0,localStorage.setItem(window.ebookAppData.uuid,JSON.stringify(r))}},goToPreviousLocation:function(){n.debug&&console.log("Going to previous location");var e=this.getFromLocalStorage(n.bookId,"scrollPosition",t.currentPage);setTimeout(function(){n.el.scrollTop(e)},50)},goToNextChapter:function(){}}}),define("modules/events",["require","modules/settings","modules/reader","modules/user-settings","modules/layout"],function(e){var t=e("modules/settings"),n=e("modules/reader"),o=e("modules/user-settings"),r=e("modules/layout"),i=function(){var e=this;this.eventHandlers={".play-btn, click":"playPause",".speed-inc, click":"speedIncrement",".speed-dec, click":"speedDecrement",".font-inc, click":"fontIncrement",".font-dec, click":"fontDecrement",".contrast-dark, click":"contrastToggle",".contrast-light, click":"contrastToggle",".full-screen, click":"toggleFullScreen","main a, click":"embeddedLinkClick"},this.bindEventHandlers=function(){$.each(e.eventHandlers,function(t,n){var o=t.split(","),r=n.split(","),i=$.trim(o[0]),a=$.trim(o[1]),s=$.trim(r[0]),c=r.slice(1);$(i).on(a,function(t){t&&"undefined"!=typeof t.originalEvent&&(c.push(t),t.preventDefault()),e[s].apply(e,c)})})},this.toggleFullScreen=function(){document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement?document.exitFullscreen?document.exitFullscreen():document.msExitFullscreen?document.msExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen():document.documentElement.requestFullscreen?document.documentElement.requestFullscreen():document.documentElement.msRequestFullscreen?document.documentElement.msRequestFullscreen():document.documentElement.mozRequestFullScreen?document.documentElement.mozRequestFullScreen():document.documentElement.webkitRequestFullscreen&&document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)},this.listenForPageChangeInterval=null,this.listenForPageChange=function(){var n=function(){$(document).trigger("updateNavIndicators")};null===e.listenForPageChangeInterval&&n();var o=Math.floor(parseInt($(t.el.first("p")).css("line-height"),10)),r=Math.floor(t.el.height()),i=100*Math.floor(o*r/t.scrollSpeed+1);window.clearInterval(e.listenForPageChangeInterval),e.listenForPageChangeInterval=setInterval(function(){n()},i)},this.playPause=function(){var t=$(".controls").find(".play-btn"),o=n.isScrolling;o?e.stopScrolling():e.startScrolling(),t.attr("data-state",o?"play":"pause")},this.requestAnim=null,this.ct=0,this.skip=null,this.getSkipInterval=function(){var n=100-t.scrollSpeed,o=n.toString().slice(-2),r=parseInt(o,10),i=6*r/30;e.skip=i},this.animateScroll=function(e,t){return setTimeout(function(){e[t].apply(e)},0)},this.readScroll=function(){return e.ct++,e.ct<e.skip?void(e.requestAnim=e.animateScroll(e,"readScroll")):(e.ct=0,t.el.scrollTop(t.el.scrollTop()+1),void(e.requestAnim=e.animateScroll(e,"readScroll")))},this.cursorTimer=null,this.cursorListener=function(){var t=$("html"),o=function(){t.removeClass("cursor-hidden")},r=function(){t.addClass("cursor-hidden")},i=function(){n.isScrolling&&(e.cursorTimer=setTimeout(function(){r()},2e3))};t.on({mousemove:function(){o(),window.clearTimeout(e.cursorTimer),i()}}),$("a").on({mouseenter:function(){window.clearTimeout(e.cursorTimer)},mouseleave:function(){i()}}),t.addClass("cursor-hidden")},this.startScrolling=function(){n.isScrolling||($(".controls").find(".play-btn").attr("data-state","pause"),null===e.skip&&e.getSkipInterval(),e.readScroll(),e.listenForPageChange(),n.isScrolling=!0)},this.stopScrolling=function(){n.isScrolling&&($(".controls").find(".play-btn").attr("data-state","play"),t.debug&&console.log("Stopped"),window.clearTimeout(e.requestAnim),window.clearInterval(e.listenForPageChangeInterval),n.isScrolling=!1)},this.speedIncrement=function(){e.stopScrolling(),t.scrollSpeed<100&&(t.scrollSpeed+=10,t.debug&&console.log("Reading speed incremented to "+t.scrollSpeed),o.updateUserPreferences()),e.getSkipInterval(),e.startScrolling()},this.speedDecrement=function(){e.stopScrolling(),t.scrollSpeed>10&&(t.scrollSpeed-=10,t.debug&&console.log("Reading speed decremented to "+t.scrollSpeed),o.updateUserPreferences()),e.getSkipInterval(),e.startScrolling()},this.isChapterEnd=function(){e.stopScrolling(),t.debug&&console.log("Chapter end")},this.hasEnded=!1,this.isBookEnd=function(){},this.fontIncrement=function(){if(t.fSize!==t.maxFontSize()){var e=t.fSize<t.maxFontSize()?t.fSize+t.fSizeIncrement:t.fSize;t.el.css("font-size",e+"%"),o.updateUserData("fSize",e),$(document).trigger("updateUi")}},this.fontDecrement=function(){if(t.fSize!==t.minFontSize()){var e=t.fSize>t.minFontSize()?t.fSize-t.fSizeIncrement:t.fSize;t.el.css("font-size",e+"%"),o.updateUserData("fSize",e),$(document).trigger("updateUi")}},this.contrastToggle=function(e){var t=e&&e.currentTarget?$(e.currentTarget).attr("data-contrast"):e,n=$("html");"dark"===t?(n.addClass("darkCss"),n.removeClass("lightCss")):"light"===t&&(n.addClass("lightCss"),n.removeClass("darkCss")),o.updateUserData("contrast",t),o.updateUserPreferences()},this.embeddedLinkClick=function(t){var n=$(t.currentTarget),r=n.attr("href"),i=function(e){return null!==e.match("^http")};i(r)?(t.stopPropagation(),e.stopScrolling(),n.attr("target","_blank")):(o.loadChapter(r),o.saveLocation())},this.orientationHasChanged=function(){if(t.debug)switch(window.orientation){case-90:case 90:console.log("Orientation has changed to landscape");break;default:console.log("Orientation has changed to portrait")}setTimeout(function(){r.adjustFramePosition(),window.pageYOffset&&window.scrollTo(0,0,1)},1),n.isScrolling&&(e.stopScrolling(),setTimeout(function(){e.startScrolling()},500))},this.countPages=function(){function o(){return Math.round(-(a.offset().top-r.offset().top)/i+1)}var r=t.el,i=r.height(),a=r.find("#page"),s=a.height(),c=$(".total-page-count"),l=$(".current-page-count");c.html(Math.round(s/i)),l.html(o()),o()>=Math.round(s/i)?n.currentPage===n.lastPage?e.isBookEnd():n.currentPage!==n.lastPage&&e.isChapterEnd():e.hasEnded=!1}};return new i}),define("modules/chapters",["require","modules/settings"],function(e){var t=e("modules/settings");return new function(){this.panels=t.chapterSelector,this.currentPos=!1,this.articles=[],this.updateState=function(){var e=this,n=e.getCurrentChapter();if(n&&n.slug){var o="#/"+t.bookSlug+"/"+n.slug;window.location.hash=o}},this.bindChapters=function(){var e=$.Deferred(),t=this,n=$([]).pushStack($("h1,h2,h3,h4,h5,h6")),o=$(window).scrollTop();return t.currentPos=!1,t.articles=[],$.map(n,function(r,i){var a=$(r),s={chapter:i,index:i,name:a.text(),slug:a.text().replace(/\s+/g,"-").replace(/[.,\/!@#$%^&*()+=?<>~`]/g,"_").toLowerCase(),posTop:n[i].offsetTop,firstEl:0===i?!0:!1,lastEl:i===n.length-1?!0:!1,prevEl:i-1>-1?n[i-1]:n[0],nextEl:i+1<=n.length-1?n[i+1]:n[n.length-1],prevPos:i-1>-1?n[i-1].offsetTop:0,nextPos:i+1<=n.length-1?n[i+1].offsetTop:n[i].offsetTop,currentEl:!1};a.data(s),t.articles.push(s),a.context.offsetTop>=o&&t.currentPos===!1&&(a.data().currentEl=!0,t.currentPos=a.context.offsetTop);for(var c in a.data())"object"!=typeof a.data()[c]&&a.attr("data-"+c,a.data()[c]);i===n.length-1&&e.resolve()}),e.promise()},this.getCurrentChapter=function(){var e,n=t.el.scrollTop(),o=200,r=$(t.chapterSelector);r.each(function(){var e=$(this),n=e.data(),o={posTop:n.posTop,nextPos:n.nextPos,index:n.index,name:n.name,slug:n.slug};t.chapterData.push(o)});for(var i=t.chapterData.length-1;i>=0;i--){var a=t.chapterData[i];n>=a.posTop-o&&n<a.nextPos&&(e=a)}return e},this.getChapterBySlug=function(e){for(var t=this,n=0;n<t.articles.length;n++)if(t.articles[n].slug===e)return t.articles[n];return!1},this.jumpToChapter=function(e,n){var o=this;$.when(o.bindChapters()).done(function(){var r,i,a=o.getChapterBySlug(e.toString());a&&(r=200,i=parseInt($('[data-slug="'+e+'"]').attr("data-postop"),10),t.el.scrollTop(i),n&&"function"==typeof n&&n())})},this.scrollToChapter=function(e,n){var o=this;o.bindChapters();var r,i=!1,a=t.el.scrollTop(),s=!1,c=!1,l=function(){var e=$.Deferred(),t=$(o.panels).length-1;return $(o.panels).each(function(n){var o=$(this),r=200,l=o.data().posTop,u=o.data().nextPos;o.attr("data-currentel",!1).data({currentEl:!1}),a>=l-r&&u>a&&i===!1&&(o.attr("data-currentel",!0).data({currentEl:!0}),i=l),n===t&&(i===!1&&(l>=a?($('[data-firstel="true"]').attr("data-currentel",!0).data({currentEl:!0}),s=!0):(o.attr("data-currentel",!0).data({currentEl:!0}),c=!0)),e.resolve())}),e.promise()};$.when(l()).done(function(){r=!1;var o=function(e){t.el.animate({scrollTop:e},{complete:function(){return r?void 0:(r=!0,void("function"==typeof n&&n()))}})};s===!0&&"prev"===e?o(0):s===!0&&"next"===e?o($('[data-firstel="true"]').data().posTop):s===!0||e?s!==!0&&o($('[data-currentel="true"]').data()[e+"Pos"]):o($('[data-currentel="true"]').data().posTop)})},this.appendNav=function(){var e=this,t=$("<a/>",{id:"chapter-prev","class":"chapter-nav","data-dir":"prev"}).on({click:function(t){t.preventDefault(),e.scrollToChapter($(this).data().dir,function(){$(document).trigger("updateNavIndicators")})}}).appendTo("body"),n=$("<a/>",{id:"chapter-next","class":"chapter-nav","data-dir":"next"}).on({click:function(t){t.preventDefault(),e.scrollToChapter($(this).data().dir,function(){$(document).trigger("updateNavIndicators")})}});$("body").append(t),$("body").append(n)}}}),$.fn.hoverIntent=function(e,t,n){var o={interval:100,sensitivity:7,timeout:0};o="object"==typeof e?$.extend(o,e):$.isFunction(t)?$.extend(o,{over:e,out:t,selector:n}):$.extend(o,{over:e,out:e,selector:t});var r,i,a,s,c=function(e){r=e.pageX,i=e.pageY},l=function(e,t){return t.hoverIntent_t=clearTimeout(t.hoverIntent_t),Math.abs(a-r)+Math.abs(s-i)<o.sensitivity?($(t).off("mousemove.hoverIntent",c),t.hoverIntent_s=1,o.over.apply(t,[e])):(a=r,s=i,t.hoverIntent_t=setTimeout(function(){l(e,t)},o.interval),void 0)},u=function(e,t){return t.hoverIntent_t=clearTimeout(t.hoverIntent_t),t.hoverIntent_s=0,o.out.apply(t,[e])},d=function(e){var t=jQuery.extend({},e),n=this;n.hoverIntent_t&&(n.hoverIntent_t=clearTimeout(n.hoverIntent_t)),"mouseenter"==e.type?(a=t.pageX,s=t.pageY,$(n).on("mousemove.hoverIntent",c),1!=n.hoverIntent_s&&(n.hoverIntent_t=setTimeout(function(){l(t,n)},o.interval))):($(n).off("mousemove.hoverIntent",c),1==n.hoverIntent_s&&(n.hoverIntent_t=setTimeout(function(){u(t,n)},o.timeout)))};return this.on({"mouseenter.hoverIntent":d,"mouseleave.hoverIntent":d},o.selector)},define("modules/../../vendor/hover-intent",function(){}),define("modules/hover",["require","modules/environment","modules/reader","modules/events","modules/settings","../../vendor/hover-intent"],function(e){var t=e("modules/environment"),n=e("modules/reader"),o=e("modules/events"),r=e("modules/settings"),i=(e("../../vendor/hover-intent"),function(){if(!t.isMobile()){var e,i,a=200;r.el.hoverIntent({over:function(){e=n.isScrolling,$("show-scroll-bar").length||r.el.addClass("show-scroll-bar"),e&&o.stopScrolling(),window.clearInterval(i),i=setInterval(function(){$(document).trigger("updateNavIndicators")},a)},out:function(){$(".show-scroll-bar").length&&!$("#userInput").is(":focus")&&r.el.removeClass("show-scroll-bar"),e&&o.startScrolling(),window.clearInterval(i)},interval:200,sensitivity:1,timeout:0})}});return new i}),define("modules/search",["require","modules/environment","modules/settings"],function(e){var t=e("modules/environment"),n=e("modules/settings");return function(){function e(){t.isMobile()||$(".mobile").length?r.hide():r.show()}function o(e){var t;if(window.find&&window.getSelection)t=window.getSelection(),t.rangeCount>0&&t.collapseToEnd(),window.find(e,0,0,1);else if(document.selection&&document.body.createTextRange){t=document.selection;var o;"Text"===t.type?(o=t.createRange(),o.collapse(!1)):(o=document.body.createTextRange(),o.collapse(!0)),o.findText(e)&&o.select()}$(t.anchorNode.parentElement).is(i)||n.el.scrollTop(t.anchorNode.parentElement.offsetTop)}var r=$(".search-wrapper"),i=$("#userInput"),a=$("#search"),s=$("#search-close");i.on({mouseenter:function(){i.focus().css({opacity:1}),s.css({opacity:1})},focus:function(){$(".show-scroll-bar").length||n.el.addClass("show-scroll-bar")},blur:function(){""===i.text()&&setTimeout(function(){i.css({opacity:0}),s.css({opacity:0}),$(".show-scroll-bar").length&&n.el.removeClass("show-scroll-bar")},1e3)}}),a.on({mouseenter:function(){i.focus().css({opacity:1}),s.css({opacity:1})},click:function(e){e.preventDefault();var t=i.text();o(t)}}),s.on("click",function(e){e.preventDefault(),i.blur().css({opacity:0}),s.css({opacity:0}),i.text("")}),$(window).resize(function(){e()}),$(document).on("keydown",function(e){13===e.which?(e.preventDefault(),a.triggerHandler("click")):27===e.which&&(e.preventDefault(),s.triggerHandler("click"))}),e()}()}),function(e,t){function n(){o.READY||(w.determineEventTypes(),v.each(o.gestures,function(e){b.register(e)}),w.onTouch(o.DOCUMENT,h,b.detect),w.onTouch(o.DOCUMENT,g,b.detect),o.READY=!0)}var o=function T(e,t){return new T.Instance(e,t||{})};o.VERSION="1.1.0dev",o.defaults={behavior:{userSelect:"none",touchAction:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},o.DOCUMENT=e.document,o.HAS_POINTEREVENTS=e.navigator.pointerEnabled||e.navigator.msPointerEnabled,o.HAS_TOUCHEVENTS="ontouchstart"in e,o.CALCULATE_INTERVAL=50;var r={},i=o.DIRECTION_DOWN="down",a=o.DIRECTION_LEFT="left",s=o.DIRECTION_UP="up",c=o.DIRECTION_RIGHT="right",l=o.POINTER_MOUSE="mouse",u=o.POINTER_TOUCH="touch",d=o.POINTER_PEN="pen",p=o.EVENT_START="start",h=o.EVENT_MOVE="move",g=o.EVENT_END="end",f=o.EVENT_RELEASE="release",m=o.EVENT_TOUCH="touch";o.READY=!1,o.plugins=o.plugins||{},o.gestures=o.gestures||{};var v=o.utils={extend:function(e,n,o){for(var r in n)e[r]!==t&&o||"returnValue"==r||(e[r]=n[r]);return e},on:function(e,t,n){e.addEventListener(t,n,!1)},off:function(e,t,n){e.removeEventListener(t,n,!1)},each:function(e,n,o){var r,i;if("forEach"in e)e.forEach(n,o);else if(e.length!==t){for(r=0,i=e.length;i>r;r++)if(n.call(o,e[r],r,e)===!1)return}else for(r in e)if(e.hasOwnProperty(r)&&n.call(o,e[r],r,e)===!1)return},inStr:function(e,t){return e.indexOf(t)>-1},inArray:function(e,t){if(e.indexOf){var n=e.indexOf(t);return-1===n?!1:n}for(var o=0,r=e.length;r>o;o++)if(e[o]===t)return o;return!1},toArray:function(e){return Array.prototype.slice.call(e,0)},hasParent:function(e,t){for(;e;){if(e==t)return!0;e=e.parentNode}return!1},getCenter:function(e){var t=[],n=[],o=[],r=[],i=Math.min,a=Math.max;return 1===e.length?{pageX:e[0].pageX,pageY:e[0].pageY,clientX:e[0].clientX,clientY:e[0].clientY}:(v.each(e,function(e){t.push(e.pageX),n.push(e.pageY),o.push(e.clientX),r.push(e.clientY)}),{pageX:(i.apply(Math,t)+a.apply(Math,t))/2,pageY:(i.apply(Math,n)+a.apply(Math,n))/2,clientX:(i.apply(Math,o)+a.apply(Math,o))/2,clientY:(i.apply(Math,r)+a.apply(Math,r))/2})},getVelocity:function(e,t,n){return{x:Math.abs(t/e)||0,y:Math.abs(n/e)||0}},getAngle:function(e,t){var n=t.clientX-e.clientX,o=t.clientY-e.clientY;return 180*Math.atan2(o,n)/Math.PI},getDirection:function(e,t){var n=Math.abs(e.clientX-t.clientX),o=Math.abs(e.clientY-t.clientY);return n>=o?e.clientX-t.clientX>0?a:c:e.clientY-t.clientY>0?s:i},getDistance:function(e,t){var n=t.clientX-e.clientX,o=t.clientY-e.clientY;return Math.sqrt(n*n+o*o)},getScale:function(e,t){return e.length>=2&&t.length>=2?this.getDistance(t[0],t[1])/this.getDistance(e[0],e[1]):1},getRotation:function(e,t){return e.length>=2&&t.length>=2?this.getAngle(t[1],t[0])-this.getAngle(e[1],e[0]):0},isVertical:function(e){return e==s||e==i},toggleBehavior:function(e,t,n){if(t&&e&&e.style){v.each(["webkit","moz","Moz","ms","o",""],function(o){v.each(t,function(t,r){o&&(r=o+r.substring(0,1).toUpperCase()+r.substring(1)),r in e.style&&(e.style[r]=!n&&t)})});var o=function(){return!1};"none"==t.userSelect&&(e.onselectstart=!n&&o),"none"==t.userDrag&&(e.ondragstart=!n&&o)}}},w=o.event={prevent_mouseevents:!1,started:!1,should_detect:!1,on:function(e,t,n,o){var r=t.split(" ");v.each(r,function(t){v.on(e,t,n),o&&o(t)})},off:function(e,t,n,o){var r=t.split(" ");v.each(r,function(t){v.off(e,t,n),o&&o(t)})},onTouch:function(e,t,n){var i=this,a=function(r){var a,s=r.type.toLowerCase(),c=o.HAS_POINTEREVENTS,l=v.inStr(s,"mouse");l&&i.prevent_mouseevents||(l&&t==p?(i.prevent_mouseevents=!1,i.should_detect=!0):t!=p||l||(i.prevent_mouseevents=!0,i.should_detect=!0),c&&t!=g&&S.updatePointer(t,r),i.should_detect&&(a=i.doDetect.call(i,r,t,e,n)),a==g?(i.prevent_mouseevents=!1,i.should_detect=!1,S.reset()):c&&t==g&&S.updatePointer(t,r))};return this.on(e,r[t],a),a},doDetect:function(e,t,n,o){var r=this.getTouchList(e,t),i=r.length,a=t,s=r.trigger,c=i;t==p?s=m:t==g&&(s=f,c=r.length-(e.changedTouches?e.changedTouches.length:1)),c>0&&this.started&&(a=h),this.started=!0;var l=this.collectEventData(n,a,r,e);return t!=g&&o.call(b,l),s&&(l.changedLength=c,l.eventType=s,o.call(b,l),l.eventType=a,delete l.changedLength),a==g&&(o.call(b,l),this.started=!1),a},determineEventTypes:function(){var t;return t=o.HAS_POINTEREVENTS?e.PointerEvent?["pointerdown","pointermove","pointerup pointercancel"]:["MSPointerDown","MSPointerMove","MSPointerUp MSPointerCancel"]:["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"],r[p]=t[0],r[h]=t[1],r[g]=t[2],r},getTouchList:function(e,t){if(o.HAS_POINTEREVENTS)return S.getTouchList();if(e.touches){if(t==h)return e.touches;var n=[],r=[].concat(v.toArray(e.touches),v.toArray(e.changedTouches)),i=[];return v.each(r,function(e){v.inArray(n,e.identifier)===!1&&i.push(e),n.push(e.identifier)}),i}return e.identifier=1,[e]},collectEventData:function(e,t,n,o){var r=u;return(v.inStr(o.type,"mouse")||S.matchType(l,o))&&(r=l),{center:v.getCenter(n),timeStamp:Date.now(),target:o.target,touches:n,eventType:t,pointerType:r,srcEvent:o,preventDefault:function(){var e=this.srcEvent;e.preventManipulation&&e.preventManipulation(),e.preventDefault&&e.preventDefault()},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return b.stopDetect()}}}},S=o.PointerEvent={pointers:{},getTouchList:function(){var e=[];return v.each(this.pointers,function(t){e.push(t)}),e},updatePointer:function(e,t){e==g?delete this.pointers[t.pointerId]:(t.identifier=t.pointerId,this.pointers[t.pointerId]=t)},matchType:function(e,t){if(!t.pointerType)return!1;var n=t.pointerType,o={};return o[l]=n===(t.MSPOINTER_TYPE_MOUSE||l),o[u]=n===(t.MSPOINTER_TYPE_TOUCH||u),o[d]=n===(t.MSPOINTER_TYPE_PEN||d),o[e]},reset:function(){this.pointers={}}},b=o.detection={gestures:[],current:null,previous:null,stopped:!1,startDetect:function(e,t){this.current||(this.stopped=!1,this.current={inst:e,startEvent:v.extend({},t),lastEvent:!1,lastCalcEvent:!1,futureCalcEvent:!1,lastCalcData:{},name:""},this.detect(t))},detect:function(e){if(this.current&&!this.stopped){e=this.extendEventData(e);var t=this.current.inst,n=t.options;return v.each(this.gestures,function(o){return!this.stopped&&t.enabled&&n[o.name]&&o.handler.call(o,e,t)===!1?(this.stopDetect(),!1):void 0},this),this.current&&(this.current.lastEvent=e),e.eventType==g&&this.stopDetect(),e}},stopDetect:function(){this.previous=v.extend({},this.current),this.current=null,this.stopped=!0},getCalculatedData:function(e,t,n,r,i){var a=this.current,s=!1,c=a.lastCalcEvent,l=a.lastCalcData;c&&e.timeStamp-c.timeStamp>o.CALCULATE_INTERVAL&&(t=c.center,n=e.timeStamp-c.timeStamp,r=e.center.clientX-c.center.clientX,i=e.center.clientY-c.center.clientY,s=!0),(e.eventType==m||e.eventType==f)&&(a.futureCalcEvent=e),(!a.lastCalcEvent||s)&&(l.velocity=v.getVelocity(n,r,i),l.angle=v.getAngle(t,e.center),l.direction=v.getDirection(t,e.center),a.lastCalcEvent=a.futureCalcEvent||e,a.futureCalcEvent=e),e.velocityX=l.velocity.x,e.velocityY=l.velocity.y,e.angle=l.angle,e.direction=l.direction},extendEventData:function(e){var t=this.current,n=t.startEvent,o=t.lastEvent||n;(e.eventType==m||e.eventType==f)&&(n.touches=[],v.each(e.touches,function(e){n.touches.push(v.extend({},e))}));var r=e.timeStamp-n.timeStamp,i=e.center.clientX-n.center.clientX,a=e.center.clientY-n.center.clientY;return this.getCalculatedData(e,o.center,r,i,a),v.extend(e,{startEvent:n,deltaTime:r,deltaX:i,deltaY:a,distance:v.getDistance(n.center,e.center),scale:v.getScale(n.touches,e.touches),rotation:v.getRotation(n.touches,e.touches)}),e},register:function(e){var n=e.defaults||{};return n[e.name]===t&&(n[e.name]=!0),v.extend(o.defaults,n,!0),e.index=e.index||1e3,this.gestures.push(e),this.gestures.sort(function(e,t){return e.index<t.index?-1:e.index>t.index?1:0}),this.gestures}};o.Instance=function(e,t){var r=this;n(),this.element=e,this.enabled=!0,this.options=v.extend(v.extend({},o.defaults),t||{}),this.options.behavior&&v.toggleBehavior(this.element,this.options.behavior,!1),this.eventStartHandler=w.onTouch(e,p,function(e){r.enabled&&e.eventType==p?b.startDetect(r,e):e.eventType==m&&b.detect(e)}),this.eventHandlers=[]},o.Instance.prototype={on:function(e,t){var n=this;return w.on(n.element,e,t,function(e){n.eventHandlers.push({gesture:e,handler:t})}),n},off:function(e,t){var n=this;return w.off(n.element,e,t,function(e){var o=v.inArray({gesture:e,handler:t});o!==!1&&n.eventHandlers.splice(o,1)}),n},trigger:function(e,t){t||(t={});var n=o.DOCUMENT.createEvent("Event");n.initEvent(e,!0,!0),n.gesture=t;var r=this.element;return v.hasParent(t.target,r)&&(r=t.target),r.dispatchEvent(n),this},enable:function(e){return this.enabled=e,this},dispose:function(){var e,t;for(this.options.behavior&&v.toggleBehavior(this.element,this.options.behavior,!0),e=-1;t=this.eventHandlers[++e];)v.off(this.element,t.gesture,t.handler);return this.eventHandlers=[],w.off(this.element,r[p],this.eventStartHandler),null}},function(e){function t(t,o){var r=b.current;if(!(o.options.drag_max_touches>0&&t.touches.length>o.options.drag_max_touches))switch(t.eventType){case p:n=!1;break;case h:if(t.distance<o.options.drag_min_distance&&r.name!=e)return;var l=r.startEvent.center;if(r.name!=e&&(r.name=e,o.options.correct_for_drag_min_distance&&t.distance>0)){var u=Math.abs(o.options.drag_min_distance/t.distance);l.pageX+=t.deltaX*u,l.pageY+=t.deltaY*u,l.clientX+=t.deltaX*u,l.clientY+=t.deltaY*u,t=b.extendEventData(t)}(r.lastEvent.drag_locked_to_axis||o.options.drag_lock_to_axis&&o.options.drag_lock_min_distance<=t.distance)&&(t.drag_locked_to_axis=!0);var d=r.lastEvent.direction;t.drag_locked_to_axis&&d!==t.direction&&(v.isVertical(d)?t.direction=t.deltaY<0?s:i:t.direction=t.deltaX<0?a:c),n||(o.trigger(e+"start",t),n=!0),o.trigger(e,t),o.trigger(e+t.direction,t);var m=v.isVertical(t.direction);(o.options.drag_block_vertical&&m||o.options.drag_block_horizontal&&!m)&&t.preventDefault();break;case f:n&&t.changedLength<=o.options.drag_max_touches&&(o.trigger(e+"end",t),n=!1);break;case g:n=!1}}var n=!1;o.gestures.Drag={name:e,index:50,handler:t,defaults:{drag_min_distance:10,correct_for_drag_min_distance:!0,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25}}}("drag"),o.gestures.Gesture={name:"gesture",index:1337,handler:function(e,t){t.trigger(this.name,e)}},function(e){function t(t,o){var r=o.options,i=b.current;switch(t.eventType){case p:clearTimeout(n),i.name=e,n=setTimeout(function(){i&&i.name==e&&o.trigger(e,t)},r.hold_timeout);break;case h:t.distance>r.hold_threshold&&clearTimeout(n);break;case f:clearTimeout(n)}}var n;o.gestures.Hold={name:e,index:10,defaults:{hold_timeout:500,hold_threshold:2},handler:t}}("hold"),o.gestures.Release={name:"release",index:1/0,handler:function(e,t){e.eventType==f&&t.trigger(this.name,e)}},o.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_min_touches:1,swipe_max_touches:1,swipe_velocity_x:.7,swipe_velocity_y:.6},handler:function(e,t){if(e.eventType==f){var n=e.touches.length,o=t.options;if(n<o.swipe_min_touches||n>o.swipe_max_touches)return;(e.velocityX>o.swipe_velocity_x||e.velocityY>o.swipe_velocity_y)&&(t.trigger(this.name,e),t.trigger(this.name+e.direction,e))}}},function(e){function t(t,o){var r,i,a=o.options,s=b.current,c=b.previous;switch(t.eventType){case p:n=!1;break;case h:n=n||t.distance>a.tap_max_distance;break;case g:"touchcancel"!=t.srcEvent.type&&t.deltaTime<a.tap_max_touchtime&&!n&&(r=c&&c.lastEvent&&t.timeStamp-c.lastEvent.timeStamp,i=!1,c&&c.name==e&&r&&r<a.doubletap_interval&&t.distance<a.doubletap_distance&&(o.trigger("doubletap",t),i=!0),(!i||a.tap_always)&&(s.name=e,o.trigger(s.name,t)))}}var n=!1;o.gestures.Tap={name:e,index:100,handler:t,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300}}}("tap"),o.gestures.Touch={name:"touch",index:-(1/0),defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(e,t){return t.options.prevent_mouseevents&&e.pointerType==l?void e.stopDetect():(t.options.prevent_default&&e.preventDefault(),void(e.eventType==m&&t.trigger("touch",e)))}},function(e){function t(t,o){switch(t.eventType){case p:n=!1;break;case h:if(t.touches.length<2)return;var r=Math.abs(1-t.scale),i=Math.abs(t.rotation);if(r<o.options.transform_min_scale&&i<o.options.transform_min_rotation)return;b.current.name=e,n||(o.trigger(e+"start",t),n=!0),o.trigger(e,t),i>o.options.transform_min_rotation&&o.trigger("rotate",t),r>o.options.transform_min_scale&&(o.trigger("pinch",t),o.trigger("pinch"+(t.scale<1?"in":"out"),t));break;case f:n&&t.changedLength<2&&(o.trigger(e+"end",t),
n=!1)}}var n=!1;o.gestures.Transform={name:e,index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1},handler:t}}("transform"),"function"==typeof define&&define.amd?define("modules/../../vendor/hammer",[],function(){return o}):"undefined"!=typeof module&&module.exports?module.exports=o:e.Hammer=o}(window),define("modules/mobile",["require","modules/reader","modules/settings","modules/events","../../vendor/hammer"],function(e){var t=e("modules/reader"),n=e("modules/settings"),o=e("modules/events"),r=e("../../vendor/hammer");return function(){n.el.css("overflow-y","scroll");var e,i=document.getElementsByTagName("body")[0],a=document.getElementById("main"),s=document.getElementsByClassName("controls")[0],c=t.isScrolling,l=!1,u=!1,d={behavior:{doubleTapInterval:200,contentZooming:"none",touchAction:"none",touchCallout:"none",userDrag:"none"},dragLockToAxis:!0,dragBlockHorizontal:!0},p=new r(i,d);p.on("touch release pinchin pinchout dragend doubletap tap",function(n){console.log(n);var r=$(n.target);l=!1,clearTimeout(e),r.is(".control-btn")||r.is(".chapter-nav")||r.is(a)||r.parents().is(a)?r.is(a)||r.parents().is(a)?"doubletap"===n.type?(l=!0,n.stopPropagation(),n.gesture.stopPropagation(),c=t.isScrolling,c?o.stopScrolling():o.startScrolling()):"touch"===n.type&&n.gesture.touches.length<2?e=setTimeout(function(){n.stopPropagation(),n.gesture.stopPropagation(),c=t.isScrolling,u=!0,c&&!l&&o.stopScrolling()},150):"release"===n.type?u&&(n.gesture.stopPropagation(),o.countPages(),c&&u&&setTimeout(function(){u=!1,o.startScrolling()},200)):"pinchin"===n.type?(console.log("pinchin"),n.stopPropagation(),n.gesture.stopPropagation(),o.fontDecrement(),c&&o.startScrolling(),n.gesture.stopDetect()):"pinchout"===n.type?(n.stopPropagation(),n.gesture.stopPropagation(),o.fontIncrement(),c&&o.startScrolling(),n.gesture.stopDetect()):"dragend"===n.type&&n.gesture.touches.length<2&&(n.preventDefault(),n.stopPropagation(),n.gesture.preventDefault(),n.gesture.stopPropagation(),n.gesture.distance>=70&&"right"===n.gesture.direction?(n.gesture.stopDetect(),o.speedIncrement()):n.gesture.distance>=70&&"left"===n.gesture.direction&&(n.gesture.stopDetect(),o.speedDecrement())):r.parents().is(s)&&(n.stopPropagation(),n.gesture.stopPropagation()):(n.preventDefault(),n.stopPropagation(),n.gesture.preventDefault(),n.gesture.stopPropagation(),n.gesture.stopDetect())})}}),define("modules/app",["require","modules/environment","modules/reader","modules/settings","modules/layout","modules/user-settings","modules/events","modules/chapters","modules/hover","modules/search","modules/mobile"],function(e){var t=e("modules/environment"),n=e("modules/reader"),o=e("modules/settings"),r=e("modules/layout"),i=e("modules/user-settings"),a=e("modules/events"),s=e("modules/chapters"),c=(e("modules/hover"),e("modules/search"),e("modules/mobile"));return function(e){var l=e;this.init=function(){function e(e){$.each(e,function(e,t){$("<li/>",{html:$("<a/>",{text:t.title,href:t.src,click:function(e){e.preventDefault(),i.saveLocation(),i.goToPreviousLocation()}})}).appendTo(o.chapters)}),o.debug&&console.log("JSON data added to DOM")}t.isMobile()&&new c,a.bindEventHandlers(),l&&$.extend(o,l),o.clearStorage&&!localStorage.refreshed?(localStorage.clear(),localStorage.setItem("refreshed",!0),window.location.href=window.location.href):o.clearStorage&&localStorage.refreshed&&localStorage.removeItem("refreshed"),window.addEventListener("orientationchange",a.orientationHasChanged),window.onunload=window.onbeforeunload=function(){$("html, body").scrollTop(0);var e=!1;return function(){e||(e=!0,o.clearStorage||(i.saveLocation(),i.updateUserPreferences()))}}(),$(window).on("resize",function(){var e;e=setInterval(function(){clearInterval(e),$(document).trigger("updateUi")},200)}),$.event.trigger({type:"udpateUi"},{type:"uiReady"},{type:"updateNavIndicators"},{type:"updateState"}),$(document).on("updateUi",function(){s.bindChapters(),r.adjustFramePosition(),i.updateUserPreferences(),a.countPages()});var u=!1;$(document).on("uiReady",function(){u=!0;var e,t=window.location.hash.split("/")[2];clearTimeout(e),e=setTimeout(function(){t&&s.jumpToChapter(t)},0)}),$(document).on("updateNavIndicators",function(){a.countPages(),u&&s.updateState()}),$(document).on("updateState",function(){s.updateState()});var d={},p=o.jsonPath;$.when($.get(p,{bust:window.ebookAppData.urlArgs},function(e){if($.each(e,function(){if(this.uuid===window.ebookAppData.uuid){var e=this.components[0];o.bookId=this.uuid,i.updatedReaderData("components",e),i.updatedReaderData("currentPage",e.src),i.updatedReaderData("firstPage",e.src),i.updatedReaderData("lastPage",e.src)}}),null===n.currentPage)if(localStorage&&!localStorage.refreshed)window.onunload=window.onbeforeunload=function(){},localStorage.clear(),localStorage.setItem("refreshed",!0),window.location.href=window.location.href;else if(localStorage&&localStorage.refreshed)return localStorage.removeItem("refreshed"),window.location.href="/404",!1;i.updateLocalStorage(o.bookId,"currentPage",n.currentPage)})).then(function(){$.when($.get(n.currentPage,{bust:window.ebookAppData.urlArgs},function(e){d.html=e}),$.get(window.ebookAppData.relPath+"/components/style/global-style.css",{bust:window.ebookAppData.urlArgs},function(e){d.css=e})).then(function(){e(n.components),$("<style />").html(d.css).appendTo("head"),o.el.html($("<section/>",{id:"page",css:{margin:0,padding:0,border:0},html:d.html}))}).then(function(){i.getLocation(),i.getUserPreferences(),i.goToPreviousLocation(),r.setStyles(),r.adjustFramePosition(),a.contrastToggle(o.contrast),a.countPages(),a.cursorListener();var e=r.renderShadows();o.el.append(e.shadowTop),o.el.append(e.shadowBottom),$(".controls, .runner-help, .runner-page-count, #page, .search-wrapper").animate({opacity:1},200),$(".spinner").fadeOut(200,function(){setTimeout(function(){a.startScrolling()},50)}),$("h1,h2,h3,h4,h5,h6").length&&(s.appendNav(),$(".chapter-nav").animate({opacity:1},200)),$.when(s.bindChapters()).done(function(){$(document).trigger("uiReady")})})})}}}),require.config({baseUrl:"./"}),require(["modules/app"],function(e){var t={dev:!1,jsonPath:null!==window.location.href.match(/^http:\/\/local/)?"http://localhost:8080/data/bookData.json":"/wp-content/themes/Fiktion/data/bookData.json",debug:!1,clearStorage:!1,scrollSpeed:10},n=window.ebookAppData||{},o=$.extend({},t,n),r=new e(o);$("html").removeClass("no-js").addClass("cursor js"),r.init()}),define("main",function(){});