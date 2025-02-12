## MODEL VIEW CONTROLLER (MVC) PART-II

## Working with Forms
There are many scenarios where forms can be used, Imagine you're running an
online store, and you want to give your staff the ability to add new products easily. To
do this, you need to create a form that lets them input product information and
submit it to the server.
### Creating the new-product.ejs view
To add a new product, we need to create a new view file called new-product.ejs. We
will use Bootstrap to create the form in this view. Here is the code for the
new-product.ejs file:

```javascript
<!-- views/add-product.ejs -->
<h1 class="mt-5 mb-4">Add New Product</h1>
<form action="/" method="post">
    <div class="mb-3">
        <label for="name" class="form-label">Product Name</label>
        <input type="text" class="form-control" id="name" name="name" required>
    </div>
    <div class="mb-3">
        <label for="desc" class="form-label">Product Description</label>
        <textarea class="form-control" id="desc" name="desc" rows="3" required></textarea>
    </div>
    <div class="mb-3">
        <label for="price" class="form-label">Price</label>
        <input type="number" class="form-control" id="price" name="price" step="0.01" min="0" required>
    </div>
    <div class="mb-3">
        <label for="imageUrl" class="form-label">Image URL</label>
        <input type="url" class="form-control" id="imageUrl" name="imageUrl" required>
    </div>
    <button type="submit" class="btn btn-primary">Add Product</button>
</form>
```

### Updating the product.controller.js file
After creating the view, we need to update our product.controller.js file. We will add a
getAddForm method to get the form, and a postAddProduct method to update the
model with the form data after submission.
Here is the updated product.controller.js file:
```javascript
import ProductModel from "../models/product.model.js";

export default class ProductController {
  getProducts(req, res) {
    let products = ProductModel.get();
    //console.log(products);
    res.render("products", { products: products });
  }

  getAddForm(req, res) {
    return res.render("new-product");
  }

  addNewProduct(req, res) {
    //access data from form
    console.log(req.body);
    let products = ProductModel.get();
    res.render("products", { products: products });
  }
}
```

### Updating the product.ejs file
Finally, we need to update the product.ejs file to add a "New Product" nav item that
redirects to '/new'
Here is how updated layout looks:
#### Products view
<img src="./images/products_view1.png" alt="Products view" width="500" height="auto" >
<img src="./images/products_view2.png" alt="Products view" width="650" height="auto" >

#### New Product View
<img src="./images/newproduct_view.png" alt="New Product View" width="500" height="auto">

Note: 'req.body' value will be `undefined` we will see how to overcome this problem
next.


## Parsing Data
Express's internal body parser express.urlencoded is used to parse form data. It is
a middleware that helps us access form data in the request body.

This middleware is a built-in middleware function in Express. It parses incoming
requests with JSON payloads and is based on body-parser. It returns middleware
that only parses JSON and only looks at requests where the Content-Type header
matches the type option. A new body object containing the parsed data is populated
on the request object after the middleware (i.e. req.body), or an empty object ({}) if
there was no body to parse, the Content-Type was not matched, or an error
occurred.

To use the `express.urlencoded` middleware in the project, we need to add the
following line of code in our index.js file:
```javascript
import express from "express";
import ProductController from "./src/controllers/product.controller.js";
import ejsLayouts from "express-ejs-layouts";
import path from "path";

const server = express();
const PORT = 3100;

//Parse from data
server.use(express.urlencoded({ extended: true }));

//Setup view engine settings
server.set("view engine", "ejs");
server.set("views", path.join(path.resolve(), "src", "views"));

server.use(ejsLayouts);

//Serves the static files from the views directory to the browser
server.use(express.static("src/views"));

//Create an instance of ProductController
const productController = new ProductController();
server.get("/", productController.getProducts);
server.get("/new", productController.getAddForm);
server.post("/", productController.addNewProduct);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```


In the product.controller.js file, we can use `req.body` to get the form data that is
submitted. To add this data to the products array in 'products.model.js', we need to
add an `addProduct` method in the 'ProductModel' class.
```javascript
export default class ProductModel {
  constructor(_id, _name, _desc, _price, _imageUrl) {
    this.id = _id;
    this.name = _name;
    this.desc = _desc;
    this.price = _price;
    this.imageUrl = _imageUrl;
  }
  static get() {
    return products;
  }

  static add(productObj) {
    let newProduct = new ProductModel(
      products.length + 1,
      productObj.name,
      productObj.desc,
      productObj.price,
      productObj.imageUrl
    );
    products.push(newProduct);
  }
}

var products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg"
  )
];
```

In the 'product.controller.js' file, add a post request on the `/new` endpoint to access
the form data and call the `addProduct` method to add the product to the products
array.

Here is the updated code for the product.controller.js file:
```javascript
import ProductModel from "../models/product.model.js";

export default class ProductController {
  getProducts(req, res) {
    let products = ProductModel.get();
    //console.log(products);
    res.render("products", { products: products });
  }

  getAddForm(req, res) {
    return res.render("new-product");
  }

  addNewProduct(req, res) {
    //access data from form
    console.log(req.body);
    ProductModel.add(req.body);
    let products = ProductModel.get();
    return res.render("products", { products });
  }
}
```

