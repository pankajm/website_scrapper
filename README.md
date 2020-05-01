# website_scrapper
This repo contains the crawler application which crawls Swiggy and Zomato websites with user entered city and cuisine and returns the restaurants with similar available cuisine with their price.

## Process to start application
1. Clone this repo by following command 

   git clone https://github.com/pankajm/website_scrapper.git

2. Go to target folder and run command 

   *npm install* 

   This will install all the dependencies. 

3. Run the app using following command. 

   *node index.js* 
   
4. Open the browser or any rest client (postman) and go to following url -

   *localhost:3000/api/crawl/{city}/{cuisine}*
   
   PS : Replace city with cityname (mumbai, nagpur, bangalore) and cuisine with cuisine name (chicken, paneer etc)
   
    
   EX - *localhost:3000/api/crawl/nagpur/chicken*
   
   ### Please note that this is a GET api so while using browser or Rest client you have to add city and cuisine name as query parameters
   
5. You will see few messages on console after running the app which shows what app is doing currently. You will receive the response when it shows *Completed Scrapping !* on the console.
   
   The reponse will be a JSON object containing swiggy and zomato restaurants array with cuisines and their respective price.
  
   
#### That's it, you are all setup to play around the application.



