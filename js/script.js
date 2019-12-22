function loadCall(){
	$("#page-1-intro").css("animation", "none").velocity({
		'opacity': '1'
	}, {
		duration: 400,
		easing: 'easeInQuart',
		complete: function(){
			$("#page-1-intro").velocity({
				'fontSize': (window.innerWidth < 860)?'25pt':'36pt',
				'paddingTop': '0px'
			}, {
				duration: 700,
				delay: 600,
				easing: 'easeInQuart',
				complete: function(){				
					$(' #page-1-scroll').velocity({
						'opacity': 0.5,
					}, {
						duration: 500,
						easing: 'easeInQuart'
					});
					
					$('h1, #page-1-desc').velocity({
						'opacity': 1,
						'scaleX': 1,
						'scaleY': 1
					}, {
						duration: 500,
						easing: 'easeInQuart'
					});
					bubbles.render();
				}
			});
		}
	});
}

$(document).ready(()=>{

	class Bubble{
		constructor(settings){
			this.radius  = settings.radius;			
			this.x  = settings.x;
			this.y = settings.y;
			this.speed = settings.speed;
			this.color = settings.color;
		}
	};

	function rand(max, min, onlyInt){
		return (onlyInt) ? Math.round(min + Math.random() * (max-min)) : min + Math.random() * (max-min);
	}

	window.bubbles = {
		$e: null,
		canvas: null,
		ctx: null,
		colors: ["rgba(39, 212, 150, 0.75)", "rgba(53, 151, 255, 0.75)", "rgba(255, 78, 79, 0.75)", "rgba(112, 94, 255,0.75)"],
		bg: $("#page-1").css("background-color"),
		bubbles: [],
		speedRange: [-2, 2],
		radRange: [30, 80],
		num: 25,
		setSize: function(){
			this.canvas.height = window.innerHeight;
			this.canvas.width = window.innerWidth;			
		},
		init: function(){
			this.$e = $("#page-1-bubbles");
			this.canvas = this.$e[0];
			this.ctx = this.canvas.getContext("2d");
			this.setSize();
			for(let i = 0; i < this.num; i++){
				let rad = 0;
				if(window.innerWidth < 850){
					rad = rand(bubbles.radRange[0]/1.5, bubbles.radRange[1]/1.5, true);
				}else{
					rad = rand(bubbles.radRange[0], bubbles.radRange[1], true);
				}
				this.bubbles.push(new Bubble({
					radius: rad,
					x: bubbles.canvas.width/2,
					y: bubbles.canvas.height/2,
					speed: {
						x: rand(bubbles.speedRange[0], bubbles.speedRange[1]),
						y: rand(bubbles.speedRange[0], bubbles.speedRange[1])
					},
					color: bubbles.colors[i%bubbles.colors.length],
				}));
			}
		},
		render: function(){
			bubbles.ctx.fillStyle = bubbles.bg;
			bubbles.ctx.fillRect(0, 0, bubbles.canvas.width, bubbles.canvas.height);
			for(let i = 0; i < bubbles.bubbles.length; i++){
				let b = bubbles.bubbles[i];
				bubbles.ctx.beginPath();
				bubbles.ctx.fillStyle = b.color;
				bubbles.ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
				bubbles.ctx.closePath();
				bubbles.ctx.fill();				
				
				if(b.x + b.radius >= bubbles.canvas.width){
					bubbles.bubbles[i].speed.x *= -1;
					bubbles.bubbles[i].x = bubbles.canvas.width - bubbles.bubbles[i].radius - 1;
				}else if(b.x - b.radius <= 0){
					bubbles.bubbles[i].speed.x *= -1;
					bubbles.bubbles[i].x = bubbles.bubbles[i].radius + 1;
				}
				
				if(b.y + b.radius >= bubbles.canvas.height){
					bubbles.bubbles[i].speed.y *= -1;
					bubbles.bubbles[i].y = bubbles.canvas.height - bubbles.bubbles[i].radius - 1;
				}else if(b.y - b.radius <= 0){
					bubbles.bubbles[i].speed.y *= -1;
					bubbles.bubbles[i].y = bubbles.bubbles[i].radius + 1;
				}

				bubbles.bubbles[i].x += bubbles.bubbles[i].speed.x;
				bubbles.bubbles[i].y += bubbles.bubbles[i].speed.y;				

			}

			window.requestAnimationFrame(bubbles.render);
		}

	};

	window.pages = {
		speed: 750,
		easing: "easeOutQuart",
		current: 1,
		dist: 130,
		lowOpacity: 1,
		lowScale: 0.8,
		scrollLimit: [],
		mobile: false,
		init: function(){
			this.setLimits();
			if(this.mobile){
				return false;
			}
			$(".page").not('#page-1').velocity({
				'translateY': pages.dist+'px',
				'scaleX': pages.lowScale,
				'scaleY': pages.lowScale
			}, {
				duration: 0
			});			
		},
		getInView: function(scroll){
			if(scroll < this.scrollLimit[0]){
				return 1;
			}else if(scroll >= this.scrollLimit[this.scrollLimit.length - 1]){
				return this.scrollLimit.length+1;
			}
			for(let i = 1; i < this.scrollLimit.length; i++){
				if(scroll >= this.scrollLimit[i-1] && scroll < this.scrollLimit[i]){
					return i+1;
				}
			}
			return -1;
		},
		setLimits: function(){
			this.scrollLimit = [
				$("#page-1").outerHeight(), 
				$("#page-2").offset().top + $("#page-2").innerHeight(),
				$("#page-3").offset().top + $("#page-3").innerHeight() - window.innerHeight,
			];
			if(window.innerWidth < 850){
				this.mobile = true;
			}
		}
	};

	bubbles.init();
	pages.init();
	$(window).resize(()=>{
		bubbles.setSize();
		pages.setLimits();
	});



	$(document).scroll(function(){
		if(pages.mobile){
			return false;
		}
		let scroll = document.documentElement.scrollTop;
		let page = pages.getInView(scroll);
		let p = 0;
		if(page == 1){
			p = scroll/pages.scrollLimit[0];
		}else if(page == pages.scrollLimit.length + 1){
			p = (scroll - pages.scrollLimit[pages.scrollLimit.length-1]) / ($("#page-4").outerHeight());
		}else{
			p = (scroll - pages.scrollLimit[page-2]) / (pages.scrollLimit[page-1] - pages.scrollLimit[page-2]);
		}
		if(isNaN(p)){
			p = 1;
		}

		if(page < 3){		
			$("#page-"+page).css({
				'transform': 'translateY(' + (pages.dist * p) + 'px) scale(' + (1 -  (1 - pages.lowScale) * p) + ', ' + (1 -  (1 - pages.lowScale) * p) + ')',

			});
			$("#page-"+(page+1)).css({
				'transform': 'translateY(' + (pages.dist * (1-p)) + 'px) scale(' + (pages.lowScale + (1 - pages.lowScale) * p) + ', ' + (pages.lowScale + (1 - pages.lowScale) * p) + ')',
			});
		}else if(page == pages.scrollLimit.length + 1){

			$("#page-"+pages.scrollLimit.length).css({
				'transform': 'translateY(' + (pages.dist * p) + 'px) scale(' + (1 -  (1 - pages.lowScale) * p) + ', ' + (1 -  (1 - pages.lowScale) * p) + ')',
			});

			$("#page-"+(pages.scrollLimit.length + 1)).css({
				'transform': 'translateY(' + (pages.dist * (1-p)) +'px) scale(' + (pages.lowScale + (1 - pages.lowScale) * p)+', '+(pages.lowScale + (1 - pages.lowScale) * p) + ')',
			});
		}else if(page == 3){
			$("#page-3").css({
				'transform': 'translateY(0px) scale(1, 1)',
			});
		}

	});

});
$(window).load(loadCall)