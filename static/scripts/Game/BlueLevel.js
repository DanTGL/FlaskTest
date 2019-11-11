"use strict";

function BlueLevel() {
    // audio clips: supports both mp3 and wav formats
    this.kBgClip = "/static/assets/sounds/BGClip.mp3";
    this.kCue = "/static/assets/sounds/BlueLevel_cue.wav";

    // Textures: ( Note: jpg does not support transparency )
    this.kPortal = "/static/assets/textures/minion_portal.jpg";
    this.kCollector = "/static/assets/textures/minion_portal.jpg";

    // Scene file name
    this.kSceneFile = "/static/assets/BlueLevel.xml";

    // All squares
    this.mSqSet = []; // These are the renderable objects

    // The camera to view the scene
    this.mCamera = null;
}

gEngine.Core.inheritPrototype(BlueLevel, Scene);

BlueLevel.prototype.loadScene = function () {
    // Load the scene file
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);

    // Load the audios
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);

    // Load the textures
    gEngine.Textures.loadTexture(this.kPortal);
    gEngine.Textures.loadTexture(this.kCollector);
};

BlueLevel.prototype.initialize = function () {
    // Called from GameLoop, after loading is done
    var sceneParser = new SceneFileParser(this.kSceneFile);

    // Parse the camera
    this.mCamera = sceneParser.parseCamera();

    // Parse for all the squares
    sceneParser.parseSquares(this.mSqSet);
    sceneParser.parseTextureSquares(this.mSqSet);

    // Start background audio
    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
};

BlueLevel.prototype.draw = function () {
    // Clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    // Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Draw all the squares
    for (var i = 0; i < this.mSqSet.length; i++) {
        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
    }
};

BlueLevel.prototype.update = function () {
    // For this very simple game, let's move the white square and pulse the red
    var xform = this.mSqSet[0].getXform();
    var deltaX = 0.05;

    // Test for white square movement
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        gEngine.AudioClips.playACue(this.kCue);
        if (xform.getXPos() > 30)
            xform.setPosition(10, 60);
        xform.incXPosBy(deltaX);
    }

    // Test for white square rotation
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up))
        xform.incRotationByDegree(1);

    xform = this.mSqSet[1].getXform();

    // Test for pulsing red square
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (xform.getWidth() > 5)
            xform.setSize(2, 2);
        xform.incSizeBy(0.05);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        gEngine.AudioClips.playACue(this.kCue);
        xform.incXPosBy(-deltaX);
        if (xform.getXPos() < 11) {
            gEngine.GameLoop.stop();
        }
    }

    // Continously change texture tinting
    var c = this.mSqSet[2].getColor();
    var ca = c[3] + deltaX;
    if (ca > 1) {
        ca = 0;
    }

    c[3] = ca
};

BlueLevel.prototype.unloadScene = function () {
    // Stop the background audio
    gEngine.AudioClips.stopBackgroundAudio();

    // Unload the scene file and loaded resources
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kCue);
    gEngine.Textures.unloadTexture(this.kPortal);
    gEngine.Textures.unloadTexture(this.kCollector);

    var nextLevel = new Game(); // The next level
    gEngine.Core.startScene(nextLevel);
};