// Define a type for the accidental.
type Accidental = '♭' | '♯' | '♮' ;

// Define a type for the note.
type Note = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

// Define the notes.
const notes: Array<Note> = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

//name the sharps
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
    name: string;
    pitches: [number,Pitch][];
}

// Define an interface for a Key, which includes the name, the number of accidentals, the accidentals themselves, and the scale.
interface Key {
    name: string;
    numberOfAccidentals: number;
    accidentals: Accidental[];
    scale: Scale;
}

// Function to generate an infinite sequence of notes.
function* generateNotes() {
    let index = 0;
    while (true) {
        yield notes[index];
        index = (index + 1) % notes.length;
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


const getScale = (numSharpFlats: number, root: Note): Array<Pitch> => {
    const pitches = getNotes(root);
    const accidentals = getAccidentals(numSharpFlats)
    const scalePitches = pitches.map(originalPitch => {
        const newPitch = accidentals.find(newPitch => newPitch.note === originalPitch.note);
        return newPitch ? newPitch : originalPitch;
    });
    return scalePitches;

}

console.log(getScale(-4,"A"))



