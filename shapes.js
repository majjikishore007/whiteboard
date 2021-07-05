var canvas, context, canvaso, contexto;
// The active tool instance.
var tool;
var tool_default = "pencil";
var ebg = "white";
let start_background_color = "white";
let draw_color = "black";
let draw_width = "1";
let is_drawing = false;
let restore_array = [];
let index = -1;
var canvasBg = document.getElementById('canvasBg')
var contextBg = canvasBg.getContext('2d');
 
function init() {
  // Find the canvas element.
  canvaso = document.getElementById("imageView");
  if (!canvaso) {
    alert("Error: I cannot find the canvas element!");
    return;
  }

  if (!canvaso.getContext) {
    alert("Error: no canvas.getContext!");
    return;
  }

  // Get the 2D canvas context.
  contexto = canvaso.getContext("2d");
  if (!contexto) {
    alert("Error: failed to getContext!");
    return;
  }
  // Add the temporary canvas.
  var container = canvaso.parentNode;
  canvas = document.createElement("canvas");
  if (!canvas) {
    alert("Error: I cannot create a new canvas element!");
    return;
  }
  // console.log(ww);
  var ww = window.innerWidth;
  var wh = window.innerHeight;
    console.log(ww);
    console.log(wh);
  canvaso.width = 1200;
  canvaso.height =700;
  canvasBg.width =  1200;
  canvasBg.height = 700;
  canvas.id = "imageTemp";
  canvas.width = canvaso.width;
  canvas.height = canvaso.height;
  container.appendChild(canvas);

  context = canvas.getContext("2d");

  // Get the tool select input.
  var opts = document.querySelector(".opts");
  console.log(opts);
  opts.addEventListener("click", ev_tool_change,false)

var eraser = document.querySelector('.erase');
console.log(eraser);
eraser.addEventListener("click", ev_tool_change, false);






  var tool_select = document.getElementById("dtool");
  if (!tool_select) {
    alert("Error: failed to get the dtool element!");
    return;
  }
  tool_select.addEventListener("change", ev_tool_change, false);

  // Activate the default tool.
  if (tools[tool_default]) {
    tool = new tools[tool_default]();
    tool_select.value = tool_default;
  }

  // Attach the mousedown, mousemove and mouseup event listeners.
  canvas.addEventListener("mousedown", ev_canvas, false);
  canvas.addEventListener("mousemove", ev_canvas, false);
  canvas.addEventListener("mouseup", ev_canvas, false);
  //  canvas.addEventListener("touchend", stop, false);
  canvas.addEventListener("mouseup", stop, false);
  canvas.addEventListener("mouseout", stop, false);
}
//clear_canvas()
function stop(e) {
    if (is_drawing) {
      contexto.stroke();
      contexto.closePath();
      is_drawing = false;
    }
    e.preventDefault();

    if (e.type != "mouseout") {
      restore_array.push(contexto.getImageData(0, 0, canvas.width, canvas.height));
      index += 1;
    }
  }
function clear_canvas() {
  // contexto.fillStyle = start_background_color;
  contextBg.clearRect(0, 0, canvas.width, canvas.height);
  contexto.clearRect(0, 0, canvas.width, canvas.height);
  // contextBg.fillRect(0, 0, canvas.width, canvas.height);
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
    contexto.putImageData(restore_array[index], 0, 0);
  }
}

function redo_last() {
  if (index < 0 || index != restore_array.length - 1) index++;
 context.putImageData(restore_array[index], 0, 0);
}
function change_bgcolor(element) {
  // console.log(element.value);
  // var eraser = document.querySelector('.erase');
  
    ebg = element.value;
    contextBg.fillStyle = element.value;
    contextBg.clearRect(0, 0, canvas.width, canvas.height);
  contextBg.fillRect(0, 0, canvas.width, canvas.height);
}

function save_canvas() {
   contextBg.drawImage(canvaso, 0, 0);
  // contextBg.clearRect(0, 0, canvaso.width, canvaso.height);
  console.log("SAVE :");
    let snap = domtoimage.toBlob(document.getElementById('canvasBg'));
    // console.log(b);
    snap.then(function (blob) {
        window.saveAs(blob, 'whiteboard.png');
    })
}

function change_color(element) {
  draw_color = element.style.color;
}

