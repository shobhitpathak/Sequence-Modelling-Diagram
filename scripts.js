const textTopOffset = 20;
let textTopTotalOffset = textTopOffset;

const reloadText = () => {
  const CODETEXT = document.getElementById("CODE");
  let width = 500;
  const lanes = null;
  const drawing = document.getElementById("DRAWING");
  // console.log(CODETEXT.value);
  if (CODETEXT && CODETEXT.value.length !== 0) {
    try {
      const code = JSON.parse(CODETEXT.value);
      const lanes = code.lanes;
      if (!lanes) {
        return;
      }
      clearCanvas(drawing);
      drawRectsCanvas(drawing, drawing.width, lanes.length, lanes);
      const sequence = code.sequence;
      if (!sequence) {
        return;
      }
      for (seq of sequence) {
        addRow(drawing, lanes.length, lanes, seq.from, seq.to, seq.action);
      }
    } catch (e) {
      console.log(e);
      console.log("Please type complete statement");
    }
  }
};
/**
 * Draws a rectangle.
 * @param {SVGElement} svg - The SVG object.
 * @param {float} width - The width of SVG derived explicitly.
 * @param {int} number - The num of rects, pls keep 4 or less
 * @param {string[]} names - The names of rectangles.
 */
const drawRectsSVG = (svg, width, number, names) => {
  const svgns = "http://www.w3.org/2000/svg";
  let offset = 0;
  const individualWidth = width / number;
  for (rectName of names) {
    rect = document.createElementNS(svgns, "rect");
    // console.log(rect);
    rect.setAttributeNS(null, "x", offset);
    rect.setAttributeNS(null, "y", 0);
    rect.setAttributeNS(null, "width", individualWidth + "px");
    rect.setAttributeNS(null, "heigth", "1000px");
    rect.setAttributeNS(null, "fill", "#ddd");
    // rect.setAttributeNS(null, "min-width", individualWidth + "px");
    // rect.setAttributeNS(null, "min-heigth", "1000px");

    svg.appendChild(rect);
    offset += individualWidth;
  }
};

/**
 * @param {Canvas}: canvas - The Canvas Object
 **/
const clearCanvas = (canvas) => {
  if (canvas.getContext) {
    context = canvas.getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }
  textTopTotalOffset = textTopOffset;
};

/**
 * Draws a rectangle.
 * @param {Canvas} canvas - The Canvas object.
 * @param {float} width - The width of SVG derived explicitly.
 * @param {int} number - The num of rects, pls keep 4 or less
 * @param {string[]} names - The names of rectangles.
 **/
const drawRectsCanvas = (canvas, width, number, names) => {
  const colorsArr = ["#B71C1C", "#283593", "#33691E"];
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let offset = 0;
    const individualWidth = width / number;
    count = 0;
    ctx.font = textTopOffset + "px sans-serif";
    for (rectName of names) {
      ctx.fillStyle = colorsArr[count % 3];
      ctx.fillRect(offset, 0, individualWidth, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.fillText(rectName, offset + 4, textTopOffset, individualWidth);
      offset += individualWidth;
      // console.log(offset, 0, individualWidth, canvas.height);
      count += 1;
    }
  }
};

const addRow = (canvas, number, names, from, to, action) => {
  if (textTopTotalOffset == textTopOffset) {
    textTopTotalOffset += textTopOffset;
  }

  const individualWidth = canvas.width / number;

  fromIDX = names.indexOf(from);
  toIDX = names.indexOf(to);

  let xstart = 0;
  let xend = 0;
  let leftArrowNeeded = false;
  let rightArrowNeeded = false;

  if (fromIDX < toIDX) {
    xstart = fromIDX * individualWidth + individualWidth / 2;
    xend = (toIDX - fromIDX) * individualWidth; //- individualWidth / 2;
    rightArrowNeeded = true;
  } else if (fromIDX == toIDX) {
    xstart = fromIDX * individualWidth;
    xend = individualWidth; //- individualWidth / 2;
  } else {
    xstart = toIDX * individualWidth + individualWidth / 2;
    xend = (fromIDX - toIDX) * individualWidth; //- individualWidth / 2;
    leftArrowNeeded = true;
  }
  console.log(action, xstart, xend);
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(xstart, textTopTotalOffset, xend, textTopOffset);
    ctx.fillStyle = "#000000";
    ctx.font = textTopOffset + "px sans-serif";
    ctx.textBaseline = "bottom";
    ctx.fillText(action, xstart + 4, textTopTotalOffset + textTopOffset);
    textTopTotalOffset += textTopOffset * 2;
    if (leftArrowNeeded) {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(xstart + 1, textTopTotalOffset - textTopOffset);
      ctx.lineTo(xstart - 10, textTopTotalOffset - textTopOffset * 1.5);
      ctx.lineTo(xstart + 1, textTopTotalOffset - textTopOffset * 2);
      ctx.fill();
    }
    if (rightArrowNeeded) {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(xstart + xend - 1, textTopTotalOffset - textTopOffset);
      ctx.lineTo(xstart + xend + 10, textTopTotalOffset - textTopOffset * 1.5);
      ctx.lineTo(xstart + xend - 1, textTopTotalOffset - textTopOffset * 2);
      ctx.fill();
      console.log("arrowR", action, xend);
    }
  }
};

// ctx.beginPath();
// ctx.moveTo(75, 50);
// ctx.lineTo(100, 75);
// ctx.lineTo(100, 25);
// ctx.fill();

document.getElementById("CODE").addEventListener("change", reloadText);
document.getElementById("CODE").addEventListener("keyup", reloadText);
document.addEventListener("DOMContentLoaded", reloadText);
