//global setup
const NDOTS = 16;
const DOTRADIUS = 5;
const MAXSPEED = .5;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let Dots = [];

function initializeScreen() {
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 10;
    Dots = [];
    //setup canvas style
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 5;
    ctx.save();
    initializeDots();
    renderDots();
    renderEdges();

};
function initializeDots() {
    for (let i = 0; i < NDOTS; i++) {
        let Dot = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * MAXSPEED + 0.1,
            directionX: Math.random() < 0.5 ? -1 : 1,
            directionY: Math.random() < 0.5 ? -1 : 1
        }
        Dots.push(Dot);
    }
}

function setDirection(directionX, directionY, dot) {
    //Set 2D moving direction for a dot
    dot.directionX = directionX;
    dot.directionY = directionY;
}

function renderDots() {
    Dots.forEach((dot, i) => {
        for (let j = 0; j < i; j++) {
            checkCollision(dot, Dots[j])
        }
        moveDot(dot, i)
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOTRADIUS, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.fill();
    });
}

function renderEdges() {
    ctx.shadowColor = 'rgba(0,0,0,0)'
    for (let i = 0; i < Dots.length; i++) {
        //looping through dots and draw an edge to each other dot in the array
        let currentDot = Dots[i];
        Dots.forEach((nextDot, j) => {
            // if nextDot === currentDot return, because we do not want to draw a recursive edge
            if (i === j) {
                return
            }
            let alpha = -0.00062 * Math.pow((getDistance(currentDot, nextDot)), 2) + 100;
            // console.log("Distance:" , getDistance(currentDot, nextDot))
            // console.log("Alpha:", alpha / 100)
            if (alpha > 0) {
                ctx.globalAlpha = alpha / 100;
            } else {
                ctx.globalAlpha = 0;
            }

            // console.log(ctx.globalAlpha)
            ctx.beginPath();
            ctx.moveTo(currentDot.x, currentDot.y);
            ctx.lineTo(nextDot.x, nextDot.y);
            ctx.stroke();


        })

    }
    ctx.globalAlpha = 1;
    ctx.shadowColor = "white";
}
function render() {
    //clear the previous "screen" for repainting
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //repaint dots
    renderDots();
    //repaint edges
    renderEdges();
}

function checkCollision(origin, target) {
    //check collision of origin with target
    let distance = getDistance(origin, target);
    // console.log("Distance Dot0 to Dot 1:" , distance)
    if (distance <= (2 * DOTRADIUS) + 1) {
        let originX = origin.directionX;
        let originY = origin.directionY;        
        let targetX = target.directionX;
        let targetY = target.directionY;
    // TODO better collision behavior
        console.log("collision detected")
        setDirection(targetX, targetY, origin);
        setDirection(originX, originY, target);
      






        // origin.x += origin.directionX * origin.speed;
        // origin.y += origin.directionY * origin.speed;
        // target.x += target.directionX * target.speed;
        // target.y += target.directionY * target.speed;


    }
}

function getDistance(origin, target) {
    let distance = Math.sqrt(Math.pow((target.x - origin.x), 2) + Math.pow((target.y - origin.y), 2))
    //  ctx.beginPath();
    //  ctx.arc(origin.x, origin.y, distance, 0, Math.PI * 2, true)
    //  ctx.stroke();
    return distance
}

function moveDot(dot, i) {

    if (dot.x + 5 >= canvas.width) {
        setDirection(-1, dot.directionY, dot);
    } else if (dot.x - 5 <= 0) {
        setDirection(1, dot.directionY, dot);
    }

    if (dot.y + 5 >= canvas.height) {
        setDirection(dot.directionX, -1, dot);
    } else if (dot.y - 5 <= 0) {
        setDirection(dot.directionX, 1, dot);
    }
    dot.x += dot.directionX * dot.speed;
    dot.y += dot.directionY * dot.speed;

}

const listener = window.addEventListener('load', initializeScreen);
window.addEventListener('resize', initializeScreen)
setInterval(render, 33)
// canvas.addEventListener("mousemove", (e) => console.log(e) )
