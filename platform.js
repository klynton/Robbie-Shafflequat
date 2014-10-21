function recordFPS()
{
	var functionTimer;
	textObj.context.clearRect(0,0,500,50);
	textObj.context.fillText("FPS: " + game.fps, 100, 50);
	game.fps = 0;
	functionTimer = setTimeout("recordFPS()",1000);
}

function init() //game initiation function
{
	if(game.init()) game.start(); //if the game object initiates true, and the canvas is supported, begin animation loop
}
/*
document.addEventListener("mousemove",function(e){
	console.log(e.clientX + " " + e.clientY);
},false);
*/
function Game_Class() //class constructor for the game object
{
	this.fps = 0;
	this.squarePool = []; //array for static SQUARES
	this.hitableSquarePoolFlex = []; //array for hitable squares with type "flexible"
	this.hitableSquarePoolInflex = []; //array for hitable squares with type "inflexible"
	this.orbPoolAlive = [];
	this.orbPoolDead = [];
	this.spawnX = 0;
	this.spawnY = 0;

	this.init = function() //initialization method
	{
		this.canvasBg = document.getElementById('canvasBg'); //create basic canvas id selector outside of conditional statement
		if(this.canvasBg.getContext) //return true if context of the canvas is supported
		{
			this.contextBg = this.canvasBg.getContext('2d'); //initiate background canvas context

			this.canvasPlayer = document.getElementById('canvasPlayer'); //canvasPlayer id selector
			this.contextPlayer = this.canvasPlayer.getContext('2d'); //player canvas context selector

			this.canvasText = document.getElementById('canvasText'); //canvasText id selector
			this.contextText = this.canvasText.getContext('2d'); //canvasText context selector

			this.canvasGame = document.getElementById('canvasGame');
			this.contextGame = this.canvasGame.getContext('2d');

			Text_Object.prototype.context = this.contextText; //provide text object with context
			Text_Object.prototype.canvasWidth = this.canvasText.width; //provide text object with its canvas width
			Text_Object.prototype.canvasHeight = this.canvasText.height; //provide text object with its canvas height
			Background.prototype.canvasWidth = this.canvasBg.width; //provide background object with its canvas width
			Background.prototype.canvasHeight = this.canvasBg.height; //provide background object with its canvas height
			Background.prototype.context = this.contextBg; //provide background object with its context
			Player.prototype.canvasWidth = this.canvasPlayer.width; //provide player object with its canvas width
			Player.prototype.canvasHeight = this.canvasPlayer.height; //provide player object with its canvas height
			Player.prototype.speed = 3;
			Player.prototype.context = this.contextPlayer; //provide player object with its context
			Square.prototype.context = this.contextBg;
			Square.prototype.canvasWidth = this.canvasBg.width;
			Square.prototype.canvasHeight = this.canvasBg.height;
			Hitable_Square.prototype.context = this.contextGame;
			Hitable_Square.prototype.canvasWidth = this.canvasGame.width;
			Hitable_Square.prototype.canvasHeight = this.canvasGame.height;
			Orb.prototype.context = this.contextGame;
			Orb.prototype.canvasWidth = this.canvasGame.width;
			Orb.prototype.canvasHeight = this.canvasGame.height;
			Enemy.prototype.context = this.contextGame;
			Enemy.prototype.canvasWidth = this.canvasGame.width;
			Enemy.prototype.canvasHeight = this.canvasGame.height;
			guiHandler.context = this.contextText;
			guiHandler.canvasWidth = this.canvasText.width;
			guiHandler.canvasHeight = this.canvasText.height;
			Sword.prototype.context = this.contextGame;
			Sword.prototype.canvasWidth = this.canvasGame.width;
			Sword.prototype.canvasHeight = this.canvasGame.height;
			Item_Bar.prototype.context = this.contextGame;
			Item_Bar.prototype.canvasWidth = this.canvasGame.width;
			Item_Bar.prototype.canvasHeight = this.canvasGame.height;

			Game_Class.prototype.groundLevel = this.canvasGame.height - 45; //asign ground level of canvas based on background image, 45 pixels from the canvas floor

			this.background = new Background();//instantiate background image
			this.background.init(0,0,this.background.canvasWidth,this.background.canvasHeight); //initiate background object statistics
			this.background.draw(); //draw background once

			this.background.context.drawImage(imageRep.orbObject,8,2,20,20); //initiate drawing of orb collectables at top left corner of screen

			//array full of object literals containing x and y positions for the square objectx to be spawned
			this.squarePositions = [
			{x: 200, y:game.groundLevel - 25},
			{x: 400, y:game.groundLevel - 25},
			{x: 600, y:game.groundLevel - 25}
			];

			
			//array full of object literals containing x and y positions for the hitable square objects with type "flexible"
			this.hitableSquarePositionsFlex = [
			{x:50, y: 75}
			];
			//array full of object literals containing x and y positions for the hitable square objects with type "inflexible"
			this.hitableSquarePositionsInflex = [
			{x:300, y: 75},
			{x:500, y: 75}
			];

			/***********************
			BEFORE OBJECT POOL CLASS
			***********************/

			this.spawnSquares(3); //instantiate square objects
			this.spawnHitables(1,true); //instantiate hitable square objects with type "flexible"
			this.spawnHitables(2,false);//instantiate hitable square object with type "inflexible"

			/***********************
			AFTER OBJECT POOL CLASS
			***********************/

			this.item_bar = new Item_Bar();
			this.item_bar.init(600, this.canvasGame.height - 40, 300, 40);
			this.item_bar.draw();

			this.player = new Player(); //instantiate player object within the game object
			this.player.init(100,game.groundLevel - 30,30,30); //initiate player properties 

			this.orbPool = new Pool(30); //instantiate orb Pool objects 
			this.orbPool.init("orb"); // initate

			for(var i = 0; i < 20; i++) //iterate portion of orbs to be stationary
			{
				this.orbPool.getType("stationary");
				this.orbPool.get(100 + i * 30, 20);
			}

			this.orbPool.drawAll(); //draw all alive orbs

			this.enemy = new Enemy();
			this.enemy.init(421,90,25,40);
			this.enemy.draw();

			this.sword = new Sword();
			this.sword.init(0,0,25,60);
			//this.sword.context.fillRect(400,0,100,100);
			this.sword.create(700,50);
			//this.sword.draw();


/*
			for(var i = 0; i < this.orbPool.length; i++)
			{
				this.orbPool[i].initiation(i * 30, 55);
				this.orbPool[i].floating = true;
			}
*/
			return true;
		}
		else
		{
			return false; //213,game.groundLevel - 55return false if canvas context is not supported 
		}

	};

	//method for spawning square objects
	this.spawnSquares = function(number) //parameter for how many squares will be spawned
	{
		for(var i = 0; i < number; i++) //iterate through the parameter's value  
		{
			var square = new Square(); //create placeholder variable as a neew square object
			square.init(this.squarePositions[i].x,this.squarePositions[i].y,50,25); //place object along the ground
			this.squarePool[i] = square; //place object into the square object list
			this.squarePool[i].draw(); //draw current square
		}
	};

	//method for spawning hitable square object
	this.spawnHitables = function(number,flexible) //parameter for how many hitable squares will be spawned
	{											   //flexible is a boolean value
		if(flexible) //if flexible is true, all proceeding objects will possess the type "flexible" when spawned
		{			 //and be added to hitableSquareFlex[] array   
			for(var i = 0; i < number; i++) //iterate through the parameter's value
			{
				var square = new Hitable_Square("flexible");//create placeholder variable as the new hitable square object with type "flexible"
				square.init(this.hitableSquarePositionsFlex[i].x, this.hitableSquarePositionsFlex[i].y, 25,25); //place object in the air
				this.hitableSquarePoolFlex[i] = square;//place object into the hitable square object list
				this.hitableSquarePoolFlex[i].draw();// draw current hitable square
			}
		}
		else //flexible is false, and all proceeding objects will possess the type "inflexible" when spawned
		{    //then added to the hitableSquareInflex[] array
			for(var i = 0; i < number; i++)
			{
				var square = new Hitable_Square("inflexible");
				square.init(this.hitableSquarePositionsInflex[i].x, this.hitableSquarePositionsInflex[i].y, 25,25);
				this.hitableSquarePoolInflex[i] = square;
				this.hitableSquarePoolInflex[i].draw();
			}
		}
	};

	this.returnAliveStatus = function()
	{
		for(var i = 0; i < this.orbPool.length;i++)
		{
			this.orbPoolAlive[i] = this.orbPool[i].alive;
		}
		console.log(this.orbPool.length);
		console.log(this.orbPoolAlive);
	};

	this.start = function() //game start method
	{
		this.player.draw();
		//recordFPS();
		animate(); //initiate animation function
	};
}

var game = new Game_Class(); //instantiate game object

