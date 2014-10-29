define(['pixi'], function (PIXI) {

	var startGame = function(){
	
		var itemTexture = PIXI.Texture.fromImage("img/hazelnut.png");
	
		var rendererHeight = 512;
		var rendererWidth = 512;
	
		var basket, landscape, squirrel, fallingItem;
        
        
        /********** VARIABLE DECLARATION SECTION **********/
        var EState = {
            RUNNING:    1,
            PAUSED:     2,
            GAMEOVER:   3,
            MENU:       4,
            INTRO:      5,
            EXIT:       6,
            OFF:        7,
        };
        
        var currentState = EState.RUNNING;
        
        //Random value for squirrel
        var dstPositonX = Math.floor(Math.random() *(512 - 0 + 1)) + 0;; /**< 0 - 512 x coords */
        var enemyPreviousPositionX = 0;
        
        //Random value for squirrel to drop a object
        var randDropWaitValue = Math.floor(Math.random() *(5 - 1 + 1)) + 1; /**< 5 - 1 seconds */
        var previousDropTime = (new Date().getSeconds());
        
        var vec = new Array();
        
        var dropObjectSpeed = 2;
        var scoreCounter = 0;
        var missCounter = 0;
        var previousScoreCounter = -1;
        var scoretext = new PIXI.Text(scoreCounter);
        var previousScoreText = 0;
        
        var textGameOver = "GAME OVER";
		/**************************************************/
	
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
				basket.position.x = basket.position.x - 15;
			}
			// right arrow => 39
			if(e.keyCode === 39){
				basket.position.x = basket.position.x + 15;
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
			//fallingItem.position.x = getRandomStartingPoint();
			fallingItem.position.x = squirrel.position.x;
            fallingItem.position.y = 50;
			vec.push(fallingItem);
			stage.addChild(fallingItem);
		}
	
		function getRandomStartingPoint() {
			return Math.floor((Math.random() * rendererWidth) + 0); 
		}
		
		function updateItem() {

			//fallingItem.position.y += 2;
            
               
            //SetGameState(EState.RUNNING);
        
            if(IsGameState(EState.RUNNING))
            {
                //Only Add Child when score has changed 
                if(previousScoreCounter != scoreCounter)
                {
                    if(previousScoreText != 0)
                    {
                        stage.removeChild(previousScoreText);
                    }
                    scoretext = new PIXI.Text(scoreCounter);
                    stage.addChild(scoretext);
                    previousScoreText = scoretext;
                }
                
                if(missCounter >= 5)
                {
                    SetGameState(EState.GAMEOVER);
                }

                previousScoreCounter = scoreCounter;

                CheckColliosion();
                AIMovement();
            }
            
            if(IsGameState(EState.GAMEOVER))
            {
                var gameOverText = new PIXI.Text("GAME OVER");
                gameOverText.position.x = 512 / 2;
                gameOverText.position.y = 512 / 2;
                gameOverText.anchor.x = 0.5;
                gameOverText.anchor.y = 0.5;
                stage.addChild(gameOverText);
            }

            
		}
        
        function CheckColliosion()
        {
            for(var i = 0; i < vec.length;i++)
            {
                if( collision(vec[i], basket, 10, 10) )
                { 
                    scoreCounter++;
                    stage.removeChild(vec[i]);
                    vec.splice(i,1);
                }
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
        
        function AIMovement()
        {                   
            var enemyPositionX = squirrel.position.x;
            
            
            //Get New Destination
            if(enemyPositionX >= dstPositonX && enemyPreviousPositionX <= dstPositonX || enemyPositionX <= dstPositonX && enemyPreviousPositionX >= dstPositonX)
            {
                dstPositonX = Math.floor(Math.random() *(512 - 0 + 1)) + 0;
            }
                  
            //Move to destination
            if(dstPositonX > enemyPositionX)
            {
                enemyPreviousPositionX = enemyPositionX;
                enemyPositionX +=5;
            }
            else
            {
                enemyPreviousPositionX = enemyPositionX;
                enemyPositionX -=5;
            }
            
            squirrel.position.x = enemyPositionX; 
            
            AIDropObject();
        }
        
        function SetGameState(state)
        {
            currentState = state;
        }
        
        
        function IsGameState(state)
        {
            if(currentState == state)
            {
                return true;
            }
            else 
            {
                return false;
            }
        }
        
        
        function AIDropObject()
        {
        	//Move Dropped Objects           
            for(var i = 0; i < vec.length;i++)
			{
				vec[i].position.y += 2;
				
				if(vec[i].position.y >= 510)
				{	
                    stage.removeChild(vec[i]);
                    vec.splice(i,1);
                    missCounter++;
				}
			}
					
            if((previousDropTime + randDropWaitValue) < (new Date().getSeconds()))
            {
                createAndAddItem();
                randDropWaitValue = Math.floor(Math.random() *(5 - 1 + 1)) + 1;
                previousDropTime = (new Date().getSeconds());
            }
            if((previousDropTime + randDropWaitValue) > 15 && (new Date().getSeconds()) < 7)
            {
            	previousDropTime = 0;
            }
        }
	};
		
	return {startGame:startGame};
});