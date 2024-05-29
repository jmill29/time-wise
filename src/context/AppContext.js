import React, { createContext, useReducer } from 'react';
import { findIndexById } from '../resources/utils/utils';

/*
  App Reducer used to manage global state
*/
export const AppReducer = (state, action) => {
  let index;
  switch (action.type) {
    case 'ADD_CONTACT':
      if (state.contacts.length > 0) {
        for (let i = 0; i < state.contacts.length; i++) {
          if (action.payload.name < state.contacts[i].name) {
            return {
              ...state,
              contacts: [
                ...state.contacts.slice(0, i),
                {
                  id: state.idCounter.contacts,
                  ...action.payload
                },
                ...state.contacts.slice(i, state.contacts.length)
              ],
              currId: i,
              idCounter: {...state.idCounter, contacts: state.idCounter.contacts + 1}
            };
          }
        }
        return {
          ...state,
          contacts: [
            ...state.contacts,
            {
              id: state.idCounter.contacts,
              ...action.payload
            }
          ],
          currId: state.contacts.length,
          idCounter: {...state.idCounter, contacts: state.idCounter.contacts + 1}
        };
      } else {
        return {
          ...state,
          contacts: [{
            id: state.idCounter.contacts,
            ...action.payload
          }],
          currId: 0,
          idCounter: {...state.idCounter, contacts: state.idCounter.contacts + 1}
        };
      }

    case 'REMOVE_CONTACT':
      index = findIndexById(state.contacts, action.payload.index);
      return {
        ...state,
        contacts: [
          ...state.contacts.slice(0, index),
          ...state.contacts.slice(index+1, state.contacts.length)
        ]
      };

    case 'ADD_APPT':
      if (state.appointments.length > 0) {
        for (let i = 0; i < state.appointments.length; i++) {
          if (action.payload.date < state.appointments[i].date) {
            return {
              ...state,
              appointments: [
                ...state.appointments.slice(0, i),
                {
                  id: state.idCounter.appointments,
                  ...action.payload
                },
                ...state.appointments.slice(i, state.appointments.length)
              ],
              currId: i,
              idCounter: {...state.idCounter, appointments: state.idCounter.appointments + 1}
            };
          }
        }
        return {
          ...state,
          appointments: [
            ...state.appointments,
            {
              id: state.idCounter.appointments,
              ...action.payload
            }
          ],
          currId: state.appointments.length,
          idCounter: {...state.idCounter, appointments: state.idCounter.appointments + 1}
        };
      } else {
        return {
          ...state,
          appointments: [{
            id: state.idCounter.appointments,
            ...action.payload
          }],
          currId: 0,
          idCounter: {...state.idCounter, appointments: state.idCounter.appointments + 1}
        };
      }

    case 'REMOVE_APPT':
      index = findIndexById(state.appointments, action.payload.index);
      return {
        ...state,
        appointments: [
          ...state.appointments.slice(0, index),
          ...state.appointments.slice(index+1, state.appointments.length)
        ]
      };

    case 'RESET_CURRID':
      return {
        ...state,
        currId: -1
      };

    default:
      return state;
  };
};

const initialState = {
  contacts: [], // Used to store contacts list
  appointments: [], // Used to store appointments list
  currId: -1, // Used to store index of most recently added element
  idCounter: {contacts: 0, appointments: 0} // Used to keep track of the indexes
                                            // That have been assigned to elements.
};

// App Context used to access global state
export const AppContext = createContext();

// App Provider used to render AppContext element and React app
export const AppProvider = props => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider
      value={{
        contacts: state.contacts,
        appointments: state.appointments,
        currId: state.currId,
        dispatch
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
