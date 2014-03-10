;(function ($) {

	var comparison = comparison || {};

	(function (cmp) {

		var $wrapper,
			$before,
			$after;

		var settings,
			size;

		cmp.applyCss = function () {};

		cmp.bind = function () {
			var update = (function ($wrapper, $target, size, direction, start,
					snap) {
				return function (event) {
					return cmp.update($wrapper, $target, size, direction,
						start, snap, event);
				};
			}($wrapper, $after, size, settings.direction, settings.start,
				settings.snap));

			$wrapper.on({
				click: function () {
					$(this).toggleClass('locked');
				},
				mousemove: function (event) {
					if (!$(this).hasClass('locked')) {
						update(event);
					}
				}
			});
		};

		cmp.init = function (options) {
			$wrapper = $(this);
			$before = $wrapper.children('img.before');
			$after = $wrapper.children('img.after');

			settings = $.extend({}, $.fn.comparison.defaults, options,
				$wrapper.data());

			cmp.validate();

			size = {
				width: $before.width(),
				height: $before.height()
			};

			$wrapper
				.width(size.width).height(size.height)
				.addClass(settings.direction);

			// todo: apply static CSS
			cmp.bind();
			cmp.update($wrapper, $after, size, settings.direction,
				settings.start, settings.snap);
		};

		cmp.update = function ($wrapper, $target, size, direction, start, snap,
				event) {
			switch (direction) {
				case 'horizontal':
					var x;

					if (typeof event !== 'undefined') {
						x = event.pageX - $wrapper.offset().left;
					} else {
						x = Math.round(start*size.width);
					}

					if (x <= snap) {
						x = 0;
					} else if (x >= size.width - snap) {
						x = size.width;
					}

					$target.css('clip', 'rect(0, ' + size.width + 'px, ' +
						size.height + 'px, ' + x + 'px)');

					return x;
					break;

				case 'vertical':
					var y;

					if (typeof event !== 'undefined') {
						y = event.pageY - $wrapper.offset().top;
					} else {
						y = Math.round(start*size.height);
					}

					if (y <= snap) {
						y = 0;
					} else if (y >= size.height - snap) {
						y = size.height;
					}

					$target.css('clip', 'rect(' + y + 'px, ' + size.width +
						'px, ' + size.height + 'px, 0)');

					return y;
					break;

				default:
					return null;
					break;
			}
		};

		cmp.validate = function () {
			if ($before.length === 0) {
				$.error('Could not find before image.');
			}

			if ($before.length > 1) {
				$.error('More than one before image.');
			}

			if ($after.length === 0) {
				$.error('Could not find after image.');
			}

			if ($after.length > 1) {
				$.error('More than one after image.');
			}

			if ($before.width() !== $after.width() || $before.height() !== 
					$after.height()) {
				$.error('Images should have the same dimensions.');
			}

			/*if ($before.next() !== $after) {
				$.error('After image should be the next sibling to the before '
					+ 'image.')
			}*/

			if (typeof settings.css !== 'boolean') {
				$.error('Option "css" is not boolean.');
			}

			if ($.inArray(settings.direction, ['horizontal', 'vertical']) ===
					-1) {
				$.error('Option "direction" is invalid ("' +
					settings.direction + '").');
			}

			// todo: validate option snap

			if (typeof settings.start !== 'number' || (settings.start < 0 &&
					settings.start > 1)) {
				$.error('Option "start" should be a float in interval '
					+ '[0, 1].');
			}
		};

	})(comparison);

	$.fn.comparison = function (options) {
		return this.each(function () {
			comparison.init.call(this, options);
		});
	};

	$.fn.comparison.defaults = {
		css: false,
		direction: 'horizontal',
		snap: 20,
		start: 0.5
	};

})(jQuery);

jQuery(document).ready(function ($) {
	$(window).load(function () {
		$('.jquery-comparison').comparison();
	});
});