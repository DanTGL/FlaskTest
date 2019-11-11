"use strict";

var gEngine = gEngine || {};

gEngine.DefaultResources = (function () {

    // Simple Shader GLSL Shader file paths
    var kSimpleVS = "/static/shaders/Game/SimpleVS.glsl";
    var kSimpleFS = "/static/shaders/Game/SimpleFS.glsl";

    var mConstColorShader = null;
    var _getConstColorShader = function () {
        return mConstColorShader;
    };

    // Texture Shader GLSL Shader file paths
    var kTextureVS = "/static/shaders/TextureVS.glsl";
    var kTextureFS = "/static/shaders/TextureFS.glsl";
    var mTextureShader = null;

    var getTextureShader = function () { return mTextureShader; };

    var mSpriteShader = null;

    var getSpriteShader = function () { return mSpriteShader; };

    // Default font
    var kDefaultFont = "/static/assets/textures/fonts/system-default-font";
    var getDefaultFont = function () { return kDefaultFont; };

    // Callback function after loadings are done
    var _createShaders = function (callBackFunction) {
        gEngine.ResourceMap.setLoadCompleteCallback(null);
        mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
        mTextureShader = new TextureShader(kTextureVS, kTextureFS);
        mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
        callBackFunction();
    };

    // Initiate asynchronous loading of GLSL Shader files
    var _initialize = function (callBackFunction) {
        // Constant color shader: SimpleVS, and SimpleFS
        gEngine.TextFileLoader.loadTextFile(kSimpleVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.loadTextFile(kSimpleFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

        // Texture shader
        gEngine.TextFileLoader.loadTextFile(kTextureVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.loadTextFile(kTextureFS, gEngine.TextFileLoader.eTextFileType.eTextFile);

        // Load default font
        gEngine.Fonts.loadFont(kDefaultFont);

        gEngine.ResourceMap.setLoadCompleteCallback(function () {
            _createShaders(callBackFunction);
        });
    };

    var cleanUp = function () {
        mConstColorShader.cleanUp();
        mTextureShader.cleanUp();
        mSpriteShader.cleanUp();

        gEngine.TextFileLoader.unloadTextFile(kSimpleVS);
        gEngine.TextFileLoader.unloadTextFile(kSimpleFS);

        // Texture shader
        gEngine.TextFileLoader.unloadTextFile(kTextureVS);
        gEngine.TextFileLoader.unloadTextFile(kTextureFS);

        // Default font
        gEngine.Fonts.unloadFont(kDefaultFont);
    }

    var mPublic = {
        initialize: _initialize,
        getConstColorShader: _getConstColorShader,
        getTextureShader: getTextureShader,
        getSpriteShader: getSpriteShader,
        getDefaultFont: getDefaultFont,
        cleanUp: cleanUp
    };
    return mPublic;
}());