import { useEffect, type RefObject } from "react";
const useOutsideClick = (
  callbackFn: () => void,
  ref: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        ref &&
        ref.current &&
        e.button === 0 &&
        !ref.current.contains(e.target as Node)
      ) {
        callbackFn();
      }
    };
    if (ref) window.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("click", handleClick, true);
    };
  }, [callbackFn, ref]);
};

export default useOutsideClick;
