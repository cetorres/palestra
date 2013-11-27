// JavaScript Document
/*************************************************
Star Rating System
First Version: 21 November, 2006
Author: Ritesh Agrawal
Inspriation: Will Stuckey's star rating system (http://sandbox.wilstuckey.com/jquery-ratings/)
Demonstration: http://php.scripts.psu.edu/rja171/widgets/rating.php
Usage: $('#rating').rating('www.url.to.post.com', {maxvalue:5, curvalue:0});

arguments
url : required -- post changes to 
options
	maxvalue: number of stars
	curvalue: number of selected stars
	

************************************************/

function getCookie(c_name)
{
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1)
	{
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1)
	{
		c_value = null;
	}
	else
	{
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1)
		{
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

jQuery.fn.rating = function(url, tipo, local, options) {
	
	if(url == null) return;
	
	var settings = {
        url       : url, // post changes to 
        maxvalue  : 5,   // max number of stars
        curvalue  : 0    // number of selected stars
    };
	
    if(options) {
       jQuery.extend(settings, options);
    };
   
   	jQuery.extend(settings, {cancel: (settings.maxvalue > 1) ? true : false});   
   
   	var container = jQuery(this);
   
   	container.html("");
	
	jQuery.extend(container, {
    	averageRating: settings.curvalue,
        url: settings.url
    });

	for(var i= 0; i <= settings.maxvalue ; i++) {
		var size = i
        if (i == 0) {
			// if(settings.cancel == true){
// 	             var div = '<div class="cancel"><a href="#0" title="Cancelar Avaliação">Cancelar Avaliação</a></div>';
// 				 container.append(div);
// 			}
        } 
		else {
             var div = '<div class="star"><a href="#'+i+'" title="Avalie em '+i+'/'+size+'">'+i+'</a></div>';
			 container.append(div);

        }
	}
	
	var stars = jQuery(container).children('.star');
    var cancel = jQuery(container).children('.cancel'); 
	
	var event = {
		fill: function(el){ // fill to the current mouse position.
			var index = stars.index(el) + 1;
			stars
				.children('a').css('width', '100%').end()
				.slice(0,index).addClass('hover').end();
		},
		drain: function() { // drain all the stars.
			stars
				.filter('.on').removeClass('on').end()
				.filter('.hover').removeClass('hover').end();
		},
		reset: function(){ // Reset the stars to the default index.
			stars.slice(0,settings.curvalue).addClass('on').end();
		}
	}        
	event.reset();   

	if (url != '') {
	    stars
	        .mouseover(function(){
	            event.drain();
	            event.fill(this);
	        })
	        .mouseout(function(){
	            event.drain();
	            event.reset();
	        })
	        .focus(function(){
	            event.drain();
	            event.fill(this)
	        })
	        .blur(function(){
	            event.drain();
	            event.reset();
	        });
			
	    stars.click(function(){
			if(settings.cancel == true){
	            settings.curvalue = stars.index(this) + 1;
				
				// Grava cookie
				setCookie('palestra_' + local + '_' + tipo, settings.curvalue, 365);
	            
				jQuery.post(container.url, {
	                "rating": jQuery(this).children('a')[0].href.split('#')[1],
					"tipo"  : tipo,
					"local" : local
	            });
				return false;
			}
			else if(settings.maxvalue == 1){
				settings.curvalue = (settings.curvalue == 0) ? 1 : 0;
				
				// Grava cookie
				setCookie('palestra_' + local + '_' + tipo, settings.curvalue, 365);
				
				$(this).toggleClass('on');
				jQuery.post(container.url, {
	                "rating": jQuery(this).children('a')[0].href.split('#')[1],
					"tipo"  : tipo,
					"local" : local
	            });
				return false;
			}
			return true;
			
	    });

	    // cancel button events
		if(cancel){
	        cancel
	            .mouseover(function(){
	                event.drain();
	                jQuery(this).addClass('on')
	            })
	            .mouseout(function(){
	                event.reset();
	                jQuery(this).removeClass('on')
	            })
	            .focus(function(){
	                event.drain();
	                jQuery(this).addClass('on')
	            })
	            .blur(function(){
	                event.reset();
	                jQuery(this).removeClass('on')
	            });
        
	        // click events.
	        cancel.click(function(){
	            event.drain();
				settings.curvalue = 0;
				
				// Grava cookie
				setCookie('palestra_' + local + '_' + tipo, settings.curvalue, 365);
				
	            jQuery.post(container.url, {
	                "rating": jQuery(this).children('a')[0].href.split('#')[1],
					"tipo"  : tipo,
					"local" : local 
	            });
	            return false;
	        });
		}
        
		
	}
	else {
		stars
			.children('a').css('width', '100%').end()
			.slice(0,settings.curvalue).addClass('hover').end();
        
	}
	
	
	
	return(this);	

}