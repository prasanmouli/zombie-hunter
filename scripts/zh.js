var canvs1 = document.getElementById('levels');
var context = canvs1.getContext('2d');

var requestId;
var land = [{
	"width" : 800,
	"height" : 220,
	"pitGap" : 150,
	"Xi" : 0,
	"Yi" : 0,
	"appWidth" : 800,
	"pos" : 0,
	"freedom" : false	
	}, 
	{
	"width" : 900,
	"height" : 270,
	"pitGap" : 200, 
	"Xi" : 0,
	"Yi" : 0,
	"appWidth" : 900,
	"pos" : 800+150, // land[0].pitGap = 150
	"freedom" : true		
	}];


ZombieHunter = function() {
	this.X = 50;
	this.Y = 487-land[0].height;
	this.jump = {
		"ascent" : false,
		"descent" : false 
		};
	this.velocity = 8.00;
	this.pix = 5;
	this.bullets = 20;
}

var canvs2 = document.getElementById('player');
var c = canvs2.getContext("2d");

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

window.cancelAnimFrame = (function(){
	return window.cancelAnimationFrame || window.mozCancelAnimationFrame;
})();

ZombieHunter.prototype.playerAscent = function(){
	
	this.jump.ascent = true;
	var time=0.0, v=0.0;
	
	var that=this;
    var inter = setInterval(function(){	
		if(v<0){
			clearInterval(inter);
			that.jump.ascent = false;
			that.playerDescent();
			return;
		}
		
		time += 0.05/3;
		c.clearRect(0, 0, 60, 500);
		
		v = that.velocity - 9.87*time;
        that.Y -= (v*v)/(2*9.87);  
        
		c.fillRect(that.X, that.Y, 10, 10);
		c.fill();
	}, 50/3);
	
}

ZombieHunter.prototype.playerDescent = function(){
	
	this.jump.descent = true;
	var time=0.0;
	
	var that=this;
    var inter = setInterval(function(){
		
		t0 = (land[0].pos-that.X)/(that.pix*60);
		t1 = (land[1].pos-that.X)/(that.pix*60);
		
		if(t0<time)
			expr = that.Y + land[0].height;
		if (t1<time)
			expr = that.Y + land[1].height;	
		
		if(expr > 482){
			clearInterval(inter);
			if(land[1].pos-land[0].pitGap<0 && that.X-land[1].pos<0){
				cancelAnimFrame(requestId);
				requestId = undefined;
				alert('You lost!');
			}
			that.jump.descent = false;
			return;
		}
		        
		time += 0.05/3;   
		c.clearRect(0, 0, 60, 500);
		
		that.Y += 0.5*9.8*time*time;
        
		c.fillRect(that.X, that.Y, 10, 10);
		c.fill();
	}, 50/3);
	
}

ZombieHunter.prototype.shoot = function(k){

	var x=0;
	var Y = this.Y;
	
	var bullet = canvs2.getContext("2d");
	this.bullets -= 1;
	
	if(this.bullets>0){
		var that=this;
		var g = setInterval(function(){
		if(k==1){	
			bullet.beginPath();  
			bullet.clearRect(that.X+x+10, Y+2, 4, 6);
			x+=3+Math.floor(that.pix/25);
			bullet.fillRect(that.X+x+10, Y+3, 4, 4);
			if(that.X+x > 1000 || (that.X+x>=land[1].pos && Y+9>(500-land[1].height))){
				clearInterval(g);
				bullet.clearRect(that.X+x+10, Y+2, 4, 6);
				}
			}
		else{
			console.log("asdasd");
			bullet.clearRect(that.X-x+21, Y+1, 8, 8);
			x+=3+Math.floor(that.pix/25);
			bullet.arc(that.X+x+25, Y+5, 3, 0, 2*Math.PI);
//			console.log(Y+" "+land[0].height+" "+land[1].height);
			if(that.X+x > 1000 || (that.X+x>=land[1].pos && Y+9>(500-land[1].height))){
				clearInterval(g);
				bullet.clearRect(that.X+x+21, Y+1, 8, 8);
				}
			}
		}, 10);
	}

}

