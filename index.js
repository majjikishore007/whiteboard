const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 2;
let ctx = canvas.getContext("2d");
ctx.fillRect(0, 0, canvas.width, canvas.height);

let start_background_color = "black";
let draw_color = "white";
let draw_width = "2";
let is_drawing = false;

let restore_array = [];
let index = -1;

function change_color(element) {
  draw_color = element.style.background;
}

function pencil() {
  canvas.addEventListener("touchstart", start, false);
  canvas.addEventListener("touchmove", draw, false);
  canvas.addEventListener("mousedown", start, false);
  canvas.addEventListener("mousemove", draw, false);

  canvas.addEventListener("touchend", stop, false);
  canvas.addEventListener("mouseup", stop, false);
  canvas.addEventListener("mouseout", stop, false);

  function start(e) {
    is_drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    e.preventDefault();
  }

  function draw(e) {
    if (is_drawing) {
      ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.strokeStyle = draw_color;
      ctx.lineWidth = draw_width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    e.preventDefault();
  }

  function stop(e) {
    if (is_drawing) {
      ctx.stroke();
      ctx.closePath();
      is_drawing = false;
    }
    e.preventDefault();

    if (e.type != "mouseout") {
      restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      index += 1;
    }
  }
}

function clear_canvas() {
  ctx.fillStyle = start_background_color;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  restore_array = [];
  index = -1;
}
function undo_last() {
  if (index <= 0) {
    let temp = restore_array;
    restore_array = temp;
    clear_canvas();
  } else {
    index -= 1;
    ctx.putImageData(restore_array[index], 0, 0);
  }
}

function redo_last() {
  if (index < 0 || index != restore_array.length - 1) index++;
  ctx.putImageData(restore_array[index], 0, 0);
}

// function undo_last(){
//     if(index <= 0){
//         clear_canvas();
//     }else{
//         index -= 1;
//         restore_array.pop();
//         ctx.putImageData(restore_array[index], 0, 0)
//     }
// }
function line() {
  var sketch = document.querySelector(".field");
  // Creating a tmp canvas
  console.log(sketch);
  var tmp_canvas = document.createElement("canvas");
  var tmp_ctx = tmp_canvas.getContext("2d");
  tmp_canvas.id = "tmp_canvas";
  tmp_canvas.width = canvas.width;
  tmp_canvas.height = canvas.height - 2;
  canvas.addEventListener("mouseup", stop, false);
  canvas.addEventListener("mouseout", stop, false);

  sketch.appendChild(tmp_canvas);

  var mouse = { x: 0, y: 0 };
  var start_mouse = { x: 0, y: 0 };

  /* Mouse Capturing Work */
  tmp_canvas.addEventListener(
    "mousemove",
    function (e) {
      mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
      mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
    },
    false
  );

  /* Drawing on Paint App */
  tmp_ctx.lineWidth = 5;
  tmp_ctx.lineJoin = "round";
  tmp_ctx.lineCap = "round";
  tmp_ctx.strokeStyle = draw_color;
  tmp_ctx.fillStyle = draw_color;

  tmp_canvas.addEventListener(
    "mousedown",
    function (e) {
      tmp_canvas.addEventListener("mousemove", onPaint, false);

      mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
      mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;

      start_mouse.x = mouse.x;
      start_mouse.y = mouse.y;

      onPaint();
    },
    false
  );

  tmp_canvas.addEventListener(
    "mouseup",
    function (e) {
      tmp_canvas.removeEventListener("mousemove", onPaint, false);
      // Writing down to real canvas now
      ctx.drawImage(tmp_canvas, 0, 0);
      // Clearing tmp canvas

      tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
      sketch.removeChild(tmp_canvas);
    },
    false
  );

  var onPaint = function () {
    // Tmp canvas is always cleared up before drawing.
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    tmp_ctx.beginPath();
    tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
    tmp_ctx.lineTo(mouse.x, mouse.y);
    tmp_ctx.stroke();
    tmp_ctx.closePath();
  };
}
function change_bgcolor(element) {
  var eraser = document.querySelector('.erase');
  eraser.style.background = element.value;
    ctx.fillStyle = element.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function save_canvas() {
    let snap = domtoimage.toBlob(document.getElementById('canvas'));
    // console.log(b);
    snap.then(function (blob) {
        window.saveAs(blob, 'whiteboard.png');
    })
}