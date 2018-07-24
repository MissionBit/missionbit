var game = new Phaser.Game(800, 800, Phaser.AUTO, 'game-div');

var level1State = { preload: preload, create: create, update: update };
var gameoverState = {
  create: function() {
    var style = {
      font: "bold 32px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };

    //  The Text is positioned at 0, 100
    text = this.game.add.text(0, 0, "<< GAME OVER >>", style);
    
    // x, y, width, height
    text.setTextBounds(0, 100, 800, 100);
    
    // text click event
    text.inputEnabled = true;
    text.events.onInputDown.add(function() {
      this.game.state.start('level1');
    }, this)
  }
};


game.state.add('level1', level1State);
game.state.add('gameover', gameoverState);
game.state.start('gameover');

function preload() {

    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    game.load.tilemap('level1', 'example-tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'simples_pimples.png');

    game.load.image('star', 'assets/star.png');

}

// Any variables that we want to use in both create() and update()
// have to be declared outside of both functions.
var keys;
var player;
var map;
var backgroundLayer;
var blockingLayer;
var itemLayer;
var star;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('level1');
    map.addTilesetImage('simples_pimples', 'tiles');

    backgroundLayer = map.createLayer('Background');
    backgroundLayer.setScale(2);
    blockingLayer = map.createLayer('Blocking Layer');
    blockingLayer.setScale(2);
    itemLayer = map.createLayer('Item Layer');
    itemLayer.setScale(2);
    
    map.setCollisionBetween(700, 750, true, 'Blocking Layer');

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 250, 'dude');
    player.scale.setTo(0.5, 0.5);

    //  We need to enable physics on the player so that it can move and collide with stuff
    game.physics.arcade.enable(player);
    
    //  Player physics properties.
    player.body.gravity.y = 1200;
    
    //  Our controls.
    keys = game.input.keyboard.createCursorKeys();
    
    // Add animations to the player
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    // These two lines are necessary to make the camera move
    // to follow the player
    game.world.setBounds(0, 0, 1920, 1920);
    game.camera.follow(player);
}

function update() {
    // Check for collisions between the player and the blocking layer
    game.physics.arcade.collide(player, blockingLayer);
    
    var onOverlap = function() {
      console.log("OVERLAP!");
    }
    
    // game.physics.arcade.overlap(player, itemLayer, onOverlap);

    // console.log(itemLayer.overlap(player));

    if (keys.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -250;
        player.animations.play('left');
    }
    else if (keys.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 250;
        player.animations.play('right');
    }
    else {
        //  Stop
        player.body.velocity.x = 0;
        
        //  Stand still
        player.animations.stop();
        
        // Reset animation frame
        player.frame = 4;
    }
    
    if (keys.up.isDown) {
        player.body.velocity.y = -700;
    }
}

