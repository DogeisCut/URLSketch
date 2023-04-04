document.addEventListener('DOMContentLoaded', () => {
    const windowEl = document.querySelector('.window-header');
  
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let hasInitialMouseDown = false;
  
    windowEl.addEventListener('mousedown', (event) => {
      if (!hasInitialMouseDown) {
        console.log("clicked window")
        initialX = event.clientX - xOffset;
        initialY = event.clientY - yOffset;
  
        if (event.target === windowEl) {
          isDragging = true;
        }
  
        hasInitialMouseDown = true;
      }
    });
  
    windowEl.addEventListener('mouseup', () => {
      initialX = currentX;
      initialY = currentY;
  
      isDragging = false;
      hasInitialMouseDown = false;
    });
  
    windowEl.addEventListener('mousemove', (event) => {
      if (isDragging) {
        event.preventDefault();
  
        currentX = event.clientX - initialX;
        currentY = event.clientY - initialY;
  
        xOffset = currentX;
        yOffset = currentY;
  
        setTranslate(currentX, currentY, windowEl.parentElement);
      }
    });
  
    function setTranslate(xPos, yPos, el) {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
  });
  