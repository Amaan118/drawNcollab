window.addEventListener("load", () => {
    let socket = io();

    socket.on("connect", () => {
        console.log("connect");
    });

    socket.on("disconnect", () => {
        console.log('disconnected');
    });

    socket.on("show-data", (data) => {
        var displayImage = new Image();

        displayImage.onload = function () {
            ctx.drawImage(displayImage, 0, 0);
        }
        displayImage.src = data;
    });

    socket.on("clear-all-boards", () => {
        ctx.reset();
    })

    let canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight * 0.7;

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth * 0.7;
        canvas.height = window.innerHeight * 0.7;
    });

    let ctx = canvas.getContext("2d");
    let drawing = false;

    function startPosition() {
        drawing = true;
    }

    function stopPosition() {
        drawing = false;
        ctx.beginPath();
    }

    let root = this;
    function draw(event) {
        if (drawing) {
            let x = event.offsetX;
            let y = event.offsetY;

            var pen = document.getElementsByClassName("pen-color");
            var color = pen[pen.length - 1].style.color;
            ctx.lineCap = "round";
            ctx.strokeStyle = color;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);

            if (root.timeout != undefined) {
                clearTimeout(root.timeout);
            }
            root.timeout = setTimeout(() => {
                var base64 = canvas.toDataURL("image/png");
                socket.emit("broadcast-data", base64);
            }, 500);
        }
    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("touchstart", startPosition);
    canvas.addEventListener("mouseup", stopPosition);
    canvas.addEventListener("touchend", stopPosition);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchmove", draw);


    let clear = document.getElementById("clear");
    clear.addEventListener("click", () => {
        socket.emit("clear-all");
    });

    const image = document.getElementsByName("image-input")[0];
    const addSketch = document.getElementsByClassName("add-sketch")[0];
    addSketch.addEventListener("click", () => {
        image.value = canvas.toDataURL("image/png");
    });
});
