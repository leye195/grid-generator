"use client";

import ReactDOM from "react-dom";

export function PreloadResources() {
  ReactDOM.preload(
    "/https://tnmt-dev.s3.ap-northeast-2.amazonaws.com/grid/grid_1.0.0.css",
    { as: "style" }
  );

  return null;
}
