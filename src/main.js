const canvas = document.getElementById("paint-canvas");
const ctx = canvas.getContext("2d");

const fakeWindows = document.querySelectorAll('.window-header');

fakeWindows.forEach(element => {

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let hasInitialMouseDown = false;

    element.addEventListener('mousedown', (event) => {
        if (!hasInitialMouseDown) {
            initialX = event.clientX - xOffset;
            initialY = event.clientY - yOffset;

            if (event.target === element) {
                isDragging = true;
            }

            hasInitialMouseDown = true;
        }
    });

    element.parentElement.addEventListener('mousedown', (event) => {
        const mainParent = document.querySelector('.window-layer');
        mainParent.appendChild(element.parentElement);
    });

    document.addEventListener('mouseup', () => {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
        hasInitialMouseDown = false;
    });

    document.addEventListener('mousemove', (event) => {
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
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

class SketchCanvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.translation = {
            x: (canvas.width / 2) - this.width / 2,
            y: (canvas.height / 2) - this.height / 2
        };
        this.isPanning = false;
        this.lastPanPosition = {
            x: 0,
            y: 0
        };

        // add event listeners for panning
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        canvas.addEventListener("mouseleave", this.handleMouseUp.bind(this));
    }

    handleMouseDown(event) {
        if (event.button === 1) {
            // middle mouse button pressed
            this.isPanning = true;
            this.lastPanPosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    }

    handleMouseMove(event) {
        if (this.isPanning) {
            // pan the canvas
            const dx = event.clientX - this.lastPanPosition.x;
            const dy = event.clientY - this.lastPanPosition.y;
            this.translation.x += dx;
            this.translation.y += dy;
            this.lastPanPosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    }

    handleMouseUp(event) {
        if (event.button === 1) {
            // middle mouse button released
            this.isPanning = false;
        }
    }
}

var currentSketchCanvas = new SketchCanvas(800, 600);

function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Borders 
    ctx.fillStyle = '#303030';
    ctx.strokeStyle = "#00000000"
    ctx.lineWidth = 0;
    //Left
    ctx.beginPath();
    ctx.moveTo(0 + currentSketchCanvas.translation.x, 0);
    ctx.lineTo(0 + currentSketchCanvas.translation.x, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, 0);
    ctx.fill();
    //Right
    ctx.beginPath();
    ctx.moveTo(currentSketchCanvas.width + currentSketchCanvas.translation.x, 0);
    ctx.lineTo(currentSketchCanvas.width + currentSketchCanvas.translation.x, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, 0);
    ctx.fill();
    //Bottom
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, currentSketchCanvas.height + currentSketchCanvas.translation.y);
    ctx.lineTo(canvas.width, currentSketchCanvas.height + currentSketchCanvas.translation.y);
    ctx.fill();
    //Top
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, 0 + currentSketchCanvas.translation.y);
    ctx.lineTo(0, 0 + currentSketchCanvas.translation.y);
    ctx.fill();

    //Canvas Border
    ctx.strokeStyle = "#636363"
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(currentSketchCanvas.translation.x, currentSketchCanvas.translation.y, currentSketchCanvas.width, currentSketchCanvas.height);
    ctx.stroke()


}
draw();