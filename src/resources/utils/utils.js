/*
  Scans dictionary array and returns the array index
  that matches the given id
*/
export const findIndexById = (arr, id) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }
  return -1;
};

/*
  Returns an appropriate label based on the
  dictionary key passed in as the argument 
  (for display purposes).
*/
export const getLabel = (dictKey) => {
  switch (dictKey) {
    case 'phone':
      return 'Phone Number';
    case 'email':
      return 'Email Address';
    case 'contact':
      return 'Who?';
    case 'date':
      return 'When?';
    case 'time':
      return 'What time?';
    default:
      return dictKey;
  }
};

/*
  Compares two appointments. If they are equal to one
  another, then the function returns TRUE. Otherwise,
  it returns FALSE.
*/
const compareAppointments = (appointment, toCompare) => {
  let isEqual = true;
  for (let key of Object.keys(appointment)) {
    if (key === 'contact') {
      if (appointment[key].name !== toCompare[key].name) {
        isEqual = false;
        break;
      }
    } else if (key === 'date') {
      if (appointment[key].toString() !== toCompare[key].toString()) {
        isEqual = false;
        break;
      }
    } else if (key !== 'id') {
      if (appointment[key] !== toCompare[key]) {
        isEqual = false;
        break;
      }
    }
  }

  return isEqual;
};

/*
  Scans through appointments list to see if the new appointment 
  that the user is attempting to add doesn't already exist. If
  the appointment already exists, the function returns TRUE. 
  Otherwise, it returns FALSE.
*/
export const doesAppointmentExist = (appointmentsList, newAppointment) => {
  for (let appointment of appointmentsList) {
    if (compareAppointments(appointment, newAppointment)) {
      return true;
    }
  }
}

/*
  Returns error message to display when the user-input
  doesn't match pattern requirements. The error message
  that is displayed depends on the information being
  requested.
*/
export const getErrorMessage = id => {
  switch (id) {
    case 'contact_name':
      return "Please enter both the first and last name.";
    case 'contact_phone':
      return "Please use the\nfollowing format: (xxx)-xxx-xxxx";
    case 'contact_email':
      return "Please enter a valid email address.";
  }
};

/*
  Returns the current date in string format.
*/
export const getTodayString = () => {
  const todaysDate = new Date();
  let todaysDateStr_day = todaysDate.getDate().toString();
  let todaysDateStr_month = (todaysDate.getMonth() + 1).toString();
  let todaysDateStr_year = todaysDate.getFullYear().toString();
  if (Number(todaysDateStr_day) < 10) {
    todaysDateStr_day = '0' + todaysDateStr_day;
  }
  if (Number(todaysDateStr_month) < 10) {
    todaysDateStr_month = '0' + todaysDateStr_month;
  }
  let todaysDateStr = todaysDateStr_year + '-' + todaysDateStr_month + '-' + todaysDateStr_day;
  return todaysDateStr;
};

/*
  Returns the current time of day in string format.
*/
export const getCurrTimeString = () => {
  const todaysDate = new Date();
  let currHour = todaysDate.getHours().toString();
  let currMin = todaysDate.getMinutes().toString();
  if (Number(currHour) < 10) {
    currHour = '0' + currHour;
  } 
  if (Number(currMin) < 10) {
    currMin = '0' + currMin;
  }
  let currTimeString = currHour + ':' + currMin;
  return currTimeString;
};
