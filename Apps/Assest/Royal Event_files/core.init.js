/* global jQuery:false */
/* global ROYAL_EVENT_STORAGE:false */

jQuery(document).ready(function() {
	"use strict";
	ROYAL_EVENT_STORAGE['theme_init_counter'] = 0;
	royal_event_init_actions();

	// Disable init VC prettyPhoto on the gallery images
	window.vc_prettyPhoto = function() {};
});

jQuery(window).on('beforeunload', function() {
	"use strict";
	// Show preloader
	if (jQuery.browser && !jQuery.browser.safari) jQuery('#page_preloader').css({display: 'block', opacity: 0}).animate({opacity:0.8}, 300);
});


// Theme init actions
function royal_event_init_actions() {
	"use strict";

	if (ROYAL_EVENT_STORAGE['vc_edit_mode'] && jQuery('.vc_empty-placeholder').length==0 && ROYAL_EVENT_STORAGE['theme_init_counter']++ < 30) {
		setTimeout(royal_event_init_actions, 200);
		return;
	}
	
	// Hide preloader
	jQuery('#page_preloader').animate({opacity:0}, 500, function() { jQuery(this).css({display: 'none'}); });

	// Check for Retina display
	if (royal_event_is_retina()) {
		royal_event_set_cookie('royal_event_retina', 1, 365);
	}

	royal_event_ready_actions();

	// Add resize handlers after VC row stretch handlers on('resize.vcRowBehaviour', ...)
	setTimeout(function() {
		jQuery(window).on('resize.royal_event', function() {
			royal_event_resize_actions();
			royal_event_scroll_actions()
		}).trigger('resize.royal_event');
	}, 10);

	// Add resize on VC action vc-full-width-row
	jQuery(document).on('vc-full-width-row', function() {
		royal_event_resize_actions();
		royal_event_scroll_actions()
	});

	// Scroll handlers
	jQuery(window).on('scroll.royal_event', function() {
		"use strict";
		royal_event_scroll_actions();
	});
}



