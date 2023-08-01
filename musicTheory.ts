// Define a type for the accidental.
type Accidental = "𝄫" | "♭" | "♯" | "𝄪" | "♮";

// Define a type for the note.
export type Note = "C" | "D" | "E" | "F" | "G" | "A" | "B";

// Define a type for modes.
type Mode =
  | "Ionian"
  | "Dorian"
  | "Phrygian"
  | "Lydian"
  | "Mixolidian"
  | "Aolean"
  | "Locrian";

// Define a type for roman numerals
type RomanNumeral = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";

// Define the notes.
const notes: Array<Note> = ["C", "D", "E", "F", "G", "A", "B"];

//name the sharps and flats
const sharps: Array<Pitch> = [
  { note: "F", accidental: "♯" },
  { note: "C", accidental: "♯" },
  { note: "G", accidental: "♯" },
  { note: "D", accidental: "♯" },
  { note: "A", accidental: "♯" },
  { note: "E", accidental: "♯" },
  { note: "B", accidental: "♯" },
];

const flats: Array<Pitch> = [
  { note: "B", accidental: "♭" },
  { note: "E", accidental: "♭" },
  { note: "A", accidental: "♭" },
  { note: "D", accidental: "♭" },
  { note: "G", accidental: "♭" },
  { note: "C", accidental: "♭" },
  { note: "F", accidental: "♭" },
];

// Pitch value map
const noteValues: Record<Note, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const accidentalValues: Record<Accidental, number> = {
  "𝄫": -2,
  "♭": -1,
  "♯": 1,
  "𝄪": 2,
  "♮": 0,
};

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

// Chords only need their quality and root, and the way we write them
interface Chord {
  commonName: string;
  rootPitch: Pitch;
  quality: string;
}

const getPitchValue = (note: Note, accidental: Accidental) => {
  let value = noteValues[note] + accidentalValues[accidental];

  // Handle wrap-around.
  if (value < 0) {
    value = value + 12;
  } else if (value >= 12) {
    value = value - 12;
  }

  return value;
};

// Get the difference in value between two pitches. Must be lower pitch first
const getRelPitchValue = (pitch1: Pitch, pitch2: Pitch): number => {
  const accidental1 = pitch1.accidental || "♮";
  const accidental2 = pitch2.accidental || "♮";
  const value1: number =
    noteValues[pitch1.note] + accidentalValues[accidental1];

  let value2: number = noteValues[pitch2.note] + accidentalValues[accidental2];
  if (value2 < value1) {
    value2 = value2 + 12;
  }
  return value2 - value1;
};

// Function to compare two Pitch objects for equivalence.
const isSamePitch = (pitch1: Pitch, pitch2: Pitch): boolean => {
  // If an accidental is not specified, it is assumed to be natural ('♮').
  let accidental1 = pitch1.accidental || "♮";
  let accidental2 = pitch2.accidental || "♮";

  return (
    getPitchValue(pitch1.note, accidental1) ===
    getPitchValue(pitch2.note, accidental2)
  );
};

const isSameChord = (chord1: Chord, chord2: Chord): boolean => {
  return (
    isSamePitch(chord1.rootPitch, chord2.rootPitch) &&
    chord1.quality === chord2.quality
  );
};

const adjustForAccidentals = (
  targetChordRoot: Pitch,
  originalDistance: number,
  relativeDistance: number,
): Pitch => {
  const accidentalOrder: Accidental[] = ["𝄫", "♭", "♮", "♯", "𝄪"];
  const initialIndex = accidentalOrder.indexOf(
    targetChordRoot.accidental || "♮",
  );
  const targetIndex = initialIndex + originalDistance - relativeDistance;

  if (targetIndex < 0 || targetIndex >= accidentalOrder.length) {
    throw new Error("Cannot adjust accidental further.");
  }

  return {
    note: targetChordRoot.note,
    accidental: accidentalOrder[targetIndex],
  };
};

export const transposeChord = (
  originalKey: Key,
  chord: Chord,
  targetKey: Key,
): Chord => {
  const originalScale = originalKey.scale.pitches;
  const foundPitch = originalScale.find(
    ([degree, pitch]) => pitch.note === chord.rootPitch.note,
  );

  if (!foundPitch) {
    throw new Error("No matching pitch found in the original scale.");
  }

  const originalScaleDegree = foundPitch[0];
  const originalDistance = getRelPitchValue(originalKey.name, chord.rootPitch);
  const targetScaleDistance = getRelPitchValue(
    targetKey.name,
    targetKey.scale.pitches[originalScaleDegree][1],
  );

  const targetChordRoot: Pitch =
    targetKey.scale.pitches[originalScaleDegree][1];
  const adjustedTargetChordRoot: Pitch = adjustForAccidentals(
    targetChordRoot,
    originalDistance,
    targetScaleDistance,
  );

  return {
    commonName: chord.commonName, // TODO handle common names
    rootPitch: adjustedTargetChordRoot,
    quality: chord.quality,
  };
};

const transposeChordArray = (
  originalKey: Key,
  chords: Chord[],
  targetKey: Key,
): Chord[] => {
  return chords.map((chord) => {
    const transposedChord = transposeChord(originalKey, chord, targetKey);
    return updateCommonName(targetKey, transposedChord);
  });
};

const updateCommonName = (targetKey: Key, chord: Chord): Chord => {
  const pitchInScale = targetKey.scale.pitches.find(
    ([, pitch]) =>
      pitch.note === chord.rootPitch.note &&
      (pitch.accidental || "♮") === chord.rootPitch.accidental,
  );
  let newCommonName = chord.rootPitch.note;
  if (pitchInScale) {
    if (pitchInScale[1].accidental) {
      newCommonName += pitchInScale[1].accidental;
    }
  } else {
    newCommonName += chord.rootPitch.accidental;
  }
  return {
    ...chord,
    commonName: newCommonName,
  };
};

