import React from "react";

function BaseCard({
  children,
  isFlexible = false,
  width = "w-[300px]",
  height = "h-[200px]",
  padding = "p-4",
  bgColor = "bg-white",  // ✅ Default Background Color
  boxShadow = true, // ✅ Default shadow enabled
  className = "",
}) {
  
  
  
  return (
    <div
      className={`relative rounded-[10px] border-gray-300 ${bgColor} ${padding} ${width} ${height} ${isFlexible ? "flex-1" : ""
        } ${className}`}
      style={{
        boxShadow: boxShadow ? "4px 10px 30px 0px rgba(0, 0, 0, 0.3)" : "none", // ✅ Conditional Shadow
      }}
    >
      {children}
    </div>
  );
}

export default BaseCard;
