"use strict";

function Game() {
    // Scene file name
    //this.kSceneFile = "/static/assets/scene.xml";

    // Audio clips: supports both mp3 and wav formats
    /*this.kBgClip = "/static/assets/sounds/BGClip.mp3";
    this.kCue = "/static/assets/sounds/MyGame_cue.wav";
    */
    // Textures: ( Note: supports png with transparency )
    this.kPortal = "/static/assets/textures/minion_portal.png";
    this.kCollector = "/static/assets/textures/minion_collector.png";
    //this.kFontImage = "/static/assets/textures/Consolas-72.png";
    
    // Sprite sheet
    this.kMinionSprite = "/static/assets/textures/spritesheets/minion_sprite.png";

    // The fonts
    //this.kFontCon16 = "/static/assets/textures/fonts/Consolas-16";  // notice font names do not need extensions!
    //this.kFontCon24 = "/static/assets/textures/fonts/Consolas-24";
    //this.kFontCon32 = "/static/assets/textures/fonts/Consolas-32";  // this is also the default system font
    //this.kFontCon72 = "/static/assets/textures/fonts/Consolas-72";
    //this.kFontSeg96 = "/static/assets/textures/fonts/Segment7-96";

    //gEngine.Core.initializeEngineCore(htmlCanvasID);
    // The camera to view the scene
    this.mCamera = null;

    // The hero and the support objects
    this.mHero = null;

    this.mMinionset = null;
    this.mDyePack = null;
    this.mMsg = null;
    this.mBrain = null;

    this.mTextToWork = null;

    this.mMode = null;

    this.mPortal = null;
    this.mCollector = null;

    this.mChoice = 'D';
    this.mFocusObj = null;

    this.mLMinion = null;
    this.mRMinion = null;
}

gEngine.Core.inheritPrototype(Game, Scene);

Game.prototype._InitText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

Game.prototype.initialize = function () {
    //var sceneParser = new SceneFileParser(this.kSceneFile);

    // Set up the camera
    this.mCamera = new Camera(vec2.fromValues(50, 33), 100, [0, 0, 600, 400]);

    // Sets the background to gray
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mDyePack = new DyePack(this.kMinionSprite);

    this.mMinionset = new GameObjectSet();
    var i = 0, randomY, aMinion;

    for (i = 0; i < 5; i++) {
        randomY = Math.random() * 65;
        aMinion = new Minion(this.kMinionSprite, randomY);
        this.mMinionset.addToSet(aMinion);
    }


    this.mHero = new Hero(this.kMinionSprite);

    this.mLMinion = Minion(this.kMinionSprite, 30, 30);
    this.mRMinion = Minion(this.kMinionSprite, 70, 30);

    this.mCollector = new TextureObject(this.kCollector, 50, 30, 30, 30);
    this.mPortal = new TextureObject(this.kPortal, 70, 30, 10, 10);

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(2);

    this.mBrain = new Brain(this.kMinionSprite);
    //this.mBrain.getXform().setPosition(2, 3);

    // Start the game loop
    //gEngine.GameLoop.start(this);

    // Start the background audio
    //gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

};

