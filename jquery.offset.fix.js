( function() {
	var original_offset_fn = jQuery.fn.offset;
	var patched = false;
	var complexpatch = false;

	function firstHost( el ) {
		while ( el ) {
			if ( el.host ) return el.host;
			el = el.parentNode;
		}
		return null;
	}

	jQuery.fn.applyOffsetPatch = function( complex ) {
		if ( complex ) {
			jQuery.fn.offset = function() {
				if ( !this.length ) return undefined;

				var el  = this[0];
				var off = original_offset_fn.apply( this );
				var doff;
				var sr;

				while ( el ) {
					sr = firstHost( el );
					if ( sr ) {
						doff = original_offset_fn.apply( jQuery( sr ) );
						if ( doff ) {
							off.left += doff.left;
							off.top  += doff.top;
						}
					}
					el = sr;
				}

				return off;
			};
		} else {
			jQuery.fn.offset = function() {
				if ( !this.length ) return undefined;
				return { left: this[0].offsetLeft, top: this[0].offsetTop };
			};
		}

		patched = true;
		complexpatch = complex;

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
			if ( complexpatch ) {
				return 'PATCH APPLIED (COMPLEX FORM)';
			} else {
				return 'PATCH APPLIED (SIMPLE FORM)';
			}
		}
	};
} )();
