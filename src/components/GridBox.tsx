"use client";

import useMounted from "@/hooks/useMounted";
import { exportCSS } from "@/libs/grid";
import { GridItemType, GridOptionsType } from "@/types/grid";
import { WithNull } from "@/types/utils";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

const GridBoard = styled.div<GridOptionsType>`
  position: relative;
  grid-template-areas: ${({ board }) => board};
  grid-template-rows: ${({ rowstemplate }) => rowstemplate};
  grid-template-columns: ${({ colstemplate }) => colstemplate};
  gap: ${({ gap }) => `${gap}px`};
`;

const GridItem = styled.div<{ resizable: string; height: number }>`
  resize: ${({ resizable }) => (resizable === "true" ? "both" : "none")};
  z-index: 9;
  height: ${({ height }) => `${height}px`};
`;

const GridBox = () => {
  const isMounted = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const item = useRef<WithNull<HTMLDivElement>>(null);
  const [selected, setSelected] = useState<WithNull<GridItemType>>(null);
  const [input, setInput] = useState({
    rows: 10,
    cols: 10,
    width: 90,
    height: 90,
    gap: 4,
    board: `
     ". . . . . . . . . ."
     ". . . . . . . . . ."
     ". . . . . . . . . ."
     ". . . . . . . . . ."
     ". . . . . . . . . ."
     ". . . . . . . . . ."
     ". . . . . . . . . ."
     ". . . . . . . . . ."
     ". . . . . . . . . ."
     ". . . . . . . . . ."`,
  });
  const [arr, setArr] = useState<{ x: number; y: number }[]>([]);
  const [css, setCSS] = useState("");
  //const [board, setBoard] = useState<string[]>([]);

  const generateCoordinates = useCallback(() => {
    setArr([]);
    const areas = [];

    for (let i = 0; i < input.cols; i++) {
      let area = "";
      for (let j = 0; j < input.rows; j++) {
        setArr((prev) => [...prev, { x: i, y: j }]);
        area += j === input.rows - 1 ? "." : ". ";
      }
      areas.push(`${area}`);
    }
    //setBoard(areas);
  }, [input]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (selected) return;

    const { id, row, col } = e.currentTarget.dataset;

    if (!id || !row || !col) return;

    setSelected({
      id: +id,
      x: +col,
      y: +row,
    });
    item.current = e.currentTarget;
  };

  const handleMouseUp = () => {
    if (!item.current || !selected) return;

    const newWidth = parseInt(item.current.style.width.replace("px", ""));
    const newHeight = parseInt(item.current.style.height.replace("px", ""));

    if (!newWidth || !newHeight) return;

    item.current.style.gridColumn = `auto / span ${Math.round(
      newWidth / input.width
    )}`;
    item.current.style.gridRow = `auto / span ${Math.round(
      newHeight / input.height
    )}`;
    item.current.style.width = "auto";
    item.current.style.height = "auto";
  };

  const handleExport = () => {
    if (!ref.current) return;

    const css = exportCSS(ref.current);
    console.log(css);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    item.current = null;
    setSelected(null);

    if (ref.current) {
      const css = exportCSS(ref.current);
      setCSS(css);
    }
  };

  useEffect(() => {
    generateCoordinates();

    if (!ref.current) return;
  }, [input, generateCoordinates]);

  useLayoutEffect(() => {
    if (isMounted && ref.current && input) {
      console.log(ref.current);
      const css = exportCSS(ref.current);
      setCSS(css);
    }
  }, [isMounted, input]);

  return (
    <div className="flex gap-3 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 border p-2 w-fukk">
          <div className="flex flex-col">
            <label htmlFor="rows">Rows</label>
            <input
              id="rows"
              className="border p-2"
              type="number"
              value={input.rows}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  rows: +e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="rows">Cols</label>
            <input
              className="border p-2"
              type="number"
              value={input.cols}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  cols: +e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="width">Width</label>
            <input
              className="border p-2"
              type="number"
              value={input.width}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  width: +e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="height">Height</label>
            <input
              className="border p-2"
              type="number"
              value={input.height}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  height: +e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="gap">Gap</label>
            <input
              className="border p-2"
              type="number"
              value={input.gap}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  gap: +e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="grid-wrapper w-full border">
          <Suspense>
            <GridBoard
              ref={ref}
              className="grid-container p-2 w-fit mx-auto"
              rowstemplate={`repeat(${input.rows},${input.height}px)`}
              colstemplate={`repeat(${input.cols},${input.width}px)`}
              {...input}
            >
              {arr.map(({ x, y }, idx) => (
                <GridItem
                  key={idx}
                  className={`grid-${idx} border rounded-lg cursor-pointer box hover:bg-[#a2c3b47d] ${
                    selected && +selected.id === idx ? "bg-[#ebfcf47d]" : ""
                  } `}
                  height={input.height}
                  data-id={idx}
                  data-row={x + 1}
                  data-col={y + 1}
                  resizable={
                    selected && +selected.id === idx ? "true" : "false"
                  }
                  onMouseUp={handleMouseUp}
                  onClick={handleClick}
                >
                  {selected && +selected.id === idx && (
                    <div className="flex justify-start gap-2">
                      <button
                        className="border text-white bg-blue-500 px-2 py-1"
                        onClick={handleCancel}
                      >
                        x
                      </button>
                    </div>
                  )}
                </GridItem>
              ))}
            </GridBoard>
          </Suspense>
        </div>
      </div>
      <div className="px-5 w-full flex flex-col gap-2">
        <div className="flex flex-col gap-2 border rounded-md p-4  h-full">
          <div className="flex justify-between">
            <label className="text-lg font-semibold">CSS</label>
            <button className="text-sm" onClick={handleExport}>
              Export CSS
            </button>
          </div>
          <div className=" h-full border rounded-lg">
            <pre>{css}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridBox;
