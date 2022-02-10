# PERIODIC TABLES - A RESTAURANT RESERVATION SYSTEM
## Thinkful Final Capstone Project
check it out here! (but please allow up to a minute for the page to load, this is a free deployment on Heroku :)

[https://mfwalchak-capstone-client.herokuapp.com/dashboard](https://mfwalchak-capstone-client.herokuapp.com/dashboard)


A full-stack app using React.js, CSS, Node.js, Express and PostreSQL.

# SUMMARY  
![navmenu](https://user-images.githubusercontent.com/81874273/152538149-adfc9c8a-b70d-4725-8ff9-19f785dce0f8.JPG)  

A simple application to create and manage reservations in your restaurant. Add your restaurant's tables to the floorplan by clicking NEW TABLE and create new reservations with your customer information by clicking NEW RESERVATION.  
Periodic Tables will allow you to seat that reservation upon arrival, notifying you that the guest is currently seated and that table is occupied. 
When your guest is finished the table can be cleared and set again for the next reservation. 
Existing reservations can be found using SEARCH by the mobile phone number used to make the reservation, and easily updated using the EDIT button or cancelled with the CANCEL button.  

![Screenshot (52)](https://user-images.githubusercontent.com/81874273/152592349-b59da428-31d1-43f3-8127-3202f050fab8.png)
![Screenshot (53)](https://user-images.githubusercontent.com/81874273/152592365-2bc39534-3a1f-4d0c-a25a-46cff3de79e3.png)
![Screenshot (54)](https://user-images.githubusercontent.com/81874273/152592423-ec7cb1b8-63ab-421f-a558-34afd3c081ab.png)


# API DOCUMENTATION
RESERVATIONS  
GET /reservations  
GET /reservations?date=YYYY-MM-DD  
POST /reservations  
PUT /reservations/:reservation_id  
PUT /reservations/:reservation_id/status  

TABLES  
GET /tables  
POST /tables  
PUT /tables/:table_id/seat  
DELETE /tables/:table_id/seat  

# INSTALLATION INSTRUCTIONS
- Clone this repository into a new local folder.
- The project is designed as a monorepo, cd into the back-end directory and run npm install. 
- Then cd into the front-end directory and run npm install. 
- Create a new local instance of the program from the root directory with npm run start:dev to begin exploring the features of the app!
