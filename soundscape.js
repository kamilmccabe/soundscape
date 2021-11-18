
const grainplayer = new Tone.GrainPlayer("/samples/C4.wav").toDestination();
grainplayer.playbackRate = 1;
grainplayer.grainSize = 0.1;

const notes = ["C2", "G3", "E4", "C3", "A4", "F3", "G4", "E2"];

const higherNotes = ["C5", "E5", "G5"];

// for performance
Tone.Context.lookAhead = 0;

// CONSTRUCT INSTRUMENTS
const ls = new LushSynth();
const lsH = new LushSynth();

const synthLoop = new Tone.Loop(time => {
    ls.stop();
    console.log(Tone.now());
    const n1 = notes[Math.floor(Math.random()*notes.length)];
    const n2 = notes[Math.floor(Math.random()*notes.length)];
    const n3 = notes[Math.floor(Math.random()*notes.length)];
    console.log(n1, n2, n3);

    if (Math.random() > 0.8) {
        console.log("higher playing");
        lsH.stop()
        lsH.playRelease(higherNotes[Math.floor(Math.random()*higherNotes.length)], "1m", time);
    }

    ls.playRelease([n1, n2, n3], "4m", time);
}, "4m");

synthLoop.probability = 0.6;

console.log(synthLoop);

let lanes = [];
let synthLane = {isPlaying: false, loop: synthLoop, prob: 0.5, probInc: 0.01}; 
lanes.push(synthLane);

const loop2 = new Tone.Loop(time => {
    console.log('loop2');
}, "2m");

const mainTransportLoop = new Tone.Loop(time => {
    lanes.forEach(lane => {
        const r = Math.random();
        console.log(r);
        console.log("prob", lane.prob);
        if (!lane.isPlaying) {
            lane.prob += lane.probInc;
            if (r < lane.prob) {
                console.log("playing loop");
                lane.loop.start(time);
                lane.isPlaying = true;
                lane.prob = 0;
            }
        }
        else if (lane.isPlaying) {
            lane.prob += lane.probInc;
            if (r < lane.prob) {
                console.log("stopping loop");
                lane.loop.stop();
                lane.isPlaying = false;
                lane.prob = 0;
            }
        }

    });
}, "1m");

const play = () => {
    if (Tone.Transport.state != "started"){
        Tone.Transport.start("+0.1");
    }
    console.log(Tone.now());
    synthLoop.start();
    
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
