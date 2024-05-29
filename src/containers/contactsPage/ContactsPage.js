import React, { useState, useContext, useEffect } from "react";

import { ContactForm } from "../../components/contactForm/ContactForm";
import { TileList } from "../../components/tileList/TileList";
import { AppContext } from "../../context/AppContext";
import styles from "../../resources/css/PageStyles.module.css";
import { getErrorMessage } from "../../resources/utils/utils";

export const ContactsPage = ({ handleAnchorClick, showScrollbar, handleCheckboxChange }) => {
  const { dispatch, contacts, currId } = useContext(AppContext);
  
  // The following states are used to hold contact information prior to adding
  // the contact to the contacts list.
  const [name, setName] = useState(''); // State used for storing name of contact
  const [phone, setPhone] = useState(''); // State used for storing contact's phone number
  const [email, setEmail] = useState(''); // State used for storing contact's email address
  const [error, setError] = useState(false); // State used for storing error status
  const [initialized, setInitialized] = useState(false); // State used for storing page 
                                                         // initialization status

  // Used for resetting current ID (ID of most recently added element),
  // so the page doesn't scroll when navigating to a different page.
  useEffect(() => {
    dispatch({
      type: 'RESET_CURRID'
    });
    setInitialized(true);
  }, []);
  
  /*
    Handles deletion of contacts
  */
  const handleDelete = id => {
    dispatch({
      type: 'REMOVE_CONTACT',
      payload: {
        index: id
      }
    });
  }
  
  /*
    Handles contact form submission
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Checks to see if contact already exists
    let contactExists = false;
    for (let contact of contacts) {
      if (contact.name === name) {
        contactExists = true;
        break;
      }
    }
    
    // If contact DOES NOT already exist, then the new contact
    // is added to the list of contacts.
    if (!contactExists) {
      dispatch({
        type: 'ADD_CONTACT',
        payload: {
          name,
          phone,
          email
        }
      });
      for (let setterFunc of [setName, setPhone, setEmail]) {
        setterFunc('');
      }

      // If the submission was successfully but the 'error' state is already set to TRUE,
      // the 'error' state is then set to FALSE.
      if (error) {
        setError(false);
      }
    } else {
      // If the contact DOES already exist, the 'error' state is set to true.
      setError(true);
    }
  };
  
  // Handles invalid user input
  const handleInvalid = target => {
    if (target.validity.patternMismatch) {
      target.setCustomValidity(getErrorMessage(target.id));
    } else {
      target.setCustomValidity('');
    }
  }
  
  // Handles contact name input change
  const handleNameChange = ({ target }) => {
    setName(target.value);
    handleInvalid(target);
  };
  
  // Handles contact phone number input change
  const handlePhoneChange = ({ target }) => {
    setPhone(target.value);
    handleInvalid(target);
  };
  
  // Handles contact email address input change
  const handleEmailChange = ({ target }) => {
    setEmail(target.value);
    handleInvalid(target);
  };
  
  // Packages the local states into one object to be passed into
  // the TileList component.
  const localStates = {
    name,
    phone,
    email
  };
  
  // Packages the local state setter functions into one object to 
  // be passed into the TileList component.
  const stateSetters = {
    handleNameChange,
    handlePhoneChange,
    handleEmailChange
  };

  return (
    <div style={{height: '90%'}}>
      <section className={styles.page_section}>
        <h2 className={styles.section_heading}>Add Contact</h2>
        { <ContactForm localStates={localStates} 
          stateSetters={stateSetters}
          handleSubmit={handleSubmit} /> }
      </section>
      <hr style={{height: '5px'}} />
      <section className={styles.page_section}>
        {(contacts.length <= 0) ? (<h2 className={styles.section_heading}>Contacts</h2>): 
          (<h2><a onClick={handleAnchorClick} className={styles.to_top}>Contacts</a></h2>)}
        <div className={styles.checkbox_container}>
          <label for="displayScrollbar" className={styles.checkbox_label}>Display Scrollbar:</label>
          <input type="checkbox" checked={showScrollbar} onChange={handleCheckboxChange}
            id="displayScrollbar" name="displayScrollbar" />
        </div>
        <TileList data={contacts} handleDelete={handleDelete} newElId={initialized ? currId: -1}
          showScrollbar={showScrollbar} />
      </section>
      {error ? (
        <div className={styles.popup_container}>
          <div className={styles.error_popup}>
            <h3 className={styles.error_message}>Contact Already Exists.</h3>
            <button onClick={() => setError(false)} className={styles.error_btn}>OK</button>
          </div>
        </div>): <></>}
    </div>
  );
};
