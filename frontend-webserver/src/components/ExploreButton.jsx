import React from "react";

const ExploreButton = ({ styles }) => {
  return (
    <button
      type="button"
      className={`py-4 px-6 bg-gold-gradient font-poppins font-medium text-[1.1rem] text-primary outline-none ${styles} rounded-[0.7rem]`}
    >
      Explore
    </button>
  );
};

export default ExploreButton;
