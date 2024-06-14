/* global jQuery:false, elementorFrontend:false */

// Attention! This action must be executed before the document.ready
// to add properties to the elementorFrontend object before it used first time!

(function(){
	"use strict";
	// Add page settings to the elementorFrontend object
	// in the frontend for non-Elementor pages (blog pages, categories, tags, etc.)
	// Run this code after the all other init code via setTimeout(0)
	setTimeout(function(){
		if (typeof elementorFrontend !== 'undefined'
			&& !elementorFrontend.isEditMode()
			&& typeof elementorFrontend.config !== 'undefined'
			&& typeof elementorFrontend.config.settings !== 'undefined'
			&& typeof elementorFrontend.config.settings.general === 'undefined'
		) {
			elementorFrontend.config.settings.general = {
				'elementor_stretched_section_container': TRX_UTILS_STORAGE['elementor_stretched_section_container']
			};
		}
	}, 0);
})();