"use strict";

function TextureShader(vertexShaderPath, fragmentShaderPath) {
    // Call super class constructor
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);

    // Reference to aTextureCoordinate within the shader
    this.mShaderTextureCoordAttribute = null;

    // Get the reference of aTextureCoordinate from the shader
    var gl = gEngine.Core.getGL();

    this.mShaderTextureCoordAttribute = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
}

// Get all the prototype functions from SimpleShader
gEngine.Core.inheritPrototype(TextureShader, SimpleShader);

TextureShader.prototype.activateShader = function (pixelColor, camera) {
    // First call the super class's activate
    SimpleShader.prototype.activateShader.call(this, pixelColor, camera);

    // Now our own functionality: enable texture coordinate array
    var gl = gEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLTexCoordRef());
    gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
    gl.vertexAttribPointer(this.mShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
};