import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import styles from "../../resources/css/ContactPicker.module.css";

/*
  Renders a select input used for selecting a contact when creating
  a new appointment
*/
export const ContactPicker = ({ value, onChange }) => {
  const { contacts } = useContext(AppContext);
  return (
    <select onChange={onChange} value={value}
    className={styles.select_input}>
      <option value=''>Select Contact</option>
      {contacts.map(el => {
        if (el.name !== undefined) {
          return (
            <option value={String(el.id)}>{el.name}</option>
          );
        } else {
          return (
            <></>
          );
        }
      })}
    </select>
  );
};