function ImageRepository() //image repository class constructor to store images and handle image related functionality
{
	//list of new images

	//idle image
	this.robIdle1 = new Image();

	/**************
	IMAGES: PLAYER RIGHT
	***************/
	//right walking
	this.robRight = new Image();
	this.testRightRun = new Image();
	this.testRightRun2 = new Image();

	//right jumping
	this.testJumpRight = new Image();

	//right falling
	this.testFallRight = new Image();

	this.equippedSwordRight = new Image();

	/*****************
	IMAGES: PLAYER LEFT
	******************/	
	//left walking
	this.robLeft = new Image();
	this.testLeftRun = new Image();
	this.testLeftRun2 = new Image();

	//left jumping
	this.testJumpLeft = new Image();

	//left falling
	this.testFallLeft = new Image();

	//equipped sword left
	this.equippedSwordLeft = new Image();

	/**************
	IMAGES: ENEMY
	***************/

	//enemy left walking
	this.EnemyLeft = new Image();
	this.EnemyLeft2 = new Image();
	this.EnemyLeft3 = new Image();
	this.EnemyLeft4 = new Image();
	this.EnemyLeft5 = new Image();
	this.EnemyLeft6 = new Image();
	this.EnemyLeft7 = new Image();

	//enemy right walking
	this.EnemyRight = new Image();
	this.EnemyRight2 = new Image();
	this.EnemyRight3 = new Image();
	this.EnemyRight4 = new Image();
	this.EnemyRight5 = new Image();
	this.EnemyRight6 = new Image();
	this.EnemyRight7 = new Image();

	//enemy left transforming
	this.EnemyLeftTransform = new Image();
	this.EnemyLeftTransform2 = new Image();
	this.EnemyLeftTransform3 = new Image();
	this.EnemyLeftTransform4 = new Image();
	this.EnemyLeftTransform5 = new Image();
	this.EnemyLeftTransform6 = new Image();
	this.EnemyLeftTransform7 = new Image();
	this.EnemyLeftTransform8 = new Image();

	//enemy right transforming
	this.EnemyRightTransform = new Image();
	this.EnemyRightTransform2 = new Image();
	this.EnemyRightTransform3 = new Image();
	this.EnemyRightTransform4 = new Image();
	this.EnemyRightTransform5 = new Image();
	this.EnemyRightTransform6 = new Image();
	this.EnemyRightTransform7 = new Image();
	this.EnemyRightTransform8 = new Image();

	//koopa shell images
	this.KoopaShellLeft = new Image();
	this.KoopaShellRight = new Image();
	this.KoopaShell2 = new Image();
	this.KoopaShell3 = new Image();
	this.KoopaShell4 = new Image();
	this.KoopaShell5 = new Image();
	this.KoopaShell6 = new Image();

	//koop reverting images
	this.RevertingLeft = new Image();
	this.RevertingLeft2 = new Image();
	this.RevertingLeft3 = new Image();
	this.RevertingLeft4 = new Image();
	this.RevertingLeft5 = new Image();
	this.RevertingLeft6 = new Image();

	//koop reverting images
	this.RevertingRight = new Image();
	this.RevertingRight2 = new Image();
	this.RevertingRight3 = new Image();
	this.RevertingRight4 = new Image();
	this.RevertingRight5 = new Image();
	this.RevertingRight6 = new Image();

	/***************
	EQUIPABLE ITEMS
	****************/
	this.EquipableSword = new Image();


	/*****************
	MAJOR GAME IMAGES
	*****************/
	//game background
	this.background = new Image();
	this.squareObject = new Image();
	this.hitableSquare = new Image();
	this.postHitSquare = new Image();
	this.orbObject = new Image();
	this.playerHp = new Image();
	this.playerMaxHp = new Image();
	this.Item_Bar = new Image();
	this.sword_icon = new Image();

	/*******************
	IMAGES: LOADING
	*******************/

	var numLoaded = 0; //private variable for number of images currently loaded
	var numImages = 70; //private variable for number of total images required to load

	var imageLoad = function() //method to count loaded images
	{
		numLoaded++; //increase images loaded count by 1

		//when all images have been loaded, initiate main program
		if(numLoaded === numImages) 
		{
			window.init();
		}
		console.log(numLoaded);
	};

	//when images load, add to load count

	this.robIdle1.onload = function()
	{
		imageLoad(); 
	};

	this.robRight.onload = function()
	{
		imageLoad();
	};

	this.testRightRun.onload = function()
	{
		imageLoad();
	};

	this.testRightRun2.onload = function()
	{
		imageLoad();
	};

	this.testJumpRight.onload = function()
	{
		imageLoad();
	};

	this.testFallRight.onload = function()
	{
		imageLoad();
	};

	this.robLeft.onload = function()
	{
		imageLoad();
	};

	this.testLeftRun.onload = function()
	{
		imageLoad();
	};

	this.testLeftRun2.onload = function()
	{
		imageLoad();
	};

	this.testJumpLeft.onload = function()
	{
		imageLoad();
	};

	this.testFallLeft.onload = function()
	{
		imageLoad();
	};

	this.background.onload = function()
	{
		imageLoad();
	};

	this.squareObject.onload = function()
	{
		imageLoad();
	};

	this.hitableSquare.onload = function()
	{
		imageLoad();
	};

	this.postHitSquare.onload = function()
	{
		imageLoad();
	};

	this.orbObject.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeft.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeft2.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeft3.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeft4.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeft5.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeft6.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeft7.onload = function()
	{
		imageLoad();
	};	

	this.EnemyRight.onload = function()
	{
		imageLoad();
	};

	this.EnemyRight2.onload = function()
	{
		imageLoad();
	};

	this.EnemyRight3.onload = function()
	{
		imageLoad();
	};

	this.EnemyRight4.onload = function()
	{
		imageLoad();
	};

	this.EnemyRight5.onload = function()
	{
		imageLoad();
	};

	this.EnemyRight6.onload = function()
	{
		imageLoad();
	};

	this.EnemyRight7.onload = function()
	{
		imageLoad();
	};	

	this.EnemyLeftTransform.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeftTransform2.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeftTransform3.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeftTransform4.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeftTransform5.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeftTransform6.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeftTransform7.onload = function()
	{
		imageLoad();
	};

	this.EnemyLeftTransform8.onload = function()
	{
		imageLoad();
	};

	this.EnemyRightTransform.onload = function()
	{
		imageLoad();
	};

	this.EnemyRightTransform2.onload = function()
	{
		imageLoad();
	};

	this.EnemyRightTransform3.onload = function()
	{
		imageLoad();
	};

	this.EnemyRightTransform4.onload = function()
	{
		imageLoad();
	};

	this.EnemyRightTransform5.onload = function()
	{
		imageLoad();
	};

	this.EnemyRightTransform6.onload = function()
	{
		imageLoad();
	};

	this.EnemyRightTransform7.onload = function()
	{
		imageLoad();
	};

	this.EnemyRightTransform8.onload = function()
	{
		imageLoad();
	};

	this.KoopaShellLeft.onload = function()
	{
		imageLoad();
	};

	this.KoopaShellRight.onload = function()
	{
		imageLoad();
	};

	this.KoopaShell2.onload = function()
	{
		imageLoad();
	};

	this.KoopaShell3.onload = function()
	{
		imageLoad();
	};

	this.KoopaShell4.onload = function()
	{
		imageLoad();
	};

	this.KoopaShell5.onload = function()
	{
		imageLoad();
	};

	this.KoopaShell6.onload = function()
	{
		imageLoad();
	};

	//koopa reverting images
	this.RevertingLeft.onload = function()
	{
		imageLoad();
	};

	this.RevertingLeft2.onload = function()
	{
		imageLoad();
	};

	this.RevertingLeft3.onload = function()
	{
		imageLoad();
	};

	this.RevertingLeft4.onload = function()
	{
		imageLoad();
	};

	this.RevertingLeft5.onload = function()
	{
		imageLoad();
	};

	this.RevertingLeft6.onload = function()
	{
		imageLoad();
	};

	this.RevertingRight.onload = function()
	{
		imageLoad();
	};

	this.RevertingRight2.onload = function()
	{
		imageLoad();
	};

	this.RevertingRight3.onload = function()
	{
		imageLoad();
	};

	this.RevertingRight4.onload = function()
	{
		imageLoad();
	};

	this.RevertingRight5.onload = function()
	{
		imageLoad();
	};

	this.RevertingRight6.onload = function()
	{
		imageLoad();
	};

	this.playerHp.onload = function()
	{
		imageLoad();
	};

	this.playerMaxHp.onload = function()
	{
		imageLoad();
	};

	this.EquipableSword.onload = function()
	{
		imageLoad();
	};

	this.Item_Bar.onload = function()
	{
		imageLoad();
	};

	this.sword_icon.onload = function()
	{
		imageLoad();
	};

	this.equippedSwordRight.onload = function()
	{
		imageLoad();
	};

	this.equippedSwordLeft.onload = function()
	{
		imageLoad();
	};

	/******************
	IMAGES: SOURCES
	*******************/

	//list of image sources

	//idle image
	this.robIdle1.src = "spriteSheets/robIdle1.png";

	//right walking
	this.robRight.src = "spriteSheets/robRight.png";
	this.testRightRun.src = "spriteSheets/testRightRun.png";
	this.testRightRun2.src = "spriteSheets/testRightRun2.png";

	//right jumping
	this.testJumpRight.src = "spriteSheets/testJumpRight.png";

	//right falling
	this.testFallRight.src = "spriteSheets/testFallRight.png";

	//left walking
	this.robLeft.src = "spriteSheets/robLeft.png";
	this.testLeftRun.src = "spriteSheets/testLeftRun.png";
	this.testLeftRun2.src = "spriteSheets/testLeftRun2.png";

	//left jumping
	this.testJumpLeft.src = "spriteSheets/testJumpLeft.png";

	//left falling
	this.testFallLeft.src = "spriteSheets/testFallLeft.png";

	//game background
	this.background.src = "spriteSheets/ground.png";

	//square object image
	this.squareObject.src = "spriteSheets/squareObject.png";

	//hitable square object
	this.hitableSquare.src = "spriteSheets/hitableSquare.png";

	//post hit square object
	this.postHitSquare.src = "spriteSheets/postHitSquare.png";

	//orb object
	this.orbObject.src = "spriteSheets/orbObject.png";

	//enemy left walking
	this.EnemyLeft.src = "spriteSheets/EnemyLeft.png";
	this.EnemyLeft2.src = "spriteSheets/EnemyWalkingLeft2.png";
	this.EnemyLeft3.src = "spriteSheets/EnemyWalkingLeft3.png";
	this.EnemyLeft4.src = "spriteSheets/EnemyWalkingLeft4.png";
	this.EnemyLeft5.src = "spriteSheets/EnemyWalkingLeft5.png";
	this.EnemyLeft6.src = "spriteSheets/EnemyWalkingLeft6.png";
	this.EnemyLeft7.src = "spriteSheets/EnemyWalkingLeft7.png";

	//enemy right walking
	this.EnemyRight.src = "spriteSheets/EnemyRight.png";
	this.EnemyRight2.src = "spriteSheets/EnemyWalkingRight2.png";
	this.EnemyRight3.src = "spriteSheets/EnemyWalkingRight3.png";
	this.EnemyRight4.src = "spriteSheets/EnemyWalkingRight4.png";
	this.EnemyRight5.src = "spriteSheets/EnemyWalkingRight5.png";
	this.EnemyRight6.src = "spriteSheets/EnemyWalkingRight6.png";
	this.EnemyRight7.src = "spriteSheets/EnemyWalkingRight7.png";

	//enemy left transform
	this.EnemyLeftTransform.src = "spriteSheets/EnemyLeftTransform.png";
	this.EnemyLeftTransform2.src = "spriteSheets/EnemyLeftTransform2.png";
	this.EnemyLeftTransform3.src = "spriteSheets/EnemyLeftTransform3.png";
	this.EnemyLeftTransform4.src = "spriteSheets/EnemyLeftTransform4.png";
	this.EnemyLeftTransform5.src = "spriteSheets/EnemyLeftTransform5.png";
	this.EnemyLeftTransform6.src = "spriteSheets/EnemyLeftTransform6.png";
	this.EnemyLeftTransform7.src = "spriteSheets/EnemyLeftTransform7.png";
	this.EnemyLeftTransform8.src = "spriteSheets/EnemyLeftTransform8.png";

	//enemy right transform
	this.EnemyRightTransform.src = "spriteSheets/EnemyRightTransform.png";
	this.EnemyRightTransform2.src = "spriteSheets/EnemyRightTransform2.png";
	this.EnemyRightTransform3.src = "spriteSheets/EnemyRightTransform3.png";
	this.EnemyRightTransform4.src = "spriteSheets/EnemyRightTransform4.png";
	this.EnemyRightTransform5.src = "spriteSheets/EnemyRightTransform5.png";
	this.EnemyRightTransform6.src = "spriteSheets/EnemyRightTransform6.png";
	this.EnemyRightTransform7.src = "spriteSheets/EnemyRightTransform7.png";
	this.EnemyRightTransform8.src = "spriteSheets/EnemyRightTransform8.png";

	//koopa shell images 
	this.KoopaShellLeft.src = "spriteSheets/KoopaShellLeft.png";
	this.KoopaShellRight.src = "spriteSheets/KoopaShellRight.png";
	this.KoopaShell2.src = "spriteSheets/KoopaShell2.png";
	this.KoopaShell3.src = "spriteSheets/KoopaShell3.png";
	this.KoopaShell4.src = "spriteSheets/KoopaShell4.png";
	this.KoopaShell5.src = "spriteSheets/KoopaShell5.png";
	this.KoopaShell6.src = "spriteSheets/KoopaShell6.png";

	//koopa reverting images
	this.RevertingLeft.src = "spriteSheets/RevertingLeft.png";
	this.RevertingLeft2.src = "spriteSheets/RevertingLeft2.png";
	this.RevertingLeft3.src = "spriteSheets/RevertingLeft3.png";
	this.RevertingLeft4.src = "spriteSheets/RevertingLeft4.png";
	this.RevertingLeft5.src = "spriteSheets/RevertingLeft5.png";
	this.RevertingLeft6.src = "spriteSheets/RevertingLeft6.png";

	this.RevertingRight.src = "spriteSheets/RevertingRight.png";
	this.RevertingRight2.src = "spriteSheets/RevertingRight2.png";
	this.RevertingRight3.src = "spriteSheets/RevertingRight3.png";
	this.RevertingRight4.src = "spriteSheets/RevertingRight4.png";
	this.RevertingRight5.src = "spriteSheets/RevertingRight5.png";
	this.RevertingRight6.src = "spriteSheets/RevertingRight6.png";

	//player hp bars
	this.playerHp.src = "spriteSheets/PlayerHp.png";
	this.playerMaxHp.src = "spriteSheets/PlayerMaxHp.png";

	//equipable items
	this.EquipableSword.src = "spriteSheets/EquipableSword.png";

	//item bar
	this.Item_Bar.src = "spriteSheets/Item_Bar.png";
	this.sword_icon.src = "spriteSheets/Sword_Icon.png";

	this.equippedSwordRight.src = "spriteSheets/EquippedSwordRight.png";
	this.equippedSwordLeft.src = "spriteSheets/EquippedSwordLeft.png";
}

