import React from 'react';

export interface SiTextSizedProps<T extends React.ElementType> {
  children: React.ReactNode;
  className?: string;
  as?: T;
  props?: Omit<React.ComponentPropsWithoutRef<T>, 'children' | 'className'>;
}

export const SiTextSizedP = <T extends React.ElementType = 'p'>({
  children,
  className,
  as,
  props,
}: SiTextSizedProps<T>) => {
  const Component = as || 'p';
  return (
    <Component
      className={`sm:text-sm md:text-base 2xl:text-lg ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const SiTextSizedSpan = <T extends React.ElementType = 'span'>({
  children,
  className,
  as,
  props,
}: SiTextSizedProps<T>) => {
  const Component = as || 'span';
  return (
    <Component
      className={`sm:text-sm md:text-base 2xl:text-lg ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const SiTextSizedDiv = <T extends React.ElementType = 'div'>({
  children,
  className,
  as,
  props,
}: SiTextSizedProps<T>) => {
  const Component = as || 'div';
  return (
    <Component
      className={`sm:text-sm md:text-base 2xl:text-lg ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