## Additonal: Restructured Code 

### 1. Entry file: 'index.js'

1. Variable Name Change: server → app
2. Controller Name Change: ProductController → ProductsController
3. Method Name Changes in Routes:
    - getAddForm → getAddProduct
    - addNewProduct → postAddProduct

4. Route Change for New Product Form: "/new" → "/new-product"

#### Before Changes

```javascript
import express from "express";
import ProductController from "./src/controllers/product.controller.js";
import ejsLayouts from "express-ejs-layouts";
import path from "path";

const server = express();
const PORT = 3100;

//Parse from data
server.use(express.urlencoded({ extended: true }));

//Setup view engine settings
server.set("view engine", "ejs");
server.set("views", path.join(path.resolve(), "src", "views"));

server.use(ejsLayouts);

//Serves the static files from the views directory to the browser
server.use(express.static("src/views"));

//Create an instance of ProductController
const productController = new ProductController();
server.get("/", productController.getProducts);
server.get("/new", productController.getAddForm);
server.post("/", productController.addNewProduct);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

#### After Changes

```javascript
import express from "express";
import ProductsController from "./src/controllers/product.controller.js";
import ejsLayouts from "express-ejs-layouts";
import path from "path";

const app = express();
const PORT = 3100;

app.use(ejsLayouts);
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup view engine settings
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));

//Serves the static files from the views directory to the browser
app.use(express.static("src/views"));

//Create an instance of ProductController
const productsController = new ProductsController();
app.get("/", productsController.getProducts);
app.get("/new-product", productsController.getAddProduct);
app.post("/", productsController.postAddProduct);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### 2. Controller: 'product.controller.js'

1. Class Name Change: ProductController → ProductsController
2. Method Name Changes:
   - getAddForm → getAddProduct
   - addNewProduct → postAddProduct
3. Model Method Change: ProductModel.get() → ProductModel.getAll()
4. Rendered View Change: "products" → "index"
5. Added next Parameter in Methods:
   - getProducts(req, res) → getProducts(req, res, next)
   - getAddProduct(req, res) → getAddProduct(req, res, next)
   - postAddProduct(req, res) → postAddProduct(req, res, next)

#### Before Changes

```javascript
import ProductModel from "../models/product.model.js";

export default class ProductController {
  getProducts(req, res) {
    let products = ProductModel.get();
    //console.log(products);
    res.render("products", { products: products });
  }

  getAddForm(req, res) {
    return res.render("new-product");
  }

  addNewProduct(req, res) {
    //access data from form
    console.log(req.body);
    ProductModel.add(req.body);
    let products = ProductModel.get();
    return res.render("products", { products });
  }
}
```

#### After Changes

```javascript
import ProductModel from "../models/product.model.js";

class ProductsController {
  getProducts(req, res, next) {
    let products = ProductModel.getAll();
    res.render("index", { products: products });
  }

  getAddProduct(req, res, next) {
    return res.render("new-product");
  }

  postAddProduct(req, res, next) {
    //access data from form
    console.log(req.body);
    ProductModel.add(req.body);
    let products = ProductModel.getAll();
    return res.render("index", { products });
  }
}

export default ProductsController;
```

### 3. Model: `product.model.js'

1. Method Name Change: get() → getAll()
2. Constructor Parameter Naming Simplified: \_id, \_name, \_desc, \_price, \_imageUrl → id, name, desc, price, imageUrl

#### Before Changes

```javascript
export default class ProductModel {
  constructor(_id, _name, _desc, _price, _imageUrl) {
    this.id = _id;
    this.name = _name;
    this.desc = _desc;
    this.price = _price;
    this.imageUrl = _imageUrl;
  }
  static get() {
    return products;
  }

  static add(productObj) {
    let newProduct = new ProductModel(
      products.length + 1,
      productObj.name,
      productObj.desc,
      productObj.price,
      productObj.imageUrl
    );
    products.push(newProduct);
  }
}

var products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg"
  ),
];
```

#### After Changes

```javascript
export default class ProductModel {
  constructor(id, name, desc, price, imageUrl) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  static getAll() {
    return products;
  }

  static add(productObj) {
    let newProduct = new ProductModel(
      products.length + 1,
      productObj.name,
      productObj.desc,
      productObj.price,
      productObj.imageUrl
    );
    products.push(newProduct);
  }
}

var products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg"
  ),
];
```

### 4. View: 'product.js' name changes to 'index.js'

```javascript
<h1 class="mt-5 mb-4">Products</h1>
<table class="table table-dark">
    <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Price</th>
            <th scope="col">Image</th>
        </tr>
    </thead>
    <tbody>
        <% products.forEach(product=> { %>
            <tr>
                <th scope="row"><%= product.id %></th>
                <td><%= product.name %></td>
                <td><%= product.desc %></td>
                <td><%= product.price %></td>
                <td>
                    <img src="<%= product.imageUrl %>" alt="<%= product.name %>" style="max-width: 100px;">
                </td>
            </tr>
            <% }) %>
    </tbody>
</table>
</div>
```
### 5. View: 'product.css' name changes to 'index.css'
```javascript
.container{
    margin: 24px;
}

img{
    width: 80px;
}
```