var imageRep = new ImageRepository(); //instantiate image repository object

/*******************
	OBJECT CLASS: TEXT OBJECT
********************/
//object for managing text and messages on the text canvas
function Text_Object()
{
	this.orbScore = function() //player score for how many orbs collected
	{
		this.context.clearRect(35,5,50,15);
		this.context.fillStyle = "#000000";
		this.context.fillText(" = " + game.player.orbScore, 28, 15);
	};
}

var textObj = new Text_Object();

/*************
GUI HANDLER OBJECT
*************/

//object for handling the graphical interface such as HP and Mana bars, retrieves context from canvas GAME
var guiHandler = {

	drawPlayerHp: function()
	{
		//this.context.clearRect(0,0,game.canvasText.width,game.canvasText.height);
		this.context.clearRect(game.player.x - 10, game.player.y - 15, 100, 25);
		this.context.drawImage(imageRep.playerMaxHp,game.player.x + 5, game.player.y - 5, 40, 3);
		this.context.drawImage(imageRep.playerHp,game.player.x + 5, game.player.y - 5,(game.player.HP / game.player.MaxHP) * 40, 3);
	}
};

/*************
OBJECT POOL CLASS
**************/
//object class for storing objects in individual pools
function Pool(maxSize) //parameter accounts for max objects allowed in the pool
{
	//store maxSize in private variable
	var size = maxSize;
	this.pool = []; // variable for storing objects

	//method that initializes the objects
	this.init = function(object) //object type
	{
		if(object == "orb") //if object type is "orb" fill pool array with Orb objects
		{
			for(var i = 0; i < size; i++) //iterate through size of pool and fill pool with Orbs
			{
				var orb = new Orb(); //initiate in 'invisible' space until ready to be used
				orb.init(0,0,20,20);
				this.pool[i] = orb;
			}
		}
	};

	//method to retrieve, and spawn objects from pool
	this.get = function(x,y) //parameters set x and y of object
	{
		if(!this.pool[size - 1].alive) //if last object is not alive - object pool is not full
		{
			this.pool[size - 1].spawn(x,y); //spawn last object in pool, turn alive
			this.pool.unshift(this.pool.pop()); //switch last object to the first item of pool
		}
	};

	//retrieve object type 
	this.getType = function(type)
	{
		if(!this.pool[size - 1].alive) //if last object in pool is not alive - retrieve object type
		{
			this.pool[size - 1].getType(type); //set object type to last object in pool
		}
	};

	//method to deactivate objects
	this.deactivate = function(objectNum) //number for object iteration - object's place in list
	{
		this.pool[objectNum].deSpawn();//despawn the targeted object - turn alive to false
		this.pool.push((this.pool.splice(objectNum,1))[0]); //switch selected object to the end of the pool
	};

	//draw all currently alive objects in pool
	this.drawAll = function()
	{
		for(var i = 0; i < size; i++)
		{
			if(this.pool[i].alive)
			{
				this.pool[i].draw();
			}
		}
	};
}

function Drawable() //constructor for drawable class 
{
	this.init = function(x, y, width, height) //initiation method, parameters for drawables possessing x, y, width, and height values
	{										  //hitbox values to be changed later
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.hitBoxX = x;
		this.hitBoxY = y;
		this.hitBoxWidth = width;
		this.hitBoxHeight = height;
	};

	//initiate speed, canvaswidth, canvas height properties, draw and move methods, all to be defined later
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	//method for erasing self image
	this.clear = function()
	{
		this.context.clearRect(this.x,this.y,this.width,this.height);
	};

	//method for drawing self image
	this.draw = function()
	{
		this.context.drawImage(this.currentImage,this.x,this.y,this.width,this.height);
		//console.log(this.x + " " + this.y + " ");
	};
	this.move = function(){};
}

/*************
OBJECT CLASS: ITEM BAR	
*************/		

function Item_Bar()
{
	this.inventory = [];
	this.inv_index = [];

	this.currentImage = imageRep.Item_Bar;

	//populate the inventory of the item bar by pushing the desired object into the inventory array
	//then draw the inventory items' icons into the graphical bar
	this.populate_inventory = function(object)
	{
		this.inventory.push(object);
		this.drawInventoryItems();
	};

	this.drawInventoryItems = function()
	{
		for(var i = 0; i < game.player.inventory.length; i++)// iterate through the game's player's inventory
		{													// space apart from each other
			this.inventory[this.inventory.length - 1].drawIcon(this.x + 10 * (i + 1), this.y + 6); //set icons of each index to draw within the item bar's graphical space
		}
	};
}

Item_Bar.prototype = new Drawable(); //Item bar inherits from the Drawable class

//class constructor for Animatable object 
function Animatable()
{
	//variables for recording frame rates and animation events
	this.tickCount = 0;
	this.animationIndex = 0;
	this.ticksPerFame = 0;
	this.currentImage;

	this.animLoop = function(frameLimit) //loop for animations
	{
		if(this.tickCount >= frameLimit)//if the progressing frames have reached targeted animation point - increase animation index by 1
		{								//reset tick count
			this.tickCount = 0;
			this.animationIndex++;
		}
		this.tickCount++;
	};
}

Animatable.prototype = new Drawable(); //inherit from Drawable super class

//class constructor for Background object
function Background() 
{
	this.currentImage = imageRep.background;	
}

Background.prototype = new Drawable(); //inherit Drawable super class

