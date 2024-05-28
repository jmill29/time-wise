import React, { useState, useContext, useEffect } from "react";

import { ContactForm } from "../../components/contactForm/ContactForm";
import { TileList } from "../../components/tileList/TileList";
import { AppContext } from "../../context/AppContext";
import styles from "../../resources/css/PageStyles.module.css";
import { getErrorMessage } from "../../resources/utils/utils";

export const ContactsPage = ({ handleAnchorClick, showScrollbar, handleCheckboxChange }) => {
  const { dispatch, contacts, currId } = useContext(AppContext);
  /*
  Define state variables for 
  contact info and duplicate check
  */
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [initialized, setInitialized] = useState(false);
  //const [showScrollbar, setShowScrollbar] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'RESET_CURRID'
    });
    setInitialized(true);
  }, []);

  const handleDelete = id => {
    dispatch({
      type: 'REMOVE_CONTACT',
      payload: {
        index: id
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let contactExists = false;
    for (let contact of contacts) {
      if (contact.name === name) {
        contactExists = true;
        break;
      }
    }

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
      if (error) {
        setError(false);
      }
    } else {
      setError(true);
    }
  };

  const handleInvalid = target => {
    if (target.validity.patternMismatch) {
      target.setCustomValidity(getErrorMessage(target.id));
    } else {
      target.setCustomValidity('');
    }
  }
  
  const handleNameChange = ({ target }) => {
    setName(target.value);
    handleInvalid(target);
  };

  const handlePhoneChange = ({ target }) => {
    setPhone(target.value);
    handleInvalid(target);
  };

  const handleEmailChange = ({ target }) => {
    setEmail(target.value);
    handleInvalid(target);
  };

  /*const handleCheckboxChange = ({ target }) => {
    setShowScrollbar(target.checked);
  }*/

  const localStates = {
    name,
    phone,
    email
  };

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
