type Accidental = "+" | "-";
type Note = "C" | "D" | "E" | "F" | "G" | "A" | "B";
type Mode = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface Pitch {
  note: Note;
  accidental: Accidental | null;
}

interface Scale {
  name: Note;
  accidental: Accidental | null;
  pitches: Pitch[];
  mode: Mode;
}

const naturals: Record<Note, number> = {
  A: 0,
  B: 2,
  C: 3,
  D: 5,
  E: 7,
  F: 8,
  G: 10,
};

const pitches: Array<Array<Pitch>> = [
  [{ note: "A", accidental: null }],
  [
    { note: "A", accidental: "+" },
    { note: "B", accidental: "-" },
  ],
  [
    { note: "B", accidental: null },
    { note: "C", accidental: "-" },
  ],
  [
    { note: "B", accidental: "+" },
    { note: "C", accidental: null },
  ],
  [
    { note: "C", accidental: "+" },
    { note: "D", accidental: "-" },
  ],
  [{ note: "D", accidental: null }],
  [
    { note: "D", accidental: "+" },
    { note: "E", accidental: "-" },
  ],
  [
    { note: "E", accidental: null },
    { note: "F", accidental: "-" },
  ],
  [
    { note: "E", accidental: "+" },
    { note: "F", accidental: null },
  ],
  [
    { note: "F", accidental: "+" },
    { note: "G", accidental: "-" },
  ],
  [{ note: "G", accidental: null }],
  [
    { note: "G", accidental: "+" },
    { note: "A", accidental: "-" },
  ],
];

const majorScales: Record<Note, Record<Accidental, boolean>> = {
  A: { "-": true, "+": false },
  B: { "-": true, "+": false },
  C: { "-": true, "+": true },
  D: { "-": true, "+": false },
  E: { "-": true, "+": false },
  F: { "-": false, "+": true },
  G: { "-": true, "+": false },
};
const majorSteps = [2, 2, 1, 2, 2, 2, 1];

const pitchList: Record<Note, { note: Note; next: Note }> = {
  A: { note: "A", next: "B" },
  B: { note: "B", next: "C" },
  C: { note: "C", next: "D" },
  D: { note: "D", next: "E" },
  E: { note: "E", next: "F" },
  F: { note: "F", next: "G" },
  G: { note: "G", next: "A" },
};

const evaluatePitch = (index: number, target: Note): Pitch => {
  const possiblePitches = pitches[index];
  if (possiblePitches.length === 1) {
    return possiblePitches[0];
  } else {
    if (possiblePitches[0].note === target) {
      return possiblePitches[0];
    } else {
      return possiblePitches[1];
    }
  }
};

const getMajorScale = (key: Pitch): Scale | null => {
  const { note, accidental } = key;

  // detect invalid key
  if (accidental !== null) {
    if (!majorScales[note][accidental]) return null;
  }

  const naturalIndex = naturals[note];
  let startIndex = naturalIndex;

  if (accidental === "+") {
    startIndex = (naturalIndex + 1) % 12;
  } else if (accidental === "-") {
    startIndex = (naturalIndex - 1) % 12;
  }

  const startPitch = evaluatePitch(startIndex, note);

  const scale: Scale = {
    name: note,
    accidental: accidental,
    pitches: [],
    mode: 1,
  };

  scale.pitches.push(startPitch);

  let currentIndex = startIndex;
  let currentPitch = pitchList[startPitch.note];
  const steps = [...majorSteps];

  while (steps.length > 1) {
    currentIndex = (currentIndex + steps[0]) % 12;
    currentPitch = pitchList[currentPitch.next];
    scale.pitches.push(evaluatePitch(currentIndex, currentPitch.note));
    steps.shift();
  }
  console.log(scale);
  return scale;
};

const getMinorScale = (key: Note, accidental: Accidental | null) => {};

const getMode = (scale: Scale, mode: Mode) => {};

getMajorScale({ note: "A", accidental: "+" });
getMajorScale({ note: "B", accidental: "-" });
getMajorScale({ note: "C", accidental: null });
getMajorScale({ note: "D", accidental: "-" });
getMajorScale({ note: "E", accidental: null });
getMajorScale({ note: "F", accidental: "+" });
getMajorScale({ note: "G", accidental: "+" });

export {};
