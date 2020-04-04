/**
 * Created by tomdt on 6/23/2017.
 */



const GAME_CANVAS = document.getElementById("gamecanvas");
const BG_CANVAS = document.getElementById("bgcanvas");

const BG_CTX = BG_CANVAS.getContext("2d");
const CTX = GAME_CANVAS.getContext("2d");

const COUNTDOWN_START_SECS = 25;

// Size parameters, they will be adjusted to fit the size of the screen
let WIDTH = GAME_CANVAS.width;
let HEIGHT = GAME_CANVAS.height;

let horseWidth = WIDTH / 8;
let horseHeight = WIDTH / 8;

// state tracking
let cyclesRemaining = 1000;
let gameState = "preRace";  // this should probably be an enum later
let horses = [];
let finalPlaces = [];
let finishLineScan = 0;
let fanfarePlayedFlag = false;
let placeCount = 1;
let roundScored = false;

let scoreboard = JSON.parse(window.localStorage.getItem("cd_scoreboard")) || {};

//UI event handlers
let clickHandlerLoaded = false;

// sound effect triggers
const soundEffectTriggers = [Math.floor(Math.random() * (100)) + 700, // should be between 700 and 800
Math.floor(Math.random() * (100)) + 300, // should be between 300 and 400
//  Math.floor(Math.random() * (100)) + 200, //between 200 - 300
];


//Start game loop
window.onload = ( ) => {
    console.log("-- Scoreboard Check --");
    console.log(scoreboard);
    initGame();
    // The game loop should be a setInterval that way the screen size can be adjusted
    setInterval(gameLoop, 20); //  a touch <60 FPS

};

function initGame(){
     cyclesRemaining = 1000;
     gameState = "preRace";  // this should probably be an enum later
     horses = [];
     finalPlaces = [];
     finishLineScan = 0;

     fanfarePlayedFlag = false;
     clickHandlerLoaded = false;
     roundScored = false;

     initBackground();
     initHorses();
}

function gameLoop(){

    switch(gameState){
        case "preRace":
            screenReset();
            drawStartScreen(CTX ,BG_CTX, WIDTH, HEIGHT, horseHeight);
            if (horses.length === 4){
                if (!clickHandlerLoaded){
                let handler = function (event) {
                        gameState = 'countdownStart';
                        console.log ("Horses loaded, transitioning to countdown");
                        removeEventListener('click', handler, false);
                        clickHandlerLoaded = false;
                    } ;
                        window.addEventListener("click",handler,false);
                    clickHandlerLoaded = true;
                }
            }
            break;
        case "countdownStart":
                startCountdown(COUNTDOWN_START_SECS,BG_CTX);
            break;
        case "running":
            screenReset();
            runRace(CTX,BG_CTX);
            break;
        case "finishing":
            screenReset();
            runRace(CTX,BG_CTX);
            break;

        case "finished":
            //quick and dirty fanfare check
            if (!fanfarePlayedFlag){
                playFanfare();
                fanfarePlayedFlag = true;
                setTimeout(()=>{
                    gameState = "WinnerCloseUp";
                }, 7 * 1000);
            }
            CTX.clearRect(0, 0, WIDTH, HEIGHT);
            drawResults(BG_CTX, WIDTH, HEIGHT, horseHeight, finalPlaces);
            break;
        case "WinnerCloseUp":
            drawWinnerCloseUp(BG_CTX, WIDTH, HEIGHT, horseHeight, finalPlaces);
            if (!clickHandlerLoaded){
                let handler = function () {
                    console.log("Restarting game....")
                    initGame();
                    gameState = "preRace"
                    removeEventListener('click', handler, false);
                    clickHandlerLoaded = false;
                };
                clickHandlerLoaded = true;
                addEventListener('click', handler, false);
            }
            break;

        default:
            break;
    }
}

