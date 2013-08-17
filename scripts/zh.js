var can = document.createElement('canvas');
can.setAttribute('id' , 'bkgd');
can.width="1000"; 
can.height="500"; 
can.style='position: absolute; left: 0;';
document.getElementsByTagName('body')[0].appendChild(can);

var canvs1 = document.getElementById('levels');

var requestId;
var land = [{
	width : 800,
	height : 140,
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
	height : 180,
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
	this.velocity = 9.00;
	this.pix = 7;
	this.bullets = 20;
	this.image = new Image();
	this.src = './images/Doodlenormal.png';
	this.width = 40;
	this.height = 40;
	this.keyPress = 0;
}

	
Zombie = function(){
	this.X = 0;
	this.Y = 0;
	this.zombiePos = 0;
	this.zombieAcc = 3;
	this.width = 40;
	this.height = 40;
	this.bullets = 1;
	this.once = 1;
	this.bulletSpeed = 1;
}

Flake = function() {
	this.x = Math.round(Math.random()*1000);
    this.y = -10;
    this.drift = Math.random();
    this.speed = 5;
    this.width = Math.round(Math.random()*1) +3;
    this.height = this.width;
}

var canvs2 = document.getElementById('player');
var c = canvs2.getContext("2d");
Z = {};	

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
	var counter = 0.0;
	var hmax = 420-land[0].height;
	
	var that=this;
	
	var inter = setInterval(function(){	
		
		c.save();			
		if(that.keyPress==0){
			that.jump.ascent=false;
			clearInterval(inter);
		}
		
		c.clearRect(0, 0, 150, 500);
		
		time += 0.05/3;
		
		v = that.velocity - 9.87*time;
        that.Y -= (v*v)/(2*9.87);  
        
        if(that.Y<hmax){
			that.Y = hmax;
			counter += 0.05/3;
			if(counter>0.45){
				console.log("Top: "+that.Y);
				that.jump.ascent=false;
				clearInterval(inter);
				that.playerDescent();
				return;
			}
		}
			
        c.drawImage(that.image,that.X,that.Y-25, that.width, that.height);
		c.restore();
	}, 50/3);
	
	that.image.src = that.src;
	
}

Hunter.prototype.playerDescent = function(){
	console.log("Descent: "+this.Y);
	this.jump.descent = true;
	var time=0.0;
	
	var that=this;
		
    var inter = setInterval(function(){
		c.save();
		t0 = (land[0].pos-that.X)/(that.pix*60);
		t1 = (land[1].pos-that.X)/(that.pix*60);
		
		if(t0<time)
			expr = that.Y + land[0].height;
		if (t1<time)
			expr = that.Y + land[1].height;	
		
		if(expr > 482){
			clearInterval(inter);
			console.log(that.X-land[1].pos);
			if(land[1].pos-land[0].pitGap<0 && that.X-land[1].pos<-22){
				cancelAnimFrame(requestId);
				requestId = undefined;
				alert('You lost!');
				console.log(that.pix);
			}
			that.jump.descent = false;
			return;
		}
		        
		time += 0.05/3;   
		c.clearRect(0, 0, 1000, 500);
		
		that.Y += 0.5*9.8*time*time;
        
        c.drawImage(that.image,that.X,that.Y-25, that.width, that.height);
		c.restore();
	}, 50/3);

    that.image.src = that.src;
}

