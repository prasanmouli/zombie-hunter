var canvas = document.getElementById('levels');
var context = canvas.getContext('2d');

var pix = 4;
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
			land[i].appWidth -= pix;
			land[i].pos = 0;
			if((land[i].Yi)%(land[i].width+land[i].pitGap)==0 && land[i].Yi>0)
				context.clearRect(0, 500-land[i].height-1, land[i].width-(land[i].Yi)%(land[i].width+land[i].pitGap)+1, land[i].height+2);
		}
		else{
			land[i].pos = land[i-1].appWidth+land[i-1].pitGap;
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
			if(land[i-1].width+land[i-1].pitGap-land[i].Xi <=5 && land[i].Xi>0){
				context.clearRect(0, 500-land[i].height-1, land[i].width+2, land[i].height+2);
				land[i].freedom = false;
				land[i].appWidth = land[i].width;
				w = Math.floor(Math.random()*40)+1000+pix*25;
				h = Math.floor(Math.random()*100)+170;
				pitGap = Math.floor(Math.random()*10+200+pix*6);
				//console.log(w+" "+pitGap);
				pos = land[i-1].width+land[i-1].pitGap-land[i].Xi+land[i].width+land[i].pitGap;
				land.push({"width" : w,"height" : h,"pitGap" : pitGap,"Xi" : 0,"Yi" : 0,"appWidth" : w,"pos" : pos,"freedom" : true});
				land.splice(i-1, 1);
				pix +=0.1;
			}
			context.fill();
			context.lineWidth = 2;
			context.strokeStyle = 'black';
			context.stroke();
			land[i].Xi += pix;
		}
	}

}

function playerAscent(){
	
	ZH.jump.ascent = true;
	var time=0.0, v=0.0;
	
    var inter = setInterval(function(){	
		if(v<0){
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
		
		t0 = (land[0].pos-ZH.X)/(pix*60);
		t1 = (land[1].pos-ZH.X)/(pix*60);
		
		if(t0<time)
			expr = ZH.Y + land[0].height;
		if (t1<time)
			expr = ZH.Y + land[1].height;	
		
		if(expr > 480){
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
	var Y = ZH.Y;
	interv[i] = setInterval(function(){
		var bullet = canvs3.getContext("2d");
		bullet.clearRect(ZH.X+x+10, Y+2, 4, 6);
		x+=3+Math.floor(pix/25);
		bullet.fillRect(ZH.X+x+10, Y+3, 4, 4);
		console.log(Y+" "+land[0].height+" "+land[1].height);
		if(ZH.X+x > 1000 || (ZH.X+x>=land[1].pos && (land[1].height-land[0].height)>12 && Y+9>(500-land[1].height))){
			clearInterval(interv[i]);
			bullet.clearRect(ZH.X+x+10, Y+2, 4, 6);
		}
	}, 10);
}

window.onload = function(){
	c.fillStyle = "#FF0000";	
	c.fillRect(ZH.X, ZH.Y, 10, 10);
    c.fill();
    
    levels();
    
};
