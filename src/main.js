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

let mousePos = {x:0,y:0}
canvas.addEventListener('mousemove', (event) => {
     mousePos = {
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top
    };
});



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
        this.history = [
            {
                newImage: {
                    timeStamp:0,
                    size: [800,600]
                },
                brush: {
                    timeStamp:0,
                    layer:0,
                    coords: [
                        [0.0,0.0],[3.0,0.0],[4.0,8.0]
                    ],
                    color: "#000000FF",
                    size: 5
                },
                erase: {
                    timeStamp:0,
                    layer:0,
                    coords: [
                        [0.0,0.0],[3.0,0.0],[4.0,8.0]
                    ],
                    size: 5
                },
                paintBucket: {
                    timeStamp:0,
                    layer:0,
                    coord: [0,0],
                    color: "#000000FF",
                    tolerance: 50
                },
                selection: {
                    timeStamp:0,
                    layer:0,
                    bounds: [[0,0],[100,100]],
                    type: "ovveride"
                },
                moveSelection: {
                    timeStamp:0,
                    to: [200,200]
                }
            }
        ]

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
            //this.saveCanvasState()
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
        const zoomFactor = (-event.deltaY/1000)*this.zoom.x;
        const mousePos = {
            x: event.clientX - canvas.getBoundingClientRect().left,
            y: event.clientY - canvas.getBoundingClientRect().top
        };
        const mousePosSketchCanvas = {
            x: (mousePos.x-this.translation.x) / this.zoom.x,
            y: (mousePos.y-this.translation.y) / this.zoom.y
        };
        const newZoomX = Math.max(0.01, Math.min(this.zoom.x + zoomFactor, 1000));
        const newZoomY = Math.max(0.01, Math.min(this.zoom.y + zoomFactor, 1000));
        const zoomDiffX = newZoomX - this.zoom.x;
        const zoomDiffY = newZoomY - this.zoom.y;
        this.zoom.x = newZoomX;
        this.zoom.y = newZoomY;
        if (zoomDiffX !== 0 && zoomDiffY !== 0) {
            this.translation.x -= mousePosSketchCanvas.x * zoomDiffX;
            this.translation.y -= mousePosSketchCanvas.y * zoomDiffY;
        }

        //this.saveCanvasState()
    }

    saveCanvasState() {
        const compressedStr = btoa(JSON.stringify({ zoom: this.zoom, translation: this.translation }));
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${encodeURIComponent(compressedStr)}`;
        history.pushState(null, null, newUrl);
    }

    loadCanvasState() {
        const compressedStr = window.location.search.slice(1);
        if (compressedStr) {
          try {
            const decodedStr = decodeURIComponent(compressedStr);
            const { zoom, translation } = JSON.parse(atob(decodedStr));
            this.zoom = zoom;
            this.translation = translation;
          } catch (error) {
            console.error("Error loading canvas state from URL:", error);
          }
        }
      }
      

    initHiddenCanvas() {
        this.canvas.style.imageRendering = 'pixelated'
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.strokeStyle = "black"
        this.ctx.lineWidth = 50;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.canvas.width,this.canvas.height);
        this.ctx.stroke();

        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width, 0);
        this.ctx.lineTo(0,this.canvas.height);
        this.ctx.stroke();

        this.ctx.globalCompositeOperation = "source-over";

        //this.loadCanvasState();
    }
      

    drawCanvasWithBorders() {
        ctx.imageSmoothingEnabled = false;

        //Borders 
        ctx.fillStyle = '#303030';
        ctx.strokeStyle = "#00000000"
        ctx.lineCap = "butt";
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

let mousePosSketchCanvas = {
    x: (mousePos.x-currentSketchCanvas.translation.x) / currentSketchCanvas.zoom.x,
    y: (mousePos.y-currentSketchCanvas.translation.y) / currentSketchCanvas.zoom.y
};

let leftmousedown = false

canvas.addEventListener('mousedown', (event) => {
    if ("buttons" in event) {
        if (event.buttons == 1) {
            leftmousedown = true;
            brush();
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (leftmousedown) {
        brush();
    }
});

canvas.addEventListener('mouseup', () => {
    leftmousedown = false
});

function brush() {
    const brushSize = 16
    const hardness = 50

    currentSketchCanvas.ctx.lineCap = "round";
    currentSketchCanvas.ctx.strokeStyle = '#ff0000';
    currentSketchCanvas.ctx.lineWidth = brushSize;
    currentSketchCanvas.ctx.beginPath()
    currentSketchCanvas.ctx.moveTo(mousePosSketchCanvas.x, mousePosSketchCanvas.y)
    mousePosSketchCanvas = {
        x: (mousePos.x-currentSketchCanvas.translation.x) / currentSketchCanvas.zoom.x,
        y: (mousePos.y-currentSketchCanvas.translation.y) / currentSketchCanvas.zoom.y
    };
    currentSketchCanvas.ctx.lineTo(mousePosSketchCanvas.x, mousePosSketchCanvas.y)
    currentSketchCanvas.ctx.stroke();
}

function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    currentSketchCanvas.drawCanvasWithBorders();

    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 8*currentSketchCanvas.zoom.x, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 8*currentSketchCanvas.zoom.x, 0, 2 * Math.PI);
    ctx.stroke();
}
currentSketchCanvas.initHiddenCanvas();
draw();