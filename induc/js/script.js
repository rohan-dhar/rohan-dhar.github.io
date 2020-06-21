document.addEventListener("DOMContentLoaded", () => {
	const $ = document.querySelectorAll.bind(document);
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

	const getPageLimits = () => {
		const pageNum = $(".page").length;
		const pageLimits = [];
		const setPageLimits = () => {
			for (let i = 0; i < pageNum; i++) {
				pageLimits[i] = $(`#page-${i + 1}`)[0].offsetTop;
			}
		};
		setPageLimits();
		window.addEventListener("resize", setPageLimits);
		return pageLimits;
	};
	const pageLimits = getPageLimits();

	const updateNav = (scroll) => {
		const threshold = 0.6;
		const makeActive = (i) => {
			$(".nav-item").forEach((e) => e.classList.remove("nav-item-active"));
			$(".nav-item")[i].classList.add("nav-item-active");
		};
		console.log(pageLimits[1] * threshold, scroll);

		if (scroll >= pageLimits[pageLimits.length - 2] * threshold) {
			return makeActive(pageLimits.length - 1);
		}
		for (let i = 0; i < pageLimits.length - 1; i++) {
			if (scroll <= pageLimits[i + 1] * threshold) {
				makeActive(i);
				break;
			}
		}
	};

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

		updateNav(y);

		elems.forEach((e, i) => {
			e.move(y);
		});
	};

	document.addEventListener("scroll", () => handleScroll(document.documentElement.scrollTop));
});
