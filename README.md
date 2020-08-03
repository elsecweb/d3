# d3-HugoAwardFirstTimeWinners
Hugo Award Winners for d3 treemap visualization 

by kateryna se barnes - kateryna[dot]barnes[at]ualberta[dot]ca and katerynabarnes[dot]com - cite me, y'all

-------------------------------------------------------

This project was heavily supported by Olav Rokne and Dr. Harvey Quamen. Much gratitude to them. 

The d3 treemap demonstrates the breakdown of first-time winners. Each rectangle is scaled based on the number of wins for each level:
    1)by category (major print categories only)
    2)by gender - as of August 2020 there have only been male or female winners. Because transwomen are women and transmen are men, they are in their respective categories.
    3)each first-time winner
   
More info, where possible, is provided such as other wins, age, and ceremony date of their first win.

While the Hugo Awards have numerous categories, the four "big" categories are given to written works of fiction: Novel (40,000 words or more), Novella (40,000 to 17,500 words), Novelette (17,500 to 7,500 words), and Short Story (less than 7,500). The associated numbers in this visualization are as follows: number of first time winners total of each category, number of winners by gender, number of total fiction wins by the individual. This means that while Charlie Jane Anders has won Hugo Awards for her novelette Six Months, Three Days and for her podcast Our Opinions are Correct (shared with Annalee Newitz), she is only counted with one win as the Fancast category is not one analyzed by this project. 


------------------------------------------------------- 

treemap functionality is in treemap.js
data is housed in hugoawards.json
the entire viz comes to life and lives in dataviz.html
