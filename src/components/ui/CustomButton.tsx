import React from "react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`custom-btn font-serif px-4 py-2 rounded transition-all duration-200 text-white font-semibold focus:outline-none focus:ring-0 ${className}`}
      {...props}
    >
      {children}
      <style jsx>{`
        .custom-btn {
          background: rgba(191, 201, 191, 1);
          border: none;
          color: #fff;
          box-shadow: 0 2px 8px 0 #BFC9BF33;
        }
        .custom-btn:hover {
          background: rgba(251, 240, 218, 1);
          border: 1px solid rgba(39, 31, 24, 1);
          color: #271F18;
        }
      `}</style>
    </button>
  );
};