function Player() //main player constructor class
{
	/***********************
		PLAYER: VARIABLES
	************************/
	this.HP = 100;
	this.MaxHP = 100;
	this.canFall = true;
	this.canMoveLeft = true;
	this.canMoveRight = true;
	this.canMoveDown = true;
	this.canMoveUp = true;
	this.canJump = true;
	this.jump = false;
	this.doubleJump = false;
	this.canDoubleJump = false;
	this.needsToBeGrounded = false;
	this.grounded = false;
	this.movingLeft = false;
	this.movingRight = false;
	this.movingDown = false;
	this.movingUp = false;
	this.gravity = 0.3;
	this.horizontal_velocity = 0;
	this.vertical_velocity = 0;
	this.currentImage = imageRep.robIdle1;
	this.facingLeft = false;
	this.facingRight = false;
	this.mouseX = 0;
	this.mouseY = 0;
	this.orbScore = 0;
	this.struck = false;
	this.stunned = false;
	this.recoverCount = 0;
	this.recovering = false;
	this.canBeStruck = true;
	this.strikeLeftX = false;
	this.strikeLeftY = false;
	this.intangible = false;
	this.flashing = false;
	this.flickerCount = 0;
	this.flickerRate = 0;
	this.flickerExtent = 0;
	this.becomeSolid = false;
	this.DEAD = false;
	this.deathJump = false;
	this.deathFall = false;
	this.weaponEquipped = [];
	this.weaponIsEquipped = false;
	this.inventory = [];


	/******************************
		PLAYER: METHODS
	*******************************/
	this.clear = function() //overload clear method to account for small alterations
	{
		this.context.clearRect(this.x - 5,this.y - 5,this.width + 10,this.height + 10); //erase player image
	};

	this.move = function()
	{	
		this.clear(); //erase image before all movement to clear smearing
		if(!this.DEAD) //if player is alive, run code
		{
			/*********************
					PLAYER: KEY BINDINGS
			*********************/
			if(KEY_STATUS.left)
			{
				if(this.canMoveLeft)
				{
					this.movingLeft = true; //pressing the left arrow key will make the player move to the left
					this.facingLeft = true; //face player to the left
					this.facingRight = false;
				}
				else
				{
					this.movingLeft = false; //if cannot move, still face left
					this.facingLeft = true;
					this.facingRight = false;
				}
			}
			if(!KEY_STATUS.left)
			{
				this.movingLeft = false; //releasing the left arrow key will make the player stop moving to the left
			}
			if(KEY_STATUS.right)
			{
				if(this.canMoveRight)
				{
					this.movingRight = true; //pressing the right arrow key will make the player move to the right
					this.facingRight = true; //face the player right
					this.facingLeft = false;
				}
				else
				{
					this.movingRight = false;
					this.facingRight = true; //even if cannot move to the right, still face right
					this.facingLeft = false;
				}			
			}

			if(!KEY_STATUS.right)
			{
				this.movingRight = false; //Releasing the right arrow key will make the player stop moving to the right
			}

			if(KEY_STATUS.spacebar)
			{
				if(this.canJump)
				{
					this.jump = true;
					this.canJump = false;
				}
				else if(this.canDoubleJump)
				{
					this.doubleJump = true;
					this.canDoubleJump = false;
				}
			}

			if(!KEY_STATUS.spacebar)
			{
				if(!this.canJump && !this.needsToBeGrounded)
				{
					this.canDoubleJump = true;
				}
			}

			/***********************
			PLAYER: PHYSICS APPLICATIONS
			***********************/
			
			//apply horizontal movements
			if(this.movingRight)
			{
				this.horizontal_velocity = this.speed; // if player is moving right, positively increase velocity
				
				//if player hits right canvas wall, stop moving
				if(this.hitBoxX + this.hitBoxWidth >= this.canvasWidth)
				{
					this.hitBoxX = this.canvasWidth - this.hitBoxWidth;
					this.horizontal_velocity = 0;
				}
			} 

			if(this.movingLeft)
			{
				this.horizontal_velocity = -this.speed; //if player is moving left, negatively increase velocity

				//if player hits left canvas wall, stop moving
				if(this.hitBoxX <= 0)
				{
					this.hitBoxX= 0;
					this.horizontal_velocity = 0;
				}
			}

			if(!this.movingRight && !this.movingLeft)
			{
				this.horizontal_velocity = 0; //if player is moving neither direction, halt velocity
			}

			if(this.jump) //if the spacebar has been pressed and the player jumps, shoot player into the air, make jump false
			{			  //so that it only happens once
				this.jump = false;
				this.vertical_velocity = -this.speed * 2;
				this.grounded = false;
			}

			if(this.doubleJump) //if player has already jumped once and released space bar without landing, shoot player into the air, make double jump false
			{					//and turn needstobegrounded false so that landing is required before jumping again
				this.doubleJump = false;
				this.vertical_velocity = -this.speed * 1.5;
				this.needsToBeGrounded = true;
			}


			//declare max speeds for positive - moving right - and negative - going left

			if(this.horizontal_velocity >= 6) this.horizontal_velocity = 6;
			if(this.horizontal_velocity <= -6) this.horizontal_velocity = -6;
			
			//apply gravity

			this.vertical_velocity += this.gravity;

			/*************
			PLAYER: CONDITIONS FOR FLICKERING
			*************/

			if(this.flashing)
			{
				this.flicker(2, 6);
			}	
			if(this.becomeSolid)
			{
				this.becomeSolid = false;
				this.intangible = false;

			}

			/*********************
			COLLISION EVENTS: HORIZONTAL COLLISION
			*********************/

			this.horizontal_collision_events();

			//apply vertical and horizontal velocities to hitbox x and y properties
			//adjust x and y to be wider and taller than hitbox

			

			this.hitBoxX += this.horizontal_velocity;

			
			
			this.x = this.hitBoxX - 10; //adjust x position wider than hitbox
			this.width = this.hitBoxWidth + 20; //adjust width wider than hitbox
		
			/*********************
			COLLISION EVENTS: VERTICAL COLLISION
			*********************/
			
			//make player jump a little if struck by enemy
			if(this.strikeLeftY)
			{
				this.strikeLeftY = false;
				this.vertical_velocity = -3;
			}
			

			this.vertical_collision_events();

			this.hitBoxY += this.vertical_velocity;	
			
			
			this.y = this.hitBoxY - 10; //adjust y taller than hitbox
			this.height = this.hitBoxHeight + 11;	//adjust hight lower than hitbox
		
			//make player stop falling when hitting the ground
			//allow player to jump again once hitting the ground
			//placed after vertical velocity application to avoid being stuck

			if(this.hitBoxY + this.hitBoxHeight >= game.groundLevel)
			{
				this.hitBoxY = game.groundLevel - this.hitBoxHeight;
				this.vertical_velocity = 0;
				this.canJump = true;
				this.grounded = true;
				this.canDoubleJump = false;
				this.needsToBeGrounded = false;
			}

			if(this.hitBoxY <= 0)
			{
				this.vertical_velocity = 2;
			}

			/***********************
				PLAYER: IMAGERY
			***********************/

			this.player_imagery_conditions();		

			this.draw();
		}
		else //if player is dead, run code for death conditions
		{	
			this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
			this.vertical_velocity += this.gravity;			
			if(!this.deathJump)
			{
				this.deathJump = true; //perform death jump once
			}

			if(this.deathJump && !this.deathFall) //if deathJump has returned true but deathfall has not yet occured, 
			{									  //jump high
												  //then turn deathfall on								
				this.vertical_velocity = -this.speed * 3;
				this.deathFall = true;
			}

			if(this.deathFall)
			{
				//if deathfall returns true draw losing message on screen
				this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
				this.context.font = "64px sans-serif";
				this.context.fillStyle = "#ff0000";
				this.context.fillText("BRO! YOU TOTALLY LOST!",(this.canvasWidth / 4) - 170, this.canvasHeight / 2);
				
			}
			if(this.vertical_velocity >= 10) this.vertical_velocity = 10;
			this.y += this.vertical_velocity;
			this.draw();
		}
	};

	this.horizontal_collision_events = function()
	{
		//conditions for player colliding with sword object
		if(this.horizontalCollision(game.sword))
		{
			if(game.sword.alive && game.sword.canBeCollected)
			{
				//if the sword is alive and can be collected
				//store sword into player's inventory and item_bar's inventory
				//then draw sword icon within graphical item bar
				this.collect_individual_inventory(game.sword);
				game.item_bar.populate_inventory(game.sword);
				this.weaponIsEquipped = true;
				this.weaponEquipped[0] = game.sword;
			}
		}

		//collision event for enemy
		if(this.horizontalCollision(game.enemy))
		{
			if(!this.intangible)
			{
				if(game.enemy.normal) //make player stop moving if enemy is in normal mode
				{
					this.horizontal_velocity = 0;
				}
				else if(game.enemy.transform_stage2_shelled) //if enemy is in stage2 shelled transformation
				{											/*make player jump and flicker
															*reset enemy's animation counts
															*turn stage 2 shelled transformation off
															*turn stage 3 rotating transformation on
															*turn canBeKicked to false
															*/
					this.strikingLeft();
					game.enemy.tickCount = 0;
						game.enemy.animationIndex = 0;
						game.enemy.wiggleCount = 0;
						game.enemy.transform_stage2_shelled = false;
						game.enemy.transform_stage3_rotating = true;
						game.enemy.canBeKicked = false;
						//make the enemy face and start moving opposite the direction it was
						if(this.facingLeft)
						{
							game.enemy.facingLeft = true;
							game.enemy.facingRight = false;

							game.enemy.movingLeft = true;
							game.enemy.movingRight = false;
						}
						else if(this.facingRight)
						{
							game.enemy.facingLeft = false;
							game.enemy.facingRight = true;

							game.enemy.movingLeft = false;
							game.enemy.movingRight = true;
						}

				}
				else if(game.enemy.transform_stage3_rotating) //if enemy is in stage 3 rotating transformation
				{
					//make player jump, and react to being struck
					this.vertical_velocity = -this.speed * 2;
					if(this.canBeStruck)
					{
						this.struck = true;
						this.canBeStruck = false;
					}
				}
			}
		}


		//collision event for red square objects
		for(var i = 0; i < game.squarePool.length; i++)
		{
			if(this.horizontalCollision(game.squarePool[i]))//iterate through all squares in the square pool and check for horizontal collision
			{
				this.horizontal_velocity = 0;
			} 
		}
		//collision event for hitable squares with type "flexible"
		for(var i = 0; i < game.hitableSquarePoolFlex.length; i++)
		{
			if(this.horizontalCollision(game.hitableSquarePoolFlex[i]))
			{
				this.horizontal_velocity = 0;
			}
		}

		//collision event for hitable squares with type "inflexible"
		for(var i = 0; i < game.hitableSquarePoolInflex.length; i++)
		{
			if(this.horizontalCollision(game.hitableSquarePoolInflex[i]))
			{
				this.horizontal_velocity = 0;
			}
		}

		/************
		Collision  event: orbs 
		****************/

		for(var i = 0; i < game.orbPool.pool.length; i++) //iterate through orb pool 
		{
			if(this.horizontalCollision(game.orbPool.pool[i]) || this.verticalCollision(game.orbPool.pool[i]))
			{ //the effect is not direction sensitive, so run code if vertical or horizontal collision returns true
				if(game.orbPool.pool[i].alive && game.orbPool.pool[i].canBeCollected) 
				{
					/*if the current orb being collided with is alive
					* and can be collected
					* heal player's health by 35 points
					* set maximum health restriction to 100
					*/	
					this.HP += 35;
					if(this.HP >= 100) this.HP = 100;
					this.collectFromPool(game.orbPool,i);
					game.orbPool.pool[i].score_point();
				}
			}
		}
	};

	this.vertical_collision_events = function()
	{
		//collision event for enemy
		if(this.verticalCollision(game.enemy))
		{
			this.directionCheckVertical();
			if(!this.intangible)
			{
				if(this.movingDown)
				{
					this.vertical_velocity = -this.speed * 2;
					if(game.enemy.normal) //if object is in normal status, initiate stage 1 transformation when jumped on
					{
						//set all animation counters to 0 to avoid animation overlaping
						game.enemy.tickCount = 0;
						game.enemy.animationIndex = 0;
						game.enemy.wiggleCount = 0;
						game.enemy.normal = false;
						game.enemy.transform_stage1_curling = true;
					}
					else if(game.enemy.canBeKicked) //once enemy is in stage 2, being shelled
					{										//being jumped on turns shelled to false, and initiates stage 3 transformation
															//set canBeKicked to false for one time effect
						game.enemy.tickCount = 0;
						game.enemy.animationIndex = 0;
						game.enemy.wiggleCount = 0;
						game.enemy.transform_stage2_shelled = false;
						game.enemy.transform_stage3_rotating = true;
						game.enemy.canBeKicked = false;
						if(this.facingLeft)
						{
							game.enemy.facingLeft = true;
							game.enemy.facingRight = false;

							game.enemy.movingLeft = true;
							game.enemy.movingRight = false;
						}
						else if(this.facingRight)
						{
							game.enemy.facingLeft = false;
							game.enemy.facingRight = true;

							game.enemy.movingLeft = false;
							game.enemy.movingRight = true;
						}
					}
					else if(game.enemy.canBeShelled)
					{
						game.enemy.tickCount = 0;
						game.enemy.animationIndex = 0;
						game.enemy.wiggleCount = 0;
						//set stage 3 to false and revert back to stage 2
						game.enemy.transform_stage3_rotating = false;
						game.enemy.transform_stage2_shelled = true;
						game.enemy.canBeShelled = false;
					}							
				}
			}
		}

		//collision event for red square objects
		for(var i = 0; i < game.squarePool.length;i++)
		{
			if(this.verticalCollision(game.squarePool[i])) //iterate through all squares in square pool and check for vertical collision
			{
				this.vertical_velocity = 0;

				if(this.movingDown)
				{
					this.canJump = true;
					this.grounded = true;
					this.canDoubleJump = false;
					this.needsToBeGrounded = false;
				}
			}
		}

		//collision event for hitable objects with the type "flexible"
		for(var i = 0; i < game.hitableSquarePoolFlex.length; i++) //iterate through all squares in hitableSquarePoolFLex for vertical collision
		{
			if(this.verticalCollision(game.hitableSquarePoolFlex[i]))
			{
				this.directionCheckVertical();

				this.vertical_velocity = 0;
				
				if(this.movingUp) //if movingup is true, player has bumped it from below
				{
					game.hitableSquarePoolFlex[i].bumped = true; //set property bumped of hitable square to true
					this.vertical_velocity = 5; // make player repel downward
				}

				if(this.movingDown)
				{
					this.canJump = true;
					this.grounded = true;
					this.canDoubleJump = false;
					this.needsToBeGrounded = false;
				}

			}
		}

		//collision event for hitable squares with type "inflexible"
		for(var i = 0; i < game.hitableSquarePoolInflex.length; i++) //iterate through all squares in hitableSquarePoolInflex for vertical collision
		{
			if(this.verticalCollision(game.hitableSquarePoolInflex[i]))
			{

				this.directionCheckVertical();

				this.vertical_velocity = 0;
				
				if(this.movingUp) // if moving up is true, player has bumped it from below
				{
					game.hitableSquarePoolInflex[i].bumped = true; //set property bumped of hitable square to true
					this.vertical_velocity = 5; //make player repel downward
				}

				if(this.movingDown)
				{
					this.canJump = true;
					this.grounded = true;
					this.canDoubleJump = false;
					this.needsToBeGrounded = false;
				}

			}
		}
	};

	//method to react differently if the object is housed in a pool
	this.collectFromPool = function(objectPool,objectIndex)
	{
		objectPool.pool[objectIndex].collectionCheck();//collectioncheck from objects index
		objectPool.deactivate(objectIndex);//deactivate object from pool
	};

	//method to react differently if the object is sepparate
	this.collect_individual_inventory = function(object)
	{
		object.collectionCheck(); //collection check from individual object
		object.deSpawn(); //despawn individual object
		this.storeInInventory(object); //store object in player inventory
	};

	//method to store specific objects into player's inventory
	this.storeInInventory = function(object)
	{
		this.inventory.push(object);
	};

	//condition for having player react to being struck
	this.strikingLeft = function()
	{
		this.strikeLeftX = true;
		this.strikeLeftY = true;
	};

	//makes player intangible for invincibility frames
	this.getIntangible = function()
	{
		this.intangible = true;
	};

	//makes player start flashing
	this.startFlashing = function()
	{
		this.flashing = true;
	};

	//condition for invincibility frames to cease and player to normalize
	this.stunRecover = function()
	{
		if(this.recoverCount > 4)
		{
			this.stunned = false;
		}
	};

	//method to make player flash rappidly
	this.flicker = function(rate) //parameters are (rate) - the speed at which flickering occurs
	{									
		this.flickerCount++;
		if(this.flickerCount === 3)
		{
			this.context.globalAlpha = 0;
		}
		else if(this.flickerCount === 5)
		{
			this.context.globalAlpha = 1;
		}
		else if(this.flickerCount === 7)
		{
			this.flickerCount = 0;
			this.flickerRate++;
		}
		if(this.flickerRate >= 12)
		{
			this.flashing = false;
			this.becomeSolid = true;
			this.flickerCount = 0;
			this.flickerRate = 0;
		}
	};

	//method for sprite walking to the right
	this.spriteWalkingRight = function()
	{
		if(this.animationIndex === 0)
		{
			this.currentImage = imageRep.robRight;
		}
		else if(this.animationIndex === 1)
		{
			this.currentImage = imageRep.testRightRun;
		}
		else if(this.animationIndex === 2)
		{
			this.currentImage = imageRep.testRightRun2;
		}
		else if(this.animationIndex === 3)
		{
			this.currentImage = imageRep.robRight;
			this.animationIndex = 0; //once animation index reaches end of image list
		}							 //reset index, set sprite to first of list
	};

	//method for sprite walking to the left
	this.spriteWalkingLeft = function()
	{
		if(this.animationIndex === 0)
		{
			this.currentImage = imageRep.robLeft;
		}
		else if(this.animationIndex === 1)
		{
			this.currentImage = imageRep.testLeftRun;
		}
		else if(this.animationIndex === 2)
		{
			this.currentImage = imageRep.testLeftRun2;
		}
		else if(this.animationIndex === 3)
		{
			this.currentImage = imageRep.robLeft;
			this.animationIndex = 0; //once animation index reaches end of image list
		}							 //reset index, set sprite to first of list
	};

	//method for horizontal collision event
	this.horizontalCollision = function(obj) //parameter is the object with which player is colliding
	{
		if(collisionCheck(this.hitBoxX + this.horizontal_velocity, this.hitBoxY, this.hitBoxWidth, this.hitBoxHeight, obj)) //pre check for incoming collision with object by
		{																							//adding horizontal velocity to x 
			//if the incoming collison of x plus horizontal velocity is true
			//check if incoming collision of x plus 1 is true, if false, increase x by 1
			//once incoming collision of x plus 1 is true, reduce horizontal velocity to 0
			//stop movement, and return true
			//using sign() converts the collision detection for negative or posititve values, depending on velocity
			//allowing for detections of both sides of player square and object square
			while(!collisionCheck(this.hitBoxX + sign(this.horizontal_velocity),this.hitBoxY,this.hitBoxWidth,this.hitBoxHeight,obj))
			{
				this.hitBoxX += sign(this.horizontal_velocity);
			}
			return true;
		}
	};

	//method for vertical collision event
	this.verticalCollision = function(obj)// parameter is the object with which player is colliding
	{
		if(collisionCheck(this.hitBoxX,this.hitBoxY + this.vertical_velocity, this.hitBoxWidth, this.hitBoxHeight,obj))//pre check for incoming collision with object by
		{																					   //adding vertical velocity to y
			//if the incoming collison of y plus vertical velocity is true
			//check if incoming collision of y plus 1 is true, if false, increase y by 1
			//once incoming collision of y plus 1 is true, reduce vertical velocity to 0
			//stop movement, and return true, reset jump and double jump variables
			//using sign() converts the collision detection for negative or posititve values, depending on velocity
			//allowing for detections of both sides of player square and object square
			while(!collisionCheck(this.hitBoxX, this.hitBoxY + sign(this.vertical_velocity), this.hitBoxWidth, this.hitBoxHeight,obj))
			{
				this.hitBoxY += sign(this.vertical_velocity);
			}
			return true;
		}
	};

	/*****************
	Method for deterimining vertical direction 
	******************/

	this.directionCheckVertical = function()
	{
		if(sign(this.vertical_velocity) === -1)
		{
			this.movingUp = true;
			this.movingDown = false;
		}
		else if(sign(this.vertical_velocity) === 1)
		{
			this.movingDown = true;
			this.movingUp = false;
		}
		else if(sign(this.vertical_velocity) === 0)
		{
			this.movingUp = false;
			this.movingDown = false;
		}
	};

	//method for conditions for being struck
	this.struckConditions = function()
	{
		//reduce players health by 21
		this.HP -= 21;
		//set restrictions for reducing passed 0
		if(this.HP <= 0) 
		{
			this.HP = 0;
			//if health becomes 0, initiate death conditions
			this.DEAD = true;
		}
		//initiate conditions for being struck
		this.strikingLeft(); //make player jump slightly
		this.getIntangible(); //set invincibility frames count
		this.startFlashing(); //make player flash
	};	

	this.player_imagery_conditions = function()
	{
		this.directionCheckVertical();

		//determine direction and velocity 
		if(this.facingRight)
		{
			if(this.movingRight)
			{
				if(this.movingUp) 
				{
					this.currentImage = imageRep.testJumpRight; //player sprite is jumping to the right
				}
				else if(this.movingDown)
				{
					this.currentImage = imageRep.testFallRight; //player sprite is falling to the right
				}
				else if(!this.movingUp && !this.movingDown)
				{
					this.animLoop(5); //if the player is facing right, and moving right, and also grounded
					this.spriteWalkingRight();//they are walking right, so itenerate through right walking sprites every 5 frames
				}
			}
			else // player is facing right but not moving right
			{	 // set image to right - reset tick count and animation index
				if(this.grounded)//player is grounded
				{
					this.currentImage = imageRep.robRight;
				}
				else //player is stationary, but not grounded
				{
					if(this.movingUp)
					{
						this.currentImage = imageRep.testJumpRight; //player sprite is jumping to the right
					}
					else if(this.movingDown)
					{
						this.currentImage = imageRep.testFallRight; //player sprite is falling to the right
					}
				}
				this.tickCount = 0;
				this.animationIndex = 0;
			}
		}


		if(this.facingLeft)
		{
			if(this.movingLeft)
			{
				if(this.movingUp) 
				{
					this.currentImage = imageRep.testJumpLeft; //set sprite image to jumping left
				}
				else if(this.movingDown) 
				{
					this.currentImage = imageRep.testFallLeft; //set sprite image to falling left
				}
				else if(!this.movingUp && !this.movingDown) 
				{
					this.animLoop(5);
					this.spriteWalkingLeft();
				}
			}
			else //player is facing left, but is not moving
			{
				if(this.grounded) //player is grounded
				{
					this.currentImage = imageRep.robLeft;
				}
				else //player is facing left, stationary, but is not grounded
				{
					if(this.movingUp) 
					{
						this.currentImage = imageRep.testJumpLeft; //player sprite is jumping to the left
					}
					else if(this.movingDown) 
					{
						this.currentImage = imageRep.testFallLeft; //player sprite is falling to the left
					}
				}
				this.tickCount = 0;
				this.animationIndex = 0;
			}
		}
	};
}

