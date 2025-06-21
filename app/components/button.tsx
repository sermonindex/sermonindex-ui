import {
  ButtonHTMLAttributes,
  FC,
  MouseEventHandler,
  ReactNode,
  TouchEvent,
} from 'react';

/**
 * Props for a shared and mobile friendly button component.
 * It extends all standard HTML button attributes.
 */
interface SiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The content to be displayed inside the button.
   * Can be text, an icon, or any other React node.
   */
  children: ReactNode;
  /**
   * A single callback function to be executed when the button is clicked
   * or tapped. It handles both desktop clicks and mobile taps.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * A button component that reliably handles both desktop `onClick` and mobile
 * `onTouchEnd` events, preventing the common "double tap" or "ghost click"
 * issue on touch devices.
 */
export const SiButton: FC<SiButtonProps> = ({
  children,
  onClick,
  ...rest // Passes down all other props like `className`, `aria-label`, `disabled`, etc.
}) => {
  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    // 1. Check if an onClick handler was provided.
    if (onClick) {
      // 2. Prevent the browser from firing a "compatibility" click event.
      //    This is the key to avoiding the action firing twice.
      e.preventDefault();

      // 3. Execute the provided onClick handler.
      //    We cast the TouchEvent to 'any' to satisfy the MouseEvent type
      //    expected by onClick, as the core action is what matters here.
      onClick(e as any);
    }
  };

  return (
    <button onClick={onClick} onTouchEnd={handleTouchEnd} {...rest}>
      {children}
    </button>
  );
};
