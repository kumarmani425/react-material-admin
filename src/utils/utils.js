// utils.js

/**
 * Formats a given date string to 'DD/MM/YYYY' format
 * @param {string} dateStr - The date string (e.g., "2025-03-22T00:00:00.000Z")
 * @returns {string} - Formatted date (e.g., "22/03/2025")
 */
export function formatDate(dateStr) {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
  }
  
  /**
   * Calculates the number of days between two dates
   * @param {string | Date} startDate - Start date (e.g., "2025-03-10")
   * @param {string | Date} endDate - End date (e.g., "2025-03-22")
   * @returns {number} - Difference in days
   */

  export function getDaysBetweenDates(startDate, endDate) {
    if (!startDate || !endDate) return 0; // Prevent errors
  
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
  
    if (isNaN(date1) || isNaN(date2)) return 0; // Handle invalid dates
  
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)); // Convert ms to days
  }
  
  export function interestCalculation(pAmount,interestRate,days ) {

    
    const interestAmount = (pAmount * parseInt(interestRate) * 1) / 100; 
    const roundInterestAmount = Math.round(interestAmount /365*days)
    return roundInterestAmount
    
  }
  /**
   * Stores data in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Data to store
   */
  export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  /**
   * Retrieves data from localStorage
   * @param {string} key - Storage key
   * @returns {any} - Parsed data or null
   */
  export function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  
  /**
   * Capitalizes the first letter of a given string
   * @param {string} str - Input string
   * @returns {string} - String with the first letter capitalized
   */
  export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  