Player.prototype = new Animatable(); //inherit from Animatable sub class

/**************************
OBJECT CLASS: ENEMY
***************************/

function Enemy()
{
	this.speed = 1;
	this.gravity = 0.3;
	this.currentImage = imageRep.EnemyLeft;
	this.horizontal_velocity = 0;
	this.vertical_velocity = 0;
	this.facingLeft = true;
	this.facingRight = false;
	this.movingLeft = true;
	this.movingRight = false;
	this.canMoveLeft = true;
	this.canMoveRight = true;
	this.normal = true;
	this.transform_stage1_curling = false;
	this.transform_stage2_shelled = false;
	this.transform_stage3_rotating = false;
	this.reversion_stage1_unshell = false;
	this.reversion_stage2_normalize = false;
	this.canBeKicked = false;
	this.canBeShelled = false;
	this.wiggleCount = 0;

	this.stepEvent = function()
	{
		this.clear();

		if(this.normal)
		{
			/***************
			ENEMY: MOVEMENT: UN-TRANSFORMED
			***************/

			if(this.movingLeft)
			{
				this.horizontal_velocity = -this.speed;
			}
			else if(this.movingRight)
			{
				this.horizontal_velocity = this.speed;
			}
			else if(!this.movingRight && !this.movingLeft)
			{
				this.horizontal_velocity = 0;
			}
			
		}

		/*************
		ENEMY: HORIZONTAL COLLISION: STATIC
		**************/
		for(var i = 0; i < game.squarePool.length; i++)
		{
			if(this.horizontalCollision(game.squarePool[i]))
			{
				if(this.facingLeft)
				{
					this.facingLeft = false;
					this.facingRight = true;

					this.movingLeft = false;
					this.movingRight = true;
				}
				else if(this.facingRight)
				{
					this.facingRight = false;
					this.facingLeft = true;

					this.movingRight = false;
					this.movingLeft = true;
				}
			}
		}

		//while koopa is normal and walking, collision with player will halt movement
		if(this.normal)
		{
			if(this.horizontalPlayerCollision(game.player))
			{
				if(!game.player.intangible)
				{
					this.horizontal_velocity = 0;
				}
			}
		}

		/************
		ENEMY: PHYSICAL APPLICATIONS x - y - gravity
		************/

		//gravity 
		this.vertical_velocity += this.gravity;

		/*****************
		ENEMY: TRANSFORMATIONS
		******************/

		//STAGE 1: CURLING
		/*once the player has hit the enemy vertically falling down, convert "normal" to false
		* and convert the variable for the first stage of transformation into curling into shell to true
		*/

		if(this.transform_stage1_curling)
		{
			//stop all movement going left or right, including velocity
			//retain which direction object is facing
			this.movingLeft = false;
			this.movingRight = false;
			this.horizontal_velocity = 0;
			this.animLoop(1);
			if(this.facingLeft) //if facing left, initiate sprite animation transforming left
			{
				if(this.transformingSpriteLeft()) //transformation runs until returning true
				{
					this.transform_stage1_curling = false; //once transformation is ended - set curling stage to false
					this.transform_stage2_shelled = true; //establish next stage of transformation - shelled
				}
			}
			else if(this.facingRight) //if facing right, initiate sprite animation transforming right
			{
				if(this.transformingSpriteRight())
				{
					this.transform_stage1_curling = false; 
					this.transform_stage2_shelled = true;
				}
			}
		}

		if(this.transform_stage2_shelled) //set motion to complete stop
		{								  //set image to dormant shelled either facing left or right
			this.movingLeft = false;
			this.movingRight = false;
			this.horizontal_velocity = 0;
			if(this.facingLeft)
			{
				this.animLoop(1);
				this.wigglingLeft();
			}
			else if(this.facingRight)
			{
				this.animLoop(1);
				this.wigglingRight();
			}

			this.canBeKicked = true; //set variable for one time effect for direction and velocity purposes
		}

		//if set to stage 3 rotation 
		if(this.transform_stage3_rotating)
		{

			if(this.horizontalPlayerCollision(game.player))
			{
				if(!game.player.intangible)
				{
					if(this.movingLeft)
					{
						this.facingLeft = false;
						this.facingRight = true;
						this.movingLeft = false;
						this.movingRight = true;
					}
					else if(this.movingRight)
					{
						this.facingRight = false;
						this.facingLeft = true;
						this.movingLeft = true;
						this.movingRight = false;
					}
					game.player.struckConditions();
				}
			}



			//if object is moving left set speed to 3 times faster
			if(this.movingLeft)
			{
				this.horizontal_velocity = -this.speed * 3;
			}
			else if(this.movingRight) //if object is moving right, set speed to 3 times faster
			{
				this.horizontal_velocity = this.speed * 3;
			}
			//set animation to rotating shell
			this.animLoop(1);
			this.rotatingShell();

			this.canBeShelled = true;
		}

		//revert transformation to stage 1 unshell

		if(this.reversion_stage1_unshell)
		{
			//reset all values to their beginning status
			this.movingLeft = false;
			this.movingRight = false;
			this.horizontal_velocity = 0;
			this.canBeKicked = false;
			this.transform_stage1_curling = false;
			this.transform_stage2_shelled = false;
			this.transform_stage3_rotating = false;
			this.canBeShelled = false;

			if(this.facingLeft)
			{
				this.animLoop(1);
				if(this.revertingSpriteLeft()) //revert stage facing left
				{
					this.reversion_stage1_unshell = false; //once reversion is completed, set to false
					this.reversion_stage2_normalize = true; //set final stage of normalize to true
					this.movingLeft = true; //set to moving left
				}
			}
			else if(this.facingRight) //revert stage facing right
			{
				this.animLoop(1);
				if(this.revertingSpriteRight())
				{
					this.reversion_stage1_unshell = false;
					this.reversion_stage2_normalize = true;
					this.movingRight = true;
				}
			}
		}

		//final stage of normalize, reverts status back to normal walking
		if(this.reversion_stage2_normalize)
		{
			this.reversion_stage2_normalize = false;
			this.normal = true;
		}

		//x application
		this.x += this.horizontal_velocity;

		if(!this.transforming && !this.transformed)
		{
			
		}

		/******************
		ENEMY: VERTICAL COLLISIONS: STATIC
		*******************/

		//square objects
		for(var i = 0; i < game.squarePool.length; i++)
		{
			if(this.verticalCollision(game.squarePool[i]))
			{
				this.vertical_velocity = 0;
			}
		}

		//y application
		this.y += this.vertical_velocity;

		if(this.y + this.height >= game.groundLevel)
		{
			this.y = game.groundLevel - this.height;
		}

		if(this.normal)
		{
			/***********
			ENEMY: IMAGERY: UN-TRANSFORMED
			***********/

			if(this.facingLeft)
			{
				this.animLoop(6);
				this.spriteWalkingLeft();
			}
			else if(this.facingRight)
			{
				this.animLoop(6);
				this.spriteWalkingRight();	
			}
		}

		this.draw();
	};

	//method for horizontal collision event
	this.horizontalCollision = function(obj) //parameter is the object with which player is colliding
	{
		if(collisionCheck(this.x + this.horizontal_velocity, this.y, this.width, this.height, obj)) //pre check for incoming collision with object by
		{																							//adding horizontal velocity to x 
			//if the incoming collison of x plus horizontal velocity is true
			//check if incoming collision of x plus 1 is true, if false, increase x by 1
			//once incoming collision of x plus 1 is true, reduce horizontal velocity to 0
			//stop movement, and return true
			//using sign() converts the collision detection for negative or posititve values, depending on velocity
			//allowing for detections of both sides of enemy square and object square
			while(!collisionCheck(this.x + sign(this.horizontal_velocity),this.y,this.width,this.height,obj))
			{
				this.x += sign(this.horizontal_velocity);
			}
			return true;
		}
	};

	this.horizontalPlayerCollision = function(obj) //parameter is the object with which player is colliding
	{
		if(playerCollisionCheck(this.x + this.horizontal_velocity, this.y, this.width, this.height, obj)) //pre check for incoming collision with object by
		{																							//adding horizontal velocity to x 
			//if the incoming collison of x plus horizontal velocity is true
			//check if incoming collision of x plus 1 is true, if false, increase x by 1
			//once incoming collision of x plus 1 is true, reduce horizontal velocity to 0
			//stop movement, and return true
			//using sign() converts the collision detection for negative or posititve values, depending on velocity
			//allowing for detections of both sides of enemy square and object square
			while(!playerCollisionCheck(this.x + sign(this.horizontal_velocity),this.y,this.width,this.height,obj))
			{
				this.x += sign(this.horizontal_velocity);
			}
			return true;
		}
	};

	//method for vertical collision event
	this.verticalCollision = function(obj)// parameter is the object with which player is colliding
	{
		if(collisionCheck(this.x,this.y + this.vertical_velocity, this.width, this.height,obj))//pre check for incoming collision with object by
		{																					   //adding vertical velocity to y
			//if the incoming collison of y plus vertical velocity is true
			//check if incoming collision of y plus 1 is true, if false, increase y by 1
			//once incoming collision of y plus 1 is true, reduce vertical velocity to 0
			//stop movement, and return true, reset jump and double jump variables
			//using sign() converts the collision detection for negative or posititve values, depending on velocity
			//allowing for detections of both sides of enemy square and object square
			while(!collisionCheck(this.x, this.y + sign(this.vertical_velocity), this.width, this.height,obj))
			{
				this.y += sign(this.vertical_velocity);
			}
			return true;
		}
	};

	this.verticalPlayerCollision = function(obj)// parameter is the object with which player is colliding
	{
		if(playerCollisionCheck(this.x,this.y + this.vertical_velocity, this.width, this.height,obj))//pre check for incoming collision with object by
		{																					   //adding vertical velocity to y
			//if the incoming collison of y plus vertical velocity is true
			//check if incoming collision of y plus 1 is true, if false, increase y by 1
			//once incoming collision of y plus 1 is true, reduce vertical velocity to 0
			//stop movement, and return true, reset jump and double jump variables
			//using sign() converts the collision detection for negative or posititve values, depending on velocity
			//allowing for detections of both sides of enemy square and object square
			while(!playerCollisionCheck(this.x, this.y + sign(this.vertical_velocity), this.width, this.height,obj))
			{
				this.y += sign(this.vertical_velocity);
			}
			return true;
		}
	};

	/********************
	ENEMY: METHODS
	*********************/
	this.clear = function() //overload clear method to account for small alterations
	{
		this.context.clearRect(this.x - 5,this.y - 5,this.width + 10,this.height + 10); //erase player image
	};

	this.spriteWalkingLeft = function()
	{
		if(this.animationIndex === 0)
		{
			this.currentImage = imageRep.EnemyLeft;
		}
		if(this.animationIndex === 1)
		{
			this.currentImage = imageRep.EnemyLeft2;
		}
		else if(this.animationIndex === 2)
		{
			this.currentImage = imageRep.EnemyLeft3;
		}
		else if(this.animationIndex === 3)
		{
			this.currentImage = imageRep.EnemyLeft4;
		}
		else if(this.animationIndex === 4)
		{
			this.currentImage = imageRep.EnemyLeft5;
		}
		else if(this.animationIndex === 5)
		{
			this.currentImage = imageRep.EnemyLeft6;
		}
		else if(this.animationIndex === 6)
		{
			this.currentImage = imageRep.EnemyLeft7;
		}
		else if(this.animationIndex === 7)
		{
			this.currentImage = imageRep.EnemyLeft;
			this.animationIndex = 0;
			this.tickCount = 0;
		}
	};

	this.spriteWalkingRight = function()
	{
		if(this.animationIndex === 0)
		{
			this.currentImage = imageRep.EnemyRight;
		}
		if(this.animationIndex === 1)
		{
			this.currentImage = imageRep.EnemyRight2;
		}
		else if(this.animationIndex === 2)
		{
			this.currentImage = imageRep.EnemyRight3;
		}
		else if(this.animationIndex === 3)
		{
			this.currentImage = imageRep.EnemyRight4;
		}
		else if(this.animationIndex === 4)
		{
			this.currentImage = imageRep.EnemyRight5;
		}
		else if(this.animationIndex === 5)
		{
			this.currentImage = imageRep.EnemyRight6;
		}
		else if(this.animationIndex === 6)
		{
			this.currentImage = imageRep.EnemyRight7;
		}
		else if(this.animationIndex === 7)
		{
			this.currentImage = imageRep.EnemyRight;
			this.animationIndex = 0;
			this.tickCount = 0;
		}
	};

	this.transformingSpriteLeft = function()
	{
		if(this.animationIndex === 3)
		{
			this.currentImage = imageRep.EnemyLeftTransform;
		}
		if(this.animationIndex === 5)
		{
			this.currentImage = imageRep.EnemyLeftTransform2;
		}
		else if(this.animationIndex === 9)
		{
			this.currentImage = imageRep.EnemyLeftTransform3;
		}
		else if(this.animationIndex === 11)
		{
			this.currentImage = imageRep.EnemyLeftTransform4;
		}
		else if(this.animationIndex === 15)
		{
			this.currentImage = imageRep.EnemyLeftTransform5;
			this.width = 25;
			this.height = 30;
		}
		else if(this.animationIndex === 17)
		{
			this.currentImage = imageRep.EnemyLeftTransform6;
			this.width = 20;
			this.height = 25;
		}
		else if(this.animationIndex === 19)
		{
			this.currentImage = imageRep.EnemyLeftTransform7;
			this.width = 25;
			this.height = 20;
		}
		else if(this.animationIndex === 21)
		{
			this.currentImage = imageRep.EnemyLeftTransform8;
		}
		else if(this.animationIndex === 23)
		{
			this.currentImage = imageRep.EnemyLeftTransform8;
			this.animationIndex = 0;
			this.tickCount = 0;
			return true;
		}
	};

	this.transformingSpriteRight = function()
	{
		if(this.animationIndex === 3)
		{
			this.currentImage = imageRep.EnemyRightTransform;
		}
		if(this.animationIndex === 5)
		{
			this.currentImage = imageRep.EnemyRightTransform2;
		}
		else if(this.animationIndex === 9)
		{
			this.currentImage = imageRep.EnemyRightTransform3;
		}
		else if(this.animationIndex === 11)
		{
			this.currentImage = imageRep.EnemyRightTransform4;
		}
		else if(this.animationIndex === 15)
		{
			this.currentImage = imageRep.EnemyRightTransform5;
			this.width = 25;
			this.height = 30;
		}
		else if(this.animationIndex === 17)
		{
			this.currentImage = imageRep.EnemyRightTransform6;
			this.width = 20;
			this.height = 25;
		}
		else if(this.animationIndex === 19)
		{
			this.currentImage = imageRep.EnemyRightTransform7;
			this.width = 25;
			this.height = 20;
		}
		else if(this.animationIndex === 21)
		{
			this.currentImage = imageRep.EnemyRightTransform8;
		}
		else if(this.animationIndex === 23)
		{
			this.currentImage = imageRep.EnemyRightTransform8;
			this.animationIndex = 0;
			this.tickCount = 0;
			return true;
		}
	};

	this.rotatingShell = function()
	{
		if(this.animationIndex === 0)
		{
			this.currentImage = imageRep.KoopaShellLeft;
		}
		else if(this.animationIndex === 5)
		{
			this.currentImage = imageRep.KoopaShell2;
		}
		else if(this.animationIndex === 10)
		{
			this.currentImage = imageRep.KoopaShell3;
		}
		else if(this.animationIndex === 15)
		{
			this.currentImage = imageRep.KoopaShell4;
		}
		else if(this.animationIndex === 20)
		{
			this.currentImage = imageRep.KoopaShell5;
		}
		else if(this.animationIndex === 25)
		{
			this.currentImage = imageRep.KoopaShell6;
		}
		else if(this.animationIndex === 30)
		{
			this.animationIndex = 0;
			this.tickCount = 0;
		}
	};

	this.wigglingLeft = function()
	{
		if(this.animationIndex === 80)
		{
			this.currentImage = imageRep.EnemyLeftTransform7;
		}
		else if(this.animationIndex === 85)
		{
			this.currentImage = imageRep.EnemyLeftTransform6;
		}
		else if(this.animationIndex === 90)
		{
			this.currentImage = imageRep.EnemyLeftTransform5;
		}
		else if(this.animationIndex === 95)
		{
			this.currentImage = imageRep.EnemyLeftTransform6;
			this.animationIndex = 0;
			this.tickCount = 0;
			this.wiggleCount++;
		}
		this.reversionTimer();
	};

	this.wigglingRight = function()
	{
		if(this.animationIndex === 80)
		{
			this.currentImage = imageRep.EnemyRightTransform7;
		}
		else if(this.animationIndex === 85)
		{
			this.currentImage = imageRep.EnemyRightTransform6;
		}
		else if(this.animationIndex === 90)
		{
			this.currentImage = imageRep.EnemyRightTransform5;
		}
		else if(this.animationIndex === 95)
		{
			this.currentImage = imageRep.EnemyRightTransform6;
			this.animationIndex = 0;
			this.tickCount = 0;
			this.wiggleCount++;
		}
		this.reversionTimer();
	};

	this.reversionTimer = function()
	{
		if(this.wiggleCount === 3)
		{
			this.transform_stage2_shelled = false;
			this.reversion_stage1_unshell = true;
			this.wiggleCount = 0;
			this.tickCount = 0;
			this.animationIndex = 0;
		}
	};

	this.revertingSpriteLeft = function()
	{
		if(this.animationIndex === 6)
		{
			this.currentImage = imageRep.RevertingLeft;
		}
		if(this.animationIndex === 10)
		{
			this.currentImage = imageRep.RevertingLeft2;
		}
		else if(this.animationIndex === 14)
		{
			this.currentImage = imageRep.RevertingLeft3;
		}
		else if(this.animationIndex === 18)
		{
			this.currentImage = imageRep.RevertingLeft4;
		}
		else if(this.animationIndex === 22)
		{
			this.currentImage = imageRep.RevertingLeft5;
			this.width = 25;
			this.height = 40;
		}
		else if(this.animationIndex === 26)
		{
			this.currentImage = imageRep.RevertingLeft6;
		}
		else if(this.animationIndex === 30)
		{
			this.currentImage = imageRep.RevertingLeft6;
			this.animationIndex = 0;
			this.tickCount = 0;
			return true;
		}
	};

	this.revertingSpriteRight = function()
	{
		if(this.animationIndex === 6)
		{
			this.currentImage = imageRep.RevertingRight;
		}
		if(this.animationIndex === 10)
		{
			this.currentImage = imageRep.RevertingRight2;
		}
		else if(this.animationIndex === 14)
		{
			this.currentImage = imageRep.RevertingRight3;
		}
		else if(this.animationIndex === 18)
		{
			this.currentImage = imageRep.RevertingRight4;
		}
		else if(this.animationIndex === 22)
		{
			this.currentImage = imageRep.RevertingRight5;
			this.width = 25;
			this.height = 40;
		}
		else if(this.animationIndex === 26)
		{
			this.currentImage = imageRep.RevertingRight6;
		}
		else if(this.animationIndex === 30)
		{
			this.currentImage = imageRep.RevertingRight6;
			this.animationIndex = 0;
			this.tickCount = 0;
			return true;
		}
	};


}

