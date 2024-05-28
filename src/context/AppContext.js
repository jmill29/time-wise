import React, { createContext, useReducer } from 'react';
import { findIndexById } from '../resources/utils/utils';

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
                  id: state.contacts.length,
                  ...action.payload
                },
                ...state.contacts.slice(i, state.contacts.length)
              ],
              currId: i
            };
          }
        }
        return {
          ...state,
          contacts: [
            ...state.contacts,
            {
              id: state.contacts.length,
              ...action.payload
            }
          ],
          currId: state.contacts.length
        };
      } else {
        return {
          ...state,
          contacts: [{
            id: 0,
            ...action.payload
          }],
          currId: 0
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
                  id: state.appointments.length,
                  ...action.payload
                },
                ...state.appointments.slice(i, state.appointments.length)
              ],
              currId: i
            };
          }
        }
        return {
          ...state,
          appointments: [
            ...state.appointments,
            {
              id: state.appointments.length,
              ...action.payload
            }
          ],
          currId: state.appointments.length
        };
      } else {
        return {
          ...state,
          appointments: [{
            id: 0,
            ...action.payload
          }],
          currId: 0
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
  contacts: [],
  appointments: [],
  currId: -1
};

export const AppContext = createContext();

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
