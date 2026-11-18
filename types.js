/* MADE BY tools/build_pages.py. What the small card in the "Business type" menu says about
   each kind of business (script.js): the questions the assistant asks, shown in turn, and three things. */
window.YAP_TYPES = {
 "restaurants": {
  "name": "Restaurants",
  "asks": [
   "For how many people?",
   "What time on Friday?",
   "What name is the booking under?",
   "Any children in the party?"
  ],
  "notes": [
   "Takes booking requests, changes and cancellations by phone",
   "Says \"requested\", never \"booked\": you confirm each one",
   "Keep OpenTable or your paper book. Nothing to replace"
  ]
 },
 "handyman": {
  "name": "Handyman",
  "asks": [
   "What size is the TV?",
   "Which day suits you?",
   "What kind of wall is it going on?"
  ],
  "notes": [
   "Takes the job, the name and the number while you work",
   "Asks your own question for each kind of job",
   "Keep the app or notebook you schedule with. Nothing to replace"
  ]
 },
 "cleaning": {
  "name": "Cleaning",
  "asks": [
   "How many bedrooms?",
   "Is it a move-out or a regular clean?",
   "Which day suits you?"
  ],
  "notes": [
   "Takes the enquiry while you are mid-clean or driving",
   "Asks what you need to quote: bedrooms, type of clean",
   "Flags a caller who says it is urgent"
  ]
 },
 "auto": {
  "name": "Auto repair",
  "asks": [
   "What car is it?",
   "What is it doing?",
   "When can you bring it in?"
  ],
  "notes": [
   "Takes the call while you are under a car",
   "Asks the car and the problem before you call back",
   "Answers hours and location from what you give it"
  ]
 },
 "it": {
  "name": "IT support",
  "asks": [
   "What kind of device is it?",
   "Is it one computer or the whole office?",
   "When did it start?"
  ],
  "notes": [
   "Takes the call while you are on site with a client",
   "Asks the device and the problem",
   "Flags a caller who says it is urgent"
  ]
 }
};
