import React from "react";
import styles from "../../resources/css/FormStyles.module.css";

/*
  Renders a form used for adding a new contact
*/
export const ContactForm = ({ localStates, stateSetters, handleSubmit }) => {
  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text"
          value={localStates.name}
          onChange={stateSetters.handleNameChange}
          pattern="[A-Za-z'\-]+ [A-Za-z'\-]+"
          placeholder="Enter name here..."
          className={styles.form_input}
          id="contact_name"
          required />
        <input type="tel" 
          value={localStates.phone} 
          onChange={stateSetters.handlePhoneChange} 
          pattern="\((\d{3})\)-(\d{3})-(\d{4})"
          placeholder="Enter phone # here..."
          className={styles.form_input}
          id="contact_phone"
          required />
        <input type="email"
          value={localStates.email}
          onChange={stateSetters.handleEmailChange}
          pattern="[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}"
          placeholder="Enter email here..."
          className={styles.form_input}
          id="contact_email"
          required />
        <div className={styles.submit_btn}>
          <input type="submit" value="Add Contact" />
        </div>
      </form>
    </>
  );
};