// Theme first load actions
//==============================================
function royal_event_ready_actions() {
	"use strict";

	// Call theme specific action (if exists)
    //----------------------------------------------
	if (window.royal_event_theme_ready_actions) royal_event_theme_ready_actions();


	// Widgets decoration
    //----------------------------------------------

	// Decorate nested lists in widgets and side panels
	jQuery('.widget ul > li').each(function() {
		"use strict";
		if (jQuery(this).find('ul').length > 0) {
			jQuery(this).addClass('has_children');
		}
	});


	// Archive widget decoration
	jQuery('.widget_archive a').each(function() {
		"use strict";
		var val = jQuery(this).html().split(' ');
		if (val.length > 1) {
			val[val.length-1] = '<span>' + val[val.length-1] + '</span>';
			jQuery(this).html(val.join(' '))
		}
	});


	// Navigate on category change
	jQuery('.widget_subcategories').on('change', 'select', function() {
		"use strict";
		var dropdown = jQuery(this).get(0);
		if ( dropdown.options[dropdown.selectedIndex].value > 0 ) {
			location.href = ROYAL_EVENT_STORAGE['site_url'] + "/?cat="+dropdown.options[dropdown.selectedIndex].value;
		}
	});

	
	// Calendar handlers - change months
	jQuery('.widget_calendar, .wp-block-calendar').on('click', '.month_prev a, .month_next a', function(e) {
		"use strict";
		var calendar = jQuery(this).parents('.wp-calendar');
		var m = jQuery(this).data('month');
		var y = jQuery(this).data('year');
		var l = jQuery(this).data('letter');
		var pt = jQuery(this).data('type');
		jQuery.post(ROYAL_EVENT_STORAGE['ajax_url'], {
			action: 'calendar_change_month',
			nonce: ROYAL_EVENT_STORAGE['ajax_nonce'],
			letter: l,
			month: m,
			year: y,
			post_type: pt
		}).done(function(response) {
			var rez = {};
			try {
				rez = JSON.parse(response);
			} catch (e) {
				rez = { error: ROYAL_EVENT_STORAGE['ajax_error'] };
				console.log(response);
			}
			if (rez.error === '') {
				calendar.parent().fadeOut(200, function() {
					jQuery(this).find('.wp-calendar').remove();
					jQuery(this).append(rez.data).fadeIn(200);
				});
			}
		});
		e.preventDefault();
		return false;
	});


	// Media setup
    //----------------------------------------------

	// Video background init
	jQuery('.video_bg').each(function() {
		"use strict";
		var youtube = jQuery(this).data('youtube-code');
		if (youtube) {
			jQuery(this).tubular({videoId: youtube});
		}
	});


	// Main slider
    //----------------------------------------------
	jQuery('.slider_over_button,.slider_over_close').on('click', function(e) {
		"use strict";
		jQuery(this).parent().toggleClass('opened');
		e.preventDefault();
		return false;
	});



	// Menu
    //----------------------------------------------
	
	// hide header mobile
	if (jQuery('.header_mobile').length > 0) {
		jQuery('.header_mobile .menu_main_nav a').each(function (){
			"use strict";
			var href = jQuery(this).attr('href');
			if (href===undefined) return;
			var aHref = jQuery(this).attr('href').indexOf("#");
			if ( (aHref >= 0) && (href.length >1) ) {
				jQuery(this).addClass('anchorClose');
			}
		});
	}
	// Clone side menu for responsive
	"use strict";
	if (jQuery('ul#menu_side').length > 0) {
		jQuery('ul#menu_side').clone().removeAttr('id').removeClass('menu_side_nav').addClass('menu_side_responsive').insertAfter('ul#menu_side');
		royal_event_show_current_menu_item(jQuery('.menu_side_responsive'), jQuery('.sidebar_outer_menu_responsive_button'));
	}
	if (jQuery('.header_mobile').length > 0) {
		jQuery('.header_mobile .menu_main_nav_area ul#menu_main').removeAttr('id');
		jQuery('.header_mobile .menu_button').on('click', function(){
			jQuery('.header_mobile .side_wrap').toggleClass('open');
			jQuery('.header_mobile .mask').toggleClass('show');
			jQuery('html').toggleClass('menu_mobile_open');
			// Fix for Safari
			if (royal_event_browser_is_ios() && jQuery('body').hasClass('menu_mobile')) {
				jQuery('body').toggleClass('ios_fixed');
			}
		});
		jQuery('.header_mobile .mask, .header_mobile .side_wrap .close, .anchorClose').on('click', function(){
			jQuery('.header_mobile .side_wrap').removeClass('open');
			jQuery('.header_mobile .mask').removeClass('show');
			jQuery('html').removeClass('menu_mobile_open');
			// Fix for Safari
			if (royal_event_browser_is_ios() && jQuery('body').hasClass('menu_mobile')) {
				jQuery('body').removeClass('ios_fixed');
			}
		});
	}

	// Push menu button
	jQuery('.menu_pushy_button').on('click', function(e){
		"use strict";
		jQuery('body').addClass('pushy-active').css('overflow', 'hidden');
		jQuery('.site-overlay').fadeIn('fast');
		e.preventDefault();
		return false;
	});
	jQuery('.pushy .close-pushy,.site-overlay').on('click', function(e){
		jQuery('body').removeClass('pushy-active').css('overflow', 'visible');
		jQuery('.site-overlay').fadeOut('fast');
		e.preventDefault();
		return false;
	});
	
	// Side menu widgets button
	jQuery('.sidebar_outer_widgets_button').on('click', function(e){
		"use strict";
		jQuery('.sidebar_outer_widgets').slideToggle();
		e.preventDefault();
		return false;
	});

	// Add arrows in responsive menu
	jQuery('.header_mobile .menu_main_nav .menu-item-has-children > a, .menu_side_responsive .menu-item-has-children > a, .menu_pushy_nav_area .menu-item-has-children > a, body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories .has_children > a').prepend('<span class="open_child_menu"></span>');

	// Submenu click handler for the responsive menu
	jQuery('.header_mobile .menu_main_nav, .menu_side_responsive, .menu_pushy_nav_area, body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories').on('click', 'li a,li a .open_child_menu, ul.product-categories.plain li a .open_child_menu', function(e) {
		"use strict";
		var is_menu_main = jQuery(this).parents('.menu_main_nav').length > 0;
		var $a = jQuery(this).hasClass('open_child_menu') ? jQuery(this).parent() : jQuery(this);
		if ((!is_menu_main || jQuery('body').hasClass('menu_mobile')) && ($a.parent().hasClass('menu-item-has-children') || $a.parent().hasClass('has_children'))) {
			if ($a.siblings('ul:visible').length > 0)
				$a.siblings('ul').slideUp().parent().removeClass('opened');
			else {
				jQuery(this).parents('li').siblings('li').find('ul:visible').slideUp().parent().removeClass('opened');
				$a.siblings('ul').slideDown().parent().addClass('opened');
			}
		}
		// Ignore link for parent menu items
		if (jQuery(this).hasClass('open_child_menu') || $a.attr('href')=='#') {
			e.preventDefault();
			return false;
		}
	});
	
	// Init superfish menus
	royal_event_init_sfmenu('.menu_main_nav_area ul#menu_main, ul#menu_user, ul#menu_side, body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories');

	// Slide effect for main menu
	if (ROYAL_EVENT_STORAGE['menu_hover']=='slide_line' || ROYAL_EVENT_STORAGE['menu_hover']=='slide_box') {
		setTimeout(function() {
			"use strict";
			jQuery('#menu_main').spasticNav({
				style: ROYAL_EVENT_STORAGE['menu_hover']=='slide_line' ? 'line' : 'box',
				color: ROYAL_EVENT_STORAGE['accent1_hover'],
				colorOverride: false
			});
		}, 500);
	}

	// Show table of contents for the current page
	if (ROYAL_EVENT_STORAGE['toc_menu'] != 'hide' && ROYAL_EVENT_STORAGE['toc_menu'] != 'no') {
		royal_event_build_page_toc();
	}

	// One page mode for menu links (scroll to anchor)
	jQuery('#toc, ul#menu_main li, ul#menu_user li, ul#menu_side li, ul#menu_footer li, ul#menu_pushy li').on('click', 'a', function(e) {
		"use strict";
		var href = jQuery(this).attr('href');
		if (href===undefined) return;
		var pos = href.indexOf('#');
		if (pos < 0 || href.length == 1) return;
		if (jQuery(href.substr(pos)).length > 0) {
			var loc = window.location.href;
			var pos2 = loc.indexOf('#');
			if (pos2 > 0) loc = loc.substring(0, pos2);
			var now = pos==0;
			if (!now) now = loc == href.substring(0, pos);
			if (now) {
				royal_event_document_animate_to(href.substr(pos));
				royal_event_document_set_location(pos==0 ? loc + href : href);
				e.preventDefault();
				return false;
			}
		}
	});
	
	
	// Store height of the top and side panels
	ROYAL_EVENT_STORAGE['top_panel_height'] = 0;
	ROYAL_EVENT_STORAGE['side_panel_height'] = 0;


	// Pagination
    //----------------------------------------------

	// Page navigation (style slider)
	jQuery('.pager_cur').on('click', function(e) {
		"use strict";
		jQuery('.pager_slider').slideDown(300, function() {
			royal_event_sc_init(jQuery('.pager_slider').eq(0));
		});
		e.preventDefault();
		return false;
	});


	// View More button
	jQuery('#viewmore_link').on('click', function(e) {
		"use strict";
		if (!ROYAL_EVENT_STORAGE['viewmore_busy'] && !jQuery(this).hasClass('viewmore_empty')) {
			jQuery(this).parent().addClass('loading');
			ROYAL_EVENT_STORAGE['viewmore_busy'] = true;
			jQuery.post(ROYAL_EVENT_STORAGE['ajax_url'], {
				action: 'view_more_posts',
				nonce: ROYAL_EVENT_STORAGE['ajax_nonce'],
				page: ROYAL_EVENT_STORAGE['viewmore_page']+1,
				data: ROYAL_EVENT_STORAGE['viewmore_data'],
				vars: ROYAL_EVENT_STORAGE['viewmore_vars']
			}).done(function(response) {
				"use strict";
				var rez = {};
				try {
					rez = JSON.parse(response);
				} catch (e) {
					rez = { error: ROYAL_EVENT_STORAGE['ajax_error'] };
					console.log(response);
				}
				jQuery('#viewmore_link').parent().removeClass('loading');
				ROYAL_EVENT_STORAGE['viewmore_busy'] = false;
				if (rez.error === '') {
					var posts_container = jQuery('.content').eq(0);
					if (posts_container.find('.isotope_wrap').length > 0) posts_container = posts_container.find('.isotope_wrap').eq(0);
					if (posts_container.hasClass('isotope_wrap')) {
						posts_container.data('last-width', 0).append(rez.data);
						ROYAL_EVENT_STORAGE['isotope_init_counter'] = 0;
						royal_event_init_appended_isotope(posts_container, rez.filters);
					} else
						jQuery('#viewmore').before(rez.data);

					ROYAL_EVENT_STORAGE['viewmore_page']++;
					if (rez.no_more_data==1) {
						jQuery('#viewmore_link').addClass('viewmore_empty').parent().hide();
					}

					royal_event_init_post_formats();
					royal_event_sc_init(posts_container);
					royal_event_scroll_actions();
				}
			});
		}
		e.preventDefault();
		return false;
	});


	// WooCommerce
    //----------------------------------------------

	// Change display mode
	jQuery('.woocommerce,.woocommerce-page').on('click', '.mode_buttons a', function(e) {
		"use strict";
		var mode = jQuery(this).hasClass('woocommerce_thumbs') ? 'thumbs' : 'list';
        royal_event_set_cookie('royal_event_shop_mode', mode, 365);
		jQuery(this).siblings('input').val(mode).parents('form').get(0).submit();
		e.preventDefault();
		return false;
	});
    // Add buttons to quantity on first run
    if (jQuery('.woocommerce div.quantity .q_inc,.woocommerce-page div.quantity .q_inc').length == 0) {
        var woocomerce_inc_dec = '<span class="q_inc"></span><span class="q_dec"></span>';
        jQuery('.woocommerce div.quantity,.woocommerce-page div.quantity').append(woocomerce_inc_dec);
        jQuery('.woocommerce div.quantity,.woocommerce-page div.quantity').on('click', '>span', function(e) {
            woocomerce_inc_dec_click(jQuery(this));
            e.preventDefault();
            return false;
        });
    }
	// Add buttons to quantity after the cart is updated
    jQuery(document.body).on('updated_wc_div', function() {
        if (jQuery('.woocommerce div.quantity .q_inc,.woocommerce-page div.quantity .q_inc').length == 0) {
            jQuery('.woocommerce div.quantity,.woocommerce-page div.quantity').append(woocomerce_inc_dec);
            jQuery('.woocommerce div.quantity,.woocommerce-page div.quantity').on('click', '>span', function(e) {
                woocomerce_inc_dec_click(jQuery(this));
                e.preventDefault();
                return false;
            });
        }
    });
	// Inc/Dec quantity on buttons inc/dec
    function woocomerce_inc_dec_click(button) {
        var f = button.siblings('input');
		if (button.hasClass( 'q_inc' )) {
			f.val( ( f.val() == '' ? 0 : parseInt( f.val(), 10 ) ) + 1 ).trigger( 'change' );
		} else {
			f.val( Math.max( 0, ( f.val() == '' ? 0 : parseInt( f.val(), 10 ) ) - 1 ) ).trigger( 'change' );
		}
    }

    // Show cart
	jQuery('.top_panel_middle .top_panel_cart_button, .header_mobile .top_panel_cart_button').on('click', function(e) {
		"use strict";
		jQuery(this).siblings('.sidebar_cart').slideToggle();
		e.preventDefault();
		return false;
	});
	// Add stretch behaviour to WooC tabs area
	jQuery('.single-product .woocommerce-tabs')
		.addClass('trx-stretch-width scheme_light')
		.after('<div class="trx-stretch-width-original"></div>');
	royal_event_stretch_width();

	// Added to cart
	jQuery( document.body ).on('added_to_cart', function() {
		"use strict";
		royal_event_update_cart();
	});

// Removed from cart
	jQuery( document.body ).on( 'removed_from_cart', function (){
		"use strict";
		royal_event_update_cart();
	});

	// Update cart display
	function royal_event_update_cart(){
		// Update amount on the cart button
		var total = jQuery('.widget_shopping_cart').eq(0).find('.total .amount').text();
		if (total != undefined) {
			jQuery('.top_panel_cart_button .cart_summa').text(total);
		}
		// Update count items on the cart button
		var cnt = 0;
		jQuery('.widget_shopping_cart_content').eq(0).find('.cart_list li').each(function() {
			var q = jQuery(this).find('.quantity').html().split(' ', 2);
			if (!isNaN(q[0]))
				cnt += Number(q[0]);
		});
		var items = jQuery('.top_panel_cart_button .cart_items').eq(0).text().split(' ', 2);
		items[0] = cnt;
		jQuery('.top_panel_cart_button .cart_items').text(items[0]+' '+items[1]);
		// Update data-attr on button
		jQuery('.top_panel_cart_button').attr({
			'data-items': cnt ? cnt : 0,
			'data-summa': total ? total : 0
		});
	}


	// Popup login and register windows
    //----------------------------------------------
	jQuery('.popup_link,.popup_login_link,.popup_register_link').addClass('inited').on('click', function(e){
		var popup = jQuery(jQuery(this).attr('href'));
		if (popup.length === 1) {
			royal_event_hide_popup(jQuery(popup.hasClass('popup_login') ? '.popup_registration' : '.popup_login' ));
			royal_event_show_popup(popup);
		}
		e.preventDefault();
		return false;
	});
	jQuery('.popup_wrap').on('click', '.popup_close', function(e){
		var popup = jQuery(this).parent();
		if (popup.length === 1) {
			royal_event_hide_popup(popup);
		}
		e.preventDefault();
		return false;
	});



	// Bookmarks
    //----------------------------------------------

	// Add bookmark
	jQuery('.bookmarks_add').on('click', function(e) {
		"use strict";
		var title = window.document.title.split('|')[0];
		var url = window.location.href;
		var list = royal_get_cookie('royal_bookmarks');
		var exists = false;
		if (list) {
			try {
				list = JSON.parse(list);
			} catch (e) {}
			if (list.length) {
				for (var i=0; i<list.length; i++) {
					if (list[i].url == url) {
						exists = true;
						break;
					}
				}
			}
		} else
			list = new Array();
		if (!exists) {
			var message_popup = royal_event_message_dialog('<label for="bookmark_title">'+ROYAL_EVENT_STORAGE['strings']['bookmark_title']+'</label><br><input type="text" id="bookmark_title" name="bookmark_title" value="'+title+'">', ROYAL_EVENT_STORAGE['strings']['bookmark_add'], null,
				function(btn, popup) {
					"use strict";
					if (btn != 1) return;
					title = message_popup.find('#bookmark_title').val();
					list.push({title: title, url: url});
					jQuery('.bookmarks_list').append('<li><a href="'+url+'" class="bookmarks_item">'+title+'<span class="bookmarks_delete icon-cancel" title="'+ROYAL_EVENT_STORAGE['strings']['bookmark_del']+'"></span></a></li>');
					royal_get_cookie('royal_event_bookmarks', JSON.stringify(list), {expires: 365, path: '/'});
					setTimeout(function () {royal_event_message_success(ROYAL_EVENT_STORAGE['strings']['bookmark_added'], ROYAL_EVENT_STORAGE['strings']['bookmark_add']);}, ROYAL_EVENT_STORAGE['message_timeout']/4);
				});
		} else
			royal_event_message_warning(ROYAL_EVENT_STORAGE['strings']['bookmark_exists'], ROYAL_EVENT_STORAGE['strings']['bookmark_add']);
		e.preventDefault();
		return false;
	});

	// Delete bookmark
	jQuery('.bookmarks_list').on('click', '.bookmarks_delete', function(e) {
		"use strict";
		var idx = jQuery(this).parent().index();
		var list = jQuery.cookie('royal_event_bookmarks');
		if (list) {
			try {
				list = JSON.parse(list);
			} catch (e) {}
			if (list.length) {
				list.splice(idx, 1);
				jQuery.cookie('royal_event_bookmarks', JSON.stringify(list), {expires: 365, path: '/'});
			}
		}
		jQuery(this).parent().remove();
		e.preventDefault();
		return false;
	});


	// Other settings
    //------------------------------------

	// Scroll to top button
	jQuery('.scroll_to_top').on('click', function(e) {
		"use strict";
		jQuery('html,body').animate({
			scrollTop: 0
		}, 'slow');
		e.preventDefault();
		return false;
	});

	// AJAX views counter
	if (ROYAL_EVENT_STORAGE['ajax_views_counter'] !== undefined) {
		setTimeout(function(){
			jQuery.post(ROYAL_EVENT_STORAGE['ajax_url'], {
				action: 'post_counter',
				nonce: ROYAL_EVENT_STORAGE['ajax_nonce'],
				post_id: ROYAL_EVENT_STORAGE['ajax_views_counter']['post_id'],
				views: ROYAL_EVENT_STORAGE['ajax_views_counter']['post_views']
			});
			}, 10);
	}

    // Show system message
	royal_event_show_system_message();

	// Init post format specific scripts
	royal_event_init_post_formats();

	// Call sc init action (if exists)
	if (window.royal_event_sc_init_actions) royal_event_sc_init_actions();

	// Init hidden elements (if exists)
	if (window.royal_event_init_hidden_elements) royal_event_init_hidden_elements(jQuery('body').eq(0));

		// Contact Form 7 popup message
		royal_rental_cf7_init();
	
} //end ready