### 6. View: 'layout.ejs'
Updated the href for the "New Product" link in the navbar:
```javascript
<!-- Before -->
<a class="nav-link active" aria-current="page" href="/new">New Product</a>

<!-- After -->
<a class="nav-link active" aria-current="page" href="/new-product">New Product</a>
```

## Validating Data
Data validation is an important process of ensuring that the input data is correct,
accurate, and secure. In the context of web development, data validation is crucial to
prevent potential security risks and to ensure that the application runs smoothly.
Here is some information and code snippets about data validation in the
product.controller.js and new-product.ejs files:

### Changes in product.controller.js file
To validate the incoming form data, the conditions to check for errors are added in
the postAddProduct method in product.controller.js file. The updated code adds a
new variable called validURL which uses the URL constructor to check if the
imageUrl provided in the form is a valid URL. If there are any errors, they are pushed
into the errors array.

If the errors array is not empty, it means that there are errors in the form data, so the
new-product.ejs view is rendered with the first error message from the errors array
using the errorMsg variable. If there are no errors, the index.ejs view is rendered
with the products variable containing the updated list of products.

#### Code for postAddProduct method:
```javascript
postAddProduct(req, res, next) {
    //validate data
    const { name, price, imageUrl } = req.body;
    let errors = [];
    if (!name || name.trim() == "") {
      errors.push("Name is required");
    }
    if (!price || parseFloat(price) < 1) {
      errors.push("Price must be a positive value");
    }
    try {
      const validUrl = URL(imageUrl);
    } catch (err) {
      errors.push("URL is invalid");
    }
    // if(errors.length>0){
    //   return res.render('new-product', {errorMessage:errors[0],})
    // } 
    if (errors.length != 0) {
      res.render('new-product', { errorMessage: errors[0] })
    } else {
      res.render('products', { products: products })
    }

    //access data from form
    console.log(req.body);
    ProductModel.add(req.body);
    let products = ProductModel.getAll();
    return res.render("index", { products });
  }
```
### Changes in new-product.ejs file
The new-product.ejs file can incorporate a conditional statement to determine
whether to display the the form view with error message or without error message
based on the validity of the data. The following is the revised code snippet:
```javascript
<%if(errorMessage){ %>
<div class="alert alert-danger" role="alert">
    <%= errorMessage %>
</div>
<%}%>
```
### Here is what form view with invalid data input looks like:
<img src="./images/validating_data.png" alt="Model View Controller"  width="600" height="auto">

## Validation Middleware
In the current implementation, the validation code for form data is placed in the
`postAddProduct` method in `product.controller.js`. This is problematic as it violates
the Single Responsibility Principle. We can also add the validation code in a
separate method and call it form 'postAddProduct' but this lead to the problem of tight
coupling. To overcome this issue, we can create a separate middleware function for
validation.

### Here are the steps to implement Validation Middleware:
1. Create a new folder named `middleware` in the `src` folder.

<img src="./images/create_middleware.png" alt="Model View Controller"  width="300" height="400">

2.Create a file named `validation.middleware.js` in the middleware folder and
add a function named `validateRequest` and export it. Move the validation
code from the `postAddProduct` method to this function.

Here is the `validation.middleware.js` file:
```javascript
const validateRequest = (req, res, next) => {
  // validate data
  const { name, price, imageUrl } = req.body;
  let errors = [];
  if (!name || name.trim() == "") {
    errors.push("Name is required");
  }
  if (!price || parseFloat(price) < 1) {
    errors.push("Price must be a positive value");
  }
  try {
    const validUrl = new URL(imageUrl);
  } catch (err) {
    errors.push("URL is invalid");
  }

  if (errors.length > 0) {
    return res.render("new-product", {
      errorMessage: errors[0],
    });
  }
  next();
};
export default validateRequest;
```

3. In the `index.js file`, import the `validateRequest` function from
`validation.middleware.js` and pass it as middleware in the `/` route of the
`server.post` method.

```javascript
import express from "express";
import ProductsController from "./src/controllers/product.controller.js";
import ejsLayouts from "express-ejs-layouts";
import path from "path";
import validateRequest from "./src/middlewares/validation.middleware.js";

const app = express();
const PORT = 3100;

app.use(ejsLayouts);
app.use(express.urlencoded({ extended: true }));

//Setup view engine settings
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));

//Serves the static files from the views directory to the browser
app.use(express.static("src/views"));

//Create an instance of ProductController
const productsController = new ProductsController();
app.get("/", productsController.getProducts);
app.get("/new-product", productsController.getAddProduct);
app.post("/", validateRequest, productsController.postAddProduct);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

By implementing the Validation Middleware, we have separated the validation logic
from the controller, and achieved a better adherence to the Single Responsibility
Principle.

