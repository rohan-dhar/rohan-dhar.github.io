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
		const makeActive = (i) => {
			$(".nav-item").forEach((e) => e.classList.remove("nav-item-active"));
			$(".nav-item")[i].classList.add("nav-item-active");
		};

		for (let i = 0; i < pageLimits.length; i++) {
			if (scroll > pageLimits[i]) {
				makeActive(i);
			}
		}
	};

	class AnimateElem {
		constructor(selector, speed) {
			this.speed = speed;
			this.node = $(selector)[0];
		}
		move(y) {
			this.node.style.transform = `translateY(${-this.speed * y}px)`;
		}
	}

	const elems = [
		new AnimateElem(".waves", 1.4),
		new AnimateElem(".page-1-circle", -2),
		new AnimateElem(".buildings", 1.4),
	];

	const handleScroll = function (y) {
		if (y < window.innerHeight) {
			elems.forEach((e) => {
				e.move(y);
			});
		}

		updateNav(y);
	};

	const toggle = (scheduleItem) => {
		if (!scheduleItem) return;

		const animOptions = {
			duration: 450,
			easing: "easeOutQuart",
		};

		const close = () => {
			scheduleItem.dataset.isOpen = "false";
			const children = scheduleItem.querySelectorAll(".schedule-item-sub");
			Velocity(children, "stop")
				.then(() => Velocity(children, { opacity: 0, scaleY: 0.7, translateY: -60 }, animOptions))
				.then(() =>
					scheduleItem.dataset.isOpen === "false"
						? children.forEach((elem) => (elem.style.display = "none"))
						: null
				);
		};

		const open = () => {
			const children = scheduleItem.querySelectorAll(".schedule-item-sub");
			scheduleItem.dataset.isOpen = "true";
			children.forEach((elem) => {
				elem.style.display = "block";
			});
			setTimeout(() => {
				Velocity(children, "stop").then(() =>
					Velocity(
						children,
						{
							opacity: 1,
							scaleY: 1,
							translateY: 0,
						},
						animOptions
					)
				);
			}, 0);
		};
		if (scheduleItem.dataset.isOpen === "true") {
			close();
		} else {
			open();
		}
	};

	document.addEventListener("scroll", () => handleScroll(document.documentElement.scrollTop));

	$("#page-3-schedule")[0].addEventListener("click", ({ target }) => toggle(target.closest(".schedule-item")));
});