// Contact Form 7 popup message
function royal_rental_cf7_init(e, container) {
	if (container === undefined) container = jQuery('body');
	if (container.length === undefined || container.length === 0) return;
	
	container.find('.wpcf7:not(.alert_inited)').each( function() {
		var $form = jQuery(this);
		// Decorate messages
		$form
			.addClass('alert_inited')
			.on('wpcf7:submit wpcf7submit', function(e, details) {
				var response = $form.find('.wpcf7-response-output');
				if ( response.length ) {
					response
						.addClass('royal_rental_message_box')
						.removeClass('royal_rental_message_box_info royal_rental_message_box_error royal_rental_message_box_success');
					if ( typeof e == 'object' && typeof e.detail == 'object' && typeof e.detail.status != 'undefined' ) {
						if ( e.detail.status == 'validation_failed' ) {
							response.addClass('royal_rental_message_box_error');
						} else if ( e.detail.status == 'mail_sent' ) {
							response.addClass('royal_rental_message_box_success');
						} else {
							response.addClass('royal_rental_message_box_info');
						}
					}
					response.fadeIn();
				}
			})
			.on('click keypress change', function() {
				$form.find('.wpcf7-response-output:visible').fadeOut();
			} );
		// Remove validation tip and class on any key pressed in the field
		$form
			.on('change', 'input,select,textarea', function() {
				var $self = jQuery(this),
					$wrap = $self.parents('.wpcf7-not-valid');
				if ( $self.val() !== '' ) {
					if ( $self.hasClass( 'wpcf7-not-valid' ) ) {
						$self.removeClass('wpcf7-not-valid');
					} else if ( $wrap.length > 0 ) {
						$wrap.removeClass('wpcf7-not-valid');
					}
				}
			});
	} );
}

// Increment arrows on number input
function royal_event_wooc_style_arrows() {
    "use strict";
    // Add buttons to quantity
    jQuery('.woocommerce div.quantity,.woocommerce-page div.quantity').append('<span class="q_inc"></span><span class="q_dec"></span>');
    jQuery('.woocommerce div.quantity').on('click', '>span', function(e) {
        var f = jQuery(this).siblings('input');
        if (jQuery(this).hasClass('q_inc')) {
            f.val(Math.max(0, parseInt(f.val()))+1);
        } else {
            f.val(Math.max(1, Math.max(0, parseInt(f.val()))-1));
        }
        e.preventDefault();
        return false;
    });
}


