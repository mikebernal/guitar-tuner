var ctx = (function() {
    if (typeof AudioContext !== "undefined") {
        return new AudioContext(); 
    } else if (typeof webkitAudioContext !== "undefined") {
        return webkitAudioContext();
    } else if (typeof mozAudioContext !== "undefined") {
        return mozAudioContext();
    } else {
        throw new Error("AudioContext is not supported by your browser");
    }
}());