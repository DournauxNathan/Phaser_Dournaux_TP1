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


var platforms;
var player;
var nVies = 3;
var jump = 2;
var nJump = 1;

var groupeBullets;
var coefDir;

var cursors; 
var rupees;

var score = 0;
var scoreText;

var gameOverText;
var newGameText

var bomb;
var speedBomb = 1;
var frog;
var vieFrog = 1;



function preload() {
	this.load.image('background','assets/back.png');	
	this.load.spritesheet('rupee','assets/rupee.png', {frameWidth: 16, frameHeight: 16});
	this.load.spritesheet('cherry','assets/cherry.png', {frameWidth: 16, frameHeight: 16});
	this.load.spritesheet('choru','assets/chorus.png', {frameWidth: 16, frameHeight: 16});
	this.load.image('sol','assets/platform.png');

	
	this.load.spritesheet('bomb','assets/bomb.png',{frameWidth: 32, frameHeight: 32});

	this.load.spritesheet('frog', 'assets/frog.png', {frameWidth: 35, frameHeight: 32});
	this.load.spritesheet('frogJ', 'assets/frogJ.png', {frameWidth: 35, frameHeight: 32});

	this.load.spritesheet('perso','assets/idle.png',{frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('run','assets/run.png',{frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('saut','assets/jump.png',{frameWidth: 32, frameHeight: 32});
	this.load.image('bullet', 'assets/bullet.png');

	this.load.image('3vie', 'assets/vie/3vie.png');
	this.load.image('2vie', 'assets/vie/2vie.png');
	this.load.image('1vie', 'assets/vie/1vie.png');
	this.load.image('0vie', 'assets/vie/0vie.png');
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

	vie3 = this.add.image(60,30,'3vie');
	vie2 = this.add.image(60,30,'2vie');
	vie1 = this.add.image(60,30,'1vie');
	vie0 = this.add.image(60,30,'0vie');
		//Projectiles
	groupeBullets = this.physics.add.group();
	this.physics.add.collider(groupeBullets,frog, hit, null,this);
	//this.physics.add.overlap(bullet, frog, hit, null, this);
        
	
		//Animation
	this.anims.create({
		key:'jump',
		frames: this.anims.generateFrameNumbers('saut', {rupeet: 0, end: 1}),
		frameRate: 2,
	});

	this.anims.create({
		key:'run',
		frames: this.anims.generateFrameNumbers('run', {rupeet: 0, end: 5}),
		frameRate: 8,
		repeat: -1
	});
	
	this.anims.create({
		key:'idle',
		frames: this.anims.generateFrameNumbers('perso', {rupeet: 0, end: 3}),
		frameRate: 8,
		repeat: -1
	});
		//
	/*Creation des input directionnelles*/
	cursors = this.input.keyboard.createCursorKeys(); 
	keys = this.input.keyboard.addKeys('X'); 
	
	/*Colllectible*/
		//Rupees
	rupees = this.physics.add.group({
		key: 'rupee',
		repeat: 4,
		setXY: {x:50,y:0,stepX:150},
		setScale: { x: 1.5, y: 1.5}
	});

	this.anims.create({
		key:'turn',
		frames: this.anims.generateFrameNumbers('rupee', {rupeet: 0, end: 3}),
		frameRate: 2,
		repeat: -1
	})
	this.physics.add.collider(rupees,platforms);
	this.physics.add.overlap(player,rupees,collectRupee,null,this);

		//Cherry
	cherrys = this.physics.add.group({
		key: 'cherry',
		setXY: {x:550,y:500},
		setScale: { x: 1.5, y: 1.5}
	});

	this.physics.add.collider(cherrys, platforms);
	this.physics.add.overlap(player, cherrys, collectCherrys, null, this);
		//Chorus
	chorus = this.physics.add.group();
	this.physics.add.collider(chorus, platforms);
	this.physics.add.overlap(player, chorus, collectChorus, null, this);
	

	/*Texte*/
		//Score
	this.add.image(770,30,'rupee');
	scoreText = this.add.text(680, 16, '0 ', { fontSize: '32px', fill: '#000' });
		//GameOver
	gameOverText = this.add.text(310, 100, 'GAME OVER', {fontSize: '32px', fill: '#000' });
	gameOverText.visible = false
		//Nouvelle partie
	newGameText = this.add.text(245, 150, 'Appuyer sur (Bas) pour rejouer', {  fontSize: '16px', fill: '#000' });
	newGameText.visible = false

	/*Ennemie*/
		//Bombes
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs, platforms, hitPlatforms, null, this);
	this.physics.add.overlap(player, bombs, hitBomb, null, this);
		//Frog
	frog = this.physics.add.sprite(700,450,'frog').setScale(1.5);
	frog.setCollideWorldBounds(true);
	this.physics.add.collider(frog,platforms);
	this.physics.add.overlap(frog, player, hitEnnemi, null, this);
	this.physics.add.overlap(frog, cherrys, ennemiCollect, null, this);
	frog.visible = false;

	this.anims.create({
		key:'frog',
		frames: this.anims.generateFrameNumbers('frog', {rupeet: 0, end: 3}),
		frameRate: 6,
		repeat: -1
	});

	this.anims.create({
		key:'frogJ',
		frames: this.anims.generateFrameNumbers('frogJ', {rupeet: 0, end: 2}),
		frameRate: 5,
		repeat: -1
	});
}


function update() {
	/*Reset le jeu*/
	if(keys.X.isDown) 
	{  
		score = 0;
		nVies = 3
		this.registry.destroy();
		this.events.off();
		this.scene.restart();
	}

	/*Déplacement*/
		//Saut
	if (player.body.touching.down && cursors.space.isDown)
	{
		jump = 2;
	}

	if (cursors.space.isUp){
		nJump = 1;
	}

	if (nJump == 1 && jump > 0 && cursors.space.isDown)
	{
		jump--;
		nJump = 0;
		if (jump == 1) 
		{	
			player.anims.play('jump', true);
			player.setVelocityY(-300);
		}

		if (jump == 0) 
		{
			player.setVelocityY(-250);
			player.anims.play('jump', true);
		}
	}

		//Droite et gauche
	if(cursors.left.isDown)
	{
		player.setVelocityX(-200);
		player.anims.play('run', true);
		player.setFlipX(true);

		if (cursors.shift.isDown && player.body.touching.down) {
			player.setVelocityX(-200*2);
		}
	}
	else if(cursors.right.isDown)
	{
		player.setVelocityX(200);
		player.anims.play('run', true);
		player.setFlipX(false);

		if (cursors.shift.isDown  && player.body.touching.down) {
			player.setVelocityX(200*2);
		}
	}
	else
	{
		player.setVelocityX(0);
		player.anims.play('idle', true);
	} 

	if (cursors.up.isDown) {
	    if (player.direction == 'left') 
	    { 
	    	coefDir = 1; 
	    } 
	    /*if (player.direction == 'left')
	    { 
	    	coefDir = 1;
	    }*/

        //Création de la balle
        var bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');
        //Parametres physiques de la balle
        bullet.setCollideWorldBounds(true);
        bullet.body.allowGravity =false;
        bullet.setVelocity(1000 * coefDir, 0); 
    }

		
	if(nVies == 2)
	{
		vie3.destroy(true);
	}
	if(nVies == 1)
	{
		vie2.destroy(true);
	}
	if(nVies == 0) 
	{
		vie1.destroy();
		
		this.physics.pause();
	    player.setTint(0xff0000);
	   	gameOverText.visible = true;
	   	newGameText.visible = true;
	   	gameOver = true;
	}
	
	/*Apparition d'un frog*/
	if (score >= 10) {
		frog.visible = true;

	  	if(frog.x >= 700)
		{
			this.tweens.add({
		        targets: frog,
		        x: 0,
		        duration: 5000,
		        ease: 'Linear'
			});
			frog.play('frogJ', true);
			frog.setFlipX(false);
		}

		if(frog.x <= 50)
		{
			this.tweens.add({
		        targets: frog,
		        x: 750,
		        duration: 5000,
		        ease: 'Linear'   
			});
			frog.play('frogJ', true);
			frog.setFlipX(true);
		}
	}

}

function hitBomb(player, bomb) {
	bomb.disableBody(true, true);
	nVies--;
	bomb.destroy(true);
	console.log(nVies);
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

function collectCherrys(player, cherry) {
	if (nVies === 3) 
	{
		cherry.disableBody(true,true);
		score += 10;
		scoreText.setText('' + score);

		if (cherrys.countActive(true) === 0)
   		{
	    	cherrys.children.iterate(function (child) {
	            child.enableBody(true, child.x, child.y, true, true);
	        });

	    	var x = (player.x < 400) ? 
        	Phaser.Math.Between(400, 800) : 
        	Phaser.Math.Between(0, 400);

	        cherrys.setXY(Phaser.Math.Between(50, 750), Phaser.Math.Between(30, 500));
		}
	}

	if(nVies < 3)
	{
		cherry.disableBody(true,true);
		nVies++;
		console.log(nVies);

		if (cherrys.countActive(true) === 0)
   		{
	    	cherrys.children.iterate(function (child) {
	            child.enableBody(true, child.x, 0, true, true);
	        });

	    	var x = (player.x < 400) ? 
        	Phaser.Math.Between(400, 750) : 
        	Phaser.Math.Between(0, 400);

	        cherrys.setXY(Phaser.Math.Between(x, x), Phaser.Math.Between(30, 550));

		}

		if (nVies == 2) {
			vie2 = this.add.image(60,30,'2vie');
		}

		if (nVies == 3) {
			vie3 = this.add.image(60,30,'3vie');
		}

	}
}

function collectChorus(player, choru) {
	choru.disableBody(true,true);
	nVies--;
	score -= 10;

	scoreText.setText('' + score);
}

function hitEnnemi (frog, player) {
	nVies = 0;
}

function ennemiCollect(frog, cherry) {
	cherry.disableBody(true,true);

	if (cherrys.countActive(true) === 0)
   	{
	    cherrys.children.iterate(function (child) {

	        child.enableBody(true, child.x, child.y, true, true);
	        var choru = chorus.create(child.x, child.y, 'bomb');
	    });

        
	    cherrys.setXY(Phaser.Math.Between(50, 750), Phaser.Math.Between(30, 500));
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

function hit (groupeBullets, frog) {
	frog.destroy(true);
}
