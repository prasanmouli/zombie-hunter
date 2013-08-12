var canvs1 = document.getElementById('levels');

var requestId;
var land = [{
	width : 800,
	height : 220,
	pitGap : 200,
	Xi : 0,
	Yi : 0,
	appWidth : 800,
	pos : 0,
	freedom : false,
	zombie : false,
	zombieCount : 0,
	
	}, 
	{
	width : 900,
	height : 260,
	pitGap : 240,
	Xi : 0,
	Yi : 0,
	appWidth : 900,
	pos : 800+150, // land[0].pitGap = 150
	freedom : true,
	zombie : false,
	zombieCount : 0,
			
	}];

Hunter = function() {
	this.X = 50;
	this.Y = 487-land[0].height;
	this.jump = {
		"ascent" : false,
		"descent" : false 
		};
	this.velocity = 8.00;
	this.pix = 7;
	this.bullets = 20;
}

	
Zombie = function(){
	this.zombiePos = 0;
	this.zombieAcc = 3;
	this.hunterHold = false;
}

Z = {};
for(var i=0; i<2; i++)
	Z[i] = new Zombie();
	
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
				console.log(this.pix);
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
			bullet.clearRect(that.X+x+10, Y+2, 6, 6);
			x+=3+Math.floor(that.pix/25);
			bullet.fillRect(that.X+x+10, Y+3, 4, 4);
			if(that.X+x > 1000 || (that.X+x>=land[1].pos && Y+9>(500-land[1].height))){
				clearInterval(g);
				bullet.clearRect(that.X+x+10, Y+2, 6, 6);
				}
			for(i=0; i<2; i++){
				if(land[i].zombie==true && that.X+x>=Z[0].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[0].zombieAcc){
					clearInterval(g);
					bullet.clearRect(that.X+x+10, Y+2, 4, 6);
					zom.clearRect(Z[0].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[0].zombieAcc, 500-land[i].height-20, 30, 20);
					land[i].zombieCount--;
					Z[0].zombiePos = Z[1].zombiePos;
					Z[0].zombieAcc = Z[1].zombieAcc;
					Z[0].hunterHold = Z[1].hunterHold;
					console.log(land[i].zombieCount);
					if(land[i].zombieCount==0)
						land[i].zombie=false;
				}
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
		console.log(this.pix);
	}

	if((this.X <= land[1].pos-5 && this.X >= (land[0].appWidth+land[0].pitGap))){
		cancelAnimFrame(requestId);
		requestId = undefined;
		alert('You lost2!');
		console.log(this.pix);
	}
	

	for(i=0; i<2; i++){
				
		if(land[i].freedom == false){
			
			zom.beginPath();
			//zombie
			var j=0;
			
			//To Do : zombie physics; zombie's hold on the hunter; release from its hold
			while(land[i].zombie==true && j<land[i].zombieCount){
				
				if(land[i].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc <= this.X && this.jump.ascent==false && this.jump.descent==false){
					zom.clearRect(Z[j].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc+10, 500-land[i].height-20, this.pix+4, 20);
					zom.rect(this.X-8, this.Y, 8, 10);
					Z[j].hunterHold=true;
				}
				else if(Z[j].hunterHold == false){
					zom.clearRect(Z[j].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc+10, 500-land[i].height-20, this.pix+4, 20);
					zom.rect(Z[j].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc, 500-land[i].height-15, 10, 10);
					Z[j].zombieAcc += 2;
				}
				else if(this.jump.ascent==true && Z[j].hunterHold==true){
					zom.clearRect(this.X-8, this.Y-1, 8, 12);
					Z[j].hunterHold=false;
				}				
				j++;	
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
				console.log(this.pix);
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
				var tmp=0;
				for(var a=0; a<land[i+1].zombieCount; a++){
					Z[a].zombiePos = (land[i+1].width)*2/3 + Math.random()*land[i+1].width/3;
					while(Z[a].zombiePos<=tmp){
						Z[a].zombiePos = (land[i+1].width)*2/3 + Math.random()*land[i+1].width/3;
					}	
					tmp = Z[a].zombiePos;
					Z[a].zombieAcc = 3;
					Z[a].hunterHold= false;
				}
				land.splice(i-1, 1);
				if(this.pix>15)
					this.pix +=0.1;
				else
					this.pix +=0.15;
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
	var w = Math.floor(Math.random()*40+800+that.pix*that.pix*8);
	var c=0;
	while(1){
		var h = Math.floor(Math.random()*100)+170;
		if(Math.abs(h-land[i].height)<50 && Math.abs(h-land[i].height)>10) break;
	}
	var p = Math.floor(Math.random()*10+225+that.pix*that.pix*3);
	var posi = land[i-1].width+land[i-1].pitGap-land[i].Xi+land[i].width+land[i].pitGap;
	if(Math.random()>0.4)
		var exis = true;
	else
		var exis = false;
	if(that.pix>18){
		p = Math.floor(Math.random()*10+600);
		w = Math.floor(Math.random()*40+900+that.pix*20);
		exis = true;
		c = 2;
	}
	else if(that.pix>12){
		p = Math.floor(Math.random()*10+225+that.pix*10);
		w = Math.floor(Math.random()*40+900+that.pix*25);
		exis = true;
		if(Math.random()>0.5)
			c = 2;
	}
	if(Math.random()>0.6&&that.pix>10){
		w = Math.floor(land[i-1].pitGap*2.5);
		exis = false;
	}
	if(c!=2 && exis==true)
		c=1;
	land.push({width : w,height : h,pitGap : p,Xi : 0,Yi : 0,appWidth : w,pos : posi,freedom : true, zombie: exis, zombieCount:c});
}

window.onload = function(){

	ZH = new Hunter();
	c.fillStyle = "#0000FF";	
	c.fillRect(ZH.X, ZH.Y, 10, 10);
    c.fill();
    
    
	ZH.landGenerate();
    	
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
	
};
