export const rotateFrontToBack = <T>(array: Array<T>): void => {
  const front = array.shift();
  if (front !== undefined) {
    array.push(front);
  }
};

export const rotateBackToFront = <T>(array: Array<T>): void => {
  const back = array.pop();
  if (back !== undefined) {
    array.unshift(back);
  }
};

export const rotateArray = <T>(
  array: Array<T>,
  times: number,
  direction: "frontToBack" | "backToFront",
): void => {
  for (let i = 0; i < times; i++) {
    if (direction === "frontToBack") {
      rotateFrontToBack(array);
    } else {
      rotateBackToFront(array);
    }
  }
};
