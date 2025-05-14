export default class ProductModel {
  constructor(name, desc, price, imageUrl, categories, sizes, stock, id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageUrl = imageUrl;
    this.categories = categories;
    this.sizes = sizes;
    this.stock = stock;
  }
}

/*
//ADD PRODUCTS DATA
{
    "name": "Prisoners of Geography",
    "desc": "How geography shapes global politics by Tim Marshall.",
    "price": 492,
    "imageUrl": "https://m.media-amazon.com/images/I/81xjhH+H57L._SL1500_.jpg",
    "category": "Geography",
    "sizes": ["Paperback", "Hardcover", "Kindle"] 
},
{
    "name": "Astrophysics for People in a Hurry",
    "desc": "A quick dive into space and time by Neil deGrasse Tyson.",
    "price": 799,
    "imageUrl": "https://m.media-amazon.com/images/I/71c46ivy5xL._SL1200_.jpg",
    "category": "Science",
    "sizes": ["Hardcover", "Kindle"]
},
{
    "name": "Clean Code",
    "desc": "A guide to writing clean and maintainable code by Robert C. Martin.",
    "price": 1999,
    "imageUrl": "https://m.media-amazon.com/images/I/41bOkXnNBjL._SY445_SX342_.jpg",
    "category": "Computers",
    "sizes": ["Paperback", "Kindle"]
},
{
    "name": "The Power of the Map",
    "desc": "Exploring how maps shape our world and perceptions by Denis Wood.",
    "price": 1615,
    "imageUrl": "https://m.media-amazon.com/images/I/51yePqOJh3L.jpg",
    "category": "Geography",
    "sizes": ["Paperback"]
},
{
    "name": "The Gene: An Intimate History",
    "desc": "A journey into genetics and its future by Siddhartha Mukherjee.",
    "price": 799.00,
    "imageUrl": "https://m.media-amazon.com/images/I/71HcXS1+R-L._SL1500_.jpg",
    "category": "Science",
    "sizes": ["Paperback", "Hardcover", "Kindle"]
},
{
    "name": "Artificial Intelligence",
    "desc": "A modern approach to AI by Stuart Russell and Peter Norvig.",
    "price": 924,
    "imageUrl": "https://m.media-amazon.com/images/I/61-6TTTBZeL._SL1000_.jpg",
    "category": "Computers",
    "sizes": ["Hardcover"]
},
{
  "name": "Data Structures and Algorithms Made Easy",
  "desc": "Comprehensive guide to data structures and algorithms with Java implementations.",
  "price": 579,
  "imageUrl": "https://m.media-amazon.com/images/I/714+tgyHDRL._SL1360_.jpg",
  "sizes": ["Paperback","Kindle"],
  "categories": "Computers , Programming"
},
{
  "name": "Beginning MERN Stack Development",
  "desc": "A hands-on guide to building full-stack web apps using MongoDB, Express, React, and Node.js.",
  "price": 1241,
  "imageUrl": "https://m.media-amazon.com/images/I/51fJDInYIFL._SL1360_.jpg",
  "sizes": ["Paperback"],
  "categories": ["Computers", "Software Development", "Programming"]
}


*/
