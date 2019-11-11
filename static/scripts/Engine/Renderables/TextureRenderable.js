"use strict";

function TextureRenderable(texture) {
    Renderable.call(this);
    Renderable.prototype.setColor.call(this, [1, 1, 1, 0]); // Alpha 0: switch off tinting.
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getTextureShader());
    this.mTexture = null; // The objects texture, cannot be null.
    // These two instance variables are to cache texture information
    // for supporting per-pixel accurate collision
    this.mTextureInfo = null;
    this.mColorArray = null;
    // Defined for subclass to override
    this.mTexWidth = 0;
    this.mTexHeight = 0;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
    this.setTexture(texture);
}

gEngine.Core.inheritPrototype(TextureRenderable, Renderable);

TextureRenderable.prototype.draw = function (camera) {
    // Activate the matrix
    gEngine.Textures.activateTexture(this.mTexture);
    Renderable.prototype.draw.call(this, camera);
};

TextureRenderable.prototype.getTexture = function () { return this.mTexture; };
TextureRenderable.prototype.setTexture = function (t) {
    this.mTexture = t;
    this.mTextureInfo = gEngine.Textures.getTextureInfo(t);
    this.mColorArray = null;
    this.mTexWidth = this.mTextureInfo.mWidth;
    this.mTexHeight = this.mTextureInfo.mHeight;
    this.mTexLeftIndex = 0;
    this.mTexBottomIndex = 0;
};