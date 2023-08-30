import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  customClassName?: string;
}

const Button = ({
  children,
  type = "button",
  disabled,
  color = "primary",
  customClassName,
  ...restProps
}: ButtonProps): JSX.Element => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        "inline-flex h-11 items-center justify-center gap-x-2 rounded-lg border px-4 text-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
        customClassName
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};
export default Button;
