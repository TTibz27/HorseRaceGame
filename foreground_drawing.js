function fg_drawShadows(ctx, horses,horseHeight, horseWidth) {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(
        horses[3].x + (horseWidth /2) , // center of horses position
        HEIGHT - (horseHeight * 1.75),// center of lane
        (horseWidth * .75) / 2,
        (horseHeight * .25) / 2,
        0, 0, Math.PI *2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
        horses[2].x + (horseWidth /2) , // center of horses position
        HEIGHT - (horseHeight * 1.25),// center of lane
        (horseWidth * .75) / 2,
        (horseHeight * .25) / 2,
        0, 0, Math.PI *2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
        horses[1].x + (horseWidth /2) , // center of horses position
        HEIGHT - (horseHeight * .75),// center of lane
        (horseWidth * .75) / 2,
        (horseHeight * .25) / 2,
        0, 0, Math.PI *2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
        horses[0].x + (horseWidth /2) , // center of horses position
        HEIGHT - (horseHeight * .25),// center of lane
        (horseWidth * .75) / 2,
        (horseHeight * .25) / 2,
        0, 0, Math.PI *2);
    ctx.fill();
}