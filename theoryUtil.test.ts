import {
  rotateArray,
  rotateBackToFront,
  rotateFrontToBack,
} from "./theoryUtil";
import { it } from "@jest/globals";

describe("theory util tests", () => {
  describe("rotate tests", () => {
    it.each<{
      rotationFunction: (array: number[]) => void;
      array: number[];
      expected: number[];
    }>`
      rotationFunction     | array        | expected
      ${rotateFrontToBack} | ${[]}        | ${[]}
      ${rotateFrontToBack} | ${[1]}       | ${[1]}
      ${rotateFrontToBack} | ${[1, 2, 3]} | ${[2, 3, 1]}
      ${rotateBackToFront} | ${[]}        | ${[]}
      ${rotateBackToFront} | ${[1]}       | ${[1]}
      ${rotateBackToFront} | ${[1, 2, 3]} | ${[3, 1, 2]}
    `(
      "$function should return $expected if array is $array",
      ({ rotationFunction, array, expected }) => {
        rotationFunction(array);
        expect(array).toEqual(expected);
      },
    );
  });

  describe("rotateArray tests", () => {
    it.each<{
      array: number[];
      times: number;
      direction: "frontToBack" | "backToFront";
      expected: number[];
    }>`
      array        | times  | direction        | expected
      ${[]}        | ${100} | ${"frontToBack"} | ${[]}
      ${[1]}       | ${100} | ${"frontToBack"} | ${[1]}
      ${[1, 2, 3]} | ${3}   | ${"frontToBack"} | ${[1, 2, 3]}
      ${[1, 2, 3]} | ${3}   | ${"backToFront"} | ${[1, 2, 3]}
      ${[1, 2, 3]} | ${2}   | ${"frontToBack"} | ${[3, 1, 2]}
      ${[1, 2, 3]} | ${2}   | ${"backToFront"} | ${[2, 3, 1]}
    `(
      "rotate $array $times times in $direction direction and expect $expected",
      ({ array, times, direction, expected }) => {
        rotateArray(array, times, direction);
        expect(array).toEqual(expected);
      },
    );
  });
});
