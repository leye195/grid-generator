const convertArrayToArea = (board: string[]) => {
  let areaStr = board.reduce((prev, cur) => `${prev}\n"${cur}"`, "");
  return areaStr;
};
