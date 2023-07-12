// Define a type for the accidental.
type Accidental = '♭' | '♯' | '♮';

// Define a type for the note.
type Note = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

// Define a type for modes.
type Mode = 'Ionian' | 'Dorian' | 'Phrygian' | 'Lydian' |
    'Mixolidian' | 'Aolean' | 'Locrian';

// Define a type for roman numerals
type RomanNumeral =
    'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' |
    'i' | 'ii' | 'iii' | 'iv' | 'v' | 'vi' | 'vii';


// Define the notes.
const notes: Array<Note> = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

//name the sharps and flats
const sharps: Array<Pitch> = [
    { note: 'F', accidental: '♯' },
    { note: 'C', accidental: '♯' },
    { note: 'G', accidental: '♯' },
    { note: 'D', accidental: '♯' },
    { note: 'A', accidental: '♯' },
    { note: 'E', accidental: '♯' },
    { note: 'B', accidental: '♯' }
]

const flats: Array<Pitch> = [
    { note: 'B', accidental: '♭' },
    { note: 'E', accidental: '♭' },
    { note: 'A', accidental: '♭' },
    { note: 'D', accidental: '♭' },
    { note: 'G', accidental: '♭' },
    { note: 'C', accidental: '♭' },
    { note: 'F', accidental: '♭' }
]

// Define an interface for a Pitch, which includes a note and its accidental.
interface Pitch {
    note: Note;
    accidental: Accidental | null;
}

// Define an interface for a Scale, which includes the name and the pitches.
interface Scale {
    name: Pitch;
    pitches: [number, Pitch][];
}

// Define an interface for a Key, which includes the name, the number of accidentals, the accidentals themselves, and the scale.
interface Key {
    name: Pitch;
    accidentals: Array<Pitch>;
    scale: Scale;
    mode: Mode;
}

// // Keys should know what chords they have, so lets store them here
// interface ChordSet {
//     chords: [number, RomanNumeral, Chord][];
// }

// // Chords only need their qualit and root, and the way we write them
// interface Chord {
//     commonName: string;
//     rootPitch: Pitch;
//     quality: string;
// }

// Function to generate an infinite sequence of notes.
function* generateNotes() {
    let index = 0;
    while (true) {
        yield notes[index];
        index = (index + 1) % notes.length;
    }
}

const rotateScale = (scale: Scale, rotations: number): Scale => {
    const pitches = [...scale.pitches];  // copy the array to avoid modifying the original
    for (let i = 0; i < rotations; i++) {
        if (pitches.length > 0) {
            let first = pitches.shift();
            if (first !== undefined) {
                pitches.push(first);
            }
        }
    }
    return {
        name: pitches[0][1],
        pitches: pitches
    }
}

const getNotes = (startNote: string) => {
    const noteGenerator = generateNotes();
    let result = noteGenerator.next();
    let note = result.value;

    // Drop notes until we get to the starting note.
    while (note !== startNote) {
        result = noteGenerator.next();
        if (result.done) {
            throw new Error('Start note not found in generator.');
        }
        note = result.value;
    }

    // Take the required number of notes.
    const notes: Array<Pitch> = [];
    for (let i = 0; i < 7; i++) {
        notes.push({ note: note, accidental: null });
        result = noteGenerator.next();
        if (result.done) {
            throw new Error('Generator exhausted before getting enough notes.');
        }
        note = result.value;
    }

    return notes;
}

const getAccidentals = (num: number): Array<Pitch> => {
    if (num === 0) {
        return [];  // no accidentals for key of C
    } else {
        // If num is positive, take from sharps, otherwise from flats
        const list = num > 0 ? sharps : flats;
        // Convert num to positive if it's negative
        const count = Math.abs(num);
        return list.slice(0, count);
    }
}


const getKey = (numSharpFlats: number, root: Pitch, mode: Mode): Key => {
    const pitches = getNotes(root.note);
    const accidentals = getAccidentals(numSharpFlats)
    const scalePitches = pitches.map(originalPitch => {
        const newPitch = accidentals.find(newPitch => newPitch.note === originalPitch.note);
        return newPitch ? newPitch : originalPitch;
    });
    const enumeratedPitches = scalePitches.map((pitch, index) => {
        return [index, pitch] as [number, Pitch];
    })
    return {
        name: root,
        accidentals: accidentals,
        scale: {
            name: root,
            pitches: enumeratedPitches
        },
        mode: mode
    }
}

const shiftModeFromIonian = (key: Key, shiftBy: number): Key => {
    const rotatedScale = rotateScale(key.scale, shiftBy);
    const modes = ['Ionian', 'Dorian', 'Phrygian', 'Lydian',
                   'Mixolidian', 'Aolean', 'Locrian'];

    return {
        name: rotatedScale.name,
        accidentals: key.accidentals,
        scale: rotatedScale,
        mode: modes[shiftBy] as Mode
    }
}

const getAllKeys = (): Array<Key> => {
    const sharpFlats: Array<number> = Array.from({length: 15 }, (_, i) => i - 7);
    const roots: Array<Pitch> = [
        { note: 'C', accidental: '♭' },
        { note: 'G', accidental: '♭' },
        { note: 'D', accidental: '♭' },
        { note: 'A', accidental: '♭' },
        { note: 'E', accidental: '♭' },
        { note: 'B', accidental: '♭' },
        { note: 'F', accidental: null },
        { note: 'C', accidental: null },
        { note: 'G', accidental: null },
        { note: 'D', accidental: null },
        { note: 'A', accidental: null },
        { note: 'E', accidental: null },
        { note: 'B', accidental: null },
        { note: 'F', accidental: '♯' },
        { note: 'C', accidental: '♯' }
    ];
    let res = []
    for (let i = 0; i <= 14; i++) {
        res.push(getKey(sharpFlats[i], roots[i], 'Ionian'))
    }
    return res;
}

const getAllModes = (): Array<Key> => {
    let res = getAllKeys();
    for (let i = 1; i <= 6; i++) {
        let keys = getAllKeys()
        res = res.concat(keys.map((key) => {
            return shiftModeFromIonian(key, i)
        }))
    }
    return res;
}




console.dir(getAllModes(), { depth: null })
