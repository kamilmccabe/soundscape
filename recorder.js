// for export/recording
const audio = document.querySelector('audio');
const actx  = Tone.context;
const dest  = actx.createMediaStreamDestination();
const recorder = new MediaRecorder(dest.stream);
const chunks = [];

recorder.ondataavailable = evt => chunks.push(evt.data);
recorder.onstop = evt => {
    let blob = new Blob(chunks, {
        type: 'audio/wav'
    });
    audio.src = URL.createObjectURL(blob);
};