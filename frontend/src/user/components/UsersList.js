import React from "react";
import "./UsersList.css";
import UserItem from "./UserItem";

const UsersList = props => {
  if (props.items.lenght === 0) {
    return (
      <div className="center">
        <h2>No users found</h2>
      </div>
    );
  }

  // passes data to the user item we get from props, every item is (user)
  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
        />
      ))}
    </ul>
  );
};

export default UsersList;