// Function to generate an infinite sequence of notes.
function* generateNotes(start: number = 0) {
  let index = start;
  while (true) {
    yield notes[index % notes.length];
    index++;
  }
}

const rotateScale = (scale: Scale, rotations: number): Scale => {
  const pitches = [...scale.pitches]; // copy the array to avoid modifying the original
  const effectiveRotations = rotations % pitches.length;

  const rotatedPitches = [
    ...pitches.slice(effectiveRotations),
    ...pitches.slice(0, effectiveRotations),
  ];

  return {
    name: rotatedPitches[0][1],
    pitches: rotatedPitches,
  };
};

// Function to get a series of notes from a specific starting pitch to an end pitch.
function getNotesSelectively(startNote: Note, endNote: Note) {
  const startIndex = notes.indexOf(startNote);
  const endIndex = notes.indexOf(endNote);
  const noteGenerator = generateNotes(startIndex);
  const series = [];
  let currentNote;
  do {
    currentNote = noteGenerator.next().value;
    series.push(currentNote);
  } while (currentNote !== endNote);

  return series;
}

const getNotes = (startNote: string) => {
  const noteGenerator = generateNotes(0);
  let result = noteGenerator.next();
  let note = result.value;

  // Drop notes until we get to the starting note.
  while (note !== startNote) {
    result = noteGenerator.next();
    if (result.done) {
      throw new Error("Start note not found in generator.");
    }
    note = result.value;
  }

  // Take the required number of notes.
  const notes: Array<Pitch> = [];
  for (let i = 0; i < 7; i++) {
    notes.push({ note: note, accidental: null });
    result = noteGenerator.next();
    if (result.done) {
      throw new Error("Generator exhausted before getting enough notes.");
    }
    note = result.value;
  }

  return notes;
};

const getAccidentals = (num: number): Array<Pitch> => {
  if (num === 0) {
    return []; // no accidentals for key of C
  } else {
    // If num is positive, take from sharps, otherwise from flats
    const list = num > 0 ? sharps : flats;
    // Convert num to positive if it's negative
    const count = Math.abs(num);
    return list.slice(0, count);
  }
};

export const getKey = (numSharpFlats: number, root: Pitch, mode: Mode): Key => {
  const pitches = getNotes(root.note);
  const accidentals = getAccidentals(numSharpFlats);
  const scalePitches = pitches.map((originalPitch) => {
    const newPitch = accidentals.find(
      (newPitch) => newPitch.note === originalPitch.note,
    );
    return newPitch ? newPitch : originalPitch;
  });
  const enumeratedPitches = scalePitches.map((pitch, index) => {
    return [index, pitch] as [number, Pitch];
  });
  return {
    name: root,
    accidentals: accidentals,
    scale: {
      name: root,
      pitches: enumeratedPitches,
    },
    mode: mode,
  };
};

const shiftModeFromIonian = (key: Key, shiftBy: number): Key => {
  const rotatedScale = rotateScale(key.scale, shiftBy);
  const modes = [
    "Ionian",
    "Dorian",
    "Phrygian",
    "Lydian",
    "Mixolidian",
    "Aolean",
    "Locrian",
  ];

  return {
    name: rotatedScale.name,
    accidentals: key.accidentals,
    scale: rotatedScale,
    mode: modes[shiftBy] as Mode,
  };
};

const getAllKeys = (): Array<Key> => {
  const sharpFlats: Array<number> = Array.from({ length: 15 }, (_, i) => i - 7);
  const roots: Array<Pitch> = [
    { note: "C", accidental: "♭" },
    { note: "G", accidental: "♭" },
    { note: "D", accidental: "♭" },
    { note: "A", accidental: "♭" },
    { note: "E", accidental: "♭" },
    { note: "B", accidental: "♭" },
    { note: "F", accidental: null },
    { note: "C", accidental: null },
    { note: "G", accidental: null },
    { note: "D", accidental: null },
    { note: "A", accidental: null },
    { note: "E", accidental: null },
    { note: "B", accidental: null },
    { note: "F", accidental: "♯" },
    { note: "C", accidental: "♯" },
  ];
  let res = [];
  for (let i = 0; i <= 14; i++) {
    res.push(getKey(sharpFlats[i], roots[i], "Ionian"));
  }
  return res;
};

const getAllModes = (): Array<Key> => {
  let res = getAllKeys();
  for (let i = 1; i <= 6; i++) {
    let keys = getAllKeys();
    res = res.concat(
      keys.map((key) => {
        return shiftModeFromIonian(key, i);
      }),
    );
  }
  return res;
};

// testing
const keyOfC = getKey(0, { note: "C", accidental: null }, "Ionian");
const keyOfBb = getKey(-2, { note: "B", accidental: "♭" }, "Ionian");

// Then use it like this
const chords: Chord[] = [
  {
    commonName: "F",
    rootPitch: { note: "F" as Note, accidental: null },
    quality: "major",
  },
  {
    commonName: "C",
    rootPitch: { note: "C" as Note, accidental: null },
    quality: "major",
  },
  {
    commonName: "Am",
    rootPitch: { note: "A" as Note, accidental: null },
    quality: "minor",
  },
  {
    commonName: "G",
    rootPitch: { note: "G" as Note, accidental: null },
    quality: "major",
  },
  {
    commonName: "Bb",
    rootPitch: { note: "B" as Note, accidental: "♭" },
    quality: "major",
  },
];

console.log(transposeChordArray(keyOfC, chords, keyOfBb));
// console.dir(getAllModes(), { depth: null })
