const canvas = document.getElementById("paint-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight-74;
  }
  
  // Call the resizeCanvas function initially and on window resize
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

const fakeWindows = document.querySelectorAll('.window-header');

fakeWindows.forEach(element => {

    let isDragging = false;
    let currentX = element.parentElement.getAttribute('offset-x');
    let currentY = element.parentElement.getAttribute('offset-y');
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let hasInitialMouseDown = false;

    setTranslate(currentX, currentY, element.parentElement);

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
        this.canvas = document.createElement('canvas'); // create a new canvas element
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.translation = {
            x: (canvas.width / 2) - this.width / 2,
            y: (canvas.height / 2) - this.height / 2
        };
        this.zoom = {
            x: 1,
            y: 1
        }
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
        canvas.addEventListener("wheel", this.handleWheel.bind(this));
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

    handleWheel(event) {
        // zoom the canvas
        event.preventDefault();
        const zoomFactor = -event.deltaY/1000;
        const mousePos = {
            x: event.clientX - canvas.getBoundingClientRect().left,
            y: event.clientY - canvas.getBoundingClientRect().top
        };
        const mousePosSketchCanvas = {
            x: (mousePos.x/this.zoom.x)+this.translation.x,
            y: (mousePos.y/this.zoom.y)+this.translation.y
        };
        this.zoom.x += zoomFactor;
        this.zoom.y += zoomFactor;
        this.zoom.x = Math.max(0.1, Math.min(this.zoom.x, 10)); // limit zoom to 10x and 0.1x
        this.zoom.y = Math.max(0.1, Math.min(this.zoom.y, 10));
        this.translation.x -= this.getClosestPointInCanvas(mousePos,false).x*zoomFactor
        this.translation.y -= this.getClosestPointInCanvas(mousePos,false).y*zoomFactor
    }
    
    getClosestPointInCanvas(point, convertBack = false) {
        // Convert the point to SketchCanvas coordinates
        const canvasX = (point.x - this.translation.x) / this.zoom.x;
        const canvasY = (point.y - this.translation.y) / this.zoom.y;
      
        // Find the closest point inside the SketchCanvas
        const closestX = Math.max(0, Math.min(canvasX, this.width));
        const closestY = Math.max(0, Math.min(canvasY, this.height));
      
        if (convertBack) {
          // Convert the closest point back to screen coordinates
          const screenX = closestX * this.zoom.x + this.translation.x;
          const screenY = closestY * this.zoom.y + this.translation.y;
      
          return { x: screenX, y: screenY };
        } else {
          const screenX = closestX;
          const screenY = closestY;
          return { x: screenX, y: screenY };
        }
      }      

    initHiddenCanvas() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.strokeStyle = "black"
        this.ctx.lineWidth = 50;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.canvas.width,this.canvas.height);
        this.ctx.stroke();
    }
      

    drawCanvasWithBorders() {
        //Borders 
        ctx.fillStyle = '#303030';
        ctx.strokeStyle = "#00000000"
        ctx.lineWidth = 0;
        //Left
        ctx.beginPath();
        ctx.moveTo(0 + this.translation.x, 0);
        ctx.lineTo(0 + this.translation.x, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(0, 0);
        ctx.fill();
        //Right
        ctx.beginPath();
        ctx.moveTo((this.width*this.zoom.x) + this.translation.x, 0);
        ctx.lineTo((this.width*this.zoom.x) + this.translation.x, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width, 0);
        ctx.fill();
        //Bottom
        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(0, (this.height*this.zoom.x) + this.translation.y);
        ctx.lineTo(canvas.width, (this.height*this.zoom.y) + this.translation.y);
        ctx.fill();
        //Top
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(canvas.width, 0 + this.translation.y);
        ctx.lineTo(0, 0 + this.translation.y);
        ctx.fill();


        //Canvas :)
        ctx.drawImage(this.canvas, this.translation.x, this.translation.y, (this.width*this.zoom.x), (this.height*this.zoom.y))


        //Canvas Border
        ctx.strokeStyle = "#636363"
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(this.translation.x, this.translation.y, (this.width*this.zoom.x), (this.height*this.zoom.y));
        ctx.stroke()
    }
}

var currentSketchCanvas = new SketchCanvas(800, 600);

function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    currentSketchCanvas.drawCanvasWithBorders();


}
currentSketchCanvas.initHiddenCanvas();
draw();