import React from "react";
import { ContactPicker } from "../contactPicker/ContactPicker";
import { getTodayString, getCurrTimeString } from "../../resources/utils/utils";
import styles from "../../resources/css/FormStyles.module.css";

/*const getTodayString = () => {
  const [month, day, year] = new Date()
    .toLocaleDateString("en-US")
    .split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};*/

export const AppointmentForm = ({ localStates, stateSetters, handleSubmit }) => {
  let contactName = String(localStates.contact.id);
  const apptName = localStates.name || '';
  
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input type="text"
        value={apptName}
        onChange={stateSetters.handleNameChange}
        placeholder="Enter appt label here..."
        className={styles.form_input}
        required />
      <ContactPicker value={contactName}
        onChange={stateSetters.handleContactChange} />
      <input type="date" 
        value={localStates.date}
        onChange={stateSetters.handleDateChange}
        min={getTodayString()}
        className={styles.form_input}
        required />
      <input type="time"
        value={localStates.time}
        onChange={stateSetters.handleTimeChange}
        className={styles.form_input}
        required />
      <div className={styles.submit_btn}>
        <input type="submit" value="Add Appointment" /> 
      </div>
    </form>
  );
};

