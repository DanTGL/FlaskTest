"use strict";

function Renderable() {
    this.mShader = gEngine.DefaultResources.getConstColorShader(); // The shader for shading this object
    this.mColor = [1, 1, 1, 1]; // Color for fragment shader
    this.mXform = new Transform(); // Transform operator for the object
};

Renderable.prototype.getXform = function () {
    return this.mXform;
};

Renderable.prototype.draw = function (camera) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, camera);
    this.mShader.loadObjectTransform(this.mXform.getXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

Renderable.prototype.setColor = function (color) {
    this.mColor = color;
};

Renderable.prototype.getColor = function () {
    return this.mColor;
};

Renderable.prototype._setShader = function (s) { this.mShader = s; };