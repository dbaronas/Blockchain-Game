import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  // ARRAY OF OBJECTS,mock up data
  const USERS = [
    {
      id: "u1",
      name: "Arthur",
      image:
        "https://www.collater.al/wp-content/uploads/2022/01/bored-ape-collater.al-cover.jpg",
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