function runRace(ctx,bg_ctx){

    cyclesRemaining --;
    //handle race background
    drawRaceBackground(bg_ctx, WIDTH, HEIGHT, horseHeight, cyclesRemaining, true);

    //todo- change these sway varibles to be "trot" objects, or something, at put it in a horse object, so we can reuse these better
    // horse 1 & 2 are hilarious, horse 3&4 are more normal paced
    const lane_1_height = HEIGHT - (horseHeight * 1.25);
    const horse_1_sway = Math.sin(cyclesRemaining) * 10;


    const lane_2_height = HEIGHT - (horseHeight * 1.75);
    const horse_2_sway = Math.cos(cyclesRemaining) * 10;


    const lane_3_height = HEIGHT - (horseHeight * 2.25);
    const horse_3_sway = Math.sin(cyclesRemaining/2) * 10;


    const lane_4_height = HEIGHT - (horseHeight * 2.75);
    const horse_4_sway = Math.cos(cyclesRemaining/2) * 10;

    horses[0].y = (lane_1_height + horse_1_sway);
    horses[1].y = (lane_2_height + horse_2_sway);
    horses[2].y = (lane_3_height + horse_3_sway);
    horses[3].y = (lane_4_height + horse_4_sway);


    updateHorsePositions();

    checkForSoundEffects(cyclesRemaining);


    //draw shadows under horses
    fg_drawShadows(ctx, horses, horseHeight, horseWidth);

    // draw horses  - order is important!!!
    ctx.drawImage(horses[3].image, horses[3].x ,  horses[3].y , horseWidth, horseHeight);
    ctx.drawImage(horses[2].image, horses[2].x ,  horses[2].y , horseWidth, horseHeight);
    ctx.drawImage(horses[1].image, horses[1].x ,  horses[1].y  , horseWidth, horseHeight);
    ctx.drawImage(horses[0].image, horses[0].x , horses[0].y , horseWidth, horseHeight);

    if (cyclesRemaining <= 0 ){
        if (gameState === 'running'){
            console.log("checking for winners now");
            finishLineScan = WIDTH - horseWidth;
            gameState = "finishing";
        }

        let foundHorseIndex = null;

        for (let i = 0; i < horses.length; i++) {
            //horse has finished
            if (horses[i].x >= finishLineScan && horses[i].place === null){
              if (!foundHorseIndex || horses[foundHorseIndex].x < horses[i].x) {
                  foundHorseIndex = i;
              }
            }
        }
        if(foundHorseIndex != null){
            finalPlaces.push(horses[foundHorseIndex]);
            horses[foundHorseIndex].place = placeCount ++;
            console.log("Horse Finished - " + foundHorseIndex);
        }
       // horses.splice(foundHorseIndex);
        if (finalPlaces.length === 4){
            if (!roundScored){
                addWinnerToScoreboard(finalPlaces);
                getAlltimeWinnerFromScoreboard();
                roundScored = true;
            }
            stopGallop();
            // give it a bit of time before setting gameState to finished
           setTimeout(() => {
               gameState = "finished";
           }, 2000)
        }
        finishLineScan -= finishLineSpeed;
    }
}


function initHorses(prevWinner) {
    console.log("initHorses");

    if (prevWinner){

    }

    const temp_horse_array = [];

    //grab random horses
    while (temp_horse_array.length < 4) {
        let validPick = true;
        // pick an index
        let pick =  Math.floor(Math.random() * horse_array.length);
        // check if its taken
        for (let i =0; i < temp_horse_array.length; i ++){
            if (temp_horse_array[i].name === horse_array[pick].name){ validPick = false;}
        }
        //push to temp array
        if (validPick){
            temp_horse_array.push(horse_array[pick]);
        }
        console.log(temp_horse_array);
    }


    // build horse game play objects
    for (let i =0; i < 4; i ++ ){
        console.log(i);
        const horse_image = new Image();
        horse_image.src = temp_horse_array[i].img;
        const temphorse = temp_horse_array[i];

        horse_image.onload = function() {
            const horse = {
                image: horse_image,
                name: temphorse.name,
                owner: temphorse.owner,
                x:0,
                y:0,
                currentSpeed: null,
                currentDestination:null,
                place: null,
                changePositionCycles:[
                    Math.floor(Math.random() * (100)) + 700, // should be between 700 and 800
                    Math.floor(Math.random() * (100)) + 450, // shuld be between 450 and 550
                    Math.floor(Math.random() * (100)) + 200, //between 200 - 300
                ]

            };
            horses.push(horse);
        }
    }

}

function screenReset(){
        HEIGHT = GAME_CANVAS.height = BG_CANVAS.height = window.innerHeight;
        WIDTH = GAME_CANVAS.width = BG_CANVAS.width = window.innerWidth;
        horseWidth = horseHeight = WIDTH / 8;
}


function startCountdown(seconds, bg_ctx){
    playCountdownAudio(seconds);
    if (gameState === "countdownStart" ) {
        gameState = "countdownRunning";
    }
    console.log ("Coundown: " + seconds);

    if (seconds > 0) {
        screenReset();
        drawCountdown(bg_ctx, WIDTH, HEIGHT, horseHeight, seconds, horses);
        setTimeout (()=>{startCountdown( seconds - 1, bg_ctx)}, 1000);
    }
    else {
        gameState = "running";
    }
}


