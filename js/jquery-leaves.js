/*!
 * jQuery Leaves
 *
 * Written by sizeof(cat) <sizeofcat AT riseup DOT net>
 * Licensed under the MIT license
 * Version 2.0.0
 */
var catLeaves = function(settings) {
	this.height_window = 0;
	this.width_window = 0;
	this.num_leaves = 0;
	this.started = false;

	this.__constructor = function(settings) {
		var self = this;
		var pos = 0;
		this.height_window = $(window).height();
		this.width_window = $(window).width();
		$(window).resize(function() {
			self.height_window = $(window).height();
			self.width_window = $(window).width();
		});
		this.settings = $.extend({
			leaves: 50,
			max_y: 100,
			speed: 3000,
			infinite: true,
			multiply_on_click: true,
			multiply: 1,
			folder: 'img/leaves/',
			num_images: 8
		}, settings);
		if (this.started === true) {
			return 0;
		}
		this.started = true;
		for (var i = 0; i < this.settings.leaves; i++) {
			pos = 1 + Math.floor(Math.random() * 2);
			switch (pos) {
				case 1:
					this._create('left');
					break;
				case 2:
					this._create('right');
					break
			}
		}
		$('body').on('click', '.catLeaf', function() {
			var id = $(this).attr('id');
			self._drop(id);
		});
		$('body').on('click', '.catLeaf-falling', function() {
			var id = $(this).attr('id');
			self._touch(id);
		});
		if (this.settings.multiply_on_click === true) {
			$('body').on('click', '.catLeaf-falling', function() {
				var id = $(this).attr('id');
				self._multiply(id);
			});
		}
		this.interval = setInterval(function() {
			var random = self._random(0, $('.catLeaf').length);
			var el = $('.catLeaf').eq(random);
			var id = el.attr("id");
			self._drop(id, false);
			if ($('.catLeaf').length === 0) {
				clearInterval(self.interval);
			}
		}, this.settings.speed);
	};

	this.add = function(leaves) {
		var angle, leaf, x, y, rnd, mid, pos, size, num;
		for (var z = 0; z < leaves; z++) {
			this.num_leaves += 1;
			num = 1 + Math.floor(Math.random() * this.settings.num_images);
			size = 1 + Math.floor(Math.random() * 4);
			$('body').append('<img id="leaf' + this.num_leaves + '" class="catLeaf x' + size + '" src="' + this.settings.folder + num + '.png" />');
			leaf = $('#leaf' + this.num_leaves);
			mid = this.width_window / 2;
			pos = this._random(1, 2);
			if (pos === 2) {
				x = this._random(mid, this.width_window);
				angle = this._random(0, 50);
			}
			else {
				x = this._random(-50, mid);
				angle = this._random(0, -50);
			}
			rnd = this._random(500, 8000);
			leaf.rotate({
				animateTo: angle,
				duration: rnd,
				center: ['10%', '110%']
			});
			leaf.animate({
				opacity: 1
			}, (rnd - 400));
			y = this._random(-100, this.max_y);
			leaf.css({
				left: x + 'px',
				top: y + 'px'
			});
		}
		return this;
	};

	this._multiply = function(id) {
		var el = $('#' + id);
		var x = el.position().top;
		var y = el.position().left;
		var leaf, num, cls;
		for (var i = 0; i <= this.settings.multiply; i++) {
			this.num_leaves += 1;
			num = 1 + Math.floor(Math.random() * this.settings.num_images);
			cls = el.attr('class').replace('catLeaf-falling', '');
			$('body').append('<img id="leaf' + this.num_leaves + '" class="catLeaf ' + cls + '" src="' + this.settings.folder + num + '.png" />');
			leaf = $("#leaf" + this.num_leaves);
			leaf.css({
				top: x + 'px',
				left: y + 'px'
			}).animate({
				opacity: 1
			}, 300);
			this._drop('leaf' + this.num_leaves, true);
			this._touch('leaf' + this.num_leaves);
		}
	};

	this._touch = function(id) {
		var el = $("#" + id);
		var angle = el.getRotateAngle();
		var to = 0;
		if (angle > 0) {
			to = 720;
		} else {
			to = -720;
		}
		el.rotate({
			animateTo: to,
			duration: 20000
		});
	};

	this._drop = function(id, clicked) {
		var el = $('#' + id), pos;
		var self = this;
		var angle, to = 0, rnd, rnd1, rnd2, rnd3;
		el.removeClass('catLeaf').addClass('catLeaf-falling');
		el.animate({
			top: '+=' + (this.height_window + 150)
		}, 5000, function() {
			el.clearQueue().animate({
				opacity: 0
			}, 300, function() {
				el.remove();
				if (self.settings.infinite === true) {
					pos = 1 + Math.floor(Math.random() * 2);
					switch (pos) {
						case 1:
							if (clicked === false) {
								self._create('left');
							}
							break;
						case 2:
							if (clicked === false) {
								self._create('right');
							}
							break;
					}
				}
			});
		});
		angle = el.getRotateAngle();
		if (angle > 0) {
			to = 120;
		}
		else {
			to = -120;
		}
		if (clicked === true) {
			var rnd = this._random(200, 600);
			if (angle > 0) {
				to = 420 + rnd;
			}
			else {
				to = -420 - rnd;
			}
			rnd1 = this._random(5, 300);
			rnd2 = this._random(5, 300);
			rnd3 = this._random(10000, 15000);
			el.rotate({
				animateTo: to,
				center: [rnd1 + '%', rnd2 + '%'],
				duration: rnd3
			});
		}
		else {
			el.rotate({
				animateTo: to,
				duration: 10000
			});
		}
	};

	this._create = function(pos) {
		var leaf, angle, x, y, size, num, mid, time;
		this.num_leaves += 1;
		num = 1 + Math.floor(Math.random() * this.settings.num_images);
		size = 1 + Math.floor(Math.random() * 4);
		$('body').append('<img id="leaf' + this.num_leaves + '" class="catLeaf x' + size + '" src="' + this.settings.folder + num + '.png" />');
		leaf = $('#leaf' + this.num_leaves);
		mid = this.width_window / 2;
		if (pos === 'right') {
			x = this._random(mid, this.width_window);
			angle = this._random(0, 50);
		}
		else {
			x = this._random(-50, mid);
			angle = this._random(0, -50);
		}
		time = this._random(500, 8000);
		leaf.rotate({
			animateTo: angle,
			duration: time,
			center: ['10%', '110%']
		});
		leaf.animate({
			opacity: 1
		}, (time - 400));
		y = this._random(-100, this.settings.max_y);
		leaf.css({
			left: x + 'px',
			top: y + 'px'
		});
	};

	this._random = function(start, end) {
		return Math.floor(Math.random() * (end - start + 1) + start);
	};
	
	return this.__constructor(settings);
};
