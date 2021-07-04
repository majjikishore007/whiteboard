const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 60;
canvas.height = 500;

let ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height); 

let start_background_color = "white";
let draw_color = "black";
let draw_width = "2";
let is_drawing = false;

let restore_array = [];
let index = -1;

function change_color(element){
    draw_color = element.style.background;
}

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);


function start(e){
    is_drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    e.preventDefault();
}

function draw(e){
    if(is_drawing){
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.strokeStyle = draw_color;
        ctx.lineWidth = draw_width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    e.preventDefault();
}

function stop(e){
    if(is_drawing){
        ctx.stroke();
        ctx.closePath();
        is_drawing = false;
    }
    e.preventDefault();
    
    if(e.type != "mouseout"){
        restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }

}

function clear_canvas(){
    ctx.fillStyle = start_background_color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    restore_array = [];
    index = -1;
}

function undo_last(){
    if(index <= 0){
        clear_canvas();
    }else{
        index -= 1;
        restore_array.pop();
        ctx.putImageData(restore_array[index], 0, 0)
    }
}