function updateHorsePositions(){

    for (let i = 0; i < horses.length; i++) {
        const horse = horses[i];

        // update to current destination
        if (horse.currentDestination === null){
            horse.currentDestination = Math.floor(Math.random() * (WIDTH - horseWidth));
        }

        if (horse.currentSpeed === null){
           horse.currentSpeed=  Math.floor(Math.random() * 5) + 3;
        }

        if (horse.x > horse.currentDestination + 5 ){
            horse.x -= horse.currentSpeed / 2;
        }
        else if (horse.x < horse.currentDestination - 5){
            horse.x += horse.currentSpeed;
        }

        //add x sway
        horse.x += swayPatternFunctions[i].x(cyclesRemaining);

        // blow away destination if horse has hit its reset point
        for (let i =0; i < horse.changePositionCycles.length; i ++){
            if (cyclesRemaining === horse.changePositionCycles[i]){
                horse.currentDestination = null;
                horse.currentSpeed = null;
            }
        }

        //last second reset for giggles!
        if(cyclesRemaining === 50 ){
            horse.currentDestination = null;
            horse.currentSpeed = null;
        }
    }

}

function checkForSoundEffects(cycle){
    for (let i = 0; i < soundEffectTriggers.length; i++) {
            if (cycle === soundEffectTriggers[i]){
                playRandomNeigh();
            }
    }
}

swayPatternFunctions = [
    {x:(cycle)=>{ return Math.cos(cycle/3) * 10;}, y:(cycle)=>{return Math.sin(cycle) * 10} },
    {x:(cycle)=>{ return Math.sin(cycle/3) * 10;}, y:(cycle)=>{ return Math.cos(cycle) * 10;}},
    {x:(cycle)=>{ return Math.cos(cycle/4) * 10;}, y:(cycle)=>{ return Math.sin(cycle/2) * 10}},
    {x:(cycle)=>{ return Math.sin(cycle/4) * 10;}, y:(cycle)=>{ return Math.cos(cycle/2) * 10}}
    ];


function addWinnerToScoreboard(finalPlaceArray){

        let makeFirst = true;
        let makeSecond = true;
        let makeThird = true;
        let makeFourth = true;

        // check for existing horses in scoreboard
        for( const horseScoreListing in scoreboard){
            if (horseScoreListing === finalPlaceArray[0].name){
                makeFirst = false;
                scoreboard[horseScoreListing].totalRaces ++;
                scoreboard[horseScoreListing].firstPlaces ++;
            } else  if (horseScoreListing === finalPlaceArray[1].name){
                makeSecond = false;
                scoreboard[horseScoreListing].totalRaces ++;
                scoreboard[horseScoreListing].secondPlaces ++;

            } else if (horseScoreListing === finalPlaceArray[2].name){
                makeThird = false;
                scoreboard[horseScoreListing].totalRaces ++;
                scoreboard[horseScoreListing].thirdPlaces ++;

            } else if (horseScoreListing === finalPlaceArray[3].name){
                makeFourth = false;
                scoreboard[horseScoreListing].totalRaces ++;
                scoreboard[horseScoreListing].forthPlaces ++;
            }
        }
        //
        if (makeFirst){
            scoreboard[finalPlaceArray[0].name] = {totalRaces: 1, firstPlaces: 1, secondPlaces: 0, thirdPlaces: 0, forthPlaces:0}
        }
        if (makeSecond){
            scoreboard[finalPlaceArray[1].name] = {totalRaces: 1, firstPlaces: 0, secondPlaces: 1, thirdPlaces: 0, forthPlaces:0}
        }
        if (makeThird){
            scoreboard[finalPlaceArray[2].name] = {totalRaces: 1, firstPlaces: 0, secondPlaces: 0, thirdPlaces: 1, forthPlaces:0}
        }
        if (makeFourth){
            scoreboard[finalPlaceArray[3].name] = {totalRaces: 1, firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0, forthPlaces:1}
        }

        // Save Scoreboard to local variable again.
    window.localStorage.setItem("cd_scoreboard", JSON.stringify(scoreboard));
}

function getAlltimeWinnerFromScoreboard(){
    console.log(scoreboard);
    let mostwins = 0;
    let winningHorse = "";
    for( const horseScoreListing in scoreboard){
        if (scoreboard[horseScoreListing].firstPlaces > mostwins) {
            mostwins = scoreboard[horseScoreListing].firstPlaces;
            winningHorse = horseScoreListing;
        }
    }
    if (mostwins > 0 ){
        console.log("The winningest horse of all time is " +winningHorse+ " with a total of " +mostwins+ " wins");
    }
}

function deleteScoreboard() {
    scoreboard = {};
    window.localStorage.setItem("cd_scoreboard", JSON.stringify(scoreboard));
}

let deletecheck = false;
window.addEventListener("keypress", (e)=>{
    if (e.key === 'd'){
        if (deletecheck === false){
            deletecheck = true;
            console.log("Press again to delete scoreboard, press any other key to cancel");
        }
        else {
            console.log("deleting scoreboard");
            deleteScoreboard()
        }

    }else {
        deletecheck = false
    }
    if (e.key === "s"){
        console.log(scoreboard);
    }
    if(e.key ===" "){
        document.body.click();
    }

},false);