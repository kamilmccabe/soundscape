class LushSynth {

    constructor() {

        const reverb = new Tone.Reverb({
            decay: 10,
            wet: 1
        }).toDestination();

        const filter = new Tone.Filter(750, "lowpass");

        this.vol = 0;

        this.synthChannel = new Tone.Channel(this.vol, 0).chain(filter, reverb);
        this.leftChannel = new Tone.Channel(this.vol, -1).chain(filter, reverb);
        this.rightChannel = new Tone.Channel(this.vol, 1).chain(filter, reverb);

        const lfo = new Tone.LFO(1, -0.5, 0.5).connect(this.leftChannel.pan).connect(this.rightChannel.pan).start();

        const triangleSynth = {
            "volume": -25,
            "detune": -4,
            "portamento": 0.05,
            "envelope": {
                "attack": 20.05,
                "attackCurve": "linear",
                "decay": 10.2,
                "decayCurve": "linear",
                "release": 10.5,
                "releaseCurve": "linear",
                "sustain": 0.9
            },
            "oscillator": {
                "partialCount": 0,
                "partials": [],
                "phase": 0,
                "type": "amtriangle",
                "harmonicity": 3.5,
                "modulationType": "sine"
            }
        };

        const sineSynth = {
            "volume": -20,
            "detune": 0,
            "portamento": 0.05,
            "envelope": {
                "attack": 20.05,
                "attackCurve": "linear",
                "decay": 10.2,
                "decayCurve": "linear",
                "release": 10.5,
                "releaseCurve": "linear",
                "sustain": 0.9
            },
            "oscillator": {
                "partialCount": 0,
                "partials": [],
                "phase": 0,
                "type": "fatsine",
                "harmonicity": 3
            }
        };

        const sawSynth = {
            "volume": -30,
            "detune": 4,
            "portamento": 0.05,
            "envelope": {
                "attack": 20.05,
                "attackCurve": "linear",
                "decay": 10.2,
                "decayCurve": "linear",
                "release": 10.5,
                "releaseCurve": "linear",
                "sustain": 0.9
            },
            "oscillator": {
                "partialCount": 0,
                "partials": [],
                "phase": 0,
                "type": "sawtooth",
                "harmonicity": 3,
                "modulationType": "sawtooth"
            }
        };

        this.noise = new Tone.NoiseSynth({
            "volume": -35,
            "detune": 0,
            "portamento": 0.05,
            "envelope": {
                "attack": 20.05,
                "attackCurve": "linear",
                "decay": 10.2,
                "decayCurve": "linear",
                "release": 10.5,
                "releaseCurve": "linear",
                "sustain": 0.9
            }
        }).connect(this.synthChannel);

        this.triPoly = new Tone.PolySynth().connect(this.leftChannel);
        this.triPoly.set(triangleSynth);
        this.sinePoly = new Tone.PolySynth().connect(this.synthChannel);
        this.sinePoly.set(sineSynth);
        this.sawPoly = new Tone.PolySynth().connect(this.rightChannel);
        this.sawPoly.set(sawSynth);
    }

    play(notes, time) {
        this.triPoly.triggerAttack(notes, time);
        this.sinePoly.triggerAttack(notes, time);
        this.sawPoly.triggerAttack(notes, time);
        this.noise.triggerAttack(time);
    }

    playRelease(notes, dur, time) {
        this.triPoly.triggerAttackRelease(notes, dur, time);
        this.sinePoly.triggerAttackRelease(notes, dur, time);
        this.sawPoly.triggerAttackRelease(notes, dur, time);
        this.noise.triggerAttackRelease(dur, time);
    }

    stop() {
        this.triPoly.releaseAll();
        this.sinePoly.releaseAll();
        this.sawPoly.releaseAll();
        this.noise.triggerRelease();
    }

}