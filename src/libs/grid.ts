export const convertArrayToArea = (board: string[]) => {
  let areaStr = board.reduce((prev, cur) => `${prev}\n"${cur}"`, "");
  return areaStr;
};

export const exportCSS = (element: HTMLElement) => {
  const gridContainerStyle = window.getComputedStyle(element);
  const { gap } = gridContainerStyle;
  const rows = element.getAttribute("rows");
  const cols = element.getAttribute("cols");
  const width = element.getAttribute("width");
  const height = element.getAttribute("height");

  const childList = element.querySelectorAll("div");

  let cssTemplate = `
    .grid-container {
      position: relative;
      display: grid;
      gap: ${gap};
      grid-template-rows: repeat(${rows},${height}px);
      grid-template-columns: repeat(${cols},${width}px);
    }
    
  `;

  for (let i = 0; i < childList.length; i++) {
    const child = childList[i];
    const { gridArea } = window.getComputedStyle(child);

    if (gridArea) {
      cssTemplate += `
    .${child.classList[0]} {
      width: auto;
      height: auto;
      grid-area: ${gridArea}
    }
      `;
    }
  }

  return cssTemplate;
};
