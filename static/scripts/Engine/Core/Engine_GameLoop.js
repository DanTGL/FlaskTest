"use strict";

var gEngine = gEngine || {};

gEngine.GameLoop = (function () {
    var kFPS = 60;              // Frames per second
    var kMPF = 1000 / kFPS;     // Milliseconds per frame

    // Variables for timing gameloop
    var mPreviousTime;
    var mLagTime;
    var mCurrentTime;
    var mElapsedTime;

    // The current loop state (running or should stop)
    var mIsLoopRunning = false;

    // Reference to game logic
    var mGame = null;

    // This function assumes it is sub-classed from Game
    var _runLoop = function () {
        if (mIsLoopRunning) {
            // Set up for next call to _runLoop and update input
            requestAnimationFrame(function () { _runLoop.call(mGame); });

            // Compute elapsed time since last RunLoop was executed
            mCurrentTime = Date.now();
            mElapsedTime = mCurrentTime - mPreviousTime;
            mPreviousTime = mCurrentTime;
            mLagTime += mElapsedTime;

            // Update the game the appropriate number of times
            // Update only every millisecond per frame
            // If lag is larger than update frames, update until caught up
            while ((mLagTime >= kMPF) && mIsLoopRunning) {
                gEngine.Input.update();
                this.update();
                mLagTime -= kMPF;
            }

            // Now let's draw
            this.draw();
        } else {
            // The game loop has stopped, unload current scene!
            mGame.unloadScene();
        }
    };

    var _startLoop = function () {
        // Reset frame time
        mPreviousTime = Date.now();
        mLagTime = 0.0;

        // Remember that loop is now running
        mIsLoopRunning = true;

        // Request _runLoop to start when loading is done
        requestAnimationFrame(function () { _runLoop.call(mGame); });
    };

    var start = function (game) {
        mGame = game;
        gEngine.ResourceMap.setLoadCompleteCallback(function () {
            mGame.initialize();
            _startLoop();
        });
    };

    var stop = function () {
        mIsLoopRunning = false;
    };

    var mPublic = {
        start: start,
        stop: stop
    };

    return mPublic;
}());