// Scroll actions
//==============================================

// Do actions when page scrolled
function royal_event_scroll_actions() {
	"use strict";
	
	// Call theme specific action (if exists)
    //----------------------------------------------
	var scroll_offset = jQuery(window).scrollTop();
	var scroll_to_top_button = jQuery('.scroll_to_top');
	var adminbar_height = Math.max(0, jQuery('#wpadminbar').height());

	if (ROYAL_EVENT_STORAGE['top_panel_height'] < 1) {
		ROYAL_EVENT_STORAGE['top_panel_height'] = Math.max(0, jQuery('.top_panel_wrap').height());
	}
	
	// Scroll to top button show/hide
	if (scroll_offset > ROYAL_EVENT_STORAGE['top_panel_height'])
		scroll_to_top_button.addClass('show');
	else
		scroll_to_top_button.removeClass('show');
	
	// Fix/unfix top panel
	if (!jQuery('body').hasClass('menu_mobile') && ROYAL_EVENT_STORAGE['menu_fixed']) {
		var slider_height = 0;
		if (jQuery('.top_panel_below .slider_wrap').length > 0) {
			slider_height = jQuery('.top_panel_below .slider_wrap').height();
			if (slider_height < 10) {
				slider_height = jQuery('.slider_wrap').hasClass('.slider_fullscreen') ? jQuery(window).height() : ROYAL_EVENT_STORAGE['slider_height'];
			}
		}
		if (scroll_offset <= slider_height + ROYAL_EVENT_STORAGE['top_panel_height']) {
			if (jQuery('body').hasClass('top_panel_fixed')) {
				jQuery('body').removeClass('top_panel_fixed');
			}
		} else if (scroll_offset > slider_height + ROYAL_EVENT_STORAGE['top_panel_height']) {
			if (!jQuery('body').hasClass('top_panel_fixed') && jQuery(document).height() > jQuery(window).height()*1.5) {
				jQuery('.top_panel_fixed_wrap').height(ROYAL_EVENT_STORAGE['top_panel_height']);
				jQuery('.top_panel_wrap').css('marginTop', '-150px').animate({'marginTop': 0}, 500);
				jQuery('body').addClass('top_panel_fixed');
			}
		}
	}
	
	// Fix/unfix side panel
	if (jQuery('.sidebar_outer').length > 0) {
		if (ROYAL_EVENT_STORAGE['side_panel_height'] == 0)	
			ROYAL_EVENT_STORAGE['side_panel_height'] = jQuery('.sidebar_outer_logo_wrap').outerHeight() + jQuery('.sidebar_outer_menu').outerHeight() + jQuery('.sidebar_outer_widgets').outerHeight();
		if (scroll_offset + jQuery(window).height() > ROYAL_EVENT_STORAGE['side_panel_height'] + 100) {
			if (jQuery('.sidebar_outer').css('position')!=='fixed') {
				jQuery('.sidebar_outer').css({
					'position': 'fixed',
					'top': Math.min(0, jQuery(window).height() - ROYAL_EVENT_STORAGE['side_panel_height'] - 100) + 'px',
				});
			}
		} else {
			if (jQuery('.sidebar_outer').css('position')=='fixed') {
				jQuery('.sidebar_outer').css({
					'position': 'absolute',
					'top': 0
				});
			}
		}
	}

	// TOC current items
	jQuery('#toc .toc_item').each(function() {
		"use strict";
		var id = jQuery(this).find('a').attr('href');
		var pos = id.indexOf('#');
		if (pos < 0 || id.length == 1) return;
		var loc = window.location.href;
		var pos2 = loc.indexOf('#');
		if (pos2 > 0) loc = loc.substring(0, pos2);
		var now = pos==0;
		if (!now) now = loc == href.substring(0, pos);
		if (!now) return;
		var off = jQuery(id).offset().top;
		var id_next  = jQuery(this).next().find('a').attr('href');
		var off_next = id_next ? jQuery(id_next).offset().top : 1000000;
		if (off < scroll_offset + jQuery(window).height()*0.8 && scroll_offset + ROYAL_EVENT_STORAGE['top_panel_height'] < off_next)
			jQuery(this).addClass('current');
		else
			jQuery(this).removeClass('current');
	});
	
	// Infinite pagination
	royal_event_infinite_scroll()
	
	// Parallax scroll
	royal_event_parallax_scroll();

	// Call sc scroll actions (if exists)
	if (window.royal_event_sc_scroll_actions) royal_event_sc_scroll_actions();
}


// Infinite Scroll
function royal_event_infinite_scroll() {
	"use strict";
	if (ROYAL_EVENT_STORAGE['viewmore_busy']) return;
	var infinite = jQuery('#viewmore.pagination_infinite');
	if (infinite.length > 0) {
		var viewmore = infinite.find('#viewmore_link:not(.viewmore_empty)');
		if (viewmore.length > 0) {
			if (jQuery(window).scrollTop() + jQuery(window).height() + 100 >= infinite.offset().top) {
				viewmore.eq(0).trigger('click');
			}
		}
	}
}

// Parallax scroll
function royal_event_parallax_scroll(){
    "use strict";
	jQuery('.sc_parallax').each(function(){
		var windowHeight = jQuery(window).height();
		var scrollTops = jQuery(window).scrollTop();
		var offsetPrx = Math.max(jQuery(this).offset().top, windowHeight);
		if ( offsetPrx <= scrollTops + windowHeight ) {
			var speed  = Number(jQuery(this).data('parallax-speed'));
			var xpos   = jQuery(this).data('parallax-x-pos');  
			var ypos   = Math.round((offsetPrx - scrollTops - windowHeight) * speed + (speed < 0 ? windowHeight*speed : 0));
			jQuery(this).find('.sc_parallax_content').css('backgroundPosition', xpos+' '+ypos+'px');
			// Uncomment next line if you want parallax video (else - video position is static)
			jQuery(this).find('div.sc_video_bg').css('top', ypos+'px');
		} 
	});
}





// Resize actions
//==============================================

// Do actions when page scrolled
function royal_event_resize_actions() {
	"use strict";

	// Call theme specific action (if exists)
    //----------------------------------------------
	// Reset stored value
	ROYAL_EVENT_STORAGE['top_panel_height'] = 0;

	royal_event_responsive_menu();
	royal_event_vc_row_fullwidth_to_boxed();
	royal_event_video_dimensions();
	royal_event_resize_video_background();
	royal_event_resize_fullscreen_slider();
	royal_event_resize_alter_portfolio();
	royal_event_stretch_width();

	// Call sc resize actions (if exists)
	if (window.royal_event_sc_resize_actions) royal_event_sc_resize_actions();
}

// Stretch area to full window width
function royal_event_stretch_width() {
    "use strict";
	jQuery('.trx-stretch-width').each(function() {
		var $el = jQuery(this);
		var $el_full = $el.next('.trx-stretch-width-original');
		var el_margin_left = parseInt( $el.css( 'margin-left' ), 10 );
		var el_margin_right = parseInt( $el.css( 'margin-right' ), 10 );
		var offset = 0 - $el_full.offset().left - el_margin_left;
		var width = jQuery( window ).width();
		if (!$el.hasClass('inited')) {
			$el.addClass('inited invisible');
			$el.css({
				'position': 'relative',
				'box-sizing': 'border-box'
			});
		}
		$el.css({
			'left': offset,
			'width': jQuery( window ).width()
		});
		if ( !$el.hasClass('trx-stretch-content') ) {
			var padding = Math.max(0, -1*offset);
			var paddingRight = Math.max(0, width - padding - $el_full.width() + el_margin_left + el_margin_right);
			$el.css( { 'padding-left': padding + 'px', 'padding-right': paddingRight + 'px' } );
		}
		$el.removeClass('invisible');
	});
}

