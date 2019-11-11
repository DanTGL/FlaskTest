"use strict";

function SimpleShader(vertexShaderPath, fragmentShaderPath) {
    this.mCompiledShader = null;
    this.mShaderVertexPositionAttribute = null;
    this.mPixelColor = null;
    this.mModelTransform = null;
    this.mViewProjShaderTransform = null;

    var gl = gEngine.Core.getGL();

    var mVertexShader = this._compileShader(vertexShaderPath, gl.VERTEX_SHADER);
    var mFragmentShader = this._compileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

    this.mCompiledShader = gl.createProgram();
    gl.attachShader(this.mCompiledShader, mVertexShader);
    gl.attachShader(this.mCompiledShader, mFragmentShader);
    gl.linkProgram(this.mCompiledShader);

    if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
        alert("Error linking shader");
        return null;
    }

    this.mShaderVertexPositionAttribute = gl.getAttribLocation(this.mCompiledShader, "aSquareVertexPosition");

    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLVertexRef());

    gl.vertexAttribPointer(this.mShaderVertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");

    this.mModelTransform = gl.getUniformLocation(this.mCompiledShader, "uModelTransform");

    this.mViewProjTransform = gl.getUniformLocation(this.mCompiledShader, "uViewProjTransform");
}

SimpleShader.prototype._compileShader = function (filePath, shaderType) {
    var shaderSource, compiledShader;
    var gl = gEngine.Core.getGL();

    // Access the shader textfile
    shaderSource = gEngine.ResourceMap.retrieveAsset(filePath);

    if (shaderSource === null) {
        alert("WARNING: Loading of: " + filePath + " Failed!");
        return null;
    }

    compiledShader = gl.createShader(shaderType);

    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }
    
    return compiledShader;
};

SimpleShader.prototype.activateShader = function (pixelColor, camera) {
    var gl = gEngine.Core.getGL();
    gl.useProgram(this.mCompiledShader);
    //gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLVertexRef());
    //gl.vertexAttribPointer(this.mShaderVertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(this.mViewProjTransform, false, camera.getVPMatrix());
    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
    gl.uniform4fv(this.mPixelColor, pixelColor);
};

SimpleShader.prototype.getShader = function () {
    return this.mCompiledShader;
};

SimpleShader.prototype.loadObjectTransform = function (modelTransform) {
    var gl = gEngine.Core.getGL();
    gl.uniformMatrix4fv(this.mModelTransform, false, modelTransform);
};

SimpleShader.prototype.cleanUp = function () {
    var gl = gEngine.Core.getGL();
    gl.detachShader(this.mCompiledShader, this.mVertexShader);
    gl.detachShader(this.mCompiledShader, this.mFragmentShader);
    gl.deleteShader(this.mVertexShader);
    gl.deleteShader(this.mFragmentShader);
};