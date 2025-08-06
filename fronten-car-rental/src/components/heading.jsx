import React from "react";

export default function HeadingTitle({
    title,
    paragraph = "",
    className = "",
}) {
    return (
        <div className={`text-center ${className}`}>
            <h2
                className="text-[40px] font-medium font-poppins text-black mx-auto"
                style={{ width: "max-content", padding: "0 10px" }}
            >
                {title}
            </h2>
            {paragraph && (
                <p className="text-base font-poppins text-black mt-2 max-w-[600px] mx-auto">
                    {paragraph}
                </p>
            )}
        </div>
    );
}
