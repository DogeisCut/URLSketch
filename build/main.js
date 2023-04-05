"use strict";
var canvas = document.getElementById("paint-canvas");
var ctx = canvas.getContext("2d");
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
var SketchCanvas = /** @class */ (function () {
    function SketchCanvas(width, height) {
        this.width = width;
        this.height = height;
        this.translation = { x: 0, y: 0 };
        this.isPanning = false;
        this.lastPanPosition = { x: 0, y: 0 };
        // add event listeners for panning
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        canvas.addEventListener("mouseleave", this.handleMouseUp.bind(this));
    }
    SketchCanvas.prototype.handleMouseDown = function (event) {
        if (event.button === 1) {
            // middle mouse button pressed
            this.isPanning = true;
            this.lastPanPosition = { x: event.clientX, y: event.clientY };
        }
    };
    SketchCanvas.prototype.handleMouseMove = function (event) {
        if (this.isPanning) {
            // pan the canvas
            var dx = event.clientX - this.lastPanPosition.x;
            var dy = event.clientY - this.lastPanPosition.y;
            this.translation.x += dx;
            this.translation.y += dy;
            this.lastPanPosition = { x: event.clientX, y: event.clientY };
        }
    };
    SketchCanvas.prototype.handleMouseUp = function (event) {
        if (event.button === 1) {
            // middle mouse button released
            this.isPanning = false;
        }
    };
    return SketchCanvas;
}());
var currentCanvas = new SketchCanvas(800, 600);
function mainLoop() {
    requestAnimationFrame(mainLoop);
    if ((ctx === null || ctx === void 0 ? void 0 : ctx.fillStyle) !== undefined) {
        ctx.fillStyle = 'black';
    }
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(-1000 + currentCanvas.translation.x, 0 + currentCanvas.translation.y, 1000 + currentCanvas.width, 1000);
    ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(1000 + currentCanvas.translation.x, 0 + currentCanvas.translation.y, 1000 + currentCanvas.width, 1000);
    if ((ctx === null || ctx === void 0 ? void 0 : ctx.fillStyle) !== undefined) {
        ctx.fillStyle = 'blue';
    }
    ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(-currentCanvas.width / 2 + currentCanvas.translation.x, -currentCanvas.height / 2 + currentCanvas.translation.y, currentCanvas.width, currentCanvas.height);
}
mainLoop();
//# sourceMappingURL=main.js.map