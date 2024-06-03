import React from "react";

const Skeleton = ({ title }: { title: string }) => {
  return (
    <div>
      <h1 className="text-primary">{title} Skeleton</h1>
    </div>
  );
};

export default Skeleton;
