function rand(start, end){
    return Math.round(start + Math.random() * (end - start));
}

function Vertex(x, y, sx = 0, sy = 0, delta = 0, time = 10){
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.dx = null;
    this.dy = null;
    this.delta = delta;
    this.time = time;
    this.speed = [];
    this.dir = [];
}

Vertex.prototype.assignDest = function() {
    this.dx = this.x + rand(-this.delta, this.delta);
    this.dy = this.y + rand(-this.delta, this.delta);
    this.speed = [(this.dx - this.sx)/this.time, (this.dy - this.sy)/this.time];
};

Vertex.prototype.update = function() {
    this.sx += this.speed[0];
    this.sy += this.speed[1];
}


var blob = {
    can: null,
    ctx: null,
    numVert: 70,
    vertices: [],
    radius: 230,
    delta: 80,
    timePtr: 0,
    color: null,
    gradColors: ['#ff656c', '#ff5e93'],
    time: 180,
    color: null,
    setDimensions: function(){
        this.can.height = $("#page-1").height();
        this.can.width = $("#page-1").width();
    },
    
    init: function(){
        this.can = $('#blob')[0];
        this.ctx = this.can.getContext('2d');
        this.setDimensions(); 

        this.vertices = [];

        this.color = this.ctx.createLinearGradient(this.can.width/2 - this.radius, this.can.height/2, this.can.width/2 + this.radius, this.can.height/2);    
        this.color.addColorStop(0, this.gradColors[0]);
        this.color.addColorStop(1, this.gradColors[1]);

        let theta = 2 * Math.PI / this.numVert;
        let cx = this.can.width/2, cy = this.can.height/2;
        
        for(let i = 0; i <= this.numVert; i++){
            let x = cx + Math.cos(i * theta) * this.radius;
            let y = cy + Math.sin(i * theta) * this.radius;
            let vert = new Vertex(x, y, x + rand(-this.delta, this.delta), y + rand(-this.delta, this.delta), this.delta, this.time);
            vert.assignDest();
            this.vertices.push(vert);
        }
    },
    render: function(){
        this.can.height = this.can.height;
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.moveTo(this.vertices[0].sx, this.vertices[0].sy);
        for(let i = 0; i < this.vertices.length-1; i++){
            let v = this.vertices[i];
            let cx = (v.sx + this.vertices[i+1].sx)/2;
            let cy = (v.sy +this.vertices[i+1].sy)/2;            
            this.ctx.quadraticCurveTo(v.sx, v.sy, cx, cy);

        }
        this.ctx.closePath();
        this.ctx.fill();
    },
    
    update: function(){
        blob.render();
        if(blob.timePtr == blob.time){
            for(let i = 0; i < blob.vertices.length; i++){
                blob.vertices[i].assignDest();
            }
            blob.timePtr = 0;
        }else{
            for(let i = 0; i < blob.vertices.length; i++){
                blob.vertices[i].update();
            }            
            blob.timePtr++;
        }
        window.requestAnimationFrame(blob.update);
    }
}

$(document).ready(function(){
    blob.init();
    window.requestAnimationFrame(blob.update);

    let nav = {
        current: 1,
        scrollDelta: 100,
        pages: $('.page'),
        animatingTo: -1,
        hoverOn(elem){
            let i = Number($(elem).attr('id').substr(10));
            this.setActive(i);
        },
        hoverOff(){
            this.setActive(this.current);
        },
        setActive(i){
            if(i == this.animatingTo){
                return;
            }
            let w = 100 + (i-1) * $('.menu-item').width();
            this.animatingTo = i;
            $('#menu-line').velocity('stop', true).velocity({
                width: w + 'px'
            }, {
                easing: 'easeOutElastic',
                duration: 200,
                complete: () => nav.animatingTo = -1
            });
        },
        scrollHandler(){
            let s = $(document).scrollTop();
            let found = false;
            for(let i = 0; i < this.pages.length - 1; i++){
                let p = $(this.pages[i]), p2 = $(this.pages[i+1]);
                if( s >= p.position().top - this.scrollDelta && s < p2.position().top - this.scrollDelta){
                    console.log('YAY: ', i+1);
                    this.current = i+1;
                    this.setActive(i+1);
                    found = true;
                    break;
                }
            }
            if(!found){
                this.current = this.pages.length;
                this.setActive(this.current);
            }
        }
    }

    $(window).resize(function(){
        blob.init();
    });
    
    $('.menu-item').hover(function(){
        nav.hoverOn(this);
    }, function(){
        nav.hoverOff(this);
    });


    $(window).scroll(function(){
        nav.scrollHandler();
    });
});