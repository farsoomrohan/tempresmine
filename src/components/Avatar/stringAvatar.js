import React from "react";
import Avatar from "@mui/material/Avatar";

function StringAvatar(props) {
  const avatarDisplay = (name) => {
    if (!name) return { sx: { bgcolor: "#999999" }, children: "" }; // Return empty if no name

    // Split name by space for first and last name, comma for special cases
    const parts = name.includes(",") ? name.split(",").map(part => part.trim()) : name.split(" ").map(part => part.trim());
    let initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];

    return {
      sx: {
        bgcolor: "#999999",
      },
      children: initials.toUpperCase(), // Ensure initials are uppercase
    };
  };

  return (
    <div>
      <Avatar {...avatarDisplay(props?.username)} />
    </div>
  );
}

export default StringAvatar;