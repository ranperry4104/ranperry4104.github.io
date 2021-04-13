
// FM Synth
function toneJS1() {

    // Create a synth and connect it to the master output
    const synth = new Tone.FMSynth({
			'modulationIndex' : 10,
            'harmonicity' : 5,
			'envelope' : {
				'attack' : 0.1,
				'decay' : 0.5
			},
			'modulation' : {
				'type' : 'triangle'
			},
			'modulationEnvelope' : {
				'attack' : 0.5,
				'decay' : 0.01
			}
		}).toMaster();

    // Play a middle 'C' for the duration of two seconds
    synth.triggerAttackRelease('C3', '2');
}

function toneJS2() {

    const synth = new Tone.AMSynth().toMaster();

    // Play C2 for a duration of a 4th note
    synth.triggerAttackRelease('C4', '8n');

    // Play E4 for a duration of 2nd note but starting a 4th note later
    synth.triggerAttackRelease('E4', '2n', Tone.Time('4n'));

    // Play F2 for a duration of 4th note but starting even later
    synth.triggerAttackRelease('F2', '4n', Tone.Time('4n') + Tone.Time('8n'));
}

function toneJS3() {
    const synth = new Tone.PluckSynth().toMaster();

    // this function is called right before the scheduled time
    function triggerSynth(time) {
    	// the time is the sample-accurate time of the event
    	synth.triggerAttackRelease('C1', '2n', time);
    }

    // schedule a few notes
    Tone.Transport.schedule(triggerSynth, 0);
    Tone.Transport.schedule(triggerSynth, 1);
    Tone.Transport.schedule(triggerSynth, 2);

    // set the transport to repeat
    Tone.Transport.loopEnd = '1m';
    Tone.Transport.loop = true;

    // start the transport
    Tone.Transport.toggle();
}

function toneJS4() {

    const synth = new Tone.MembraneSynth().toMaster();

    //create a loop
    const loop = new Tone.Loop(function(time) {
    	synth.triggerAttackRelease("C1", "8n", time);
        console.log('The loop call!');
    }, "4n");

    //play the loop between 0-2m on the transport
    loop.start(0).stop('2m');
    Tone.Transport.toggle();
}

function toneJS5() {

    // Create three effects
    const distortion = new Tone.Distortion(0.6);
    const tremolo = new Tone.Tremolo().start();
    const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toMaster();

    // Create a synth and 'chain' the effects, then play a chord
    const polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, feedbackDelay, Tone.Master);

    polySynth.triggerAttackRelease(['C5', 'E1'], '1m');
}

function toneJS6() {

    const reverb = new Tone.Reverb().toMaster();
    const plucky = new Tone.PluckSynth().toMaster();

	reverb.generate().then(() => {
        plucky.connect(reverb);
        plucky.triggerAttack("C4");
	});
}

function loadUI() {

    // Create envelope
    let env = new Tone.AmplitudeEnvelope({
        "attack" : 0.11,
        "decay" : 0.21,
        "sustain" : 0.5,
        "release" : 1.2
    }).toMaster();

    // Create an oscillator and connect it to the envelope
    let osc = new Tone.Oscillator({
        "partials" : [3, 2, 1],
        "type" : "custom",
        "frequency" : "C#4",
        "volume" : -8,
    }).connect(env).start();

    // Bind the interface
    document.querySelector("tone-envelope").bind(env);
    document.querySelector("tone-oscillator").bind(osc);

    document.querySelector("tone-trigger").addEventListener("change", e => {
        if (e.detail){
            env.triggerAttack();
        } else {
            env.triggerRelease();
        }
    });
}
