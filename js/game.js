define(['pixi'], function (PIXI) {

	var startGame = function(){
	
		var itemTexture = PIXI.Texture.fromImage("img/hazelnut.png");
	
		var rendererHeight = 512;
		var rendererWidth = 512;
	
		var basket, landscape, squirrel, fallingItem;
	
		// create an new instance of a pixi stage
		var stage = new PIXI.Stage(0x000000);

		// create a renderer instance
		var renderer = new PIXI.autoDetectRenderer(rendererWidth, rendererHeight); //WebGLRenderer(512, 512)
		
		createAndAddSprites();
		createAndAddItem();
		
		window.onkeydown = keyDEvent;

		// add the renderer view element to the DOM
		document.body.appendChild(renderer.view);

		requestAnimFrame( animate );

		function animate() {

			requestAnimFrame( animate );

			updateItem();

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
		
		function createAndAddItem() {
			fallingItem = new PIXI.Sprite(itemTexture);
			fallingItem.anchor.x = 0.5;
			fallingItem.anchor.y = 0.5;
			fallingItem.position.x = getRandomStartingPoint();
			fallingItem.position.y = 50;
			
			stage.addChild(fallingItem);
		}
	
		function getRandomStartingPoint() {
			return Math.floor((Math.random() * rendererWidth) + 0); 
		}
		
		function updateItem() {
			fallingItem.position.y += 2;
			
			if( collision(fallingItem, basket, 10, 10) ){
				stage.removeChild(fallingItem);
				createAndAddItem();
			}
		}
		
		function collision(object1, object2, catchOffsetTop, catchOffsetSide) {
			if(object1.position.y > object2.position.y - catchOffsetTop &&
				object1.position.y + object1.height < object2.position.y + object2.height) {
				if (object1.position.x > object2.position.x - catchOffsetSide &&
					object1.position.x + object1.width < object2.position.x + object2.width + catchOffsetSide) {
					return true;
				}
			}
			return false;
		}
	};
		
	return {startGame:startGame};
});