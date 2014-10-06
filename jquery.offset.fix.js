( function() {
	var original_offset_fn = jQuery.fn.offset;
	var patched = false;

	jQuery.fn.applyOffsetPatch = function() {
		jQuery.fn.offset = function() {
			if ( !this.length ) return undefined;

			var el = this[0];
			var box = el.getBoundingClientRect();
			var off = { left: box.left, top: box.top };

			while ( el ) {
				var host = el.parentNode || el.host;
				if ( host && host.nodeType === 1 ) {
					off.left += host.scrollLeft;
					off.top  += host.scrollTop;
				}
				el = host;
			}

			return off;
		};

		patched = true;

		return this;
	};

	jQuery.fn.revertOffsetPatch = function() {
		jQuery.fn.offset = original_offset_fn;
		patched = false;
		return this;
	};

	jQuery.fn.isOffsetPatched = function() {
		return patched;
	};

	jQuery.fn.offsetPatchStatus = function() {
		if ( !patched ) {
			return 'PATCH NOT APPLIED';
		} else {
			return 'PATCH APPLIED';
		}
	};
} )();