// Width vc_row when content boxed
function royal_event_vc_row_fullwidth_to_boxed(){
	"use strict";
   if (jQuery('body').hasClass('body_style_boxed')) {
       var width_body = jQuery('body').width();
       var width_content = jQuery('.page_wrap').width();
       var width_content_wrap = jQuery('.page_content_wrap  .content_wrap').width();
       var indent = ( width_content - width_content_wrap ) / 2;
	   if ( width_body > width_content ){
		   jQuery('.vc_row[data-vc-full-width="true"]').each( function() {
				"use strict";
				var mrg = parseInt(jQuery(this).css('marginLeft'));
				jQuery(this).css({
					'width': width_content,
					'left': -indent-mrg,
					'padding-left': indent+mrg,
					'padding-right': indent+mrg
				});
				if (jQuery(this).attr('data-vc-stretch-content')) {
				   jQuery(this).css({
					   'padding-left': 0,
					   'padding-right': 0
				   });
				}
		   });
	   }
   }
}

// Check window size and do responsive menu
function royal_event_responsive_menu() {
	"use strict";
	if (royal_event_is_responsive_need(ROYAL_EVENT_STORAGE['menu_mobile'])) {
		if (!jQuery('body').hasClass('menu_mobile')) {
			jQuery('body').removeClass('top_panel_fixed').addClass('menu_mobile');
			jQuery('header.top_panel_wrap ').hide();
			jQuery('.header_mobile').show();
			
			jQuery('header #popup_login').attr('id', 'popup_login_1');
			jQuery('header #popup_registration').attr('id', 'popup_registration_1');
			jQuery('.header_mobile #popup_login_1').attr('id', 'popup_login');
			jQuery('.header_mobile #popup_registration_1').attr('id', 'popup_registration');
		}
	} else {
		if (jQuery('body').hasClass('menu_mobile')) {
			jQuery('body').removeClass('menu_mobile');
			jQuery('header.top_panel_wrap ').show();
			jQuery('.header_mobile').hide();
			
			jQuery('header #popup_login_1').attr('id', 'popup_login');
			jQuery('header #popup_registration_1').attr('id', 'popup_registration');
			jQuery('.header_mobile #popup_login').attr('id', 'popup_login_1');
			jQuery('.header_mobile #popup_registration').attr('id', 'popup_registration_1');
		}
	}
	
	if (jQuery(window).width() < 640) {
		var pass = jQuery('.header_mobile .popup_wrap.popup_registration .registration_form > .form_right');
		if(pass.length > 0){ 
			jQuery('.header_mobile .popup_wrap.popup_registration .form_left .popup_form_field.email_field').after(pass);
		}
	}
	else{
		var pass = jQuery('.header_mobile .popup_wrap.popup_registration .form_left > .form_right');
		if(pass.length > 0){ 
			jQuery('.header_mobile .popup_wrap.popup_registration .registration_form').append(pass);
		}
	}

	if (!jQuery('.top_panel_wrap').hasClass('menu_show')) jQuery('.top_panel_wrap').addClass('menu_show');
	// Show widgets block on the sidebar outer (if sidebar not responsive and widgets are hidden)
	if (jQuery('.sidebar_outer').length > 0 && jQuery('.sidebar_outer').css('position')=='absolute' && jQuery('.sidebar_outer_widgets:visible').length==0) 
		jQuery('.sidebar_outer_widgets').show();
	// Switch popup menu / hierarchical list on product categories list placed in sidebar
	var cat_menu = jQuery('body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories');
	var sb = cat_menu.parents('.widget_area');
	if (sb.length > 0 && cat_menu.length > 0) {
		if (sb.width() == sb.parents('.content_wrap').width()) {
			if (cat_menu.hasClass('inited')) {
				cat_menu.removeClass('inited').addClass('plain').superfish('destroy');
				cat_menu.find('ul.animated').removeClass('animated').addClass('no_animated');
			}
		} else {
			if (!cat_menu.hasClass('inited')) {
				cat_menu.removeClass('plain').addClass('inited');
				cat_menu.find('ul.no_animated').removeClass('no_animated').addClass('animated');
				royal_event_init_sfmenu('body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories');
			}
		}
	}
}


// Check if responsive menu need
function royal_event_is_responsive_need(max_width) {
	"use strict";
	var rez = false;
	if (max_width > 0) {
		var w = window.innerWidth;
		if (w == undefined) {
			w = jQuery(window).width()+(jQuery(window).height() < jQuery(document).height() || jQuery(window).scrollTop() > 0 ? 16 : 0);
		}
		rez = max_width > w;
	}
	return rez;
}


// Fit video frames to document width
function royal_event_video_dimensions() {
    "use strict";
	jQuery('.sc_video_frame').each(function() {
		"use strict";
		if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
		var frame  = jQuery(this).eq(0);
		var player = frame.parent();
		var ratio = (frame.data('ratio') ? frame.data('ratio').split(':') : (frame.find('[data-ratio]').length>0 ? frame.find('[data-ratio]').data('ratio').split(':') : [16,9]));
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var w_attr = frame.data('width');
		var h_attr = frame.data('height');
		if (!w_attr || !h_attr) return;
		var percent = (''+w_attr).substr(-1)=='%';
		w_attr = parseInt(w_attr);
		h_attr = parseInt(h_attr);
		var w_real = Math.min(percent || frame.parents('.columns_wrap').length>0 ? 10000 : w_attr, frame.parents('div,article').width()),
			h_real = Math.round(percent ? w_real/ratio : w_real/w_attr*h_attr);
		if (parseInt(frame.attr('data-last-width'))==w_real) return;
		if (percent) {
			frame.height(h_real);
		} else {
			frame.css({'width': w_real+'px', 'height': h_real+'px'});
		}
		frame.attr('data-last-width', w_real);

    });
	jQuery('video.sc_video,video.wp-video-shortcode').each(function() {
        "use strict";
		if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
		var video = jQuery(this).eq(0);
		var ratio = (video.data('ratio')!=undefined ? video.data('ratio').split(':') : [16,9]);
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var mejs_cont = video.parents('.mejs-video');
		var frame = video.parents('.sc_video_frame');
		var w_attr = frame.length>0 ? frame.data('width') : video.data('width');
		var h_attr = frame.length>0 ? frame.data('height') : video.data('height');
		if (!w_attr || !h_attr) {
			w_attr = video.attr('width');
			h_attr = video.attr('height');
			if (!w_attr || !h_attr) return;
			video.data({'width': w_attr, 'height': h_attr});
		}
		var percent = (''+w_attr).substr(-1)=='%';
		w_attr = parseInt(w_attr);
		h_attr = parseInt(h_attr);
		var w_real = Math.round(mejs_cont.length > 0 ? Math.min(percent ? 10000 : w_attr, mejs_cont.parents('div,article').width()) : video.width()),
			h_real = Math.round(percent ? w_real/ratio : w_real/w_attr*h_attr);
		if (parseInt(video.attr('data-last-width'))==w_real) return;
		if (mejs_cont.length > 0 && mejs) {
			royal_event_set_mejs_player_dimensions(video, w_real, h_real);
		}
		if (percent) {
			video.height(h_real);
		} else {
			video.attr({'width': w_real, 'height': h_real}).css({'width': w_real+'px', 'height': h_real+'px'});
		}
		video.attr('data-last-width', w_real);
	});
	jQuery('video.sc_video_bg').each(function() {
		"use strict";
		if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
		var video = jQuery(this).eq(0);
		var ratio = (video.data('ratio')!=undefined ? video.data('ratio').split(':') : [16,9]);
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var mejs_cont = video.parents('.mejs-video');
		var container = mejs_cont.length>0 ? mejs_cont.parent() : video.parent();
		var w = container.width();
		var h = container.height();
		var w1 = Math.ceil(h*ratio);
		var h1 = Math.ceil(w/ratio);
		if (video.parents('.sc_parallax').length > 0) {
			var windowHeight = jQuery(window).height();
			var speed = Number(video.parents('.sc_parallax').data('parallax-speed'));
			var h_add = Math.ceil(Math.abs((windowHeight-h)*speed));
			if (h1 < h + h_add) {
				h1 = h + h_add;
				w1 = Math.ceil(h1 * ratio);
			}
		}
		if (h1 < h) {
			h1 = h;
			w1 = Math.ceil(h1 * ratio);
		}
		if (w1 < w) { 
			w1 = w;
			h1 = Math.ceil(w1 / ratio);
		}
		var l = Math.round((w1-w)/2);
		var t = Math.round((h1-h)/2);
		if (parseInt(video.attr('data-last-width'))==w1) return;
		if (mejs_cont.length > 0) {
			royal_event_set_mejs_player_dimensions(video, w1, h1);
			mejs_cont.css({
				'top': -t+'px'
			});
		} else
			video.css({
				'top': -t+'px'
			});
		video.attr({'width': w1, 'height': h1, 'data-last-width':w1}).css({'width':w1+'px', 'height':h1+'px'});
		if (video.css('opacity')==0) video.animate({'opacity': 1}, 3000);
	});
	jQuery('iframe').each(function() {
		"use strict";
		if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
		var iframe = jQuery(this).eq(0);
		var ratio = (iframe.data('ratio')!=undefined ? iframe.data('ratio').split(':') : (iframe.find('[data-ratio]').length>0 ? iframe.find('[data-ratio]').data('ratio').split(':') : [16,9]));
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var w_attr = iframe.attr('width');
		var h_attr = iframe.attr('height');
		var frame = iframe.parents('.sc_video_frame');
		if (frame.length > 0) {
			w_attr = frame.data('width');
			h_attr = frame.data('height');
		}
		if (!w_attr || !h_attr) {
			return;
		}
		var percent = (''+w_attr).substr(-1)=='%';
		w_attr = parseInt(w_attr);
		h_attr = parseInt(h_attr);
		var w_real = frame.length > 0 ? frame.width() : iframe.width(),
			h_real = Math.round(percent ? w_real/ratio : w_real/w_attr*h_attr);
		if (parseInt(iframe.attr('data-last-width'))==w_real) return;
		iframe.css({'width': w_real+'px', 'height': h_real+'px'});
	});
}

