import { useRouter } from "next/router";
import MeetupDetail from "./MeetupDetail";
import classes from "./MeetupItem.module.css";
import Card from "../ui/Card";

function MeetupItem(props) {
  const router = useRouter(); // use hooks at the root of the component function

  function showDetailsHandler() {
    router.push("/" + props.id); // navigates programmatically to the specified route inside the parentheses
  } // props.id are passed from the parent and specify the details for the card with the given id

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
        <div className={classes.actions}>
          <button onClick={showDetailsHandler}>Show Details</button>
        </div>
      </Card>
    </li>
  );
}

export default MeetupItem;