Enemy.prototype = new Animatable(); //enemy inherits from the Animatable class

function Square() //class for square obstacles
{
	this.currentImage = imageRep.squareObject;
}

Square.prototype = new Animatable(); //declare Square as an Animatable entity

//constructor class for hitable square object
function Hitable_Square(type)
{

	this.bumped = false; 
	this.moveUp = false;
	this.moveUp2 = false;
	this.moveDown = false;
	this.moveDown2 = false;
	this.pixelsToAscend = 0;
	this.pixelsToDescend = 0;
	this.canBeBumped = true;
	this.squareType = type;
	this.stationary = false;
	this.currentImage = imageRep.hitableSquare;

	//method for step event
	this.stepEvent = function() //intended to handle specific animations for hitable Squares
	{
		if(!this.stationary)
		{
			if(this.bumped && this.canBeBumped) //once block has been bumped, if it is able to be bumped start animation
			{
				this.bumped = false; //switch bumped to false so that animation only cycles once 
				this.canBeBumped = false; //switch bumped to false so that animation will not recylce until finished
				this.moveUp = true; // turn moveUp to true to execute next part of animation
			}
			else if(this.moveUp)
			{
				this.animLoop(2); //call animation counter to give animation a 2 frame pause before running next animation
				
				if(this.animationIndex === 1) //execute next animation
				{
					this.clear(); //erase image, move up 3 pixels, reset index, turn move up to false, turn moveUp2 to true, draw image at new location
					this.y -= 3; //move up three pixels
					this.animationIndex = 0;
					this.moveUp = false;
					this.moveUp2 = true;
					this.draw(); //draw image in new location
				}
				
			}
			else if(this.moveUp2)
			{
				this.animLoop(2); //call animation counter to give animation another 2 frame pause before running next animation
				if(this.animationIndex === 1)
				{
					this.clear(); //erase image
					this.y -= 3; //move up 3 pixels
					this.animationIndex = 0; // reset animation index
					this.moveUp2 = false; //moveUp2 set to false
					this.moveDown = true; //moveDown set to true
					this.draw(); //draw image at new location
				}
			}
			else if(this.moveDown) //initiate downward animation
			{
				this.clear(); //erase image
				this.moveDown = false; //set MoveDown to false
				this.moveDown2 = true; //set 
				this.y += 3; //move down 3 pixels
				this.animationIndex = 0; //reset animation index
				this.draw();//draw image in new location
			}
			else if(this.moveDown2)
			{
				this.clear();//erase image
				this.moveDown2 = false;// set MoveDown2 to false
				this.y += 3; // move down three more pixels
				this.animationIndex = 0; //reset animation index
				if(this.squareType === "flexible") // if square's type is flexible, return canBeBumped to true to allow for repetitive animations
				{
					this.canBeBumped = true;
				} 
				else if(this.squareType === "inflexible") //if square's type is inflexible, permanently lock animation from recycling
				{
					this.currentImage = imageRep.postHitSquare; //set image to postHitSquare 
					this.stationary = true;
					game.orbPool.getType("floating");
					game.orbPool.get(this.x + this.width - 23, this.y - 25);
					this.draw();
				}
				this.draw();
			}
		}

	};

}

