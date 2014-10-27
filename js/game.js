define(['pixi'], function (PIXI) {

	var startGame = function(){
	
		var basket, landscape, squirrel;
	
		// create an new instance of a pixi stage
		var stage = new PIXI.Stage(0x000000);

		// create a renderer instance
		var renderer = new PIXI.WebGLRenderer(512, 512);//autoDetectRenderer(400, 300);
		
		createAndAddSprites();
		
		window.onkeydown = keyDEvent;

		// add the renderer view element to the DOM
		document.body.appendChild(renderer.view);

		requestAnimFrame( animate );

		function animate() {

			requestAnimFrame( animate );

			// just for fun, lets rotate mr rabbit a little
			//bunny.rotation += 0.1;

			// render the stage
			renderer.render(stage);
		}
		
		function keyDEvent(e) {
			// left arrow => 37
			if(e.keyCode === 37){
				basket.position.x = basket.position.x - 4;
			}
			// right arrow => 39
			if(e.keyCode === 39){
				basket.position.x = basket.position.x + 4;
			}
		}
		
		function createAndAddSprites() {
			var basketTexture = PIXI.Texture.fromImage("img/basket.png");
			basket = new PIXI.Sprite(basketTexture);
			basket.anchor.x = 0.5;
			basket.anchor.y = 0.5;
			basket.position.x = 100;
			basket.position.y = 496;
			
			var landscapeTexture = PIXI.Texture.fromImage("img/landscape.png");
			landscape = new PIXI.Sprite(landscapeTexture);
			landscape.anchor.x = 0;
			landscape.anchor.y = 0;
			landscape.position.x = 0;
			landscape.position.y = 0;
			
			var squirrelTexture = PIXI.Texture.fromImage("img/squirrel.png");
			squirrel = new PIXI.Sprite(squirrelTexture);
			squirrel.anchor.x = 0.5;
			squirrel.anchor.y = 0.5;
			squirrel.position.x = 200;
			squirrel.position.y = 40;
			
			stage.addChild(landscape);
			stage.addChild(basket);
			stage.addChild(squirrel);
		}
	};
		
	return {startGame:startGame};
});