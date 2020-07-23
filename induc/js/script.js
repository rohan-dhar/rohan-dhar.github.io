firebase.initializeApp({
	apiKey: "AIzaSyAiHJ1lLHpN5qIDh5QLW3vVarDEQ439o-I",
	authDomain: "inductioniiitd2020.firebaseapp.com",
	databaseURL: "https://inductioniiitd2020.firebaseio.com",
	projectId: "inductioniiitd2020",
	storageBucket: "inductioniiitd2020.appspot.com",
	messagingSenderId: "676495080890",
	appId: "1:676495080890:web:7dbcd8f31791aaaaf8b183",
	measurementId: "G-GNNRR4CBRZ",
});

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

	const schedule = {
		loading: true,
		error: false,
		_data: null,
		el: null,
		months: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
		db: firebase.database(),
		genHTML() {
			if (!this.data) {
				return null;
			}
			let html = `<div id="page-3-schedule-line"></div>`;

			for (let date in this.data) {
				const dateObj = new Date(date);
				// Events holders
				html += `
					<div class="schedule-item">
						<div class="schedule-date"><span>${dateObj.getDate()}</span>${this.months[dateObj.getMonth() + 1]}</div>
						<h2 class="schedule-head">Events</h2>
				`;
				// Events here
				this.data[date].forEach((event) => {
					html += `
					<div class="schedule-item-sub">
						<h3>${event.eventName}</h3>
						<p>${event.eventDesc}</p>
					</div>
					`;
				});

				html += "</div></div>";
			}

			return html;
		},
		render() {
			if (!this.el) return;
			if (this.loading) {
				this.el.innerHTML = '<div class="loader"></div>';
			} else {
				this.el.innerHTML = this.genHTML();
			}
		},
		set data(data) {
			const dateMap = {};
			data.forEach((d) => (dateMap[d.date] ? dateMap[d.date].push(d) : (dateMap[d.date] = [d])));
			this._data = dateMap;
		},
		get data() {
			return this._data;
		},
		init() {
			const ref = this.db.ref("Schedule");
			this.el = $("#page-3-schedule")[0];
			this.render();
			ref.on("value", (snap) => {
				this.loading = false;
				this.data = snap.val().slice(1);
				console.log(this.data);
				this.render();
			});
		},
	};

	schedule.init();

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
	const thershold = 100;
	const updateNav = (scroll) => {
		const makeActive = (i) => {
			$(".nav-item").forEach((e) => e.classList.remove("nav-item-active"));
			$(".nav-item")[i].classList.add("nav-item-active");
		};

		for (let i = 0; i < pageLimits.length; i++) {
			if (scroll > pageLimits[i] - 100) {
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

	$(".nav-item").forEach((elem) =>
		elem.addEventListener("click", (e) => {
			const i = Number(e.currentTarget.id.substr(9));
			Velocity($("#page-" + i)[0], "scroll");
		})
	);
});