Hitable_Square.prototype = new Square(); //inherit from Square sub class

/****************
OBJECT CLASS: ITEM
*****************/

function Item()
{
	this.floating = false;
	this.floatUp = true;
	this.floatDown = false;
	this.maxAscention = 6;
	this.currentAscention = 0;
	this.alive = false;

	//make object ready for use, set x and y coords, set alive to true
	this.spawn = function(x,y)
	{
		this.alive = true;
		this.x = x;
		this.y = y;
	};

	//delete object image and set back into 'invisible' object space until usable again - set alive to false
	this.deSpawn = function()
	{
		this.clear();
		this.alive = false;
		this.x = 0;
		this.y = 0;
		this.floating = false;
		this.collectable = false;
	}

	//method for repeatable floating animation

	this.float = function()
	{
		if(this.floating) //if floating is true, initiate or continue animation
		{
			this.animLoop(8); //set animation pause to 8 frames
			if(this.floatUp) //object will float up every 8 frames until reaching maximum ascention of 6 pixels
			{
				if(this.currentAscention < this.maxAscention)
				{	
					if(this.animationIndex === 1)
					{
						this.animationIndex = 0;
						this.clear();
						this.y--;
						this.currentAscention++;
						this.draw();
					}
				}
				else //once maximum ascention has been met, floatUp is false, float down is true
				{
					this.floatUp = false;
					this.floatDown = true;
				}
			}
			else if(this.floatDown)
			{
				if(this.currentAscention > 0) //float down until currentAscention is 0
				{
					if(this.animationIndex === 1)
					{
						this.animationIndex = 0;
						this.clear();
						this.y++;
						this.currentAscention--;
						this.draw();
					}
				}
				else //reset float Down to float Up
				{
					this.floatUp = true;
					this.floatDown = false;
				}
			}
		}
	};

	this.stepEvent = function() //main step event for object animation and handling
	{
		this.operations();
	};

	this.operations = function(){};
}

