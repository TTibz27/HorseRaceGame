// this should load all of the effects into memory.

// Neighs, random horse noises
const effects = [
    new Howl({
        src:['resources/audio/neighs/418428__soundslikewillem__neighing-horse.wav']
    }),
    new Howl({
        src:['resources/audio/neighs/61605__andune__schnauf.wav']
    }),
    new Howl({
        src:['resources/audio/neighs/418427__soundslikewillem__snorting-horse.wav']
    }),
    new Howl({
        src:['resources/audio/neighs/53261__stomachache__horse.wav']
    }),
    new Howl({
     src:['resources/audio/neighs/448090__breviceps__theremin-horse.wav']
    })
];

// starter guns
const gunshots = [
    new Howl({
    src:['resources/audio/starter_guns/145206__lensflare8642__m16-gun-3-round-burst.mp3']
    }),
    new Howl({
        src:['resources/audio/starter_guns/170417__eelke__bang-03-clean.mp3']
    }),
    new Howl({
        src:['resources/audio/starter_guns/200245__noah-fletcher__homeade-gun-shot1-no-echo.wav']
    }),
    new Howl({
        src:['resources/audio/starter_guns/244394__werra__bang-explosion-metallic.wav']
    }),
    new Howl({
        src:['resources/audio/starter_guns/244587__timbre__a-synthetic-bang.wav']
    }),
    new Howl({
        src:['resources/audio/starter_guns/344142__brokenphono__gunshot-002.wav']
    }),
    new Howl({
        src:['resources/audio/starter_guns/347591__nicjonesaudio__assault-rifle-1.wav']
    }),
    new Howl({
        src:['/home/tibz/Dev/HorseRaceGame/resources/audio/starter_guns/362652__trngle__cat-meow(1).wav']
    }),
    new Howl({
        src:['resources/audio/starter_guns/382735__schots__gun-shot.aiff']
    }),
    new Howl({
        src:['resources/audio/starter_guns/391965__ssierra1202__wood-bang.wav']
    }),
    new Howl({
        src:['resources/audio/starter_guns/474094__piotr123__bang.wav']
    })
];

const five = [
    new Howl({
    src:['resources/audio/countdowns/five.wav']
    }),
];
const four = [
    new Howl({
        src:['resources/audio/countdowns/four.wav']
    }),
];
const three = [
    new Howl({
        src:['resources/audio/countdowns/three.wav']
    }),
];
const two = [
    new Howl({
        src:['resources/audio/countdowns/two.wav']
    }),
];
const one = [
    new Howl({
        src:['resources/audio/countdowns/one.wav']
    }),
];


// gallops

const gallops = [
    new Howl({
        src:['resources/audio/gallops/322448__deadxcreed__horse-gallop-loop.wav'],
        loop: true
    }),
    new Howl({
        src:['resources/audio/gallops/106896__robinhood76__02234-fake-horse-steps.wav'],
        loop: true
    }),

];


function playRandomNeigh(){
    const index = Math.floor(Math.random() * effects.length);
    effects[index].play();
}

// function starterGun(){
//    const index =  Math.floor(Math.random() * gunshots.length);
//    gunshots[index].play();
// }

function playCountdownAudio(seconds){
    let index;
    switch (seconds) {
        case 5:
            index = Math.floor(Math.random() * five.length);
            five[index].play();
            break;
        case 4:
            index = Math.floor(Math.random() * four.length);
            four[index].play();
            break;
        case 3:
            index = Math.floor(Math.random() * three.length);
            three[index].play();
            break;
        case 2:
            index = Math.floor(Math.random() * two.length);
            two[index].play();
            break;
        case 1:
            index = Math.floor(Math.random() * one.length);
            one[index].play();
            break;
        case 0:
            index = Math.floor(Math.random() * gunshots.length);
            gunshots[index].play();
            startGallop();
            break;
    }
}

function startGallop(){
    gallops[0].play();
    gallops[1].play();

}

function stopGallop(){
    gallops[0].stop();
    gallops[1].stop();

}