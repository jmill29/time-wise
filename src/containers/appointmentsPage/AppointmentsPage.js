import React, { useState, useContext, useEffect } from "react";

import { AppointmentForm } from "../../components/appointmentForm/AppointmentForm";
import { TileList } from "../../components/tileList/TileList";
import { AppContext } from "../../context/AppContext";
import { findIndexById, getTodayString, getCurrTimeString, 
  updateClock, doesAppointmentExist } from "../../resources/utils/utils";
import styles from "../../resources/css/PageStyles.module.css";

export const AppointmentsPage = ({ handleAnchorClick, showScrollbar, handleCheckboxChange }) => {
  const { dispatch, appointments, contacts, currId } = useContext(AppContext);

  /*
  Define state variables for 
  appointment info
  */
  const [name, setName] = useState('');
  const [contact, setContact] = useState({name: 'John Doe', id: '', email: '', phone: ''});
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState(getCurrTimeString());
  const [currTime, setCurrTime] = useState(getCurrTimeString());
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(false);

  setInterval(() => {
    setCurrTime(updateClock())
  }, 1000);

  useEffect(() => {
    dispatch({
      type: 'RESET_CURRID'
    });
    setInitialized(true);
  }, []);

  useEffect(() => {
    updateTime(date);
  }, [currTime]);

  function updateTime(currDate) { // If the selected date is today's date, make sure the selected
                                    // time is no later than the current time. Also makes sure the
                                    // selected date is no later than today's date.
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

  const handleDelete = id => {
    dispatch({
      type: 'REMOVE_APPT',
      payload: {
        index: id
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
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

    if (!appointmentExists) {
      dispatch({
        type: 'ADD_APPT',
        payload: newAppointment
      });
      
      if (error) {
        setError(false);
      }
    } else {
      if (!error) {
        setError(true);
      }
    }
  };

  const handleNameChange = ({ target }) => {
    setName(target.value);
  };

  const handleContactChange = ({ target }) => {
    if (target.value === '') {
      setContact({
        name: '',
        id: '',
        email: '',
        phone: ''
      });
    } else {
      setContact(contacts[findIndexById(contacts, Number(target.value))]);
    }
  };

  const handleDateChange = ({ target }) => {
    setDate(target.value);
    updateTime(target.value);
  };

  const handleTimeChange = ({ target }) => {
    if (date === getTodayString()) {
      if (target.value.split(':')[0] < currTime.split(':')[0]) {
        return;
      } else if (target.value.split(':')[0] === currTime.split(':')[0]
                  && target.value.split(':')[1] < currTime.split(':')[1]) {
        return;
      } else {
        setTime(target.value);
      }
    } else {
      setTime(target.value);
    }
  };

  const localStates = {
    name,
    contact,
    date,
    time
  };

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
