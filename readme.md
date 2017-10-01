# This repo functions as an example of how you can load an online JSON file with D3 and how you can visualize it

See an example of how it works [here](https://razpudding.github.io/fed3-d3events/index.html)

## Data
The data used comes from the [municipality of Amsterdam](https://data.amsterdam.nl/#?dte=catalogus%2Fapi%2F3%2Faction%2Fpackage_show%3Fid%3Dd7a4c93c-0d7f-4d39-82d4-5f50eaffa624&dtfs=T&dsf=res_format::JSON&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945)
It includes a list of events and sights which updates
 daily, providing a great example of a changing dataset
  for students

The dataset holds for each event the following information:
* title 
* short description
* lastupdated: Last updated timestamp
* types: _object_ holding at least one type and category id
* media: an _array_ holding 0 or more objects whhich hold
a url to an image of the event
* location: _object_ With a name, city, adress, zipcode and lat long
The list above is of datatype string unless mentioned otherwise

Todo:
* Describe steps taken to make datavis
V Translate categories and map them to color
* Make scatterplot of price and category
* Zoom in on the data a bit more to remove outliers (do this with the range possibly)
* Add interaction (filtering data)
* Add image of event or title on mouseover (possible to the right of the graph)
* Add the legend back

Steps taken
* Figure out what the categories mean
    - Sort the data by category
    - Write down what I think each item in a cat has in common
    - Make an enum out of my assumptions for each cat