Item.prototype = new Animatable(); //inherit Animatable class

/******************
OBJECT SUB-CLASS: COLLECTABLE
******************/
function Collectable()
{
	this.canBeCollected = false;
	this.collected = false;

	this.collectionCheck = function()//parameter refers to object index within pool
	{
		if(this.canBeCollected) //if object can be collected, prevent it from being collected repeatedly
		{						//deactivate specific object in pool
			this.canBeCollected = false;
			this.collected = true;
		}
	};
}

Collectable.prototype = new Item(); //inherit Item class

/**********************
OBJECT CLASS: ORB
**********************/
function Orb()
{
	//set image to orb image
	this.currentImage = imageRep.orbObject;

	this.getType = function(type) //set object type
	{
		if(type == "stationary") //set properties for 'stationary' orbs
		{
			this.floating = false;
			this.canBeCollected = true;
		}
		else if(type == "floating") //set properties for 'floating' orbs
		{
			this.floating = true;
			this.canBeCollected = true;
		}
	};

	this.score_point = function(objectNum)
	{
		game.player.orbScore += 1;
	};

	this.operations = function()
	{
		this.float();
	};
}

Orb.prototype = new Collectable(); //inherit from Collectable class

/**************
ITEM SUB-CLASS: EQUIPABLE
***************/

function Equipable(type, name, idNo,icon)
{
	this.canBeEquipped = false;
	this.equipped = false;	
	this.statistics = {
		type: type,
		name: name,
		ID_Number: idNo,
		icon: icon
	};

	this.equipping = false;
	this.creating = false;

	this.equip = function()
	{
		
	};

	this.holding = function()
	{
		this.clear();
		this.x = game.player.x + 13;
		this.y = game.player.y - 50;
		this.draw();
	};

	this.create = function(x,y)
	{
		this.spawn(x,y);
		this.floating = true;
		this.canBeCollected = true;
	};	

	this.drawIcon = function(x,y)
	{
		this.context.clearRect(x,y,20,20);
		this.context.drawImage(this.statistics.icon,x,y,20,20);
	};
}

Equipable.prototype = new Collectable();

function Sword()
{
	this.currentImage = imageRep.EquipableSword;

	this.operations = function()
	{
		this.float();
		if(this.equipped)
		{
			this.holding();
		}
	};

}

Sword.prototype = new Equipable("sword","test_sword",00,imageRep.sword_icon);

function animate() //main frame animation loop
{
	game.player.move();
	for(var i = 0; i < game.hitableSquarePoolFlex.length; i++) //iterate through flexible squares and call their step events
	{
		game.hitableSquarePoolFlex[i].stepEvent();
	}
	for(var i = 0; i < game.hitableSquarePoolInflex.length; i++) //iterate through inflexible squares and call their step events
	{
		game.hitableSquarePoolInflex[i].stepEvent();
	}

	for(var i = 0; i < game.orbPool.pool.length; i++) //iterate through all orbs in orb pool and call their step events if they are alive
	{
		if(game.orbPool.pool[i].alive)
		{
			game.orbPool.pool[i].stepEvent();
		}
	}

	game.enemy.stepEvent();
	game.sword.stepEvent();
	game.fps++
	textObj.orbScore(); // draw player orb score
	guiHandler.drawPlayerHp();
	
	requestAnimFrame(animate); //callback animate function
}

/************
KEYBOARD BINDINGS
*************/

 //initiate object for the key codes of keyboard keys
var KEY_CODES = {
	37: 'left', //left arrow key
	38: 'up', //up arrow key
	39: 'right', //right arrow key
	40: 'down', //down arrow
	32: 'spacebar' //space bar
};

var KEY_STATUS = {}; //instantiate empty object for keyboard key codes statuses

for(code in KEY_CODES) //assign all the values in KEY_CODES as keys in KEY_STATUS, with the collective values of -false-
{
	KEY_STATUS[KEY_CODES[code]] = false;
}



//event listener to react to specfic key presses
document.addEventListener('keydown',function(e){
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
	if(KEY_CODES[keyCode])
	{
		e.preventDefault(); //prevent the default functionality of the keys so that the game is not interrupted
		KEY_STATUS[KEY_CODES[keyCode]] = true; //turns specific key pressed into a true value 
	}
},false);

//event listener that reacts to specific keys released

document.addEventListener('keyup',function(e){
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
	if(KEY_CODES[keyCode])
	{
		e.preventDefault();//prevent the default functionality of the keys so that the game is not interrupted
		KEY_STATUS[KEY_CODES[keyCode]] = false; // turns specific key released into a false value
	}
},false);

/**************************
FUNCTIONS
***************************/

//function for detecting collision events between two squares
function collisionCheck(x,y,width,height,obj) //parameters must be the x, y, width, and height of first object
{											  //in order to account for vertical and horizontal velocity, merely the instance of the second object is needed
	return (x < obj.x + obj.width &&
		    x + width > obj.x &&
		    y < obj.y + obj.height &&
		    y + height > obj.y); //returns true if any side of the first square is intersecting with any side of the second square
}

function playerCollisionCheck(x,y,width,height,obj)
{
	return(x < obj.hitBoxX + obj.hitBoxWidth &&
		   x + width > obj.hitBoxX &&
		   y < obj.hitBoxY + obj.hitBoxHeight &&
		   y + height > obj.hitBoxY);
}

function sign(value) //function for tracking velocity directions
{					//place velocity in for (value), returns positive if moving right of moving down, negative if going left or moving up
	if(value > 0)
	{
		return 1;
	}
	else if(value < 0)
	{
		return -1;
	}
	else
	{
		return 0;
	}
}

window.requestAnimFrame = (function(){ //smooth mult-browser compatible animation API created by Paul Irish
		return window.requestAnimationFrame ||
			   window.oRequestAnimationFrame ||
			   window.msRequestAnimationFrame ||
			   window.webkitRequestAnimationFrame ||
			   window.mozRequestAnimationFrame ||
		function(callback)
		{
			window.setTimeout(callback, 1000 / 60);
		}
})();