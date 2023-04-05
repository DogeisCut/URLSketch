const canvas = <HTMLCanvasElement> document.getElementById("paint-canvas");
const ctx = canvas.getContext("2d");

const windowEl = document.querySelectorAll('.window-header') as NodeListOf<HTMLElement>;

  let isDragging = false;
  let currentX: number;
  let currentY: number;
  let initialX: number;
  let initialY: number;
  let xOffset = 0;
  let yOffset = 0;
  let hasInitialMouseDown = false;

    windowEl.forEach(element => {
        element.addEventListener('mousedown', (event: MouseEvent) => {
            if (!hasInitialMouseDown) {
                console.log("clicked window")
                initialX = event.clientX - xOffset;
                initialY = event.clientY - yOffset;
    
                if (event.target === element) {
                    isDragging = true;
                }
    
                hasInitialMouseDown = true;
            }
        });
    
        element.addEventListener('mouseup', () => {
            initialX = currentX;
            initialY = currentY;
    
            isDragging = false;
            hasInitialMouseDown = false;
        });
    
        element.addEventListener('mousemove', (event: MouseEvent) => {
            if (isDragging) {
                event.preventDefault();
    
                currentX = event.clientX - initialX;
                currentY = event.clientY - initialY;
    
                xOffset = currentX;
                yOffset = currentY;
    
                setTranslate(currentX, currentY, element.parentElement as HTMLElement);
            }
        });
    });
    

function setTranslate(xPos: number, yPos: number, el: HTMLElement) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

class SketchCanvas {
    width: number;
    height: number;
    translation: { x: number, y: number };
    isPanning: boolean;
    lastPanPosition: { x: number, y: number };
  
    constructor(width: number, height: number) {
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
  
    handleMouseDown(event: MouseEvent) {
      if (event.button === 1) {
        // middle mouse button pressed
        this.isPanning = true;
        this.lastPanPosition = { x: event.clientX, y: event.clientY };
      }
    }
  
    handleMouseMove(event: MouseEvent) {
      if (this.isPanning) {
        // pan the canvas
        const dx = event.clientX - this.lastPanPosition.x;
        const dy = event.clientY - this.lastPanPosition.y;
        this.translation.x += dx;
        this.translation.y += dy;
        this.lastPanPosition = { x: event.clientX, y: event.clientY };
      }
    }
  
    handleMouseUp(event: MouseEvent) {
      if (event.button === 1) {
        // middle mouse button released
        this.isPanning = false;
      }
    }
  }

var currentCanvas: SketchCanvas = new SketchCanvas(800,600)

function mainLoop() {
    requestAnimationFrame(mainLoop);
    if (ctx?.fillStyle !== undefined) { 
      ctx.fillStyle = 'black';
    }
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
    ctx?.fillRect(-1000+currentCanvas.translation.x,0+ currentCanvas.translation.y,1000+currentCanvas.width,1000)
    ctx?.fillRect(1000+currentCanvas.translation.x,0+ currentCanvas.translation.y,1000+currentCanvas.width,1000)
    if (ctx?.fillStyle !== undefined) { 
      ctx.fillStyle = 'blue';
    }
    ctx?.fillRect(-currentCanvas.width/2 + currentCanvas.translation.x, -currentCanvas.height/2 + currentCanvas.translation.y,currentCanvas.width,currentCanvas.height);

}
mainLoop()