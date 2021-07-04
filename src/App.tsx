import { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { HomeView } from "./views/HomeView";
import { RoomView } from "./views/RoomView";
import './App.css';

export const App: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomeView} />
        {/* <Route path="/create-room" component={CreateRoomView} />
        <Route path="/join-room" component={JoinRoomView} /> */}
        <Route path="/room" exact component={RoomView} />
        <Route path="/room/:roomId" exact component={RoomView} />
        <Redirect path="*" to="/" />
      </Switch>
    </Router>
  );
}
