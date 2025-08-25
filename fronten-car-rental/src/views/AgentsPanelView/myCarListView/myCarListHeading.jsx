import React from "react";
import HeadingTitle from "../../../components/heading";

export default function MyCarListHeading() {
  return (
    <div className="p-8 bg-white">
      <HeadingTitle
        title="My Car List"
        paragraph="Here you can manage your cars"
      />
    </div>
  );
}