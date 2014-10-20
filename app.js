require.config({
	baseUrl: 'lib',
	paths: {
		'app':'../src',
		'pixi': 'pixi'
	},
	shim: {
		'pixi': {
			exports: 'PIXI'
		}
	}
});

require(['pixi'], function (PIXI, ignoreMe){
	// test change
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0x66FF99);

	// create a renderer instance
	var renderer = new PIXI.WebGLRenderer(400, 300);//autoDetectRenderer(400, 300);

	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);

	requestAnimFrame( animate );

	// create a texture from an image path
	var texture = PIXI.Texture.fromImage("resource/bunny.png");
	// create a new Sprite using the texture
	var bunny = new PIXI.Sprite(texture);

	// center the sprites anchor point
	bunny.anchor.x = 0.5;
	bunny.anchor.y = 0.5;

	// move the sprite t the center of the screen
	bunny.position.x = 200;
	bunny.position.y = 150;
	
	window.onkeydown = keyDEvent;

	stage.addChild(bunny);

	function animate() {

	    requestAnimFrame( animate );

	    // just for fun, lets rotate mr rabbit a little
	    //bunny.rotation += 0.1;

	    // render the stage
	    renderer.render(stage);
	}
	
	function keyDEvent(e) {
		// up arrow => 38
		if(e.keyCode === 38){
			bunny.position.y = bunny.position.y - 2;
		}
		// down arrow => 40
		if(e.keyCode === 40){
			bunny.position.y = bunny.position.y + 2;
		}
		// left arrow => 37
		if(e.keyCode === 37){
			bunny.position.x = bunny.position.x - 2;
		}
		// right arrow => 39
		if(e.keyCode === 39){
			bunny.position.x = bunny.position.x + 2;
		}
	}
});