// Resize fullscreen video background
function royal_event_resize_video_background() {
	"use strict";
	var bg = jQuery('.video_bg');
	if (bg.length < 1) 
		return;
	if (ROYAL_EVENT_STORAGE['media_elements_enabled'] && bg.find('.mejs-video').length == 0)  {
		setTimeout(royal_event_resize_video_background, 100);
		return;
	}
	var video = bg.find('video');
	var ratio = (video.data('ratio')!=undefined ? video.data('ratio').split(':') : [16,9]);
	ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
	var w = bg.width();
	var h = bg.height();
	var w1 = Math.ceil(h*ratio);
	var h1 = Math.ceil(w/ratio);
	if (h1 < h) {
		h1 = h;
		w1 = Math.ceil(h1 * ratio);
	}
	if (w1 < w) { 
		w1 = w;
		h1 = Math.ceil(w1 / ratio);
	}
	var l = Math.round((w1-w)/2);
	var t = Math.round((h1-h)/2);
	if (bg.find('.mejs-container').length > 0) {
		royal_event_set_mejs_player_dimensions(bg.find('video'), w1, h1);
		bg.find('.mejs-container').css({'left': -l+'px', 'top': -t+'px'});
	} else
		bg.find('video').css({'left': -l+'px', 'top': -t+'px'});
	bg.find('video').attr({'width': w1, 'height': h1}).css({'width':w1+'px', 'height':h1+'px'});
}

// Set Media Elements player dimensions
function royal_event_set_mejs_player_dimensions(video, w, h) {
	"use strict";
	if (mejs) {
		for (var pl in mejs.players) {
			if (mejs.players[pl].media.src == video.attr('src')) {
				if (mejs.players[pl].media.setVideoSize) {
					mejs.players[pl].media.setVideoSize(w, h);
				}
				mejs.players[pl].setPlayerSize(w, h);
				mejs.players[pl].setControlsSize();
			}
		}
	}
}

// Resize Fullscreen Slider
function royal_event_resize_fullscreen_slider() {
	"use strict";
	var slider_wrap = jQuery('.slider_wrap.slider_fullscreen');
	if (slider_wrap.length < 1) 
		return;
	var slider = slider_wrap.find('.sc_slider_swiper');
	if (slider.length < 1) 
		return;
	var h = jQuery(window).height() - jQuery('#wpadminbar').height() - (jQuery('body').hasClass('top_panel_above') && !jQuery('body').hasClass('.top_panel_fixed') ? jQuery('.top_panel_wrap').height() : 0);
	slider.height(h);
}

// Resize Alter portfolio elements
function royal_event_resize_alter_portfolio() {
	"use strict";
	var wrap = jQuery('.isotope_wrap.inited');
	if (wrap.length==0) return;
	wrap.each(function() {
		"use strict";
		var alter = jQuery(this).find('.post_item_alter');
		if (alter.length==0) return;
		var single = alter.find('.post_featured img[data-alter-items-w="1"]').eq(0);
		if (single.length != 1) return;
		var w_real = single.width();
		var h_real = single.height();
		var space = Number(single.data('alter-item-space'));
		var relayout = false;
		alter.find('.post_featured img').each(function() {
			"use strict";
			var items_w = Number(jQuery(this).data('alter-items-w'));
			var items_h = Number(jQuery(this).data('alter-items-h'));
			if (items_h > 1) {
				jQuery(this).height(Math.round(items_h*h_real+(items_h-1)*(space+1)));
				relayout = true;
			} else if (items_w > 1) {
				jQuery(this).height(h_real);
				relayout = true;
			}
		});
		if (relayout) {
			jQuery(this).isotope('layout');
		}
	});
}





// Navigation
//==============================================

// Init Superfish menu
function royal_event_init_sfmenu(selector) {
    "use strict";
	jQuery(selector).show().each(function() {
		if (royal_event_is_responsive_need() && (jQuery(this).attr('id')=='menu_main' || jQuery(this).attr('id')=='menu_side')) return;
		jQuery(this).addClass('inited').superfish({
			delay: 500,
			animation: {
				opacity: 'show'
			},
			animationOut: {
				opacity: 'hide'
			},
			speed: 		ROYAL_EVENT_STORAGE['css_animation'] ? 500 : 200,
			speedOut:	ROYAL_EVENT_STORAGE['css_animation'] ? 500 : 200,
			autoArrows: false,
			dropShadows: false,
			onBeforeShow: function(ul) {
				if (jQuery(this).parents("ul").length > 1){
					var w = jQuery(window).width();  
					var par_offset = jQuery(this).parents("ul").offset().left;
					var par_width  = jQuery(this).parents("ul").outerWidth();
					var ul_width   = jQuery(this).outerWidth();
					if (par_offset+par_width+ul_width > w-20 && par_offset-ul_width > 0)
						jQuery(this).addClass('submenu_left');
					else
						jQuery(this).removeClass('submenu_left');
				}
				if (ROYAL_EVENT_STORAGE['css_animation']) {
					jQuery(this).removeClass('animated fast '+ROYAL_EVENT_STORAGE['menu_animation_out']);
					jQuery(this).addClass('animated fast '+ROYAL_EVENT_STORAGE['menu_animation_in']);
				}
			},
			onBeforeHide: function(ul) {
				if (ROYAL_EVENT_STORAGE['css_animation']) {
					jQuery(this).removeClass('animated fast '+ROYAL_EVENT_STORAGE['menu_animation_in']);
					jQuery(this).addClass('animated fast '+ROYAL_EVENT_STORAGE['menu_animation_out']);
				}
			}
		});
	});
}


