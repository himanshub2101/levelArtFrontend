import { createContext, useState } from "react";

const UserType = createContext();

const UserContext = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [profilePictureUri, setProfilePictureUri] = useState("");

  return (
    <UserType.Provider value={{ userId, setUserId,profilePictureUri, setProfilePictureUri }}>
      {children}
    </UserType.Provider>
  );
};

export { UserType, UserContext };
