(function(){

var can = document.createElement('canvas');
can.setAttribute('id' , 'bkgd');
can.width="1000"; 
can.height="500"; 
can.style='position: absolute; left: 0;';
document.getElementsByTagName('body')[0].appendChild(can);

var scoreDiv,
	ammoDiv,
	shieldDiv;

var canvs1 = document.getElementById('levels');

var Hunter = function() {
	this.X = 50;
	this.Y = 487-land[0].height;
	this.jump = {
		"ascent" : false,
		"descent" : false 
		};
	this.velocity = 9.00;
	this.health = 5;
	this.pix = 10;
	this.bullets = 2;
	this.image = new Image();
	this.src = './images/Doodlenormal.png';
	this.width = 40;
	this.height = 40;
	this.keyPress = 0;
	this.powerUp = {
		shield : false,
		time : 0,
		maxTime : 10,
		need : {
			health: false,
			bullets: false,
			shield: false
			},
		missed : {
			health: false,
			bullets: false
			}
		};
}

var Zombie = function(){
	this.X = 0;
	this.Y = 0;
	this.zombiePos = 0;
	this.zombieAcc = 3;
	this.width = 40;
	this.height = 40;
	this.bullets = 2;
	this.bulletSpeed = 2;
	this.exists = false;
}

var canvs2 = document.getElementById('player');
var c = canvs2.getContext("2d");
var Z=[];	

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

var requestId;
var land = [{
	width : 800,
	height : 110,
	pitGap : 200,
	Xi : 0,
	Yi : 0,
	appWidth : 800,
	pos : 0,
	freedom : false,
	zombie : false,
	zombieCount : 0,
	offerings : {
		id : 0
		}
	}, 
	{
	width : 900,
	height : 130,
	pitGap : 240,
	Xi : 0,
	Yi : 0,
	appWidth : 900,
	pos : 800+200, // land[0].pitGap = 200
	freedom : true,
	zombie : false,
	zombieCount : 0,
	offerings : {
		id : 0
		}
	}];
	
var landCount = 0;	

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
		
		c.clearRect(0, 0, 500, 500);
		time += 0.05/3;
		v = that.velocity - 9.87*time;
        that.Y -= (v*v)/(2*9.87);  
        
        if(that.Y<hmax){
			that.Y = hmax;
			counter += 0.05/3;
			if(counter>0.2){
				that.jump.ascent=false;
				clearInterval(inter);
				that.playerDescent();
				return;
			}
		}
		if(that.powerUp.shield){
			c.drawImage(that.image,that.X,that.Y-25, that.width, that.height);
			console.log("Shield is up");
			that.powerUp.time += 0.05/3;
			if(that.powerUp.time>that.powerUp.maxTime){
				console.log("END:"+that.powerUp.shield);
				that.powerUp.shield = false;
				that.powerUp.time = 0;
			}
		}
		else{
			c.drawImage(that.image,that.X,that.Y-25, that.width, that.height);
		}
		c.restore();
	}, 50/3);
	
	that.image.src = that.src;
	
}

Hunter.prototype.playerDescent = function(){
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
		c.clearRect(0, 0, 500, 500);
		
		that.Y += 0.5*9.8*time*time;
        
        if(that.powerUp.shield){
			c.drawImage(that.image,that.X,that.Y-25, that.width, that.height);
			console.log("Shield is up");
			that.powerUp.time += 0.05/3;
			if(that.powerUp.time>that.powerUp.maxTime){
				console.log("END:"+that.powerUp.shield);
				that.powerUp.shield = false;
				that.powerUp.time = 0;
			}
		}
		else{
			c.drawImage(that.image,that.X,that.Y-25, that.width, that.height);
		}
		
		c.restore();
	}, 50/3);

    that.image.src = that.src;
}

var pow = canvs1.getContext('2d');
Hunter.prototype.shoot = function(k){
	
	var x=0;
	var Y = this.Y;	
	var bullet = canvs2.getContext("2d");
	
	if(this.bullets>0){
		var that=this;
		var g = setInterval(function(){
		if(k==1){	
			bullet.beginPath(); 
			bullet.fillStyle='yellow'; 
			bullet.clearRect(that.X+x+that.width, Y-12, 6, 6);
			x+=4+Math.floor(that.pix/25);
			bullet.fillRect(that.X+x+that.width, Y-11, 4, 4);
			if(that.X+x > 1000 || (that.X+x>=land[1].pos && Y-5>(500-land[1].height))){
				clearInterval(g);
				bullet.clearRect(that.X+x+that.width, Y-12, 6, 6);
				}
			for(i=0; i<2; i++){
			if(Z.length)
				if(land[i].zombie==true && (485-land[i].height)<=Y+3 && (500-land[i].height)>=Y+3 && that.X+x>=Z[0].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[0].zombieAcc && Z[0].exists){
				  clearInterval(g);
				  bullet.clearRect(that.X+x+that.width, Y-12, 4, 6);
			      zom.clearRect(Z[0].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[0].zombieAcc, 500-land[i].height-50, 50, 50);
     			  zom.clearRect(Z[0].X-Z[0].bulletSpeed-10, Z[0].Y-12, 50, 6);
     			  land[i].zombieCount--;
     			  Z.splice(0, 1);
				  if(land[i].zombieCount==0)
					land[i].zombie=false;
				  break;	
				}
			}	
			}
		}, 10);
		this.bullets -= 1;
		if(this.bullets<=2)
			this.powerUp.need.bullets=true;
		}
}

