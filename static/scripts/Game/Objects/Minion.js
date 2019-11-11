/* jslint node: true, vars: true */
/* global gEngine: false, GameObject: false, SpriteAnimateRenderable: false */

"use strict";

function Minion(spriteTexture, atX, atY) {
    this.kDelta = 0.2;
    this.mMinion = new SpriteAnimateRenderable(spriteTexture);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(atX, atY);
    this.mMinion.getXform().setSize(12, 9.6);
    this.mMinion.setSpriteSequence(512, 0, 204, 164, 5, 0);
    console.log("test");
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(15);
    GameObject.call(this, this.mMinion);
}

gEngine.Core.inheritPrototype(Minion, GameObject);

Minion.prototype.update = function () {
    // Remember to update this.mMinion's animation
    this.mMinion.updateAnimation();
    /*
    // Move toward the left and wraps
    var xform = this.getXform();
    xform.incXPosBy(-this.kDelta);

    // If fly off to the left, re-appear at the right
    if (xform.getXPos() < 0) {
        xform.setXPos(100);
        xform.setYPos(65 * Math.random());
    }*/
};