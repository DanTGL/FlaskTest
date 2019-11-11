"use strict";

var gEngine = gEngine || {};

gEngine.Core = (function () {
    var mGL = null;

    var getGL = function () { return mGL; };

    var initializeEngineCore = function (htmlCanvasID, game) {
        _initializeWebGL(htmlCanvasID);
        gEngine.VertexBuffer.initialize();
        gEngine.Input.initialize();
        gEngine.AudioClips.initAudioContext();

        // Inits DefaultResources, when done, invoke startScene(game)
        gEngine.DefaultResources.initialize(function () {
            startScene(game);
        });
    };

    var _initializeWebGL = function (htmlCanvasID) {
        var canvas = document.getElementById(htmlCanvasID);

        // Get standard webgl, or experimental.
        // binds webgl to the Canvas area on the web-page to the variable mGL
        mGL = canvas.getContext("webgl", { alpha: false }) || canvas.getContext("experimental-webgl", { alpha: false });

        // Allows transperency with textures.
        mGL.blendFunc(mGL.SRC_ALPHA, mGL.ONE_MINUS_SRC_ALPHA);
        mGL.enable(mGL.BLEND);

        // Set images to flip the y axis to match the texture coordinate space.
        mGL.pixelStorei(mGL.UNPACK_FLIP_Y_WEBGL, true);
        
        if (mGL === null) {
            document.write("<br><b>WebGL is not supported!</b>");
            return;
        }
    };

    var clearCanvas = function (color) {
        mGL.clearColor(color[0], color[1], color[2], color[3]);
        mGL.clear(mGL.COLOR_BUFFER_BIT);
    };

    var startScene = function (game) {
        game.loadScene.call(game);
        //game.initialize.call(game);
        gEngine.GameLoop.start(game);
    };

    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    var cleanUp = function () {
        gEngine.VertexBuffer.cleanUp();
        gEngine.DefaultResources.cleanUp();
    };

    var mPublic = {
        getGL: getGL,
        initializeEngineCore: initializeEngineCore,
        clearCanvas: clearCanvas,
        inheritPrototype: inheritPrototype,
        startScene: startScene,
        cleanUp: cleanUp
    };

    return mPublic;
}());
