const $ = document.querySelectorAll.bind(document);

document.addEventListener("DOMContentLoaded", () => {
	let max = Infinity;

	window.addEventListener(
		"load",
		() => (max = $(".card:last-child")[0].offsetTop)
	);

	$("#down")[0].addEventListener("click", () => {
		const y = document.body.scrollTop;
		const cards = $(".card");
		let to = -1;
		for (card of cards) {
			if (card.offsetTop > y) {
				to = card.offsetTop;
				break;
			}
		}
		if (to == -1) {
			return;
		}

		document.body.scrollTop = to + 5;
	});

	window.addEventListener("resize", () => {
		max = $("cards:last-child")[0].offsetTop;
	});

	$(".card").forEach((el) =>
		el.addEventListener("click", (e) => {
			console.log(e.currentTarget.style.height);
			const height = e.currentTarget.style.height;
			if (height === "auto") {
				e.currentTarget.style.height = "105px";
			} else {
				e.currentTarget.style.height = "auto";
			}
		})
	);

	window.addEventListener("scroll", () => {
		const y = document.body.scrollTop;
		if (y > max) {
			$("#down")[0].style.display = "none";
		} else {
			$("#down")[0].style.display = "flex";
		}
	});
});
