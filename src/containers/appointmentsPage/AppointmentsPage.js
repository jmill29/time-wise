import React, { useState, useContext, useEffect } from "react";

import { AppointmentForm } from "../../components/appointmentForm/AppointmentForm";
import { TileList } from "../../components/tileList/TileList";
import { AppContext } from "../../context/AppContext";
import { findIndexById, getTodayString, getCurrTimeString, 
  doesAppointmentExist } from "../../resources/utils/utils";
import styles from "../../resources/css/PageStyles.module.css";

export const AppointmentsPage = ({ handleAnchorClick, showScrollbar, handleCheckboxChange }) => {
  const { dispatch, appointments, contacts, currId } = useContext(AppContext);

  /*
  Define state variables for 
  appointment info
  */
  const [name, setName] = useState('');  // State used for storing name of appointment
  const [contact, setContact] = useState({name: 'John Doe', 
    id: '', email: '', phone: ''}); // State used for storing contact of appointment
  const [date, setDate] = useState(getTodayString()); // State used for storing date of appointment
  const [time, setTime] = useState(getCurrTimeString());  // State used for storing time of appointment
  const [currTime, setCurrTime] = useState(getCurrTimeString());  // State used for storing current time of day
  const [initialized, setInitialized] = useState(false); // State used for storing initialization state of page
  const [error, setError] = useState(false); // State used for storing whether there was an error adding an
                                             // appointment or not

  // Used for updating current time of day
  setInterval(() => {
    setCurrTime(getCurrTimeString());
  }, 1000);
  
  // Used for resetting current ID (ID of most recently added element),
  // so the page doesn't scroll when navigating to a different page.
  useEffect(() => {
    dispatch({
      type: 'RESET_CURRID'
    });
    setInitialized(true);
  }, []);
  
  // Used for dynamically updating minimum value of time and date states
  useEffect(() => {
    updateTime(date);
  }, [currTime]);
  
  /*
    If the selected date is today's date, make sure the selected
    time is no later than the current time. Also makes sure the
    selected date is no later than today's date.
  */
  function updateTime(currDate) {
    if (currDate === getTodayString()) {
      if (time.split(':')[0] < currTime.split(':')[0]) {
        setTime(currTime);
      } else if (time.split(':')[0] === currTime.split(':')[0]) {
        if (time.split(':')[1] < currTime.split(':')[1]) {
          setTime(currTime);
        }
      }
    } else {
      if (currDate.split('-')[0] < getTodayString().split('-')[0]) {
        setDate(getTodayString());
        setTime(currTime);
      } else if (currDate.split('-')[1] < getTodayString().split('-')[1]) {
        if (currDate.split('-')[0] === getTodayString().split('-')[0]) {
          setDate(getTodayString());
          setTime(currTime);
        }
      } else if (currDate.split('-')[2] < getTodayString().split('-')[2]) {
        if (currDate.split('-')[0] === getTodayString().split('-')[0] 
            && currDate.split('-')[1] === getTodayString().split('-')[1]) {
          setDate(getTodayString());
          setTime(currTime);
        }
      }
    }
  };
  
  /*
    Handles deletion of appointments
  */
  const handleDelete = id => {
    dispatch({
      type: 'REMOVE_APPT',
      payload: {
        index: id
      }
    });
  };
  
  /*
    Handles Appointment Form submission
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Checks to see if the appointment already exists
    let appointmentExists = false;
    const dateObj = new Date(Number(date.split('-')[0]), Number(date.split('-')[1])-1, Number(date.split('-')[2]));
    dateObj.setHours(Number(time.split(':')[0]), Number(time.split(':')[1]));
    let newAppointment = {
      name,
      contact,
      date: dateObj,
      time
    }
    appointmentExists = doesAppointmentExist(appointments, newAppointment);
    
    // If the appointment DOES NOT already exist, then the new appointment is
    // added to the list of appointments
    if (!appointmentExists) {
      dispatch({
        type: 'ADD_APPT',
        payload: newAppointment
      });
      
      // If the submission was successfully but the 'error' state is already set to TRUE,
      // the 'error' state is then set to FALSE.
      if (error) {
        setError(false);
      }
    } else {
      // If the appointment DOES already exist, the 'error' state is set to true.
      if (!error) {
        setError(true);
      }
    }
  };
  
  // Handles appointment name input change
  const handleNameChange = ({ target }) => {
    setName(target.value);
  };
  
  // Handles appointment contact input change
  const handleContactChange = ({ target }) => {
    if (target.value === '') { // If no contact was selected, the 'contact' state is reset.
      setContact({
        name: '',
        id: '',
        email: '',
        phone: ''
      });
    } else { // Else, the 'contact' state is set to the selected contact.
      setContact(contacts[findIndexById(contacts, Number(target.value))]);
    }
  };
  
  // Handles appointment Date input change
  const handleDateChange = ({ target }) => {
    setDate(target.value);
    updateTime(target.value); // Looks to see if the selected date is earlier than
                              // today's date. If so, it sets the value of 'Date'
                              // to the current date.
  };
  
  // Handles appointment Time input change
  const handleTimeChange = ({ target }) => {
    if (date === getTodayString()) { // Looks to see if the selected time is earlier than the current time
                                     // (taking into account the date). If so, the input change is not
                                     // registered. This prevents users from scheduling appointments that
                                     // have already passed.
      if (target.value.split(':')[0] < currTime.split(':')[0]) {
        return;
      } else if (target.value.split(':')[0] === currTime.split(':')[0]
                  && target.value.split(':')[1] < currTime.split(':')[1]) {
        return;
      } else {
        setTime(target.value);
      }
    } else { // Else, the input change is registered.
      setTime(target.value);
    }
  };
  
  // Packages the local states into one object to be passed into
  // the TileList component.
  const localStates = {
    name,
    contact,
    date,
    time
  };
  
  // Packages the local state setter functions into one object to 
  // be passed into the TileList component.
  const stateSetters = {
    handleNameChange,
    handleContactChange,
    handleDateChange,
    handleTimeChange
  };

  return (
    <div style={{height: '90%'}}>
      <section className={styles.page_section}>
        <h2>Add Appointment</h2>
        <AppointmentForm localStates={localStates}
          stateSetters={stateSetters} handleSubmit={handleSubmit} />
      </section>
      <hr style={{height: '5px'}} />
      <section className={styles.page_section}>
        {(appointments.length <= 0) ? (<h2>Appointments</h2>): (<h2><a className={styles.to_top} 
                                                                      onClick={handleAnchorClick}>
          Appointments
        </a></h2>)}
        <div className={styles.checkbox_container}>
          <label for="displayScrollbar" className={styles.checkbox_label}>Display Scrollbar:</label>
          <input type="checkbox" checked={showScrollbar} onChange={handleCheckboxChange}
          id="displayScrollbar" />
        </div>
        <TileList data={appointments} handleDelete={handleDelete} newElId={initialized ? currId: -1}
          showScrollbar={showScrollbar} />
      </section>
      {error ? (
        <div className={styles.popup_container}>
          <div className={styles.error_popup}>
            <h3 className={styles.error_message}>Appointment Already Exists.</h3>
            <button onClick={() => setError(false)} className={styles.error_btn}>OK</button>
          </div>
        </div>): <></>}
    </div>
  );
};
