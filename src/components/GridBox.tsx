"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import useMounted from "@/hooks/useMounted";
import { exportCSS, resetCSS } from "@/libs/grid";
import { GridItemType, GridOptionsType } from "@/types/grid";
import { WithNull } from "@/types/utils";
import Check from "@/components/icons/Check";
import Refresh from "@/components/icons/Refresh";
import Overlay from "@/components/Overlay";
import Loader from "@/components/Loader";
import InputWithLabel from "@/components/InputWithLabel";

const GridBoard = styled.div<GridOptionsType>`
  grid-template-rows: ${({ rowstemplate }) => rowstemplate};
  grid-template-columns: ${({ colstemplate }) => colstemplate};
  gap: ${({ gap }) => `${gap}px`};
  grid-auto-flow: row dense;
`;

const GridItem = styled.div<{ resizable: string; height: number }>`
  resize: ${({ resizable }) => (resizable === "true" ? "both" : "none")};
  z-index: 9;
  height: ${({ height }) => `${height}px`};
`;

const GridBox = () => {
  const [tab, setTab] = useState("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isHideCSS, setIsHideCSS] = useState(false);
  const [selected, setSelected] = useState<WithNull<GridItemType>>(null);
  const [input, setInput] = useState({
    rows: 10,
    cols: 10,
    width: 90,
    height: 90,
    gap: 4,
  });
  const [arr, setArr] = useState<{ x: number; y: number }[]>([]);
  const [css, setCSS] = useState("");
  const isMounted = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const item = useRef<WithNull<HTMLDivElement>>(null);

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
  }, [input]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    // 사이즈 수정
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

  const handleReset = () => {
    if (!ref.current) return;

    setCSS(resetCSS(ref.current));
  };

  const handleOK = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    item.current = null;
    setSelected(null);

    if (ref.current) {
      const css = exportCSS(ref.current);
      setCSS(css);
    }
  };

  const handleResetItem = () => {
    console.log("resetItem");
  };

  const handleTab = (type: string) => () => {
    setTab(type);
  };

  useEffect(() => {
    generateCoordinates();
    setIsLoading(false);

    if (!ref.current) return;
  }, [input, generateCoordinates]);

  useLayoutEffect(() => {
    if (isMounted && ref.current && input) {
      const css = exportCSS(ref.current);
      setCSS(css);
    }
  }, [isMounted, input]);

  return (
    <>
      {isLoading ? (
        <Overlay className="flex items-center justify-center">
          <Loader />
        </Overlay>
      ) : (
        <div className="flex gap-8 w-full justify-between">
          <section className="flex gap-4">
            <div className="flex flex-col gap-4 border p-2 h-fit">
              <InputWithLabel
                label="Rows"
                value={input.rows}
                handleChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    rows: +e.target.value,
                  }))
                }
              />
              <InputWithLabel
                label="Cols"
                value={input.cols}
                handleChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    cols: +e.target.value,
                  }))
                }
              />
              <InputWithLabel
                label="Width"
                value={input.width}
                handleChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    width: +e.target.value,
                  }))
                }
              />
              <InputWithLabel
                label="Height"
                value={input.height}
                handleChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    height: +e.target.value,
                  }))
                }
              />
              <InputWithLabel
                label="Gap"
                value={input.gap}
                handleChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    gap: +e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid-wrapper w-fit relative rounded-lg p-2 border">
              <div className="flex gap-2 pb-2 text-sm">
                <button
                  className={`border rounded-md px-2 py-1 ${
                    tab === "desktop" && "bg-slate-800 text-white"
                  }`}
                  onClick={handleTab("desktop")}
                >
                  Desktop
                </button>
                <button
                  className={`border rounded-md px-2 py-1 ${
                    tab === "tablet" && "bg-slate-800 text-white"
                  }`}
                  onClick={handleTab("tablet")}
                >
                  Tablet
                </button>
                <button
                  className={`border rounded-md px-2 py-1 ${
                    tab === "mobile" && "bg-slate-800 text-white"
                  }`}
                  onClick={handleTab("mobile")}
                >
                  Mobile
                </button>
              </div>
              <Suspense>
                <GridBoard
                  ref={ref}
                  className="grid-container  w-fit mx-auto "
                  rowstemplate={`repeat(${input.rows ?? 10},${
                    input.height ?? 10
                  }px)`}
                  colstemplate={`repeat(${input.cols ?? 10},${
                    input.width ?? 10
                  }px)`}
                  {...input}
                >
                  {arr.map(({ x, y }, idx) => (
                    <GridItem
                      key={idx}
                      className={`flex items-center justify-center border rounded-lg cursor-pointer box hover:opacity-65 grid-${idx} ${
                        selected && +selected.id === idx ? "bg-[#ebfcf47d]" : ""
                      } `}
                      height={input.height}
                      data-id={idx}
                      data-row={x + 1}
                      data-col={y + 1}
                      data-width="auto"
                      data-height="auto"
                      data-name={`item-${idx}`}
                      resizable={
                        selected && +selected.id === idx ? "true" : "false"
                      }
                      onMouseUp={handleMouseUp}
                      onClick={handleClick}
                    >
                      {selected && +selected.id === idx && (
                        <div className="flex justify-start gap-2 absolute top-0 left-0">
                          <button className="text-blue-700" onClick={handleOK}>
                            <Check className="w-[20px] h-[20px]" />
                          </button>
                          <button
                            className=" text-blue-700"
                            onClick={handleResetItem}
                          >
                            <Refresh className="w-[20px] h-[20px]" />
                          </button>
                        </div>
                      )}
                      <p className="text-center text-slate-400">{`item-${idx}`}</p>
                    </GridItem>
                  ))}
                </GridBoard>
              </Suspense>
            </div>
          </section>
          <section
            className={`h-fit flex flex-col gap-2 pl-4 relative max-w-[400px] ${
              isHideCSS ? "w-0 border-l" : "w-full"
            }`}
          >
            <button
              className="absolute rotate-[-90deg] origin-bottom-right right-[calc(95%+5px)] bottom-[96%] before:content-[''] before:absolute before:top-0 before:left-[-4px] before:w-[calc(100%+8px)] before:h-[calc(100%+2px)] before:hover:bg-gray-400/20 before:rounded-md"
              onClick={() => setIsHideCSS((prev) => !prev)}
            >
              <span className="text-xs hover:text-white">
                {isHideCSS ? "Show" : "Hide"}
              </span>
            </button>
            <div className="flex flex-col gap-2 border rounded-md p-4">
              <div className="flex justify-between">
                <label className="text-lg font-semibold">CSS</label>
                <div className="flex gap-2">
                  <button
                    className="text-sm border p-1 rounded-lg"
                    onClick={handleExport}
                  >
                    Export CSS
                  </button>
                  <button
                    className="text-sm border p-1 rounded-lg"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="h-full border rounded-lg max-w-[400px] max-h-[70vh] text-xs overflow-auto">
                <pre>{css}</pre>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default GridBox;
