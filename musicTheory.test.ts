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