var lands = canvs1.getContext('2d');
var sky = canvs2.getContext('2d');
var zom = canvs1.getContext('2d');

var	zombieImg= new Image();
zombieImg.src = './images/AlienNormal.png';

var zomBullet = [canvs1.getContext('2d'),canvs1.getContext('2d')];
var once = 0;
var garb = 0;
Hunter.prototype.landGenerate = function(){
	
	ammoDiv.innerHTML = "AMMO : "+this.bullets;
	if(this.powerUp.shield){
		shieldDiv.innerHTML = 'SHIELD : ON ('+(this.powerUp.maxTime-Math.floor(this.powerUp.time))+')';	
	}
	else
		shieldDiv.innerHTML = 'SHIELD : OFF';	
	scoreDiv.innerHTML = "SCORE : "+this.health;
		
	if(this.jump.ascent==false && this.jump.descent==false){
		if(this.powerUp.shield && once==0){
			c.clearRect(this.X,this.Y-28, this.width+5, this.height+5);
			c.drawImage(this.image,this.X,this.Y-25, this.width, this.height);
			once = 1;
			console.log("LAND: Shield is up");
		}
		if(this.powerUp.shield){
			this.powerUp.time += 0.05/3;
			if(this.powerUp.time>10){
				console.log("END:"+this.powerUp.shield);
				this.powerUp.shield = false;
				this.powerUp.time = 0;
				once = 1;	
				}
			}
		else if(!this.powerUp.shield && this.jump.ascent==false && this.jump.descent==false && once==1){
			c.clearRect(this.X,this.Y-28, this.width+5, this.height+5);
			c.drawImage(this.image,this.X,this.Y-25, this.width, this.height);
			console.log("LAND: Shield is down");
			once = 0;
		}
	}
    
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
			zom.clearRect(0,0,1000,1000);
			while(j<Z.length && land[i].zombie==true){	
	       		var Y = Z[j].Y;
				zom.save();
				zom.clearRect(Z[j].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc+10, 500-land[i].height-50, this.pix+40, 50);
				zom.drawImage(zombieImg, Z[j].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc, 500-land[i].height-38, Z[j].width, Z[j].height);
				Z[j].X = Z[j].zombiePos-(land[i].Yi)%(land[i].width+land[i].pitGap)-Z[j].zombieAcc;
				Z[j].Y = 480 - land[i].height;
				Z[j].zombieAcc += 0.8; 
				
				zomBullet[j].clearRect(Z[j].X-Z[j].bulletSpeed, Y-12, 22, 6);
				if(Z[j].bullets>0){	
					if((this.X-(Z[j].X-Z[j].bulletSpeed)<=this.width) && (this.X-(Z[j].X-Z[j].bulletSpeed)>=-20) && (Z[j].Y-18)<=this.Y){
						zomBullet[j].clearRect(Z[j].X-Z[j].bulletSpeed, Y-12, 22, 6);
						if(!this.powerUp.shield){
							console.log('Hit');
							this.health--;
							if(this.health<=2)
								this.powerUp.need.health=true;
							if(this.health<=0){
								cancelAnimFrame(requestId);
								requestId = undefined;
								alert('HIT : You lost!');
							}
						}
						Z[j].bullets--;
						Z[j].bulletSpeed = 2+this.pix/30;
					}else if(Z[j].X-Z[j].bulletSpeed < 0){						
						zomBullet[j].clearRect(Z[j].X-Z[j].bulletSpeed, Y-12, 22, 6);
						Z[j].bullets--;
						Z[j].bulletSpeed = 2+this.pix/30;
					}	
					
					zomBullet[j].clearRect(Z[j].X-Z[j].bulletSpeed, Y-12, 22, 6);
					Z[j].bulletSpeed+=4;
					zomBullet[j].rect(Z[j].X-Z[j].bulletSpeed-5, Y-11, 4, 4);
				
				}
				zom.restore();
				j++;
			}
						
			zom.fillStyle="yellow";
			zom.fill();
			zom.lineWidth = 1;
			zom.strokeStyle = '#FF4500';
			zom.stroke();
			
			//offerings
			pow.beginPath();
			pow.clearRect(land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap), land[i].offerings.height, 2, 2);
			//console.log(land[i].offerings.height+"   "+(this.Y-30)+"   "+Math.abs(land[i].offerings.height-this.Y-this.width/2+30)+"   "+this.width/2);
			switch(land[i].offerings.id){
			case 1:
				pow.rect(land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap),land[i].offerings.height, 6, 6);
				pow.fillStyle="green";
				pow.fill();
				if(this.X+this.width-20>=land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap) && Math.abs(land[i].offerings.height-this.Y-this.width/2+30)<=this.width/2 && land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap)>this.X){
					pow.clearRect(land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap), land[i].offerings.height, 20, 20);
					land[i].offerings.id = 0;
					this.health += 3;
					if(this.health>5)
						this.health = 5;
					this.powerUp.missed.health = false;
				}else
					this.powerUp.missed.health = true;
				
				break;
			case 2:
				pow.rect(land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap),land[i].offerings.height, 6, 6);
				pow.fillStyle="red";
				pow.fill();
				if(this.X+this.width-20>=land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap) && Math.abs(land[i].offerings.height-this.Y-this.width/2+30)<=this.width/2 && land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap)>this.X){
					pow.clearRect(land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap), land[i].offerings.height, 20, 20);
					land[i].offerings.id = 0;
					this.bullets += 3;	
					this.powerUp.missed.bullets = false;				
				}else
					this.powerUp.missed.bullets = true;
				break;
			case 3:
				if(!this.powerUp.shield){
				pow.rect(land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap),land[i].offerings.height, 6, 6);
				pow.fillStyle="yellow";
				pow.fill();
				if(this.X+this.width-20>=land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap) && Math.abs(land[i].offerings.height-this.Y-this.width/2+30)<=this.width/2 && land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap)>this.X){
					pow.clearRect(land[i].offerings.pos-(land[i].Yi)%(land[i].width+land[i].pitGap), land[i].offerings.height, 20, 20);
					land[i].offerings.id = 0;
					this.powerUp.shield = true;
					this.powerUp.maxTime = Math.floor(10-this.pix/5);
					this.powerUp.missed.health = false;
				}else
				this.powerUp.missed.health = true;	
				}
				break;
			default:
				break;
			}	
			
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
					Z[a] = new Zombie();
					if(a==0)
						Z[a].zombiePos = (land[i+1].width)*6/8 + Math.random()*land[i+1].width/8;
					else
						Z[a].zombiePos = (land[i+1].width)*8/9 + Math.random()*land[i+1].width/9;
					Z[a].zombieAcc = 1+this.pix/20;
					Z[a].bullets = 1;
					Z[a].bulletSpeed = 3.5+this.pix/20;
					Z[a].exists = true;
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
	landCount++;
	var ID, POS, H;
	var w = Math.floor(Math.random()*40+800+that.pix*that.pix*8);
	var c=0;
	while(1){
		var h = Math.floor(Math.random()*100)+120;
		if(Math.abs(h-land[i].height)<40-that.pix/20 && Math.abs(h-land[i].height)>10) break;
	}
	var p = Math.floor(Math.random()*10+245+that.pix*that.pix*3);
	var posi = land[i-1].width+land[i-1].pitGap-land[i].Xi+land[i].width+land[i].pitGap;
	
	if(Math.random()>0.1)
		var exis = true;
	else
		var exis = false;
		
	if(that.pix>14){
		p = Math.floor(Math.random()*10+600);
		w = Math.floor(Math.random()*40+1100+that.pix*35);
		exis = true;
		c = 2;
	}
	else if(that.pix>10){
		p = Math.floor(Math.random()*10+245+that.pix*10);
		w = Math.floor(Math.random()*40+1000+that.pix*30);
		exis = true;
		if(Math.random()>0.3)
			c = 2;
	}
	if(c!=2 && exis==true)
		c=1;
	ID=0;
	
	if((that.bullets==0 && that.powerUp.need.bullets) || (that.bullets==0 && that.powerUp.missed.bullets)){
		ID=2;
		POS=2*w/3;
		H=500-land[i].height-Math.random()*60;
		that.powerUp.need.bullets=false;
	}
	if((that.powerUp.missed.health && that.health<=1) || (that.health<=1 && that.powerUp.need.health)){
		if(Math.random()>0.6){
			ID=1;
			POS=2*w/3;
			H=500-land[i].height-Math.random()*60;
			that.powerUp.need.health=false;
		}
		else{
			ID=3;
			POS=w/2;
			H=500-land[i].height-Math.random()*60;
			that.powerUp.need.health=false;
		}			
	}
	
	land.push({
		width : w,
		height : h,
		pitGap : p,
		Xi : 0,Yi : 0,
		appWidth : w,
		pos : posi,
		freedom : true,
		zombie: exis, 
		zombieCount:c, 
		offerings: {
			id:ID, 
			pos:POS,
			height:H}
		});
}

window.onload = function(){	
	var keyFreq = 0;
	var time = 0;
	//score();
	scoreDiv = document.getElementById('score');
	ammoDiv = document.getElementById('ammo');
	shieldDiv = document.getElementById('shield');
	
	var ZH = new Hunter();
	ZH.image.onload = function(){
		c.drawImage(ZH.image,ZH.X,ZH.Y-28, ZH.width, ZH.height);
	}
    ZH.image.src = ZH.src;
    c.fillStyle = 'yellow';
	ZH.landGenerate();
    	
    window.addEventListener("keydown", function(e){	
	if(requestId){
		if(e.keyCode == 67 && ZH.jump.ascent == false && ZH.jump.descent == false){
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

})();
