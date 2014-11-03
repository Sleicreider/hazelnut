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
            HAZELNUT:   3,
            WASTE:      -1,
            APPLE:      10
        };
        
        var ELevelState = {
            LEVEL_1:    1,
            LEVEL_2:    2,
            LEVEL_3:    3,
            LEVEL_4:    4,
            LEVEL_5:    5,
            LEVEL_6:    6,
            LEVEL_PEFORMANCE_TEST: 1337,
        };
        
        var callCounterADD = 0;
        var callCounterREMOVE = 0;
        
        
    
        //amount of LIVES
        var amountOfLives = 5;
        
        //Random value for squirrel
        var dstPositonX = Math.floor(Math.random() *(512 - 0 + 1)) + 0;; /**< START  0 - 512 x coords */
        var enemyPreviousPositionX = 0;
        
        //Random value for squirrel to drop a object
        var randDropWaitValue = Math.floor(Math.random() *(3000 - 1 + 1)) + 1; /**< START INTERVAL 1 - 1 milliseconds */
        var previousDropTime = (Date.now());
        
        var arrDropObjects = new Array();
        
        var dropObjectSpeed = 2;
        
        var levelDropInterval       = 0;
        var levelAppleDropRate      = 0;
        var levelWasteDropRate      = 0;
        var levelHazelnutDropRate   = 0;
        var levelBonus              = 0;
        var levelSquirrelSpeed      = 0;
        var levelDropObjectMinSpeed = 0;
        var levelDropObjectMaxSpeed = 0;
            
        var levelStateMachine = new StateMachine();
        
        var scoreCounter = 0;
        var previousScoreCounter = -1;
        
        var textGameOver = "GAME OVER";
		/**************************************************/
        
        /**************** DEBUG DECLARATION SECTION **********************/
        var debug_mode = false;
        
        //For Testing set GameState to RUNNING
        var currentGameState = EGameState.RUNNING;
        var dtLast = Date.now();
        var dtNow = 0;
        var dt = 0;
        
        
        var fps_stat = new FPSMeter();
        /*****************************************************************/
        
        /**************** FRAMEWORK DECLARATION SECTION ******************/
        
        var frameworkText;
        var frameworkTextArray = new Object();
        var frameworkTextArrayContent = new Array();
        
        var frameworkTextSequenceObject = {
            textObject:"",
            startTime:"",
            initialized: false
        };
        
        var frameworkTextSequence = new Object();
        var frameworkTextSequenceArray = new Array();
        /*****************************************************************/
	
		// create an new instance of a pixi stage
		var stage = new PIXI.Stage(0x000000);

		// create a renderer instance
		var renderer = new PIXI.autoDetectRenderer(rendererWidth, rendererHeight); //WebGLRenderer(512, 512)
		
		createAndAddSprites();
		
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
                //BASKET SIZE 32x32
                if(basket.position.x > 17)
                {
                    basket.position.x = basket.position.x - 18;
                }		
			}
			// right arrow => 39
			if(e.keyCode === 39){
                if(basket.position.x < 493)
                {
                    basket.position.x = basket.position.x + 18;
                }	
			}
            if(e.keyCode == 79)
            {
                if(debug_mode)
                {
                    debug_mode = false;
                    //ClearText("debug");
                }
                else
                {
                    debug_mode = true;
                    //PrintText("debug","DEBUGMODE ON",250,500,0.5,0.5,false);
                }
            }
            
            //DEBUGMODE KEYOPTIONS
            if(debug_mode)
            {
                if(e.keyCode == 85)
                {
                    scoreCounter += 100;
                }
                if(e.keyCode == 76)
                {
                    amountOfLives++;
                }
                
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
                itemType:   "",
                speed:      "",
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
            
            var randSpeed = Math.floor(Math.random() *(levelDropObjectMaxSpeed - levelDropObjectMinSpeed + 1)) + levelDropObjectMinSpeed;
            dropObject.speed = randSpeed;
            
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
            dtNow = Date.now();
            dt = dtLast - dtNow;
            console.log(dt);
            if(debug_mode)
            {
                fps_stat.tick();
            }
            
            if(IsGameState(EGameState.RUNNING))
            {   
                PrintText("score",scoreCounter,490,20,0.5,0.5,true);
                
                //create a pointsystem and livesystem function for this
                PrintText("lives","LIVES: " + amountOfLives,(512/2),20,0.5,0.5,true);
                if(amountOfLives <= 0)
                {
                    SetGameState(EGameState.GAMEOVER);
                }

                previousScoreCounter = scoreCounter;

                CheckColliosion();
                AIMovement();
                LevelSystem(scoreCounter);
            }
            
            if(IsGameState(EGameState.GAMEOVER))
            {   
                PrintText("gameover",textGameOver,(512/2),(512/2),0.5,0.5,false);
            }    
            dtLast = Date.now();
		}
        
        function CheckColliosion()
        {
            for(var i = 0; i < arrDropObjects.length;i++)
            {
                if( collision(arrDropObjects[i].item, basket, 10, 10) )
                { 
                    if(arrDropObjects[i].itemType == EDropObjectType.WASTE)
                    {
                        amountOfLives--;
                    }
                    else if(arrDropObjects[i].itemType == EDropObjectType.APPLE)
                    {
                        amountOfLives++;
                        scoreCounter += (arrDropObjects[i].itemType + levelBonus);
                    }
                    else
                    {
                        scoreCounter += (arrDropObjects[i].itemType + levelBonus);
                    }
                             
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
                enemyPositionX += levelSquirrelSpeed;
            }
            else
            {
                enemyPreviousPositionX = enemyPositionX;
                enemyPositionX -= levelSquirrelSpeed;
            }
            
            squirrel.position.x = enemyPositionX; 
            
            AIDropObject();
        }
       
        function AIDropObject()
        {
        	//Move Dropped Objects           
            for(var i = 0; i < arrDropObjects.length;i++)
			{
				arrDropObjects[i].item.position.y += arrDropObjects[i].speed;
                
				if(arrDropObjects[i].item.position.y >= 510)
                {	
                    stage.removeChild(arrDropObjects[i].item);
                    
                    if(arrDropObjects[i].itemType == EDropObjectType.APPLE || arrDropObjects[i].itemType == EDropObjectType.HAZELNUT)
                    {
                        if(!debug_mode)
                        {
                            amountOfLives--;
                        }
                    }  
                    
                    arrDropObjects.splice(i,1);   
				}
			}
					
            if((previousDropTime + randDropWaitValue) < (Date.now()))
            {
                createAndAddItem();
                randDropWaitValue = Math.floor(Math.random() *(levelDropInterval - levelDropInterval/3 + 1)) + levelDropInterval/3;
                previousDropTime = (Date.now());
            }
            if((previousDropTime + randDropWaitValue) > 15 && (Date.now()) < 7)
            {
            	previousDropTime = 0;
            }
        }
        /***************** END AI SECTION *****************/
        
        /***************** BEGIN LEVEL SECTION *****************/
        function LevelSystem(scoreCounter)
        {
            //var levelStateMachine = new StateMachine();
            
            if(scoreCounter <= 15)
            {
                levelStateMachine.SetState(ELevelState.LEVEL_1);
            }
            else if(scoreCounter > 15 && scoreCounter <= 35)
            {
                levelStateMachine.SetState(ELevelState.LEVEL_2);
            }
            else if(scoreCounter > 35 && debug_mode == false)
            {
                levelStateMachine.SetState(ELevelState.LEVEL_3);
            }
            else if(scoreCounter > 35 && scoreCounter < 3000 && debug_mode == true)
            {
                levelStateMachine.SetState(ELevelState.LEVEL_3);
            }
            else if(debug_mode == true && scoreCounter => 3000)
            {
                levelStateMachine.SetState(ELevelState.LEVEL_PEFORMANCE_TEST);
            }
            
            LevelSettings(levelStateMachine.GetState());
        }
        
        function LevelSettings(state)
        {
            if(state == ELevelState.LEVEL_1)
            {
                PrintTextSequence("lvl1","LEVEL 1",250,300,0.5,0.5,false,2000);
                levelDropInterval = 5000;
                levelBonus = 0;
                levelSquirrelSpeed = 2;
                levelDropObjectMinSpeed = 1;
                levelDropObjectMaxSpeed = 2;
            }
            else if(state == ELevelState.LEVEL_2)
            {
                PrintTextSequence("lvl2","LEVEL 2",250,300,0.5,0.5,false,2000);
                levelDropInterval = 3000;
                levelBonus = 5;
                levelSquirrelSpeed = 5;
                levelDropObjectMinSpeed = 1;
                levelDropObjectMaxSpeed = 3;
            }
            else if(state == ELevelState.LEVEL_3)
            {
                PrintTextSequence("lvl3","LEVEL 3",250,300,0.5,0.5,false,2000);
                levelDropInterval = 2000;
                levelBonus = 10;
                levelSquirrelSpeed = 7;
                levelDropObjectMinSpeed = 2;
                levelDropObjectMaxSpeed = 3;
            }
            else if(state == ELevelState.LEVEL_PEFORMANCE_TEST)
            {
                PrintTextSequence("lvl4","PERFORMANCE TEST",250,300,0.5,0.5,false,2000);
                levelDropInterval = 5;
                levelBonus = 100;
                levelSquirrelSpeed = 100;
                levelDropObjectMinSpeed = 1;
                levelDropObjectMaxSpeed = 10;
            }
            
        }
        /***************** END ALEVEL SECTION *****************/
        
        /***************** BEGIN GAMESTATE SECTION *****************/
        function SetGameState(state)
        {
            currentGameState = state;
        }
          
        function IsGameState(state)
        {
            if(currentGameState == state)
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
                    console.log("DRAW TEXT");
                    if(updateAble)
                    {
                        stage.removeChild(frameworkTextArray[id]);
                    }
                    
                    frameworkText = new PIXI.Text(text);
                    frameworkText.position.x = posX;
                    frameworkText.position.y = posY;
                    frameworkText.anchor.x = anchorX;
                    frameworkText.anchor.y = anchorY;
                
                    stage.addChild(frameworkText);
                
                    frameworkTextArray[id] = frameworkText;
                    
                    console.log("ADD=" + callCounterADD + " REMOVE="+callCounterREMOVE);
                }
            }
        }
        
        function PrintTextSequence(id,text,posX,posY,anchorX,anchorY,updateAble,milliSeconds)
        {
            
            //if id is not available
            if(!(id in frameworkTextSequence))
            {
                frameworkTextSequence[id] = frameworkTextSequenceObject;
                
                frameworkText = new PIXI.Text(text);
                frameworkText.position.x = posX;
                frameworkText.position.y = posY;
                frameworkText.anchor.x = anchorX;
                frameworkText.anchor.y = anchorY;
                
                stage.addChild(frameworkText);
                
                frameworkTextSequence[id].textObject = frameworkText;
                frameworkTextSequence[id].startTime = Date.now();
                frameworkTextSequence[id].initialized = true;
            }
            
            //If id is available check if it is null, if so then print
            if(id in frameworkTextSequence)
            {
               if(frameworkTextSequence[id] == null || updateAble == true)
                {
                    if(updateAble)
                    {
                        stage.removeChild(frameworkTextSequence[id].textObject);
                    }
                    if(frameworkTextSequence[id] == null)
                    {
                        frameworkTextSequence[id] = frameworkTextSequenceObject;
                    }
                    
                    frameworkText = new PIXI.Text(text);
                    frameworkText.position.x = posX;
                    frameworkText.position.y = posY;
                    frameworkText.anchor.x = anchorX;
                    frameworkText.anchor.y = anchorY;
                
                    stage.addChild(frameworkText);
                
                    frameworkTextSequence[id].textObject = frameworkText;
                    
                    if(!frameworkTextSequence[id].initialized)
                    {
                        frameworkTextSequence[id].startTime = Date.now();
                        frameworkTextSequence[id].initialized = true;
                    }
                }
            if(frameworkTextSequence[id] != null)
            {
                if((frameworkTextSequence[id].startTime + milliSeconds) <= Date.now())
                {
                    stage.removeChild(frameworkTextSequence[id].textObject);
                    frameworkTextSequence[id] = null;
                }
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
         
        //CREATE A STATEMACHINE?
        //add all states to a array, each state calls a fuction
        
        function StateMachine()
        {
                var currentState = -1;
        }
        
        StateMachine.prototype.SetState = function(state)
        {
            this.currentState = state;
        }
        StateMachine.prototype.GetState = function()
        {
            return this.currentState;
        }
        
        /**************** BEGIN FRAMEWORK ****************/
        
	};
		
	return {startGame:startGame};
});