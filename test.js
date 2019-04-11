// DOM manipulation
var strings = document.querySelectorAll(".strings");
strings.forEach(function(string, i) {
    string.addEventListener("click", function() {
        play(ctx, i);
    });
});
// Main 
function play(ctx, string) {
    var guitar = {};
    // Helper functions
    var getNote = (function() {
        var notes = ["e4", "b3", "g3", "d3", "a2", "e2"];
        return function(n) {
            return notes[n];
        };
    }());
    var getFrequency  = (function () {
        var frequency = [329.63,  246.94, 196.00, 146.83, 110.00,  82.41];
        return function (n) {
            return frequency[n];
        };
    }());
    var getWaveLength  = (function() {
        var waveLength = [104.66, 139.71, 176.02, 234.96, 313.64, 418.65];
        return function(n) {
            return waveLength[n];
        };
    }());
    var fadeOut = (function() {
        return function() {
            // set gain value for fallback
            // guitar.volume.gain.value = 0;
            var volumeFadeOut = new Float32Array([0.5,0.4,0.3,0.2,0.1,0]);
            var hz = guitar.string.frequency.value;
            var frequencyFadeOut = new Float32Array([
                hz - 55,
                hz - 27.5,
                hz - 13.75,
                hz - 6.875,
                hz - 3.4375,
                hz - 3.4375,
                hz - 1.71875,
                hz - 0.859375,
                hz - 0.4296875,
                hz - 0.21484375,
                hz - 0.107421875,
                hz - 0.0537109375,
                hz - 0.02685546875,
                hz - 0
            ]);
            
            // Cannot push on Float32Array
            // for(; hz > 0; hz -= 13.75) {
            //     frequencyFadeOut.push = hz;
            //     console.log(frequencyFadeOut);
            //     console.log("length: "+frequencyFadeOut.length);
            // };
            guitar.volume.gain.setValueCurveAtTime(volumeFadeOut, ctx.currentTime, 3000);
            guitar.string.frequency.setValueCurveAtTime(frequencyFadeOut, ctx.currentTime, 3000);
            console.log("String note : " + guitar.string.note);
            console.log("Oscillator frequency is: " + guitar.string.frequency.value);
            console.log("Wave length is: " + guitar.filter.Q.value);
            guitar.string.stop();
            // guitar.volume.disconnect();
        };
    }());
    // Setup AudioNodes
    guitar.string      = ctx.createOscillator();
    guitar.string.note = getNote(string);
    guitar.volume      = ctx.createGain();

    guitar.filter      = ctx.createBiquadFilter();

    guitar.string.type            = "sine";
    guitar.string.frequency.value = getFrequency(string);;

    guitar.filter.type            = "lowpass";
    guitar.filter.frequency.value = guitar.string.frequency.value;
    // Q value value 52.33
    guitar.filter.Q.value         = 52.33; 
    // guitar.filter.Q.value         = getWaveLength(string);
    
    // Node Routing
    // Oscillator -> BiquadFilter -> Gain -> Destination
    guitar.string.connect(guitar.filter).connect(guitar.volume).connect(ctx.destination);

    // Play Oscillator
    guitar.string.start();
    setTimeout(fadeOut, 100);
}