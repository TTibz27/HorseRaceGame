/**
 * Created by tomdt on 6/23/2017.
 */




const spriteWidth = 20;
const spriteHeight = 20;

const yMoveLimit = 400;

let framecount = 0;

const horse_image_array = [
    "./resources/horse_images/final/stonewall_000.png",
    "./resources/horse_images/final/DEMON_HORZE_666.png",
    "./resources/horse_images/final/CrotchRocket_93_raw.png",
    "./resources/horse_images/final/BlackJack_10.png"
];


const GAME_CANVAS = document.getElementById("gamecanvas");
const BG_CANVAS = document.getElementById("bgcanvas");

const BG_CTX = BG_CANVAS.getContext("2d");
const CTX = GAME_CANVAS.getContext("2d");

// Size parameters, they will be adjusted to fit the size of the screen
let WIDTH = GAME_CANVAS.width;
let HEIGHT = GAME_CANVAS.height;


let horseWidth = WIDTH / 8;
let horseHeight = WIDTH / 8;





// state tracking
const gameState = "running";  // this should probably be an enum later

const horses = [];


//Start game loop
window.onload = ( ) => {
     //  initBackground();


    initHorses();

    setInterval(gameLoop, 20); //  a touch <60 FPS

};

function gameLoop(){
    screenSizeAdjust();

    //
    switch(gameState){
        case "running":
            runRace(CTX,BG_CTX);
            break;
        default:
            break;
    }
}

function runRace(ctx,bg_ctx){
    framecount ++;

    //handle race background
    drawRaceBackground(bg_ctx, WIDTH, HEIGHT, horseHeight);


    const x = WIDTH / 2;
    const y = HEIGHT / 2;

    const lane_1_height = HEIGHT - (horseHeight * 1.25);
    const horse_1_sway = Math.sin(framecount) * 10;
    const horse_1_X_sway = Math.cos(framecount/3) * 10;

    const lane_2_height = HEIGHT - (horseHeight * 1.75);
    const horse_2_sway = Math.cos(framecount) * 10;
    const horse_2_X_sway = Math.sin(framecount/3) * 10;

    const lane_3_height = HEIGHT - (horseHeight * 2.25);
    const horse_3_sway = Math.sin(framecount/2) * 10;
    const horse_3_X_sway = Math.cos(framecount/4) * 10;

    const lane_4_height = HEIGHT - (horseHeight * 2.75);
    const horse_4_sway = Math.cos(framecount/2) * 10;
    const horse_4_X_sway = Math.sin(framecount/4) * 10;

    if (horses.length > 3){
     //   console.log("Horse 0 at x: "+ x + "  y: "+ y);
        ctx.drawImage(horses[3].image, horse_4_X_sway , (lane_4_height + horse_4_sway) , horseWidth, horseHeight);
        ctx.drawImage(horses[2].image, horse_3_X_sway , (lane_3_height + horse_3_sway) , horseWidth, horseHeight);
        ctx.drawImage(horses[1].image, horse_2_X_sway , (lane_2_height + horse_2_sway) , horseWidth, horseHeight);
        ctx.drawImage(horses[0].image, horse_1_X_sway , (lane_1_height + horse_1_sway) , horseWidth, horseHeight);
    }
}


function initHorses() {
    console.log("initHorses");
    for (let i =0; i < 4; i ++ ){
        const horse_image = new Image();
        horse_image.src = horse_image_array[i]; // todo - change to grab random horse image
        horse_image.onload = function() {
            const horse = {
                image: horse_image
                // todo - Draw the rest of the fucking owl
            }
            horses.push(horse);
            console.log("horseImagePushed");
            console.log(horses[0]);
        }
    }

}


function screenSizeAdjust(){
    HEIGHT = GAME_CANVAS.height = BG_CANVAS.height = window.innerHeight;
    WIDTH = GAME_CANVAS.width = BG_CANVAS.width = window.innerWidth;

    horseWidth = horseHeight = WIDTH / 8;
}



function drawPlayer(ctx){
    let xStart = xPosition;
    let yStart = yPosition + spriteHeight;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(xStart,yStart); // bottom left corner
    ctx.lineTo(xStart + (spriteWidth/2), yPosition);
    ctx.lineTo(xStart + spriteWidth, yStart);
    ctx.lineTo(xStart +(spriteWidth/2), yPosition +(spriteHeight/2));
    ctx.lineTo(xStart,yStart);
    ctx.fill();

}

