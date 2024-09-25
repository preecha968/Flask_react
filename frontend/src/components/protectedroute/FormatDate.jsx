import React from 'react';

const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('th-TH', options).format(date);
};



export default formatDate;
