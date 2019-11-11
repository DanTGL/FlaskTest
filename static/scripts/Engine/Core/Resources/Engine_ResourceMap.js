"use strict";

var gEngine = gEngine || {};

gEngine.ResourceMap = (function () {
    var MapEntry = function (rName) {
        this.mAsset = rName;
        this.mRefCount = 1;
    };

    // Resource storage
    var mResourceMap = {};

    // Number of outstanding load operations
    var mNumOutstandingLoads = 0;

    // Callback function when all textures are loaded
    var mLoadCompleteCallback = null;

    var asyncLoadRequested = function (rName) {
        mResourceMap[rName] = new MapEntry(rName);

        // Place holder for the resource to be loaded
        ++mNumOutstandingLoads;
    };

    var asyncLoadCompleted = function (rName, loadedAsset) {
        if (!isAssetLoaded(rName))
            alert("gEngine.asyncLoadCompleted: [" + rName + "] not in map!");
        mResourceMap[rName].mAsset = loadedAsset;
        --mNumOutstandingLoads;
        _checkForAllLoadCompleted();
    };

    var _checkForAllLoadCompleted = function () {
        if ((mNumOutstandingLoads === 0) && (mLoadCompleteCallback !== null)) {
            // Ensures the load complete callback will only be called once
            var funToCall = mLoadCompleteCallback;
            mLoadCompleteCallback = null;
            funToCall();
        }
    };

    // Make sure to set the callback after all load commands are issued
    var setLoadCompleteCallback = function (funct) {
        mLoadCompleteCallback = funct;

        // In case all loading are done
        _checkForAllLoadCompleted();
    };

    var retrieveAsset = function (rName) {
        var r = null;
        if (rName in mResourceMap)
            r = mResourceMap[rName].mAsset;
        return r;
    };

    var isAssetLoaded = function (rName) {
        return (rName in mResourceMap);
    };

    var unloadAsset = function (rName) {
        var c = 0;
        if (rName in mResourceMap) {
            mResourceMap[rName].mRefCount -= 1;
            c = mResourceMap[rName].mRefCount;
            if (c === 0)
                delete mResourceMap[rName];
        }

        return c;
    };

    var incAssetRefCount = function (rName) {
        mResourceMap[rName].mRefCount += 1;
    };

    var mPublic = {
        // Asynchronous resource loading support
        asyncLoadRequested: asyncLoadRequested,
        asyncLoadCompleted: asyncLoadCompleted,
        setLoadCompleteCallback: setLoadCompleteCallback,

        // Resource storage
        retrieveAsset: retrieveAsset,
        unloadAsset: unloadAsset,
        isAssetLoaded: isAssetLoaded,

        incAssetRefCount: incAssetRefCount
    };
    return mPublic;
}());