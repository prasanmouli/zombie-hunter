var canvs1 = document.getElementById('levels');

var requestId;
var land = [{
	width : 800,
	height : 220,
	pitGap : 150,
	Xi : 0,
	Yi : 0,
	appWidth : 800,
	pos : 0,
	freedom : false,
	zombie : false,
	zombiePos : 0,
	zombieAcc : 0
	
	}, 
	{
	width : 900,
	height : 270,
	pitGap : 200, 
	Xi : 0,
	Yi : 0,
	appWidth : 900,
	pos : 800+150, // land[0].pitGap = 150
	freedom : true,
	zombie : false,
	zombiePos : 0,
	zombieAcc : 0
			
	}];


Hunter = function() {
	this.X = 50;
	this.Y = 487-land[0].height;
	this.jump = {
		"ascent" : false,
		"descent" : false 
		};
	this.velocity = 8.00;
	this.pix = 5;
	this.bullets = 20;
	this.zombieHold = false;
}

Zombie = function(){
	this.X = 100;
	this.Y = 487-land[0].height;
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

Hunter.prototype.playerAscent = function(){

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

Hunter.prototype.playerDescent = function(){

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
			if(land[1].pos-land[0].pitGap<0 && that.X-land[1].pos<3){
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

Hunter.prototype.shoot = function(k){
	
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
			for(i=0; i<2; i++)
				if(land[i].zombie==true && that.X+x>=land[i].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-land[i].zombieAcc){
					clearInterval(g);
					bullet.clearRect(that.X+x+10, Y+2, 4, 6);
					zom.clearRect(land[i].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-land[i].zombieAcc, 500-land[i].height-20, 20, 20);
					land[i].zombie=false;
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

var lands = canvs1.getContext('2d');
var zom = canvs1.getContext('2d');

Hunter.prototype.landGenerate = function(){

	var that=this;
	requestId = requestAnimFrame(function(){ that.landGenerate();});
	
	if(this.jump.descent==false && this.jump.ascent==false && (this.X+land[0].pitGap-land[1].pos)<=10 && this.X>land[0].appWidth){
		cancelAnimFrame(requestId);
		requestId = undefined;
		alert('You lost1!');
	}

	if((this.X <= land[1].pos-5 && this.X >= (land[0].appWidth+land[0].pitGap))){
		cancelAnimFrame(requestId);
		requestId = undefined;
		alert('You lost2!');
	}

	for(i=0; i<2; i++){
				
		if(land[i].freedom == false){
			
			zom.beginPath();
			//zombie
			
			//To Do : zombie physics; zombie's hold on the hunter; release from its hold
			if(land[i].zombie==true){
				
				if(land[i].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-land[i].zombieAcc <= this.X && this.jump.ascent==false && this.jump.descent==false){
					zom.clearRect(land[i].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-land[i].zombieAcc+10, 500-land[i].height-20, this.pix+2, 20);
					zom.rect(this.X-8, this.Y, 8, 10);
					this.zombieHold=true;
				}
				else if(this.zombieHold == false){
					zom.clearRect(land[i].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-land[i].zombieAcc+10, 500-land[i].height-20, this.pix+2, 20);
					zom.rect(land[i].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-land[i].zombieAcc, 500-land[i].height-15, 10, 10);
					land[i].zombieAcc += 1;
				}
				else if(this.jump.ascent==true && this.zombieHold==true){
					zom.clearRect(this.X-8, this.Y-1, 8, 12);
					this.zombieHold=false;
				}
				
			}
			zom.fillStyle = "#FF0000";
			zom.fill();
			
			lands.beginPath();
			//land
			lands.clearRect(land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap), 500-land[i].height-1, this.pix+2, land[i].height+2 );
			lands.rect(0, 500-land[i].height, land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap), land[i].height);
			lands.fillStyle = 'yellow';
			lands.fill();
			lands.lineWidth = 2;
			lands.strokeStyle = 'black';
			lands.stroke();
			land[i].Yi += this.pix;
			land[i].appWidth -= this.pix;
			land[i].pos = 0;
			if((land[i].Yi)%(land[i].width+land[i].pitGap)==0 && land[i].Yi>0)
				lands.clearRect(0, 500-land[i].height-1, land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap)+1, land[i].height+2);
		}
		else{
			if(this.Y+5>(500-land[i].height) && land[i].pos<=land[i-1].pitGap && this.jump.ascent==false){
				cancelAnimFrame(requestId);
				requestId = undefined;
				alert('You lost3!');
			}
			land[i].pos = land[i-1].appWidth+land[i-1].pitGap;
			lands.beginPath();
			if(land[i].height > land[i-1].height){
				lands.clearRect(land[i-1].width+land[i-1].pitGap-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i].height-1, land[i].width, land[i].height+2);
				lands.clearRect(land[i-1].width+land[i-1].pitGap+land[i].width-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i].height-1, this.pix+2, land[i].height+2);
			}
			else{
				lands.clearRect(land[i-1].width+land[i-1].pitGap-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i-1].height-1, land[i].width, land[i-1].height+2);
				lands.clearRect(land[i-1].width+land[i-1].pitGap+land[i].width-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i-1].height-1, this.pix+2, land[i-1].height+2);
			}
			lands.rect(land[i-1].width+land[i-1].pitGap-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i].height, land[i].width, land[i].height);
			if(land[i-1].width+land[i-1].pitGap-land[i].Xi <=5 && land[i].Xi>0){
				lands.clearRect(0, 500-land[i].height-1, land[i].width+2, land[i].height+2);
				land[i].freedom = false;
				land[i].appWidth = land[i].width;
				landPush(this);
				land.splice(i-1, 1);
				this.pix +=0.1;
			}
			lands.fill();
			lands.lineWidth = 2;
			lands.strokeStyle = 'black';
			lands.stroke();
			land[i].Xi += this.pix;
		}
	}
	
}

function landPush(that){
	var w = Math.floor(Math.random()*40)+800+that.pix*that.pix*8;
	while(1){
		var h = Math.floor(Math.random()*100)+170;
		if(h-land[i].height<50) break;
	}
	var p = Math.floor(Math.random()*10+200+that.pix*10);
	var posi = land[i-1].width+land[i-1].pitGap-land[i].Xi+land[i].width+land[i].pitGap;
	var z = 2*w/3+Math.random()*w/3;
	if(Math.random()>0.4)
		var exis = true;
	else
		var exis = false;
	if(Math.random()>0.75){
		w = Math.floor(Math.random()*100)+500;
		exis = false;
	}
	land.push({width : w,height : h,pitGap : p,Xi : 0,Yi : 0,appWidth : w,pos : posi,freedom : true, zombie: exis, zombiePos: z, zombieAcc : 2});
}

window.onload = function(){

	ZH = new Hunter();
	c.fillStyle = "#0000FF";	
	c.fillRect(ZH.X, ZH.Y, 10, 10);
    c.fill();
    	
    window.addEventListener("keydown", function(e){
	if(requestId){
		if(e.keyCode == 67 && ZH.jump.ascent == false && ZH.jump.descent == false){
			ZH.playerAscent();
		}
	
		if(e.keyCode == 39){
			ZH.shoot(1);
		}
	
		if(e.keyCode == 88){
			ZH.shoot(2);
		}
	}
	}, true);	
    	
	ZH.landGenerate();
	
};
