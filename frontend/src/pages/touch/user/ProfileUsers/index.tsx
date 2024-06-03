import React from "react";

const ProfileUsers = ({
  title,
  subPath,
}: {
  title: string;
  subPath: string;
}) => {
  return (
    <div>
      <h2>
        {title} {subPath} page
      </h2>
    </div>
  );
};

export default ProfileUsers;
