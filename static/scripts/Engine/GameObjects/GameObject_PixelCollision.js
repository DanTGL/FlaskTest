"use strict";

GameObject.prototype.pixelTouches = function (otherObj, wcTouchPos) {
    // Only continue if both objects have GetColorArray defined
    var pixelTouch = false;
    var ren = this.getRenderable();
    var otherRen = otherObj.getRenderable();

    if ((typeof ren.pixelTouches === "function") && (typeof otherRen.pixelTouches === "function")) {
        if ((ren.getXform().getRotationInRad() === 0) && (otherRen.getXform().getRotationInRad() === 0)) {
            var otherBbox = otherObj.getBBox();

            if (otherBbox.intersectsBound(this.getBBox())) {
                ren.setColorArray();
                otherRen.setColorArray();
                pixelTouch = ren.pixelTouches(otherRen, wcTouchPos);
            }
        } else {
            // One or both are rotated, compute an encompassing circle by using the hypotenuse as radius
            var size = ren.getXform().getSize();
            var otherSize = otherRen.getXform().getSize();
            var r = Math.sqrt(0.5 * mySize[0] * 0.5 * mySize[0] + 0.5 * mySize[1] * 0.5 * mySize[1]);
            var otherR = Math.sqrt(0.5 * otherSize[0] * 0.5 * otherSize[0] + 0.5 * otherSize[1] * 0.5 * otherSize[1]);

            var d = [];
            vec2.sub(d, ren.getXform().getPosition(), otherRen.getXform.getPosition());

            if (vec2.length(d) < (r + otherR)) {
                ren.setColorArray();
                otherRen.setColorArray();
                pixelTouch = ren.pixelTouches(otherRen, wcTouchPos);
            }
        }
    }

    return pixelTouch;
};