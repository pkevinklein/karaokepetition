(function() {
    let canvasInputBox = document.getElementById("canvasinputbox");
    let signature = document.getElementById("signature");
    let mouseY;
    let mouseX;
    let draw = false;
    let c = canvasInputBox.getContext("2d");
    c.strokeStyle = "black";
    // console.log("hiiiiiiiiiii");
    // var cBig = canvasbox.getContext("2d");

    canvasInputBox.addEventListener("mousedown", function(){
        draw = true;

    });

    canvasInputBox.addEventListener("mousemove", function(e){
        if (draw) {
            c.moveTo(mouseX, mouseY);
            c.lineTo(e.clientX - canvasInputBox.offsetLeft, e.clientY - canvasInputBox.offsetTop);
            c.stroke();
        }
        mouseX = e.clientX - canvasInputBox.offsetLeft;
        mouseY = e.clientY - canvasInputBox.offsetTop;
    });

    canvasInputBox.addEventListener("mouseup", function(){
        // mouseX = e.clientX - canvasInputBox.offsetLeft(e);
        // mouseY = e.clientY - canvasInputBox.offsetTop(e);
        draw = false;
        signature.value = canvasInputBox.toDataURL();
        console.log(signature.value);
    });

})();
