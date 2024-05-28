import React, { useState } from "react";
import { AppProvider, AppContext } from './context/AppContext';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom"
import Root, { ROUTES } from "./components/root/Root";
import { AppointmentsPage } from "./containers/appointmentsPage/AppointmentsPage";
import { ContactsPage } from "./containers/contactsPage/ContactsPage";

function App() {
  const [showScrollbar, setShowScrollbar] = useState(false);

  const handleCheckboxChange = ({ target }) => {
    setShowScrollbar(target.checked);
  }

  const handleAnchorClick = (e) => {
    e.preventDefault();
    const target = document.getElementById('start');
    target.scrollIntoView({ behavior: 'smooth' })
    window.history.replaceState(null, null, '');
  }

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={ <Root/> }>
      <Route index element={ <Navigate to={ROUTES.CONTACTS} replace/> }/>
      <Route path={ROUTES.CONTACTS} element={ <ContactsPage 
        handleAnchorClick={handleAnchorClick} showScrollbar={showScrollbar}
        handleCheckboxChange={handleCheckboxChange} /> }/>
      <Route path={ROUTES.APPOINTMENTS} element={ <AppointmentsPage
        handleAnchorClick={handleAnchorClick} showScrollbar={showScrollbar}
        handleCheckboxChange={handleCheckboxChange} /> }/>
    </Route>
  ));
  
  return (
    <div style={{height: '100%'}}>
      <AppProvider>
        <RouterProvider router={router}/>
      </AppProvider>
    </div>
  );
}

export default App;
