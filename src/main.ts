document.addEventListener('DOMContentLoaded', () => {
  const windowEl = document.querySelector('.window-header') as HTMLElement;

  let isDragging = false;
  let currentX: number;
  let currentY: number;
  let initialX: number;
  let initialY: number;
  let xOffset = 0;
  let yOffset = 0;
  let hasInitialMouseDown = false;

  windowEl.addEventListener('mousedown', (event: MouseEvent) => {
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

  windowEl.addEventListener('mousemove', (event: MouseEvent) => {
      if (isDragging) {
          event.preventDefault();

          currentX = event.clientX - initialX;
          currentY = event.clientY - initialY;

          xOffset = currentX;
          yOffset = currentY;

          setTranslate(currentX, currentY, windowEl.parentElement as HTMLElement);
      }
  });

  function setTranslate(xPos: number, yPos: number, el: HTMLElement) {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
});


class SketchCanvas {
    width: number;
    height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