// The update function, updates the application state. Make sure not to draw anything from this function
Game.prototype.update = function () {
    var zoomDelta = 0.05;
    var msg = "L/R: Left or Right Minion; H: Hero; P: Portal";

    this.mLMinion.update();
    this.mRMinion.update();

    this.mHero.update();
    this.mPortal.update(gEngine.Input.keys.Up, gEngine.Input.keys.Down, gEngine.Input.keys.Left, gEngine.Input.keys.Right);
    //this.mCollector.update(gEngine.Input.keys.Up, gEngine.Input.keys.Down, gEngine.Input.keys.Left, gEngine.Input.keys.Right);

    var h = [];

    // Portal's resolution is 1/16 that of collector!
    // if (this.mCollector.pixelTouches(this.mPortal, h)) { // VERY EXPENSIVE!!
    if (!this.mHero.pixelTouches(this.mBrain, h)) {
        this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), 0.01);
        GameObject.prototype.update.call(this.mBrain);
    }

    /*var rate = 1;

    this.mHero.update();

    var hBbox = this.mHero.getBBox();
    var bBbox = this.mBrain.getBBox();

    switch (this.mMode) {
        case 'H':
            this.mBrain.update();   // Player steers with arrow keys
            break;
        case 'K':
            rate = 0.02;    // Graduate rate
            // When "K" is typed, the following should also be executed
        case 'J':
            if (!hBbox.intersectsBound(bBbox)) {
                this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), rate);
                GameObject.prototype.update.call(this.mBrain);
            }
            break;
    }

    // Check for hero going outside 80% of the WC Window bound
    var status = this.mCamera.collideWCBound(this.mHero.getXform(), 0.8);

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H))
        this.mMode = 'H';
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J))
        this.mMode = 'J';
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K))
        this.mMode = 'K';*/

    //this.mMinionset.update();
    //this.mDyePack.update();

    

    // Pan camera to object
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {
        this.mFocusObj = this.mLMinion;
        this.mChoice = 'L';
        this.mCamera.panTo(this.mLMinion.getXform().getXPos(), this.mLMinion.getXform().getYPos());
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R)) {
        this.mFocusObj = this.mRMinion;
        this.mChoice = 'R';
        this.mCamera.panTo(this.mRMinion.getXform().getXPos(), this.mRMinion.getXform().getYPos());
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        this.mFocusObj = this.mPortal;
        this.mChoice = 'P';
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) {
        this.mFocusObj = this.mHero;
        this.mChoice = 'H';
    }

    // Zoom
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.N))
        this.mCamera.zoomBy(1 - zoomDelta);
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.M))
        this.mCamera.zoomBy(1 + zoomDelta);
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J))
        this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 - zoomDelta);
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K))
        this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 + zoomDelta);

    // Interaction with the WC bounds
    this.mCamera.clampAtBoundary(this.mBrain.getXform(), 0.9);
    this.mCamera.clampAtBoundary(this.mPortal.getXform(), 0.8);
    this.mCamera.panWith(this.mHero.getXform(), 0.9);

    //this.mMsg.setText(msg + this.mMode + " [Hero bound=" + status + "]");
    this.mMsg.setText(msg + this.mChoice);
};

Game.prototype.draw = function () {
    // Clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    // Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Draw everything
    //this.mMinionset.draw(this.mCamera);
    ///this.mHero.draw(this.mCamera);
    this.mHero.draw(this.mCamera);
    this.mLMinion.draw(this.mCamera);
    this.mRMinion.draw(this.mCamera);
    ///this.mBrain.draw(this.mCamera);
    this.mPortal.draw(this.mCamera);
    //this.mCollector.draw(this.mCamera);
    this.mMsg.draw(this.mCamera);
};

Game.prototype.loadScene = function () {
    // Loads the audio
    //gEngine.AudioClips.loadAudio(this.kBgClip);
    //gEngine.AudioClips.loadAudio(this.kCue);

    // Loads the textures
    //gEngine.Textures.loadTexture(this.kPortal);
    //gEngine.Textures.loadTexture(this.kCollector);
    gEngine.Textures.loadTexture(this.kPortal);
    gEngine.Textures.loadTexture(this.kCollector);
    gEngine.Textures.loadTexture(this.kMinionSprite);
    /*gEngine.Textures.loadTexture(this.kFontImage);

    // Loads all the fonts
    gEngine.Fonts.loadFont(this.kFontCon16);
    gEngine.Fonts.loadFont(this.kFontCon24);
    gEngine.Fonts.loadFont(this.kFontCon32);
    gEngine.Fonts.loadFont(this.kFontCon72);
    gEngine.Fonts.loadFont(this.kFontSeg96);*/
};

Game.prototype.unloadScene = function () {
    //gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);

    // Stop the background audio before unloading it
    gEngine.AudioClips.stopBackgroundAudio();

    // Unload the scene resources
    // gEngine.AudioClips.unloadAudio(this.kBgClip);
    //      The above line is commented out on purpose because
    //      you know this clip will be used elsewhere in the game
    //      so you decide not to unload this clip.
    //gEngine.AudioClips.unloadAudio(this.kCue);

    //gEngine.Textures.unloadTexture(this.kPortal);
    //gEngine.Textures.unloadTexture(this.kCollector);
    gEngine.Textures.unloadTexture(this.kPortal);
    gEngine.Textures.unloadTexture(this.kCollector);
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    //gEngine.Textures.unloadTexture(this.kFontImage);

    // Unload the fonts
    /*gEngine.Fonts.unloadFont(this.kFontCon16);
    gEngine.Fonts.unloadFont(this.kFontCon24);
    gEngine.Fonts.unloadFont(this.kFontCon32);
    gEngine.Fonts.unloadFont(this.kFontCon72);
    gEngine.Fonts.unloadFont(this.kFontSeg96);*/

    var nextLevel = new GameOver();    // Next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

function getRandom(min, max) {
    return Math.random() * (max - min) + max;
}