// The general-purpose event handler. This function just determines the mouse
// position relative to the canvas element.
function ev_canvas(ev) {
  if (ev.layerX || ev.layerX == 0) {
    // Firefox
    ev._x = ev.layerX;
    ev._y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    // Opera
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;
  }

  // Call the event handler of the tool.
  var func = tool[ev.type];
  if (func) {
    func(ev);
  }
}

// The event handler for any changes made to the tool selector.
function ev_tool_change(ev) {
  console.log(ev.target.parentNode.id);
  if (tools[ev.target.parentNode.id]) {
    tool = new tools[ev.target.parentNode.id]();
  }
}

// This function draws the #imageTemp canvas on top of #imageView, after which
// #imageTemp is cleared. This function is called each time when the user
// completes a drawing operation.
function img_update() {
  contexto.drawImage(canvas, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// This object holds the implementation of each drawing tool.
var tools = {};

tools.erase = function () {
  var tool = this;
  this.started = false;

  // This is called when you start holding down the mouse button.
  // This starts the pencil drawing.
  this.mousedown = function (ev) {
    context.beginPath();
    context.moveTo(ev._x, ev._y);
    tool.started = true;
  };

  // This function is called every time you move the mouse. Obviously, it only
  // draws if the tool.started state is set to true (when you are holding down
  // the mouse button).
  this.mousemove = function (ev) {
    if (tool.started) {
      context.lineTo(ev._x, ev._y);
      context.strokeStyle = ebg;
      context.lineWidth = draw_width;
      context.lineCap = "round";
      context.lineJoin = "round";
       contextBg.lineCap = "round";
      contextBg.lineJoin = "round";
      context.stroke();
    }
  };

  // This is called when you release the mouse button.
  this.mouseup = function (ev) {
    if (tool.started) {
      tool.mousemove(ev);
      tool.started = false;
      img_update();
    }
  };
};




// The drawing pencil.
tools.pencil = function () {
  var tool = this;
  this.started = false;

  // This is called when you start holding down the mouse button.
  // This starts the pencil drawing.
  this.mousedown = function (ev) {
    context.beginPath();
    context.moveTo(ev._x, ev._y);
    tool.started = true;
  };

  // This function is called every time you move the mouse. Obviously, it only
  // draws if the tool.started state is set to true (when you are holding down
  // the mouse button).
  this.mousemove = function (ev) {
    if (tool.started) {
      context.lineTo(ev._x, ev._y);
      context.strokeStyle = draw_color;
      context.lineWidth = draw_width;
      context.lineCap = "round";
      context.lineJoin = "round";
       contextBg.lineCap = "round";
      contextBg.lineJoin = "round";
      context.stroke();
    }
  };

  // This is called when you release the mouse button.
  this.mouseup = function (ev) {
    if (tool.started) {
      tool.mousemove(ev);
      tool.started = false;
      img_update();
    }
  };
};

// The rectangle tool.
tools.rect = function () {
  var tool = this;
  this.started = false;

  this.mousedown = function (ev) {
    tool.started = true;
    tool.x0 = ev._x;
    tool.y0 = ev._y;
  };

  this.mousemove = function (ev) {
    if (!tool.started) {
      return;
    }

    var x = Math.min(ev._x, tool.x0),
      y = Math.min(ev._y, tool.y0),
      w = Math.abs(ev._x - tool.x0),
      h = Math.abs(ev._y - tool.y0);
     context.strokeStyle = draw_color;
      context.lineWidth = draw_width;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!w || !h) {
      return;
    }

    context.strokeRect(x, y, w, h);
  };

  this.mouseup = function (ev) {
    if (tool.started) {
      tool.mousemove(ev);
      tool.started = false;
      img_update();
    }
  };
};

// The line tool.
tools.line = function () {
  var tool = this;
  this.started = false;

  this.mousedown = function (ev) {
    tool.started = true;
    tool.x0 = ev._x;
    tool.y0 = ev._y;
  };

  this.mousemove = function (ev) {
    if (!tool.started) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.lineJoin = "round";
     contextBg.lineCap = "round";
      contextBg.lineJoin = "round";
    context.beginPath();
    context.moveTo(tool.x0, tool.y0);
    context.lineTo(ev._x, ev._y);
    context.stroke();
    context.closePath();
  };

  this.mouseup = function (ev) {
    if (tool.started) {
      tool.mousemove(ev);
      tool.started = false;
      img_update();
    }
  };
};

init();
