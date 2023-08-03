import { transposeChord, getKey, Note } from "./musicTheory";

test("transposeChord transposes chords correctly", () => {
  expect(
    transposeChord(
      getKey(0, { note: "C", accidental: null }, "Ionian"),
      {
        commonName: "F",
        rootPitch: { note: "F" as Note, accidental: null },
        quality: "major",
      },
      getKey(1, { note: "F", accidental: null }, "Ionian"),
    ),
  ).toStrictEqual({
    commonName: "F",
    rootPitch: { note: "B" as Note, accidental: "♭" },
    quality: "major",
  });
});

test("transposeChord transposes Cb correctly", () => {
  expect(
    transposeChord(
      getKey(-7, { note: "C", accidental: "♭" }, "Ionian"),
      {
        commonName: "Cb",
        rootPitch: { note: "C" as Note, accidental: "♭" },
        quality: "major",
      },
      getKey(7, { note: "C", accidental: "♯" }, "Ionian"),
    ),
  ).toStrictEqual({
    commonName: "Cb",
    rootPitch: { note: "C" as Note, accidental: "♯" },
    quality: "major",
  });
});

test("transposeChord transposes C# correctly", () => {
  expect(
    transposeChord(
      getKey(7, { note: "C", accidental: "♯" }, "Ionian"),
      {
        commonName: "C#",
        rootPitch: { note: "C" as Note, accidental: "♯" },
        quality: "major",
      },
      getKey(-7, { note: "C", accidental: "♭" }, "Ionian"),
    ),
  ).toStrictEqual({
    commonName: "C#",
    rootPitch: { note: "C" as Note, accidental: "♭" },
    quality: "major",
  });
});
