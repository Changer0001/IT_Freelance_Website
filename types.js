/* MADE BY tools/build_pages.py. What the small card in the "Business type" menu says about
   each kind of business (script.js): the question the assistant asks, and three things. */
window.YAP_TYPES = {
 "restaurants": {
  "name": "Restaurants",
  "ask": "For how many people?",
  "notes": [
   "Takes booking requests, changes and cancellations by phone",
   "Says \"requested\", never \"booked\": you confirm each one",
   "Keep OpenTable or your paper book. Nothing to replace"
  ]
 },
 "handyman": {
  "name": "Handyman",
  "ask": "What size is the TV?",
  "notes": [
   "Takes the job, the name and the number while you work",
   "Asks your own question for each kind of job",
   "Keep the app or notebook you schedule with. Nothing to replace"
  ]
 },
 "cleaning": {
  "name": "Cleaning",
  "ask": "How many bedrooms?",
  "notes": [
   "Takes the enquiry while you are mid-clean or driving",
   "Asks what you need to quote: bedrooms, type of clean",
   "Flags a caller who says it is urgent"
  ]
 },
 "auto": {
  "name": "Auto repair",
  "ask": "What car is it?",
  "notes": [
   "Takes the call while you are under a car",
   "Asks the car and the problem before you call back",
   "Answers hours and location from what you give it"
  ]
 },
 "it": {
  "name": "IT support",
  "ask": "What kind of device is it?",
  "notes": [
   "Takes the call while you are on site with a client",
   "Asks the device and the problem",
   "Flags a caller who says it is urgent"
  ]
 }
};
