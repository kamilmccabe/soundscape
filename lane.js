class Lane {

    constructor(url, playbackRate, grainSize, volume, prob) {
        this.grainplayer = new Tone.GrainPlayer(url).toDestination();
        this.grainplayer.playbackRate = playbackRate;
        this.grainplayer.grainSize = grainSize;
        this.grainplayer.volume.value = volume;

        this.isPlaying = false;
        this.prob = prob;
    }

}