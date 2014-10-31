define(['pixi','fpsmeter'], function (PIXI,fpsmeter) {

	var startGame = function(){
	
		var texHazelnut = PIXI.Texture.fromImage("img/hazelnut.png");
        var texWaste = PIXI.Texture.fromImage("img/waste.png");
        var texApple = PIXI.Texture.fromImage("img/apple.png");
	
		var rendererHeight = 512;
		var rendererWidth = 512;
	
		var basket, landscape, squirrel, fallingItem;
        
        
        /********** VARIABLE DECLARATION SECTION **********/
        var EGameState = {
            RUNNING:    1,
            PAUSED:     2,
            GAMEOVER:   3,
            MENU:       4,
            INTRO:      5,
            EXIT:       6,
            OFF:        7,
        };
        
        var EDropObjectType = {
            HAZELNUT:   1,
            WASTE:      -3,
            APPLE:      10
        };
        
        var currentState = EGameState.RUNNING;
        
        //Random value for squirrel
        var dstPositonX = Math.floor(Math.random() *(512 - 0 + 1)) + 0;; /**< 0 - 512 x coords */
        var enemyPreviousPositionX = 0;
        
        //Random value for squirrel to drop a object
        var randDropWaitValue = Math.floor(Math.random() *(5 - 1 + 1)) + 1; /**< 5 - 1 seconds */
        var previousDropTime = (new Date().getSeconds());
        
        var arrDropObjects = new Array();
        
        var dropObjectSpeed = 2;
        var scoreCounter = 0;
        var missCounter = 0;
        var previousScoreCounter = -1;
        var scoretext = new PIXI.Text(scoreCounter);
        var previousScoreText = 0;
        
        var textGameOver = "GAME OVER";
		/**************************************************/
        
        /**************** DEBUG DECLARATION SECTION **********************/
        var debug_mode = true;
        
        var fps_stat = new FPSMeter();
        /*****************************************************************/
        
        /**************** FRAMEWORK DECLARATION SECTION ******************/
        
        var frameworkText;
        var frameworkTextArray = new Object();
        var frameworkTextArrayContent = new Array();
        /*****************************************************************/
	
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
			var dropObject = {
                item:       "",
                itemType:   ""
            };            
               
            var randItemTypeValue = Math.floor(Math.random() *(100 - 1 + 1)) + 1;
            
            if(randItemTypeValue <= 50)
            {
                dropObject.itemType = EDropObjectType.HAZELNUT;
                texType = texHazelnut;
            }
            else if(randItemTypeValue > 50 && randItemTypeValue <= 80)
            {
                dropObject.itemType = EDropObjectType.WASTE;
                texType = texWaste;
            }
            else if(randItemTypeValue > 80)
            {
                dropObject.itemType = EDropObjectType.APPLE;
                texType = texApple;
            }
            
            
            fallingItem = new PIXI.Sprite(texType);
			fallingItem.anchor.x = 0.5;
			fallingItem.anchor.y = 0.5;
			//fallingItem.position.x = getRandomStartingPoint();
			fallingItem.position.x = squirrel.position.x;
            fallingItem.position.y = 50;
            
            dropObject.item = fallingItem;
            stage.addChild(fallingItem);
			arrDropObjects.push(dropObject);
		}
	
		function getRandomStartingPoint() {
			return Math.floor((Math.random() * rendererWidth) + 0); 
		}
		
		function updateItem() {

			//fallingItem.position.y += 2;
            
            //SetGameState(EGameState.RUNNING);
            
            if(debug_mode)
            {
                fps_stat.tick();
            }
            //fps_stat.tick;
            
            if(IsGameState(EGameState.RUNNING))
            {   
                PrintText("score",scoreCounter,500,10,0.5,0.5,true);
                
                if(missCounter >= 5)
                {
                    SetGameState(EGameState.GAMEOVER);
                }

                previousScoreCounter = scoreCounter;

                CheckColliosion();
                AIMovement();
            }
            
            if(IsGameState(EGameState.GAMEOVER))
            {   
                PrintText("gameover","GAME OVER",(512/2),(512/2),0.5,0.5,false);
            }    
		}
        
        function CheckColliosion()
        {
            for(var i = 0; i < arrDropObjects.length;i++)
            {
                if( collision(arrDropObjects[i].item, basket, 10, 10) )
                { 
                    scoreCounter += arrDropObjects[i].itemType;
                    
                    stage.removeChild(arrDropObjects[i].item);
                    arrDropObjects.splice(i,1);
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
        
        /***************** BEGIN AI SECTION *****************/
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
        
        
        function AIDropObject()
        {
        	//Move Dropped Objects           
            for(var i = 0; i < arrDropObjects.length;i++)
			{
				arrDropObjects[i].item.position.y += 2;
                
				if(arrDropObjects[i].item.position.y >= 510)
                {	
                    stage.removeChild(arrDropObjects[i].item);
                    arrDropObjects.splice(i,1);
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
        /***************** END AI SECTION *****************/
        
        /***************** BEGIN GAMESTATE SECTION *****************/
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
        /***************** END GAMESTATE SECTION *****************/
        
        
        
        
        
        
        
        
        
        
        
        /**************** BEGIN FRAMEWORK ****************/
        
        /**
        *   Print a text to the screen by id (use it like a string "<id name>")
        */
        function PrintText(id,text,posX,posY,anchorX,anchorY,updateAble)
        {
            //if id is not available
            if(!(id in frameworkTextArray))
            {
                frameworkText = new PIXI.Text(text);
                frameworkText.position.x = posX;
                frameworkText.position.y = posY;
                frameworkText.anchor.x = anchorX;
                frameworkText.anchor.y = anchorY;
                
                stage.addChild(frameworkText);
                
                frameworkTextArray[id] = frameworkText;
            }
            
            //If id is available check if it is null, if so then print
            if(id in frameworkTextArray)
            {
                if(frameworkTextArray[id] == null || updateAble == true)
                {
                    if(updateAble)
                    {
                        stage.removeChild(frameworkTextArray[id])
                    }
                    
                    frameworkText = new PIXI.Text(text);
                    frameworkText.position.x = posX;
                    frameworkText.position.y = posY;
                    frameworkText.anchor.x = anchorX;
                    frameworkText.anchor.y = anchorY;
                
                    stage.addChild(frameworkText);
                
                    frameworkTextArray[id] = frameworkText;
                }
            }
        }
        
        /**
        * Remove a text by id
        */
        function ClearText(id)
        {
            if(id in frameworkTextArray)
            {
                stage.removeChild(frameworkTextArray[id]);
                frameworkTextArray[id] = null;
            }
        }
        
        /**************** BEGIN FRAMEWORK ****************/
        
	};
		
	return {startGame:startGame};
});