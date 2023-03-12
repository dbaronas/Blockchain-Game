import React from "react";

import { Link } from "react-router-dom";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./UserItem.css";

const UserItem = props => {
  return (
    <li className="user-item">
      {/* <div className="user-item__content"> */}
        <Card className="user-item__content">
          <Link to={`/${props.id}/nfts`}>
            <div className="user-item__image">
              {/* <img src={props.image} alt={props.name} /> */}
              <Avatar image={props.image} alt={props.name} />
            </div>
            <div className="user-item__info">
              <h2>{props.name}</h2>
            </div>
          </Link>
        </Card>
      {/* </div> */}
    </li>
  );
};

export default UserItem;