var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

var score = 0;
var platforms;
var player;
var jump = 2;
var nJump = 1;
var cursors; 
var rupees;
var scoreText;
var bomb;
var speedBomb = 1;


function preload() {
	this.load.image('background','assets/back.png');	
	this.load.spritesheet('rupee','assets/rupee.png', {frameWidth: 16, frameHeight: 16});
	this.load.image('sol','assets/platform.png');

	
	this.load.spritesheet('bomb','assets/bomb.png',{frameWidth: 32, frameHeight: 32});

	this.load.spritesheet('perso','assets/idle.png',{frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('run','assets/run.png',{frameWidth: 33, frameHeight: 32});
	this.load.spritesheet('saut','assets/jump.png',{frameWidth: 32, frameHeight: 32});
}



function create() {

	/*Fond du jeu*/
	this.add.image(400,300,'background');

	/*Platformes*/
	platforms = this.physics.add.staticGroup();
	platforms.create(50,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(160,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(330,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(420,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(600,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(700,580,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(690,370,'sol').setScale(0.75,0.5).refreshBody();
	platforms.create(200,270,'sol').setScale(0.75,0.5).refreshBody();
	
	/*Joueur*/
	player = this.physics.add.sprite(100,450,'idle').setScale(2);
	player.setCollideWorldBounds(true);
	this.physics.add.collider(player,platforms);
	
		//Animation
	this.anims.create({
		key:'jump',
		frames: this.anims.generateFrameNumbers('saut', {rupeet: 0, end: 0}),
		frameRate: 2,
	});

	this.anims.create({
		key:'sol',
		frames: this.anims.generateFrameNumbers('saut', {rupeet: 1, end: 1}),
		frameRate: 2,
	});

	this.anims.create({
		key:'run',
		frames: this.anims.generateFrameNumbers('run', {rupeet: 0, end: 5}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'idle',
		frames: this.anims.generateFrameNumbers('perso', {rupeet: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});


	/*Creation des input directionnelles*/
	cursors = this.input.keyboard.createCursorKeys(); 
	
	/*Colllectible*/
	rupees = this.physics.add.group({
		key: 'rupee',
		repeat:11,
		setXY: {x:12,y:0,stepX:70},
	});

	this.anims.create({
		key:'turn',
		frames: this.anims.generateFrameNumbers('rupee', {rupeet: 0, end: 3}),
		frameRate: 2,
		repeat: -1
	})
	
	this.physics.add.collider(rupees,platforms);
	this.physics.add.overlap(player,rupees,collectRupee,null,this);

	/*Texte*/
		//Score
	this.add.image(770,30,'rupee');
	scoreText = this.add.text(680, 16, '0 ', { fontSize: '32px', fill: '#000' });

	/*Ennemi*/
		//Bombes
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs, platforms, hitPlatforms, null, this);
	this.physics.add.collider(player, bombs, hitBomb, null, this);
}


function update() {
/*	if(gameOver=false)
	{
		rupees.anims.play('turn', true);
	}
*/
	/*Déplacement*/
		//Saut
		if ((player.body.touching.down) && (cursors.space.isDown))
		{
			jump = 2;
		}

		if (cursors.space.isUp){
			nJump = 1;
		}

		if ((nJump == 1) &&( jump > 0) && (cursors.space.isDown))
		{
			jump--;
			nJump = 0;
			if (jump == 1) 
			{
				player.setVelocityY(-300);
			}

			if (jump == 0) 
			{
				player.setVelocityY(-250);
			}
		}
	
	 	
	 	//player.anims.play('jump', true);
	
		//Droite et gauche
	if(cursors.left.isDown)
	{
		player.setVelocityX(-200);
		player.anims.play('run', true);
		player.setFlipX(true);
	}
	else if(cursors.right.isDown)
	{
		player.setVelocityX(200);
		player.anims.play('run', true);
		player.setFlipX(false);
	}
	else
	{
		player.setVelocityX(0);
		player.anims.play('idle', true);
	} 
}


function hitBomb(player, bomb) {
	/*this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	gameOver=true;*/
	bomb.destroy(true);
}



function collectRupee(player, rupee) {
	rupee.disableBody(true,true);
	score += 10;

	scoreText.setText('' + score);

		if (rupees.countActive(true) === 0)
	    {
	        rupees.children.iterate(function (child) {
	            child.enableBody(true, child.x, 0, true, true);
	        });

	        var x = (player.x < 400) ? 
	        	Phaser.Math.Between(400, 800) : 
	        	Phaser.Math.Between(0, 400);

	        var bomb = bombs.create(x, 16, 'bomb');

	        bomb.setBounce(1);
	        bomb.setCollideWorldBounds(true);
	        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	        bomb.allowGravity = false;
	    }
}

function hitPlatforms(bomb, platforms) {
	speedBomb+= 10;
	bomb.setGravityX(Phaser.Math.Between(-150+speedBomb, 150+speedBomb), 100+speedBomb);
	console.log(speedBomb);

	if(speedBomb >= 150)
	{
		bomb.destroy(true); 
		speedBomb = 0;
	}
}
