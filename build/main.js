"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var windowEl = document.querySelectorAll('.window-header');
    var isDragging = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    var hasInitialMouseDown = false;
    windowEl.forEach(function (element) {
        element.addEventListener('mousedown', function (event) {
            if (!hasInitialMouseDown) {
                console.log("clicked window");
                initialX = event.clientX - xOffset;
                initialY = event.clientY - yOffset;
                if (event.target === element) {
                    isDragging = true;
                }
                hasInitialMouseDown = true;
            }
        });
        element.addEventListener('mouseup', function () {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            hasInitialMouseDown = false;
        });
        element.addEventListener('mousemove', function (event) {
            if (isDragging) {
                event.preventDefault();
                currentX = event.clientX - initialX;
                currentY = event.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, element.parentElement);
            }
        });
    });
    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(".concat(xPos, "px, ").concat(yPos, "px, 0)");
    }
});
var canvas = /** @class */ (function () {
    function SketchCanvas(width, height) {
        this.width = width;
        this.height = height;
    }
    return SketchCanvas;
}());
//# sourceMappingURL=main.js.map