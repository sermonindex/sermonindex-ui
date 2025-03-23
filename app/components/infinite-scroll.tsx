import { useEffect, useRef } from 'react';
import { Spinner } from './spinner';

export interface InfiniteScrollProps {
  fetchData: () => void;
  loading: boolean;
  error: string | null;
  children?: React.ReactNode;
}

export const InfiniteScroll = ({
  fetchData,
  loading,
  error,
  children,
}: InfiniteScrollProps) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!loading) {
            fetchData();
          }
        }
      },
      { threshold: 1 },
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  return (
    <>
      {children}
      <div ref={observerTarget} />
      {loading && <Spinner />}
      {error && <div>{error}</div>}
    </>
  );
};
