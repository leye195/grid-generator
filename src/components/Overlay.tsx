import { PropsWithChildren } from "react";

type Props = {
  className?: string;
} & PropsWithChildren;

const Overlay = ({ children, className }: Props) => {
  return (
    <div
      className={`w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50 ${className}`}
    >
      {children}
    </div>
  );
};

export default Overlay;