Hunter.prototype.shoot = function(k){
	
	var x=0;
	var Y = this.Y;
	
	var bullet = canvs2.getContext("2d");
	
	if(this.bullets>0){
		var that=this;
		var g = setInterval(function(){
		if(k==1){	
			bullet.beginPath();  
			bullet.clearRect(that.X+x+that.width, Y-12, 6, 6);
			x+=3+Math.floor(that.pix/25);
			bullet.fillRect(that.X+x+that.width, Y-11, 4, 4);
			if(that.X+x > 1000 || (that.X+x>=land[1].pos && Y-5>(500-land[1].height))){
				clearInterval(g);
				bullet.clearRect(that.X+x+that.width, Y-12, 6, 6);
				}
			for(i=0; i<2; i++){
				if(land[i].zombie==true && (485-land[i].height)<=Y+3 && (500-land[i].height)>=Y+3 && that.X+x>=Z[0].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[0].zombieAcc){
					clearInterval(g);
					bullet.clearRect(that.X+x+that.width, Y-12, 4, 6);
					zom.clearRect(Z[0].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[0].zombieAcc, 500-land[i].height-50, 50, 50);
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
			if(that.X+x > 1000 || (that.X+x>=land[1].pos && Y+9>(500-land[1].height))){
				clearInterval(g);
				bullet.clearRect(that.X+x+21, Y+1, 8, 8);
				}
			}
		}, 10);
	}
	
	this.bullets -= 1;
}

var lands = canvs1.getContext('2d');
var sky = canvs1.getContext('2d');
var zom = canvs1.getContext('2d');

function cloud(){
sky.beginPath();
sky.arc(900,50, 30, 0, 2*Math.PI);
sky.fillStyle='#CCCCCC';
sky.fill();
}

var	zombieImg= new Image();
zombieImg.src = './images/AlienNormal.png';
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
			
			var Y = [Z[0].Y, Z[1].Y];
	
			//To Do : zombie physics; zombie's hold on the hunter; release from its hold
			while(land[i].zombie==true && j<land[i].zombieCount){
				zom.save();
				zom.clearRect(Z[j].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc+10, 500-land[i].height-50, this.pix+40, 50);
				zom.drawImage(zombieImg, Z[j].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc, 500-land[i].height-38, Z[j].width, Z[j].height);
				Z[j].X = Z[j].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc;
				Z[j].Y = 480 - land[i].height;
				
				if(Z[j].bullets>0){ 
					zom.clearRect(Z[j].X-Z[j].bulletSpeed, Y[i]-12, 20, 6);
					Z[j].bulletSpeed+=2;
					zom.rect(Z[j].X-Z[j].bulletSpeed, Y[i]-11, 4, 4);
					if(Z[j].X-Z[j].bulletSpeed < 0){// || (that.X-x>=land[1].pos && Y-5>(500-land[1].height))){
						zom.clearRect(0, Y[i]-12, 20, 20);
						Z[j].bullets = 1;
						Z[j].bulletSpeed = 1;
					}
					
					if(Z[j].X-Z[j].bulletSpeed <= this.X+this.width && Z[j].Y-18 <= this.Y){
						zom.clearRect(this.X+this.width, this.Y, 40, 40);
						Z[j].bullets = 1;
						Z[j].bulletSpeed = 1;
					}				
				}
				zom.restore();
				Z[j].zombieAcc += 2;
				j++;	
			}
			zom.fillStyle="yellow";
			zom.fill();
			zom.lineWidth = 1;
			zom.strokeStyle = '#FF4500';
			zom.stroke();
			
			lands.beginPath();
			//land
			lands.clearRect(land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap), 500-land[i].height-1, this.pix+2, land[i].height+2 );
			lands.rect(0, 500-land[i].height, land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap), land[i].height);
			lands.fillStyle = '#666666';
			lands.fill();
			lands.lineWidth = 2;
			lands.strokeStyle = 'white';
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
					Z[a].zombiePos = (land[i+1].width)*4/5 + Math.random()*land[i+1].width/5;
					while(Z[a].zombiePos<tmp-10){
						Z[a].zombiePos = (land[i+1].width)*4/5 + Math.random()*land[i+1].width/5;
					}	
					tmp = Z[a].zombiePos;
					Z[a].zombieAcc = Math.random()*2+1;
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
			lands.strokeStyle = 'white';
			lands.stroke();
			land[i].Xi += this.pix;
		}
	}
	
}

function landPush(that){
	
	var w = Math.floor(Math.random()*40+800+that.pix*that.pix*8);
	var c=0;
	while(1){
		var h = Math.floor(Math.random()*100)+120;
		if(Math.abs(h-land[i].height)<40-that.pix/20 && Math.abs(h-land[i].height)>10) break;
	}
	var p = Math.floor(Math.random()*10+225+that.pix*that.pix*3);
	var posi = land[i-1].width+land[i-1].pitGap-land[i].Xi+land[i].width+land[i].pitGap;
	if(Math.random()>0.4)
		var exis = true;
	else
		var exis = false;
	if(that.pix>15){
		p = Math.floor(Math.random()*10+600);
		w = Math.floor(Math.random()*40+1100+that.pix*35);
		exis = true;
		c = 2;
	}
	else if(that.pix>10){
		p = Math.floor(Math.random()*10+225+that.pix*10);
		w = Math.floor(Math.random()*40+1000+that.pix*30);
		exis = true;
		if(Math.random()>0.4)
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
	
	var keyFreq = 0;
	var time = 0;
	cloud();
	ZH = new Hunter();
	ZH.image.onload = function(){
		c.drawImage(ZH.image,ZH.X,ZH.Y-28, ZH.width, ZH.height);
	}
    ZH.image.src = ZH.src;
    c.fillStyle = 'yellow';
	for(var i=0; i<2; i++)
		Z[i] = new Zombie();
    
	ZH.landGenerate();
    	
    window.addEventListener("keydown", function(e){	
	if(requestId){
		if(e.keyCode == 67 && ZH.jump.ascent == false){
			ZH.keyPress = 1; 
			ZH.playerAscent();
		}
	
		if(e.keyCode == 39){
			ZH.shoot(1);
		}
		
	}
	}, true);
	
	window.addEventListener("keyup", function(e){	
	if(requestId){
		if(e.keyCode == 67){
			ZH.keyPress = 0; 
			ZH.playerDescent();
		}
	}
	}, true);
	
};
