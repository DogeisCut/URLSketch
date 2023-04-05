document.addEventListener('DOMContentLoaded', () => {
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
});

const canvas = 

class SketchCanvas {
    width: number;
    height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
