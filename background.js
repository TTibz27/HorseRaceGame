
const fencePostGap = 200;
let fenceOffset = fencePostGap;


function drawRaceBackground(ctx, width, height, horseSize){

    // Create gradient
    const grd = ctx.createRadialGradient( width /2, height/2, 0.000, width/2, height/2, width/2);

    // Add colors
    grd.addColorStop(0.101, 'rgba(255, 255, 255, 1.000)');
    grd.addColorStop(1.000, 'rgba(116, 224, 224, 1.000)');

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);


    ctx.fillStyle = '#CD853F';
    ctx.fillRect(0, height - (2 * horseSize) , width, height);
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(0, height - (2.4 * horseSize) , width, horseSize/2);

    const fenceline = ( height - (2 * horseSize));

    drawGuides(ctx, width, height, horseSize, fenceline);
    drawFence(ctx, width, fenceline, horseSize );

}

function drawGuides(ctx, width, height, horseSize, fenceline){

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

function drawFence(ctx, width, fenceline, horseSize) {

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

    fenceOffset -=5;
    if (fenceOffset < 0) { fenceOffset = fencePostGap};
}