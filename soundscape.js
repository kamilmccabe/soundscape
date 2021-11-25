
const cMajScale = ["C", "D", "E", "G", "A"];
const notes = ["C2", "G3", "E4", "C3", "A4", "F3", "G4", "E2"];

const higherNotes = ["C5", "E5", "G5"];

// for performance
Tone.Context.lookAhead = 0;


// FIELD RECORDINGS
const grainplayer = new Tone.GrainPlayer("/samples/field_recordings/deansgate1.wav").toDestination();
grainplayer.playbackRate = 1;
grainplayer.grainSize = 0.01;
grainplayer.volume.value = -25;

// PIANO

const reverb = new Tone.Reverb({
    decay: 5,
    wet: 0.6
}).toDestination();

const feedbackDelay = new Tone.FeedbackDelay("4tn", 0.2).connect(reverb);

const filter = new Tone.Filter(500, "lowpass").connect(feedbackDelay);

const piano = new Tone.Sampler({
    urls: {
        C3: "C3.wav",
        C4: "C4.wav",
        C5: "C5.wav",
        G3: "G3.wav",
        G4: "G4.wav",
        G5: "G5.wav",
    },
    baseUrl: "samples/",
    volume: 0
}).connect(filter);


// CONSTRUCT SYNTHS
const ls = new LushSynth(-10);
const lsH = new LushSynth(-10);
const lsDrone = new LushSynth(-20);

let lsProb = Math.random();
const synthLoop = new Tone.Loop(time => {
    if (Math.random() < lsProb) {
        ls.stop();
        const n1 = notes[Math.floor(Math.random() * notes.length)];
        const n2 = notes[Math.floor(Math.random() * notes.length)];
        const n3 = notes[Math.floor(Math.random() * notes.length)];
        console.log(n1, n2, n3);

        if (Math.random() > 0.8) {
            console.log("higher playing");
            lsH.stop()
            lsH.playRelease(higherNotes[Math.floor(Math.random() * higherNotes.length)], "1m", time);
        }

        ls.playRelease([n1, n2, n3], "4m", time);
    }
}, "4m");

//synthLoop.probability = 0.6;
let pianoProb = Math.random();
let probChange = Tone.now();
console.log(probChange);
const pianoLoop = new Tone.Loop(time => {
    if (Math.random() < pianoProb) {
        const delay = Math.random() / 2;
        const vel = Math.random();
        const n1 = cMajScale[Math.floor(Math.random()*cMajScale.length)] + randomIntFromInterval(3,6);
        console.log("Piano notes ", n1);
        piano.triggerAttackRelease(n1, "1m", time + delay, vel);
    }
}, "2n");

let lanes = [];
//let synthLane = {isPlaying: false, loop: synthLoop, prob: 0.5, probInc: 0.01}; 
let dgLane = {isPlaying: false, loop: grainplayer, prob: 0.5, probInc: 0.01}; 
//lanes.push(synthLane);
lanes.push(dgLane);

const loop2 = new Tone.Loop(time => {
    console.log('loop2');
}, "2m");

const mainTransportLoop = new Tone.Loop(time => {

    lanes.forEach(lane => {
        const r = Math.random();
        console.log(r);
        if (!lane.isPlaying) {
            lane.prob += lane.probInc;
            if (r < lane.prob) {
                lane.loop.start(time);
                lane.isPlaying = true;
                lane.prob = 0;
            }
        }
        else if (lane.isPlaying) {
            lane.prob += lane.probInc;
            if (r < lane.prob) {
                lane.loop.stop();
                lane.isPlaying = false;
                lane.prob = 0;
            }
        }

    });

    // update probabilityt change after every n seconds
    if (Tone.now() - probChange > 20) {
        console.log('change prob');
        probChange = Tone.now();
        pianoProb = Math.random();
        lsProb = Math.random();
        console.log(pianoProb);
    }
}, "1m");

const play = () => {
    if (Tone.Transport.state != "started"){
        Tone.Transport.start("+0.1");
    }
    // Play the drone
    lsDrone.play(["C1", "G2"], 0);
    synthLoop.start();
    pianoLoop.start();
    mainTransportLoop.start();
    
    // grainplayer.start();
}

const stop = () => {
    synthLoop.stop();
}

const getState = () => {
    console.log(synthLoop.state);
}

const playLushSynths = (notes) => {
    
}

const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}