// Build page TOC from the tag's id
function royal_event_build_page_toc() {
	"use strict";
	var toc = '', toc_count = 0;
	jQuery('[id^="toc_"],.sc_anchor').each(function(idx) {
		"use strict";
		var obj = jQuery(this);
		var id = obj.attr('id');
		var url = obj.data('url');
		var icon = obj.data('icon');
		if (!icon) icon = 'icon-circle-dot';
		var title = obj.attr('title');
		var description = obj.data('description');
		var separator = obj.data('separator');
		toc_count++;
		toc += '<div class="toc_item'+(separator=='yes' ? ' toc_separator' : '')+'">'
			+(description ? '<div class="toc_description">'+description+'</div>' : '')
			+'<a href="'+(url ? url : '#'+id)+'" class="toc_icon'+(title ? ' with_title' : '')+' '+icon+'">'+(title ? '<span class="toc_title">'+title+'</span>' : '')+'</a>'
			+'</div>';
	});
	if (toc_count > (ROYAL_EVENT_STORAGE['toc_menu_home'] ? 1 : 0) + (ROYAL_EVENT_STORAGE['toc_menu_top'] ? 1 : 0)) {
		if (jQuery('#toc').length > 0)
			jQuery('#toc .toc_inner').html(toc);
		else
			jQuery('body').append('<div id="toc" class="toc_'+ROYAL_EVENT_STORAGE['toc_menu']+'"><div class="toc_inner">'+toc+'</div></div>');
	}
}


// Show current page title on the responsive menu button
function royal_event_show_current_menu_item(menu, button) {
	"use strict";
	menu.find('a').each(function () {
		var menu_link = jQuery(this);
		if (menu_link.text() == "") {
			return;
		}
		if (menu_link.attr('href') == window.location.href)
			button.text(menu_link.text());
	});
}



// Isotope
//=====================================================

// First init isotope containers
function royal_event_init_isotope() {
	"use strict";

	var all_images_complete = true;

	// Check if all images in isotope wrapper are loaded
	jQuery('.isotope_wrap:not(.inited)').each(function () {
		"use strict";
		all_images_complete = all_images_complete && royal_event_check_images_complete(jQuery(this));
	});
	// Wait for images loading
	if (!all_images_complete && ROYAL_EVENT_STORAGE['isotope_init_counter']++ < 30) {
		setTimeout(royal_event_init_isotope, 200);
		return;
	}

	// Isotope filters handler
	jQuery('.isotope_filters:not(.inited)').addClass('inited').on('click', 'a', function(e) {
		"use strict";
		jQuery(this).parents('.isotope_filters').find('a').removeClass('active');
		jQuery(this).addClass('active');
	
		var selector = jQuery(this).data('filter');
		jQuery(this).parents('.isotope_filters').siblings('.isotope_wrap').eq(0).isotope({
			filter: selector
		});

		if (selector == '*')
			jQuery('#viewmore_link').fadeIn();
		else
			jQuery('#viewmore_link').fadeOut();

		e.preventDefault();
		return false;
	});

	// Init isotope script
	jQuery('.isotope_wrap:not(.inited)').each(function() {
		"use strict";

		var isotope_container = jQuery(this);

		// Init shortcodes
		if (window.royal_event_init_shortcodes) {
			royal_event_sc_init(isotope_container);
		}

		// If in scroll container - no init isotope
		if (isotope_container.parents('.sc_scroll').length > 0) {
			isotope_container.addClass('inited').find('.isotope_item').animate({opacity: 1}, 200, function () { jQuery(this).addClass('isotope_item_show'); });
			return;
		}
		
		// Init isotope with timeout
		setTimeout(function() {
			isotope_container.addClass('inited').isotope({
				itemSelector: '.isotope_item',
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			});
	
			// Show elements
			isotope_container.find('.isotope_item').animate({opacity: 1}, 200, function () { 
				jQuery(this).addClass('isotope_item_show'); 
			});
			
			// Resize Alter portfolio elements
			royal_event_resize_alter_portfolio();
			
		}, 500);

	});		
}

function royal_event_init_appended_isotope(posts_container, filters) {
	"use strict";
	
	if (posts_container.parents('.sc_scroll_horizontal').length > 0) return;
	
	if (!royal_event_check_images_complete(posts_container) && ROYAL_EVENT_STORAGE['isotope_init_counter']++ < 30) {
		setTimeout(function() { royal_event_init_appended_isotope(posts_container, filters); }, 200);
		return;
	}
	// Add filters
	var flt = posts_container.siblings('.isotope_filter');
	for (var i in filters) {
		if (flt.find('a[data-filter=".flt_'+i+'"]').length == 0) {
			flt.append('<a href="#" class="isotope_filters_button" data-filter=".flt_'+i+'">'+filters[i]+'</a>');
		}
	}
	// Init shortcodes in added elements
	royal_event_sc_init(posts_container);
	// Get added elements
	var elems = posts_container.find('.isotope_item:not(.isotope_item_show)');
	// Notify isotope about added elements with timeout
	setTimeout(function() {
		posts_container.isotope('appended', elems);
		// Show appended elements
		elems.animate({opacity: 1}, 200, function () { jQuery(this).addClass('isotope_item_show'); });
	}, 500);
}



// Post formats init
//=====================================================

