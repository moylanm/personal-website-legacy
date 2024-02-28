import { RefObject, useEffect } from "react"

const useIntersectionObserver = <T extends Element>(
  ref: RefObject<T>,
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): void => {
  useEffect(() => {
    const element = ref.current;

    if (element) {
      const observer = new IntersectionObserver(callback, options);

      observer.observe(element);

      return () => {
        observer.unobserve(element);
      };
    }
  }, [callback, ref, options])
};

export default useIntersectionObserver;
