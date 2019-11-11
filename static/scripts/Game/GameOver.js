"use strict";

function GameOver() {
    this.mCamera = null;
    this.mMsg = null;
};

gEngine.Core.inheritPrototype(GameOver, Scene);

GameOver.prototype.initialize = function () {
    // Set up the cameras
    this.mCamera = new Camera(vec2.fromValues(50, 33), 100, [0, 0, 600, 400]);
    this.mCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);

    this.mMsg = new FontRenderable("Game Over!");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(22, 32);
    this.mMsg.setTextHeight(10);
};

GameOver.prototype.draw = function () {
    // Clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // Clear to light gray

    // Activate the drawing Camera
    this.mCamera.setupViewProjection();
    this.mMsg.draw(this.mCamera.getVPMatrix());
};

GameOver.prototype.update = function () {
    gEngine.GameLoop.stop();
};

GameOver.prototype.unloadScene = function () {
    gEngine.Core.cleanUp(); // Release gl resources
};