ZombieHunter.prototype.landGenerate = function(){

	var that=this;
	requestId = requestAnimFrame(function(){ that.landGenerate();});
	
	if(this.jump.descent==false && this.jump.ascent==false && (this.X+land[0].pitGap-land[1].pos)<=10 && this.X>land[0].appWidth){
		cancelAnimFrame(requestId);
		requestId = undefined;
		alert('You lost!');
	}
	
	for(i=0; i<2; i++){
				
		if(land[i].freedom == false){
			context.clearRect(land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap), 500-land[i].height-1, this.pix+2, land[i].height+2 );
			context.beginPath();
			context.rect(0, 500-land[i].height, land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap), land[i].height);
			context.fillStyle = 'yellow';
			context.fill();
			context.lineWidth = 2;
			context.strokeStyle = 'black';
			context.stroke();
			land[i].Yi += this.pix;
			land[i].appWidth -= this.pix;
			land[i].pos = 0;
			if((land[i].Yi)%(land[i].width+land[i].pitGap)==0 && land[i].Yi>0)
				context.clearRect(0, 500-land[i].height-1, land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap)+1, land[i].height+2);
		}
		else{
			land[i].pos = land[i-1].appWidth+land[i-1].pitGap;
			context.beginPath();
			if(land[i].height > land[i-1].height){
				context.clearRect(land[i-1].width+land[i-1].pitGap-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i].height-1, land[i].width, land[i].height+2);
				context.clearRect(land[i-1].width+land[i-1].pitGap+land[i].width-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i].height-1, this.pix+2, land[i].height+2);
			}
			else{
				context.clearRect(land[i-1].width+land[i-1].pitGap-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i-1].height-1, land[i].width, land[i-1].height+2);
				context.clearRect(land[i-1].width+land[i-1].pitGap+land[i].width-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i-1].height-1, this.pix+2, land[i-1].height+2);
			}
			context.rect(land[i-1].width+land[i-1].pitGap-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i].height, land[i].width, land[i].height);
			if(land[i-1].width+land[i-1].pitGap-land[i].Xi <=5 && land[i].Xi>0){
				context.clearRect(0, 500-land[i].height-1, land[i].width+2, land[i].height+2);
				land[i].freedom = false;
				land[i].appWidth = land[i].width;
				var w = Math.floor(Math.random()*40)+1000+this.pix*25;
				while(1){
					var h = Math.floor(Math.random()*100)+170;
					if(h-land[i].height<60) break;
				}
				var pitGap = Math.floor(Math.random()*10+200+this.pix*6);
				var pos = land[i-1].width+land[i-1].pitGap-land[i].Xi+land[i].width+land[i].pitGap;
				land.push({"width" : w,"height" : h,"pitGap" : pitGap,"Xi" : 0,"Yi" : 0,"appWidth" : w,"pos" : pos,"freedom" : true});
				land.splice(i-1, 1);
				this.pix +=0.1;
			}
			context.fill();
			context.lineWidth = 2;
			context.strokeStyle = 'black';
			context.stroke();
			land[i].Xi += this.pix;
		}
	}
	
}

window.onload = function(){

	ZH = new ZombieHunter();
	c.fillStyle = "#0000FF";	
	c.fillRect(ZH.X, ZH.Y, 10, 10);
    c.fill();
    	
    window.addEventListener("keydown", function(e){
	
		if(e.keyCode == 67 && ZH.jump.ascent == false && ZH.jump.descent == false){
			ZH.playerAscent();
		}
	
		if(e.keyCode == 39){
			ZH.shoot(1);
		}
	
		if(e.keyCode == 88){
			ZH.shoot(2);
		}
	
	}, true);	
    	
	ZH.landGenerate();
	
};
