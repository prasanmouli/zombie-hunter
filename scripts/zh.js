var canvas = document.getElementById('levels');
var context = canvas.getContext('2d');

var pitGap = 100;
var pix = 4;
var land = [{
	"width" : 800,
	"height" : 220,
	"pitGap" : 150,
	"Xi" : 0,
	"Yi" : 0,
	"appWidth" : 800,
	"pos" : 800,
	"freedom" : false
	}, 
	{
	"width" : 900,
	"height" : 270,
	"pitGap" : 200, 
	"Xi" : 0,
	"Yi" : 0,
	"appWidth" : 800,
	"pos" : 1600+pitGap,
	"freedom" : true	
	}];


var ZH = {
	"X" : 50,
	"Y" : 485 - land[0].height,
	"jump" : {
		"ascent" : false,
		"descent" : false
		},
	"velocity" : 9.87
	};

var num = 1;
var interv = {};	
	
document.body.addEventListener("keydown", function(e){
	
	if(e.keyCode == 67 && ZH.jump.ascent == false && ZH.jump.descent == false){
	  	playerAscent();
	}
	
	if(e.keyCode == 39){
		shoot(num++);
	}
	
}, true);	

var canvs = document.getElementById('player');
var c = canvs.getContext("2d");

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var canvs2 = document.getElementById('levels');
var canvs3 = document.getElementById('player');

function levels(){
		
	requestAnimFrame(levels);
	for(i=0; i<2; i++){
		
		//land[i].Yi = 500 - land[i].height;		
		
		if(land[i].freedom == false){
			context.clearRect(land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap), 500-land[i].height-1, pix+2, land[i].height+2 );
			context.beginPath();
			context.rect(0, 500-land[i].height, land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap), land[i].height);
			context.fillStyle = 'yellow';
			context.fill();
			context.lineWidth = 2;
			context.strokeStyle = 'black';
			context.stroke();
			land[i].Yi += pix;
			land[i].appWidth -= 4;
			if((land[i].Yi)%(land[i].width+land[i].pitGap)==0 && land[i].Yi>0)
				context.clearRect(0, 500-land[i].height-1, land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap)+1, land[i].height+2);
		}
		else{
			context.beginPath();
			if(land[i].height > land[i-1].height){
				context.clearRect(land[i-1].width+land[i-1].pitGap-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i].height-1, land[i].width, land[i].height+2);
				context.clearRect(land[i-1].width+land[i-1].pitGap+land[i].width-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i].height-1, pix+2, land[i].height+2);
			}
			else{
				context.clearRect(land[i-1].width+land[i-1].pitGap-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i-1].height-1, land[i].width, land[i-1].height+2);
				context.clearRect(land[i-1].width+land[i-1].pitGap+land[i].width-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i-1].height-1, pix+2, land[i-1].height+2);
			}
			context.rect(land[i-1].width+land[i-1].pitGap-(land[i].Xi)%(land[i-1].width+land[i-1].pitGap), 500-land[i].height, land[i].width, land[i].height);
			if(-land[i].Xi + land[i-1].width + land[i-1].pitGap <=5 && land[i].Xi>0){
				context.clearRect(0, 500-land[i].height-1, land[i].width+2, land[i].height+2);
				land[i].freedom = false;
				land[i].appWidth = land[i].width;
				w = Math.floor(Math.random()*40)+1000+pix*25;
				h = Math.floor(Math.random()*100)+170;
				pitGap = Math.floor(Math.random()*10+200+pix*6);
				console.log(w+" "+pitGap);
				land.push({"width" : w,"height" : h,"pitGap" : pitGap,"Xi" : 0,"Yi" : 0,"appWidth" : 800,"pos" : 800+pitGap,"freedom" : true});
				land.splice(i-1, 1);
				pix +=0.1;
			}
			context.fill();
			context.lineWidth = 2;
			context.strokeStyle = 'black';
			context.stroke();
			land[i].Xi += pix;
		}
		if(land[i].appWidth == land[i].width)
			if(i==1)
				land[i].pos = land[i].width+land[i-1].pitGap+land[i-1].appWidth;
			else
				land[i].pos = land[i].width+land[i+1].pitGap+land[i+1].appwidth;
		else{
			land[i].pos = land[i].appWidth;	
		}	
	}

}

function playerAscent(){
	
	ZH.jump.ascent = true;
	var time=0.0, v=0.0;
	
    var inter = setInterval(function(){	
		if(v<0){
			//console.log(ZH.Y);
			clearInterval(inter);
			ZH.jump.ascent = false;
			playerDescent();
			return;
		}
		
		time += 0.05/3;
		c.clearRect(0, 0, 60, 500);
		
		v = ZH.velocity - 9.87*time;
        ZH.Y -= (v*v)/(2*9.87);
		  
		c.fillRect(ZH.X, ZH.Y, 10, 10);
		c.fill();
	}, 50/3);
	
}

function playerDescent(){
	ZH.jump.descent = true;
	var time=0.0;
	
    var inter = setInterval(function(){	
		if(land[0].freedom == false && (land[1].Xi)%(land[0].width) > 5)
			expr = ZH.Y + land[0].height;
		else if (land[1].freedom == false && (land[0].Xi)%(land[1].width) > 5)
			expr = ZH.Y + land[1].height;	
		if(expr > 480){
			//console.log(ZH.Y);
			clearInterval(inter);
			ZH.jump.descent = false;
			return;
		}
        
		time += 0.05/3;   
		c.clearRect(0, 0, 60, 500);
		
		ZH.Y += 0.5*9.8*time*time;
        
		c.fillRect(ZH.X, ZH.Y, 10, 10);
		c.fill();
	}, 50/3);
	
}


function shoot(i){
	var x=0;
	var X = ZH.X+10, Y = ZH.Y;
	interv[i] = setInterval(function(){
		var bullet = canvs3.getContext("2d");
		bullet.clearRect(X+x, Y+2, 4, 6);
		x+=3;
		bullet.fillRect(X+x, Y+3, 4, 4);
		
		if(ZH.X+x > 1000){
			clearInterval(interv[i]);
			bullet.clearRect(X+x, Y+2, 4, 6);
		}
	}, 10);
}

window.onload = function(){
	c.fillStyle = "#FF0000";	
	c.fillRect(ZH.X, ZH.Y, 10, 10);
    c.fill();
    
    levels();
    
};
