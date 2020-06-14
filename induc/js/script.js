document.addEventListener("DOMContentLoaded", () => {
	const throttle = (fn, delay, thisArg = null) => {
		let lastFire = 0;
		return (...args) => {
			const now = new Date().getTime();
			if (now - lastFire >= delay) {
				lastFire = now;
				fn.call(thisArg, ...args);
			}
		};
	};

	const $ = document.querySelectorAll.bind(document);
	class AnimateElem {
		constructor(selector, speed) {
			this.speed = speed;
			this.node = $(selector)[0];
			this.start = this.node.offsetTop;
		}
		move(y) {
			this.node.style.top = this.start - this.speed * y + "px";
		}
	}

	const elems = [
		new AnimateElem(".waves", 1.4),
		new AnimateElem(".page-1-circle", -2),
		new AnimateElem(".buildings", 1.4),
	];

	const handleScroll = function (y) {
		if (y >= window.innerHeight) {
			return;
		}

		elems.forEach((e, i) => {
			e.move(y);
		});
	};

	document.addEventListener("scroll", () => handleScroll(document.documentElement.scrollTop));
});
