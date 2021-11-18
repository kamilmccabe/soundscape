
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

const loop = new Tone.Loop(time => {
    ls.stop();
    const n1 = notes[Math.floor(Math.random()*notes.length)];
    const n2 = notes[Math.floor(Math.random()*notes.length)];
    const n3 = notes[Math.floor(Math.random()*notes.length)];
    console.log(n1, n2, n3);

    if (Math.random() > 0.8) {
        console.log("higher playing");
        lsH.stop()
        lsH.playRelease(higherNotes[Math.floor(Math.random()*higherNotes.length)], "1m", time);
    }

    ls.play([n1, n2, n3], time);
}, "4m");

const loop2 = new Tone.Loop(time => {
    console.log('loop2');
}, "2m");

const play = () => {
    Tone.Transport.start("+0.1");
    loop.start();
    // grainplayer.start();
}

const getState = () => {
    console.log(grainplayer.state);
    const time = new Tone.Time(0);
    loop2.stop();
}

const playLushSynths = (notes) => {
    
}
