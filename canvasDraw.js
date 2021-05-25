function drawPoint(ctx, x, y, text) {
    ctx.save();
    ctx.fillStyle = '#0000FF';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
    ctx.fill();
    if (text != undefined){
        ctx.fillText(text, x + 10, y);
    }
    ctx.restore();
}
function drawLine(ctx, startX, startY, endX, endY){
    ctx.beginPath();
    ctx.moveTo(startX,startY)
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.closePath();
}
function clearCanvas(){
    var graph = document.getElementById('graph-1'),
    canvas = graph.getContext('2d');
    canvas.clearRect(0, 0, graph.width, graph.height);
    canvas.beginPath();
    canvas.moveTo(5, 0);
    canvas.lineTo(5, graph.height - 5);
    canvas.lineTo(graph.width, graph.height-5);
    canvas.stroke();
    canvas.font = 'italic 9pt Arial';
    canvas.fillText('p', 10, 10);
    canvas.fillText('t', graph.width -10, graph.height -10);
    canvas.closePath();
}