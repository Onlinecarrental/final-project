import React from "react";
import HeadingTitle from "../../../components/heading"

// Main component that uses HeadingTitle to create the car heading section
export default function AddCarHeading() {
  return (
    <div className="w-full bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <HeadingTitle
          title="Add A car"
          paragraph="Join our business network and unlock premium services for your company"
          className="mb-6 "
        />
      </div>
    </div>
  );
}
