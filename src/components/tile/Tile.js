import React from "react";
import { getLabel } from "../../resources/utils/utils";
import trashClosed from "../../resources/img/trash_closed.png";
import trashOpen from "../../resources/img/trash_open.png";
import styles from "../../resources/css/Tile.module.css";

/* Tile Component used for displaying contact and appointment information */
export const Tile = ({ data, handleDelete, includesOthers }) => {
  
  const handleMouseOver = ({ target }) => {
    target.src = trashOpen;
  }

  const handleMouseOut = ({ target }) => {
    target.src = trashClosed;
  }

  return (
    <div className={styles.flex_container}>
      <div className={styles.tile_container}>
        <div>
          <h3 className={styles.tile_heading}>{data.name}</h3>
          {Object.keys(data.description).map(el => {
            const label = getLabel(el);
            return (
              <p className={styles.tile_info}>{label}: {
                // Determine how to display the information based on what is being displayed
                el === 'contact' ? `You${!includesOthers ? '': ` and ${data.description[el].name}`}`: 
                (el === 'date' ? `${data.description[el].toDateString()}`:
                                `${data.description[el]}`) 
              }</p>
            )
          })}
        </div>
        <button onClick={handleDelete} className={styles.delete_btn}> { /* Used for displaying the delete
                                                                          button */ }
          <img src={trashClosed} className={styles.delete_img}
            onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} />
        </button>
      </div>
    </div>
  );

};
