import React, { useEffect } from "react";
import {Tile} from "../tile/Tile";
import styles from "../../resources/css/TileList.module.css";

/*
  Renders list of Tile components to display the contact or appointment
  information
*/
export const TileList = ({ data, handleDelete, newElId, showScrollbar }) => {
  
  // Used to mark the last element added so the page scrolls into view of that element when it's added
  useEffect(() => {
    let target;
    if (newElId === 0) {
      target = document.getElementById('start');
    } else {
      target = document.getElementById('end');
    }
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, null, '');
    }
  }, [newElId]);

  return (
    <div className={(showScrollbar && data.length > 1) ?
      styles.outer_container_with_scrollbar:
      styles.outer_container_no_scrollbar}>
      <div className={(showScrollbar && data.length > 1) ?
        styles.scrollbar_container_with_scrollbar:
        styles.scrollbar_container_no_scrollbar}>
        <div className={styles.flex_container}>
          <ul style={{width: 'fit-content', marginTop: 0}}>
            {data.map((el, index) => {
              let formattedElement = {
                name: '',
                description: {}
              };
              for (let key in el) { // Formats the elements of the contacts (or appointments) list
                                    // so it is displayed correctly.
                if (key === 'name') {
                  formattedElement[key] = el[key];
                } else if (key !== 'id') {
                  formattedElement['description'][key] = el[key];
                }
              }
              let includesOthers = false; // Used to determine if the appointment includes only the user
                                          // or the user and somebody else. This is done so it is displayed
                                          // properly.
              if (el.contact) {
                if (el.contact.id !== '') {
                  includesOthers = true;
                }
              }
              return (
                <div id={(index === 0) ? 'start': // ID is used to mark the most recently added element so the 
                                                  // page scrolls into view of it when it is added.
                  ((index === newElId) ? 'end': '')
                }>
                  <Tile data={formattedElement} handleDelete={() => handleDelete(el.id)}
                    includesOthers={includesOthers} />
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
