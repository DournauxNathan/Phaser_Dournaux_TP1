var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
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

var bullets;
var coefDir = 1;

var cursors; 
var rupees;

var score = 0;
var scoreText;

var gameOverText;
var newGameText

var bomb;
var speedBomb = 1;
var frog;
var frog2;




function preload() {
	this.load.image('background','assets/back.png');	
	this.load.spritesheet('rupee','assets/rupee.png', {frameWidth: 16, frameHeight: 16});
	this.load.spritesheet('cherry','assets/cherry.png', {frameWidth: 16, frameHeight: 20});
	this.load.spritesheet('choru','assets/chorus.png', {frameWidth: 16, frameHeight: 16});
	this.load.image('sol','assets/platform.png');

	
	this.load.spritesheet('bomb','assets/bomb.png',{frameWidth: 32, frameHeight: 32});

	this.load.spritesheet('ennemi1', 'assets/frog.png', {frameWidth: 35, frameHeight: 32});
	this.load.spritesheet('frogJ', 'assets/frogJ.png', {frameWidth: 35, frameHeight: 32});

	this.load.spritesheet('perso','assets/idle.png',{frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('run','assets/run.png',{frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('saut','assets/jump.png',{frameWidth: 32, frameHeight: 32});
	this.load.image('bullet', 'assets/bullet.png');

	this.load.image('3vie', 'assets/vie/3vie.png');
	this.load.image('2vie', 'assets/vie/2vie.png');
	this.load.image('1vie', 'assets/vie/1vie.png');
}

function create() {
	/*Creation des projectiles*/
	 var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, -100, 0, 'bullet');

            this.speed = Phaser.Math.GetSpeed(600, 1);
        },

        fire: function (x, y)
        {
            this.setPosition(x, y);

            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta)
        {
            this.x += this.speed * delta;

            if (this.x > 820)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        } 
     });

	    bullets = this.add.group({
	        classType: Bullet,
	        maxSize: 30,
	        runChildUpdate: true
	    });

	/*Fond du jeu*/
		this.add.image(400,300,'background');
		this.add.image(1200,300,'background');
		this.add.image(2000,300,'background');

	/*Porte*/
		portes = this.physics.add.staticGroup();
		portes.create(2250,500,'porte').refreshBody();

	/*Platformes*/
		platforms = this.physics.add.staticGroup();
		platforms.create(50,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(268,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(486,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(704,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(922,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(1140,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(1358,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(1576,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(1794,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(2012,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(2230,580,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(2448,580,'sol').setScale(0.75,0.5).refreshBody();

		platforms.create(1500,420,'sol').setScale(0.75,0.5).refreshBody();
		platforms.create(1000,200,'sol').setScale(0.75,0.5).refreshBody();
	
	/*Joueur*/
	this.cameras.main.setBounds(0, 0, 1200 * 2, 300 * 2);
    this.physics.world.setBounds(0, 0, 1200 * 2, 300*2);

	player = this.physics.add.sprite(100,450,'idle').setScale(2).setSize(25,32,false);;
	player.setCollideWorldBounds(true);
	player.setGravityY(150);
	this.physics.add.collider(player,platforms);
	this.physics.add.collider(player,portes, fadeLevel, null, this);

	this.cameras.main.startFollow(player , true, 0.05, 0.05);

	vie3 = this.add.image(60,30,'3vie').setScrollFactor(0);
	vie2 = this.add.image(60,30,'2vie').setScrollFactor(0);
	vie1 = this.add.image(60,30,'1vie').setScrollFactor(0);

		//Projectiles
	groupeBullets = this.physics.add.group();
	this.physics.add.overlap(groupeBullets,frog, hit, null,this);
	this.physics.add.overlap(groupeBullets,frog2, hit, null,this);
	this.physics.add.overlap(groupeBullets,platforms, deleteBullet, null,this);
        
	
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
	fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
	keys = this.input.keyboard.addKeys('X'); 
	
	/*Colllectible*/
		//Rupees
	rupees = this.physics.add.group({
		key: 'rupee',
		repeat: 2,
		setXY: {x:920,y:150,stepX:80},
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
		setXY: {x:1500,y:300},
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
	this.add.image(player.x+650,30,'rupee').setScale(1.5).setScrollFactor(0);
	scoreText = this.add.text(680, 16, '0 ', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
		//GameOver
	gameOverText = this.add.text(310, 100, 'GAME OVER', {fontSize: '32px', fill: '#000' }).setScrollFactor(0);
	gameOverText.visible = false;
		//Nouvelle partie
	newGameText = this.add.text(245, 150, 'Appuyer sur (F5) pour rejouer', {  fontSize: '16px', fill: '#000' }).setScrollFactor(0);
	newGameText.visible = false;

	/*Ennemie*/
		//Bombes
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs, platforms, hitPlatforms, null, this);
	this.physics.add.overlap(player, bombs, hitBomb, null, this);
		//Frog
	frog = this.physics.add.sprite(1360,450,'ennemi1').setScale(1.5);
	frog.setCollideWorldBounds(true);
	this.physics.add.collider(frog,platforms);
	this.physics.add.overlap(frog, player, hitEnnemi, null, this);
	this.physics.add.overlap(frog, cherrys, ennemiCollect, null, this);
	this.physics.add.overlap(frog, groupeBullets, hit, null, this);

	frog2 = this.physics.add.sprite(2050,450,'ennemi1').setScale(1.5);
	frog2.setCollideWorldBounds(true);
	this.physics.add.collider(frog2,platforms);
	this.physics.add.overlap(frog2, player, hitEnnemi, null, this);
	this.physics.add.overlap(frog2, cherrys, ennemiCollect, null, this);
	this.physics.add.overlap(frog2, groupeBullets, hit2, null, this);
	

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

	/*Tutoriel*/
		//Droite et gauche
		if (player.x >= 100) 
		{
			var moveText = this.add.text(100, 430,'<- Move ->');

		}
		 
		if (player.x >= 300) 
		{
			var moveText = this.add.text(350, 410,' Run\nSHIFT');
		}

		if (player.x >= 550) 
		{
			var moveText = this.add.text(600, 410,' Fire\n  F');
		}

		if (player.x >= 1200) 
		{
			var moveText = this.add.text(1300, 410,' Jump\nSPACE');
		}

		if (player.y < 350) 
		{
			var moveText = this.add.text(1140, 120,'Double Jump\n  SPACE x2');
		}

	/*Reset le jeu*/
		if(keys.X.isDown) 
		{  
			this.registry.destroy();
			this.events.off();
			this.scene.restart();
		
			score = 0;
			nVies = 3;
			jump = 2;	
			nJump = 1;
			speedBomb = 1;
			//this.tweens.destroy();
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
				player.setVelocityY(-390);
			}

			if (jump == 0) 
			{
				player.setVelocityY(-260);
				player.anims.play('jump', true);
			}
		}

		//Droite et gauche
		if(cursors.left.isDown)
		{
			player.direction = 'left';
			player.setVelocityX(-200);
			player.anims.play('run', true);
			player.setFlipX(true);

			if (cursors.shift.isDown && player.body.touching.down) {
				player.direction = 'left';
				player.setVelocityX(-200*2);
			}
		}
		else if(cursors.right.isDown)
		{
			player.direction = 'right';
			player.setVelocityX(200);
			player.anims.play('run', true);
			player.setFlipX(false);

			if (cursors.shift.isDown  && player.body.touching.down) {
				player.direction = 'right';
				player.setVelocityX(200*2);
			}
		}
		else
		{
			player.setVelocityX(0);
			player.anims.play('idle', true);
		} 

		if (Phaser.Input.Keyboard.JustDown(fire)) {
			
			if (player.direction == 'right') {
				var coefDir = 1;
			}

			if (player.direction == 'left') {
				var coefDir = -1;
			}

		    if (player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
	        // on crée la balle a coté du joueur
	        var bullet = groupeBullets.create(player.x + (25 * coefDir), player.y - 4, 'bullet');
	        // parametres physiques de la balle.
	        bullet.body.allowGravity =false;
	        bullet.setVelocity(1000 * coefDir, 0); 
	    }

	/*Actualisation de la vie*/
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
	   	this.cameras.main.fade(0xfff, 4000);

	   	this.registry.destroy();
		this.events.off();
		this.scene.restart();
	}
	
	/*Apparition d'un frog*/
		//Frog1
	  	if(frog.x >= 1360)
		{
			this.tweens.add({
		        targets: frog,
		        x: 850,
		        duration: 5000,
		        ease: 'Linear'
			});
			frog.play('frogJ', true);
			frog.setFlipX(false);
		}

		if(frog.x <= 850)
		{
			this.tweens.add({
		        targets: frog,
		        x: 1360,
		        duration: 5000,
		        ease: 'Linear'   
			});
			frog.anims.play('frogJ', true);
			frog.setFlipX(true);
		}
		//Frog2
		if(frog2.x >= 2050)
		{
			this.tweens.add({
		        targets: frog2,
		        x: 1800,
		        duration: 5000,
		        ease: 'Linear'
			});
			frog2.play('frogJ', true);
			frog2.setFlipX(false);
		}

		if(frog2.x <= 1800)
		{
			this.tweens.add({
		        targets: frog2,
		        x: 2050,
		        duration: 5000,
		        ease: 'Linear'   
			});
			frog2.anims.play('frogJ', true);
			frog2.setFlipX(true);
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

	    	var x = (player.x < 800 || player.x >100) ? 
        	Phaser.Math.Between(1000, 2000) : 
        	Phaser.Math.Between(0, 100);

	        cherrys.setXY(Phaser.Math.Between(x, x), Phaser.Math.Between(30, 500));
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
	choru.disableBody(true, true);
	nVies--;
	score -= 10;

	scoreText.setText('' + score);
}

function hitEnnemi (frog, player) {
	nVies = 0;
}

function ennemiCollect(frog, cherry) {
	cherry.disableBody(true, true);

	if (cherrys.countActive(true) === 0)
   	{
	    cherrys.children.iterate(function (child) {

	        child.enableBody(true, child.x, child.y, true, true);
	        var choru = chorus.create(child.x, child.y, 'choru');
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

function hit(ennemi1, groupeBullets) {
	//ennemi1.disableBody(true, true);
	frog.disableBody(true);
	frog.setAlpha(0);
	groupeBullets.destroy(true);
}

function hit2(ennemi1, groupeBullets) {
	//ennemi1.disableBody(true, true);
	frog2.disableBody(true);
	frog2.setAlpha(0);
	groupeBullets.destroy(true);
}

function deleteBullet(groupeBullets, platforms) {
	groupeBullets.destroy(true);
}

function fadeLevel(player, porte) {
	/*Affaiblissement de l'écran - début de la transition vers la scene suivante*/
	this.cameras.main.fade(0xf0f, 4000);
	timedEvent = this.time.delayedCall(5000, changeLevel, [], this);
}

function changeLevel() {
	console.log("Changement de scene");
	this.scene.start('Level_1');
}