function royal_event_init_post_formats() {
	"use strict";

	// Call theme specific action (if exists)
	if (window.royal_event_theme_init_post_formats) royal_event_theme_init_post_formats();

	// MediaElement init
	royal_event_init_media_elements(jQuery('body'));
	
	// Isotope first init
	if (jQuery('.isotope_wrap:not(.inited)').length > 0) {
		ROYAL_EVENT_STORAGE['isotope_init_counter'] = 0;
		royal_event_init_isotope();
	}

	// Hover Effect 'Dir'
	if (jQuery('.isotope_wrap .isotope_item_content.square.effect_dir:not(.inited)').length > 0) {
		jQuery('.isotope_wrap .isotope_item_content.square.effect_dir:not(.inited)').each(function() {
			jQuery(this).addClass('inited').hoverdir();
		});
	}

	// Popup init
	if (ROYAL_EVENT_STORAGE['popup_engine'] == 'pretty') {
		jQuery("a[href$='jpg'],a[href$='jpeg'],a[href$='png'],a[href$='gif']").attr('rel', 'prettyPhoto[slideshow]');
		var images = jQuery("a[rel*='prettyPhoto']:not(.inited):not(.esgbox):not([data-rel*='pretty']):not([rel*='magnific']):not([data-rel*='magnific'])").addClass('inited');
		try {
			images.prettyPhoto({
				social_tools: '',
				theme: 'facebook',
				deeplinking: false
			});
		} catch (e) {};
	} else if (ROYAL_EVENT_STORAGE['popup_engine']=='magnific') {
		jQuery("a[href$='jpg'],a[href$='jpeg'],a[href$='png'],a[href$='gif']").each(function() {
			if (!jQuery(this).parent().hasClass('woocommerce-product-gallery__image'))
				jQuery(this).attr('rel', 'magnific');
		});
		var images = jQuery("a[rel*='magnific']:not(.inited):not(.esgbox):not(.prettyphoto):not([rel*='pretty']):not([data-rel*='pretty'])").addClass('inited');
		try {
			images.magnificPopup({
				type: 'image',
				mainClass: 'mfp-img-mobile',
				closeOnContentClick: true,
				closeBtnInside: true,
				fixedContentPos: true,
				midClick: true,
				preloader: true,
				tLoading: ROYAL_EVENT_STORAGE['strings']['magnific_loading'],
				gallery:{
					enabled: true
				},
				image: {
					tError: ROYAL_EVENT_STORAGE['strings']['magnific_error'],
					verticalFit: true
				}
			});
		} catch (e) {};
	}


	// Add hover icon to products thumbnails
	jQuery(".post_item_product .product .images a.woocommerce-main-image:not(.hover_icon)").addClass('hover_icon hover_icon_view');


	// Likes counter
	if (jQuery('.post_counters_likes:not(.inited)').length > 0) {
		jQuery('.post_counters_likes:not(.inited)')
			.addClass('inited')
			.on('click', function(e) {
				var button = jQuery(this);
				var inc = button.hasClass('enabled') ? 1 : -1;
				var post_id = button.data('postid');
				var likes = Number(button.data('likes'))+inc;
				var cookie_likes = royal_event_get_cookie('royal_event_likes');
				if (cookie_likes === undefined || cookie_likes===null) cookie_likes = '';
				jQuery.post(ROYAL_EVENT_STORAGE['ajax_url'], {
					action: 'post_counter',
					nonce: ROYAL_EVENT_STORAGE['ajax_nonce'],
					post_id: post_id,
					likes: likes
				}).done(function(response) {
					var rez = {};
					try {
						rez = JSON.parse(response);
					} catch (e) {
						rez = { error: ROYAL_EVENT_STORAGE['ajax_error'] };
						console.log(response);
					}
					if (rez.error === '') {
						if (inc == 1) {
							var title = button.data('title-dislike');
							button.removeClass('enabled').addClass('disabled');
							cookie_likes += (cookie_likes.substr(-1)!=',' ? ',' : '') + post_id + ',';
						} else {
							var title = button.data('title-like');
							button.removeClass('disabled').addClass('enabled');
							cookie_likes = cookie_likes.replace(','+post_id+',', ',');
						}
						button.data('likes', likes).attr('title', title).find('.post_counters_number').html(likes);
						royal_event_set_cookie('royal_event_likes', cookie_likes, 365);
					} else {
						royal_event_message_warning(ROYAL_EVENT_STORAGE['strings']['error_like']);
					}
				});
				e.preventDefault();
				return false;
			});
	}

	// Social share links
	if (jQuery('.sc_socials_share:not(.inited)').length > 0) {
		jQuery('.sc_socials_share:not(.inited)').each(function() {
			"use strict";
			jQuery(this).addClass('inited').on('click', '.social_item_popup > a.social_icons', function(e) {
				"use strict";
				var url = jQuery(this).data('link');
				window.open(url, '_blank', 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=480, height=400, toolbar=0, status=0');
				e.preventDefault();
				return false;
			});
		});
	}

	// Add video on thumb click
	if (jQuery('.sc_video_play_button:not(.inited)').length > 0) {
		jQuery('.sc_video_play_button:not(.inited)').each(function() {
			"use strict";
			jQuery(this)
				.addClass('inited')
				.animate({opacity: 1}, 1000)
				.on('click', function (e) {
					"use strict";
					if (!jQuery(this).hasClass('sc_video_play_button')) return;
					var video = jQuery(this).removeClass('sc_video_play_button hover_icon hover_icon_play').data('video');
					if (video!=='') {
						jQuery(this).empty().html(video);
						royal_event_video_dimensions();
						var video_tag = jQuery(this).find('video');
						var w = video_tag.width();
						var h = video_tag.height();
						royal_event_init_media_elements(jQuery(this));
						// Restore WxH attributes, because Chrome broke it!
						jQuery(this).find('video').css({'width':w, 'height': h}).attr({'width':w, 'height': h});
					}
					e.preventDefault();
					return false;
				});
		});
	}
}


function royal_event_init_media_elements(cont) {
    "use strict";
	if (ROYAL_EVENT_STORAGE['media_elements_enabled'] && cont.find('audio,video').length > 0) {
		if (window.mejs) {
			if (typeof window.mejs.MepDefaults != 'undefined') window.mejs.MepDefaults.enableAutosize = false;
			if (typeof window.mejs.MediaElementDefaults != 'undefined') window.mejs.MediaElementDefaults.enableAutosize = false;
			cont.find('audio:not(.wp-audio-shortcode),video:not(.wp-video-shortcode)').each(function() {
				if (jQuery(this).parents('.mejs-mediaelement').length == 0
					&& jQuery(this).parents('figure.wp-block-media-text__media').length == 0				
					&& jQuery( this ).parents( '.wp-block-video' ).length == 0
					&& ! jQuery( this ).hasClass( 'wp-block-cover__video-background' )) {
					var media_tag = jQuery(this);
					var settings = {
						enableAutosize: true,
						videoWidth: -1,		// if set, overrides <video width>
						videoHeight: -1,	// if set, overrides <video height>
						audioWidth: '100%',	// width of audio player
						audioHeight: 30,	// height of audio player
						success: function(mejs) {
							var autoplay, loop;
							if ( 'flash' === mejs.pluginType ) {
								autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
								loop = mejs.attributes.loop && 'false' !== mejs.attributes.loop;
								autoplay && mejs.addEventListener( 'canplay', function () {
									mejs.play();
								}, false );
								loop && mejs.addEventListener( 'ended', function () {
									mejs.play();
								}, false );
							}
							media_tag.parents('.sc_audio,.sc_video').addClass('inited sc_show');
						}
					};
					jQuery(this).mediaelementplayer(settings);
				}
			});
		} else
			setTimeout(function() { royal_event_init_media_elements(cont); }, 400);
	}
}






// Popups and system messages
//==============================================

// Show system message (bubble from previous page)
function royal_event_show_system_message() {
    "use strict";
	if (ROYAL_EVENT_STORAGE['system_message'] && ROYAL_EVENT_STORAGE['system_message']['message']) {
		if (ROYAL_EVENT_STORAGE['system_message']['status'] == 'success')
			royal_event_message_success(ROYAL_EVENT_STORAGE['system_message']['message'], ROYAL_EVENT_STORAGE['system_message']['header']);
		else if (ROYAL_EVENT_STORAGE['system_message']['status'] == 'info')
			royal_event_message_info(ROYAL_EVENT_STORAGE['system_message']['message'], ROYAL_EVENT_STORAGE['system_message']['header']);
		else if (ROYAL_EVENT_STORAGE['system_message']['status'] == 'error' || ROYAL_EVENT_STORAGE['system_message']['status'] == 'warning')
			royal_event_message_warning(ROYAL_EVENT_STORAGE['system_message']['message'], ROYAL_EVENT_STORAGE['system_message']['header']);
	}
}

// Toggle popups
function royal_event_toggle_popup(popup) {
    "use strict";
	if (popup.css('display')!='none')
		royal_event_hide_popup(popup);
	else
		royal_event_show_popup(popup);
}

// Show popups
function royal_event_show_popup(popup) {
    "use strict";
	if (popup.css('display')=='none') {
		if (false && ROYAL_EVENT_STORAGE['css_animation'])
			popup.show().removeClass('animated fast '+ROYAL_EVENT_STORAGE['menu_animation_out']).addClass('animated fast '+ROYAL_EVENT_STORAGE['menu_animation_in']);
		else
			popup.slideDown();
	}
}

// Hide popups
function royal_event_hide_popup(popup) {
    "use strict";
	if (popup.css('display')!='none') {
		if (false && ROYAL_EVENT_STORAGE['css_animation'])
			popup.removeClass('animated fast '+ROYAL_EVENT_STORAGE['menu_animation_in']).addClass('animated fast '+ROYAL_EVENT_STORAGE['menu_animation_out']).delay(500).hide();
		else
			popup.fadeOut();
	}
}



// Table cart Woo /***/
jQuery(document).ready(function () {
    "use strict";
    jQuery('.shop_table thead .product-remove').remove();
    jQuery('.shop_table thead .product-thumbnail').remove();
    jQuery('.shop_table thead .product-name').attr('colspan', 3);
});

// VC_ROW /***/
jQuery(document).ready(function () {
    "use strict";
    jQuery('.vc_row[class*="vc_custom_"]').each(function() {
        if(((jQuery(this).css('background-color') != jQuery('body').css('background-color')) && (jQuery(this).css('background-color') != 'rgba(0, 0, 0, 0)' )) || (jQuery(this).css('background-image') != 'none')){
            jQuery(this).addClass('with-custom-background');
        }
    });
});

// Scroll to top /***/
jQuery(document).ready(function () {
    "use strict";
    jQuery('.scroll_to_top_in_footer .scroll_to_top').appendTo(jQuery('.page_content_wrap + footer'));
});

// Smooth transition /***/
jQuery(document).ready(function(){
    "use strict";
    jQuery('.slider_scroll_down').on("click", function (event) {
        event.preventDefault();
        var top  = jQuery('.page_content_wrap').offset().top;
        jQuery('body,html').animate({scrollTop: top}, 1000);
    });
});