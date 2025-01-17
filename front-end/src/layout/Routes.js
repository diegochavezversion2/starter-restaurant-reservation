import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import NewReservation from "./NewReservation";
import NewTable from "./NewTable";
import Seating from "./Seating";
import Search from "./Search";
import EditReservation from "./EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  // const [tablesError, setTablesError] = useState(null);
  // const [tables, setTables] = useState([])
  // const [reservations, setReservations] = useState([]);
  // const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  let date = query.get("date")
  if (!date) {
    date = today();
  }

  // useEffect(loadTables, []);

  // function loadTables() {
  //   const abortController = new AbortController();
  //   setTablesError(null);
  //   listTables(abortController.signal)
  //     .then(data => setTables(data))
  //     .catch(setTablesError)
  //   return () => abortController.abort();
  // }

  // useEffect(loadReservations, [date]);

  // function loadReservations() {
  //   const abortController = new AbortController();
  //   setReservationsError(null);
  //   listReservations({ date }, abortController.signal)
  //     .then(data => setReservations(data))
  //     .catch(setReservationsError);
  //   return () => abortController.abort();
  // }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/seat">
        <Seating />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/edit">
        <EditReservation />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date? date: today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
