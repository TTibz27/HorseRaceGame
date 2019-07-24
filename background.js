
const fencePostGap = 200;
let fenceOffset = fencePostGap;
let finishLinePosition = -1000;
const finishLineSpeed = 7;
let finishLineDrawn = false;

function drawRaceBackground(ctx, width, height, horseSize, cyclesRemaining, isMoving){

    // Create gradient
    const grd = ctx.createRadialGradient( width /2, height/2, 0.000, width/2, height/2, width/2);

    // Add colors
    grd.addColorStop(0.101, 'rgba(255, 255, 255, 1.000)');
    grd.addColorStop(1.000, 'rgba(116, 224, 224, 1.000)');

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    // Draw Track
    ctx.fillStyle = '#CD853F';
    ctx.fillRect(0, height - (2 * horseSize) , width, height);

    // Draw Distance left, or draw finishline
    if (isMoving) {
        if (cyclesRemaining > 0) {
            drawRemainingDistance(ctx, width, horseSize, cyclesRemaining);
        }
        else {
            if (!finishLineDrawn) {
                finishLineDrawn = true;
                finishLinePosition = width;
            }
            drawFinishLine(ctx, horseSize, height);
            finishLinePosition -= finishLineSpeed;
        }
    }

    // Draw grass
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(0, height - (2.4 * horseSize) , width, horseSize/2);

    drawGuides(ctx, width, height, horseSize);
    drawFence(ctx, width, ( height - (2 * horseSize)) , horseSize, isMoving);
}

function drawGuides(ctx, width, height, horseSize){

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(0, height - (horseSize/2));
    ctx.lineTo(width, height - (horseSize/2));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height - (horseSize));
    ctx.lineTo(width, height - (horseSize));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height - (horseSize * 1.5));
    ctx.lineTo(width, height - (horseSize * 1.5));
    ctx.stroke();

}

function drawFence(ctx, width, fenceline, horseSize, isMoving) {

    ctx.fillStyle = '#322e1b';

    const  postHeight = (horseSize /2);
    const postTop = fenceline  - postHeight;

    for (let x = fenceOffset; x < width; x+=fencePostGap) {
        const postStart = x;
        ctx.fillStyle = '#322e1b';
        ctx.fillRect(postStart, postTop , 7, postHeight);
    }

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(0, postTop);
    ctx.lineTo(width, postTop);
    ctx.stroke();

    if(isMoving){
        fenceOffset -=5;
    }
    if (fenceOffset < 0) { fenceOffset = fencePostGap};
}


function drawRemainingDistance(ctx, width, horseSize, cyclesRemaining){
    const remainingString = (cyclesRemaining /10).toFixed(1) + " Yards Remaining";
    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.fillText(remainingString, (width / 2) - 150, (horseSize / 2));
}

function drawCountdown(ctx, width, height, horseSize, seconds, horses){

    console.log("draw countdown");
    console.log(horses);
    drawRaceBackground(ctx,width,height,horseSize, 0, false);

    ctx.fillStyle = "#000000";
    ctx.font = "120px Arial";

    ctx.fillText(seconds, (width / 2) - 50, (horseSize ));

    for (let i = 0; i < horses.length; i++) {
        drawHorseNamesinLane(ctx, horses[i], i, horseSize, height);
    }

}

function drawFinishLine(ctx, horseSize, height){

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(finishLinePosition, height - (2 * horseSize) , 8 , height);

}

function drawHorseNamesinLane(ctx,horse, lane, horseSize, height) {
    ctx.fillStyle = "#000000";
    ctx.font = "40px Arial";

    ctx.fillText(horse.name, horseSize, height - (lane * (horseSize / 2 )) -20);
}

function drawResults(ctx, width, height, horseSize, finalPlaces){
    drawRaceBackground(ctx,width,height,horseSize, 0, false);
    // draw rectangle
    ctx.fillStyle = '#dddddd';
    ctx.fillRect(horseSize*2, height - (.5 * horseSize) , (horseSize *4), - (horseSize * 3));

    ctx.fillStyle = '#9999FF';
    ctx.fillRect(horseSize*2 + 3, height - (.5 * horseSize) -3  , (horseSize *4) -6, - (horseSize * 3) + 6 );


    const first = "1ST - " + finalPlaces[0].name;
    const second = "2ND - " + finalPlaces[1].name;
    const third = "3RD - " + finalPlaces[2].name;
    const fourth = "4TH - " + finalPlaces[3].name;

    ctx.fillStyle = "#000000";
    ctx.font = "40px Arial";

    ctx.fillText("Final Results", horseSize* 3, height - (horseSize * 3));
    ctx.fillText(first, horseSize* 2.5, height - (horseSize * 2.5));
    ctx.fillText(second, horseSize* 2.5, height - (horseSize * 2));
    ctx.fillText(third, horseSize* 2.5, height -(horseSize * 1.5));
    ctx.fillText(fourth,horseSize* 2.5, height - (horseSize));

}