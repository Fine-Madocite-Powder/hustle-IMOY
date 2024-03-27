const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function update() {


    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(update)
}

requestAnimationFrame(update)