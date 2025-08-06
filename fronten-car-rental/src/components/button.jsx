import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Button({
  title,
  iconRight = null,
  to = null,
  height = "50px",
  width = "150px",
  bgColor = "bg-[#5937e0]",
  textColor = "text-white",
  hoverBgColor = "hover:bg-[#a9a9a9]",
  hoverTextColor = "hover:text-white",
  rounded = "rounded-[10px]",
  shadow = "shadow-lg",
  onClick = null,
  className = "",
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (to) navigate(to);
  };

  const classes = `font-jakarta text-[20px] font-[500] px-4 lg:px-5 flex items-center justify-center gap-2 
    ${bgColor} ${textColor} ${hoverBgColor} ${hoverTextColor} ${rounded} ${shadow} transition-all duration-300 ${className}`;

  return (
    <button
      className={classes}
      style={{ height, width }}
      type="button"
      onClick={to || onClick ? handleClick : undefined}
    >
      {title}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
}

export default Button;
