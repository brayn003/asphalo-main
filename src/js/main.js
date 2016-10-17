console.log("We don't talk anymore");

function canvasResize(){
	var canvas = document.getElementById('canvas-landing');
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
}

// canvasResize();


Magnetic = new function(){
	
	var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') != -1) || (navigator.userAgent.toLowerCase().indexOf('iphone') != -1) || (navigator.userAgent.toLowerCase().indexOf('ipad') != -1);
	
	var SCREEN_WIDTH = document.body.clientWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	
	var MAGNETS_AT_START = 1;
	var PARTICLES_PER_MAGNET = 60;
	var MAGNETIC_FORCE_THRESHOLD = 300;
	
	var canvas;
	var context;
	
	var particles = [];
	var magnets = [];
	
	var mouseX = (window.innerWidth - SCREEN_WIDTH);
	var mouseY = (window.innerHeight - SCREEN_HEIGHT);
	var mouseIsDown = false;
	var mouseDownTime = 0;
	
	var skinIndex = 0;
	var skins = [{
		glowA: 'rgba(22,22,22,0.0)',
		glowB: 'rgba(22,22,22,0.0)',
		particleFill: '#333333',
		fadeFill: 'rgba(255,255,255,.6)',
		useFade: false
	}, {
		glowA: 'rgba(233,143,154,0.0)',
		glowB: 'rgba(0,143,154,0.0)',
		particleFill: '#FFFFFF',
		fadeFill: 'rgba(51,51,51,.6)',
		useFade: true
	}
	// , {
	// 	glowA: 'rgba(230,0,0,0.3)',
	// 	glowB: 'rgba(230,0,0,0.0)',
	// 	particleFill: '#ffffff',
	// 	fadeFill: 'rgba(11,11,11,.6)',
	// 	useFade: true
	// }, {
	// 	glowA: 'rgba(0,230,0,0.3)',
	// 	glowB: 'rgba(0,230,0,0.0)',
	// 	particleFill: 'rgba(0,230,0,0.7)',
	// 	fadeFill: 'rgba(22,22,22,.6)',
	// 	useFade: true
	// }, {
	// 	glowA: 'rgba(0,0,0,0.3)',
	// 	glowB: 'rgba(0,0,0,0.0)',
	// 	particleFill: '#333333',
	// 	fadeFill: 'rgba(255,255,255,.6)',
	// 	useFade: true
	// }, {
	// 	glowA: 'rgba(0,0,0,0.0)',
	// 	glowB: 'rgba(0,0,0,0.0)',
	// 	particleFill: '#333333',
	// 	fadeFill: 'rgba(255,255,255,.2)',
	// 	useFade: true
	// }, {
	// 	glowA: 'rgba(230,230,230,0)',
	// 	glowB: 'rgba(230,230,230,0.0)',
	// 	particleFill: '#ffffff',
	// 	fadeFill: '',
	// 	useFade: false
	// }
	];
	
	this.init = function(){
	
		canvas = document.getElementById('canvas-landing');
		
		if (canvas && canvas.getContext) {
			context = canvas.getContext('2d');
			
			if( isMobile ) {
				canvas.style.border = 'none';
			}
			
			// Register event listeners
			document.addEventListener('mousemove', documentMouseMoveHandler, false);
			// canvas.addEventListener('mousedown', documentMouseDownHandler, false);
			// document.addEventListener('mouseup', documentMouseUpHandler, false);
			// document.addEventListener('keydown', documentKeyDownHandler, false);
			window.addEventListener('resize', windowResizeHandler, false);
			// canvas.addEventListener('touchstart', documentTouchStartHandler, false);
			document.addEventListener('touchmove', documentTouchMoveHandler, false);
			document.addEventListener('touchend', documentTouchEndHandler, false);
			
			// document.getElementById('keyboardLeft').addEventListener('click', keyboardLeftHandler, false);
			// document.getElementById('keyboardRight').addEventListener('click', keyboardRightHandler, false);
			
			createBaseMagnets();
			
			windowResizeHandler();
			
			setInterval(loop, 1000 / 30);
		}
	}
	
	function createBaseMagnets(){
		var w = 300;
		var h = 300;
		
		console.log(mouseX,mouseY)
		// for (var i = 0; i < MAGNETS_AT_START; i++) {
			var position = {
				x: SCREEN_WIDTH/2,
				y: SCREEN_HEIGHT/2
			};
			
			createMagnet(position);
			createMagnet({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2},false);
			console.log(magnets);
		// }
	}

	function updateMagnet(magnet,position){
		magnet.position.x = position.x;
		magnet.position.y = position.y;
	}

	function createMagnet(position,particle){
		if (particle == undefined || particle == true) {
			particle = true;
		}else{
			particle = false;
		}

		var m = new Magnet();
		m.position.x = position.x;
		m.position.y = position.y;
		
		magnets.push(m);
		
		if (particle) {
			createParticles(m.position);
		}
	}
	

	function createParticles(position){
		for (var i = 0; i < PARTICLES_PER_MAGNET; i++) {
			var p = new Particle();
			p.position.x = position.x;
			p.position.y = position.y;
			p.shift.x = position.x;
			p.shift.y = position.y;
			p.color = skins[skinIndex].particleFill;
			
			particles.push(p);
		}
	}
	
	function documentMouseMoveHandler(event){
			mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * .5;
			mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * .5;
	}
	
	function documentMouseDownHandler(event){
		event.preventDefault();
		
		handleMouseDown();
	}
	
	function handleMouseDown(){
		mouseIsDown = true;
		
		if (new Date().getTime() - mouseDownTime < 300) {
			// The mouse was pressed down twice with a < 300 ms interval: add a magnet
			createMagnet({
				x: mouseX,
				y: mouseY
			});
			
			mouseDownTime = 0;
		}
		
		mouseDownTime = new Date().getTime();
		
		for (var i = 0, len = magnets.length; i < len; i++) {
			magnet = magnets[i];
			
			if (distanceBetween(magnet.position, {
				x: mouseX,
				y: mouseY
			}) < magnet.orbit * .5) {
				magnet.dragging = true;
				break;
			}
		}
	}
	
	function documentMouseUpHandler(event) {
		mouseIsDown = false;
		
		for( var i = 0, len = magnets.length; i < len; i++ ) {
			magnet = magnets[i];
			magnet.dragging = false;
		}
	}
	
	function documentKeyDownHandler(event) {
		if( event.keyCode == 37 ) {
			changeSkin( -1 );
		}
		else if( event.keyCode == 39  ) {
			changeSkin( 1 );
		}
	}
	
	function documentTouchStartHandler(event) {
		if(event.touches.length == 1) {
			event.preventDefault();
			
			mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;
			mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
			
			handleMouseDown();
		}
	}
	
	function documentTouchMoveHandler(event) {
		if(event.touches.length == 1) {
			event.preventDefault();

			mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;
			mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
		}
	}
	
	function documentTouchEndHandler(event) {
		// mouseIsDown = false;
		
		// for( var i = 0, len = magnets.length; i < len; i++ ) {
		// 	magnet = magnets[i];
		// 	magnet.dragging = false;
		// }
		mouseX = SCREEN_WIDTH/2;
		mouseY = SCREEN_HEIGHT/2;
	}
	
	function keyboardLeftHandler(event) {
		event.preventDefault();
		changeSkin( -1 );
	}
	
	function keyboardRightHandler(event) {
		event.preventDefault();
		changeSkin( 1 );
	}
	
	function changeSkin( offset ) {
		skinIndex += offset;
		skinIndex = skinIndex < 0 ? skins.length-1 : skinIndex;
		skinIndex = skinIndex > skins.length-1 ? 0 : skinIndex;
		
		for (var i = 0, len = particles.length; i < len; i++) {
			particles[i].color = skins[skinIndex].particleFill;
		}
	}
	
	function windowResizeHandler() {
		SCREEN_WIDTH = document.body.clientWidth;
		SCREEN_HEIGHT = window.innerHeight;
		console.log(SCREEN_WIDTH,SCREEN_HEIGHT)
		canvas.width = SCREEN_WIDTH;
		canvas.height = SCREEN_HEIGHT;
		
		var cvx = (window.innerWidth - SCREEN_WIDTH) * .5;
		var cvy = (window.innerHeight - SCREEN_HEIGHT) * .5;
		
		// canvas.style.position = 'absolute';
		// canvas.style.left = cvx + 'px';
		// canvas.style.top = cvy + 'px';
	}

	function loop() {
		
		if( skins[skinIndex].useFade) {
			context.fillStyle = skins[skinIndex].fadeFill;
	   		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		}
		else {
			context.clearRect(0,0,canvas.width,canvas.height);
		}
		
		var particle, magnet;
		var i, j, ilen, jlen;
		
		var magnetToKill = -1;
		
		// Render the magnets
		for( j = 0, jlen = magnets.length; j < jlen; j++ ) {
			magnet = magnets[j];
			
			if( j == 1 ) {
				magnet.position.x += ( mouseX - magnet.position.x ) * 0.2;
				magnet.position.y += ( mouseY - magnet.position.y ) * 0.2;
			}

			if( mouseX < 10 || mouseY < 10 || mouseX > SCREEN_WIDTH-10 || mouseY > SCREEN_HEIGHT-10 ) {
				magnet.position.x = SCREEN_WIDTH/2;
				magnet.position.y = SCREEN_HEIGHT/2;
			}
			
			// Increase the size of the magnet center point depending on # of connections
			magnet.size += ( (magnet.connections/3) - magnet.size ) * 0.05;
			magnet.size = Math.max(magnet.size,2);
			
			var gradientFill = context.createRadialGradient(magnet.position.x,magnet.position.y,0,magnet.position.x,magnet.position.y,magnet.size*10);
			gradientFill.addColorStop(0,skins[skinIndex].glowA);
			gradientFill.addColorStop(1,skins[skinIndex].glowB);
			
			context.beginPath();
			context.fillStyle = gradientFill;
			context.arc(magnet.position.x, magnet.position.y, magnet.size*10, 0, Math.PI*2, true);
			context.fill();
			
			context.beginPath();
			context.fillStyle = gradientFill;
			context.arc(magnet.position.x, magnet.position.y, magnet.size, 0, Math.PI*2, true);
			context.fill();
			
			magnet.connections = 0;
		}
		
		if ( magnetToKill != -1 && magnets.length > 1 ) {
			magnets.splice(magnetToKill, 1)
		}
		
		// Render the particles
		for (i = 0, ilen = particles.length; i < ilen; i++) {
			particle = particles[i];
			
			var currentDistance = -1;
			var closestDistance = -1;
			var closestMagnet = null;
			
			var force = { x: 0, y: 0 };
			
			// For each particle, we check what the closes magnet is
			for( j = 0, jlen = magnets.length; j < jlen; j++ ) {
				magnet = magnets[j];
				
				currentDistance = distanceBetween( particle.position, magnet.position ) - ( magnet.orbit * 0.5 );
				
				if( particle.magnet != magnet ) {
					var fx = magnet.position.x - particle.position.x;
					if( fx > -MAGNETIC_FORCE_THRESHOLD && fx < MAGNETIC_FORCE_THRESHOLD ) {
						force.x += fx / MAGNETIC_FORCE_THRESHOLD;
					}
					
					var fy = magnet.position.y - particle.position.y;
					if( fy > -MAGNETIC_FORCE_THRESHOLD && fy < MAGNETIC_FORCE_THRESHOLD ) {
						force.y += fy / MAGNETIC_FORCE_THRESHOLD;
					}
					
				}
					
				if( closestMagnet == null || currentDistance < closestDistance ) {
					closestDistance = currentDistance;
					closestMagnet = magnet;
				}
			}
			
			if( particle.magnet == null || particle.magnet != closestMagnet ) {
				particle.magnet = closestMagnet;
			}
			
			closestMagnet.connections += 1;
			
			// Rotation
			particle.angle += particle.speed * particle.direction;
			
			// Translate towards the magnet position
			particle.shift.x += ( (closestMagnet.position.x+(force.x*6)) - particle.shift.x) * particle.speed;
			particle.shift.y += ( (closestMagnet.position.y+(force.y*6)) - particle.shift.y) * particle.speed;
			
			// Appy the combined position including shift, angle and orbit
			particle.position.x = particle.shift.x + Math.cos(i+particle.angle) * (particle.orbit*particle.force);
			particle.position.y = particle.shift.y + Math.sin(i+particle.angle) * (particle.orbit*particle.force);
			
			// Limit to screen bounds
			particle.position.x = Math.max( Math.min( particle.position.x, SCREEN_WIDTH-particle.size/2 ), particle.size/2 );
			particle.position.y = Math.max( Math.min( particle.position.y, SCREEN_HEIGHT-particle.size/2 ), particle.size/2 );
			
			// Slowly inherit the cloest magnets orbit
			particle.orbit += ( closestMagnet.orbit - particle.orbit ) * 0.1;
			
			context.beginPath();
			context.fillStyle = particle.color;
			context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
			context.fill();
		}
	}
	
	function distanceBetween(p1,p2) {
		var dx = p2.x-p1.x;
		var dy = p2.y-p1.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	
};

function Particle() {
	this.size = 0.5+Math.random()*10;
	this.position = { x: 0, y: 0 };
	this.shift = { x: 0, y: 0 };
	this.angle = 0;
	this.speed = 0.01 + (this.size/4) * 0.003;
	this.force = 1 - (Math.random()*0.11);
	this.color = '#ffffff';
	this.orbit = 1;
	this.magnet = null;
	this.direction = Math.random() > 0.5 ? -1 : 1;
}

function Magnet() {
	this.orbit = 150;
	this.position = { x: 0, y: 0 };
	this.dragging = false;
	this.connections = 0;
	this.size = 10;
}


Magnetic.init();
	
