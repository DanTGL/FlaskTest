"use strict";

function FontRenderable(text) {
    this.mFont = gEngine.DefaultResources.getDefaultFont();
    this.mOneChar = new SpriteRenderable(this.mFont + ".png");
    this.mXform = new Transform();  // Transform that moves this object around
    this.mText = text;
}

FontRenderable.prototype.draw = function (camera) {
    var widthOfOneChar = this.mXform.getWidth() / this.mText.length;
    var heightOfOneChar = this.mXform.getHeight();
    var yPos = this.mXform.getYPos();

    // Center position of the first char
    var xPos = this.mXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);

    var charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
    for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
        aChar = this.mText.charCodeAt(charIndex);
        charInfo = gEngine.Fonts.getCharInfo(this.mFont, aChar);

        // Set the texture coordinate
        this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft, charInfo.mTexCoordRight, charInfo.mTexCoordBottom, charInfo.mTexCoordTop);

        // Now the size of the char
        xSize = widthOfOneChar * charInfo.mCharWidth;
        ySize = heightOfOneChar * charInfo.mCharHeight;
        this.mOneChar.getXform().setSize(xSize, ySize);

        // How much to offset from the center
        xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
        yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;

        this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

        this.mOneChar.draw(camera);

        xPos += widthOfOneChar;
    }
};

FontRenderable.prototype.getXform = function () { return this.mXform; };
FontRenderable.prototype.getText = function () { return this.mText; };
FontRenderable.prototype.setText = function (text) {
    this.mText = text;
    this.setTextHeight(this.getXform().getHeight());
};

FontRenderable.prototype.getFont = function () { return this.mFont; };
FontRenderable.prototype.setFont = function (font) {
    this.mFont = font;
    this.mOneChar.setTexture(this.mFont + ".png");
};

FontRenderable.prototype.setColor = function (color) {
    this.mOneChar.setColor(color);
};

FontRenderable.prototype.getColor = function () {
    return this.mOneChar.getColor();
};

FontRenderable.prototype.setTextHeight = function (h) {
    // This is for "A"
    var charInfo = gEngine.Fonts.getCharInfo(this.mFont, "A".charCodeAt(0));
    var w = h * charInfo.mCharAspectRatio;
    this.getXform().setSize(w * this.mText.length, h);
};