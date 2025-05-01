## WORKING WITH MONGOOSE-II

## Relationships in Mongoose

Mongoose is an Object Data Modeling (ODM) library for MongoDB, which allows you
to define data models in a structured manner. Relationships in Mongoose involve
how different data models or collections are related to each other. These
relationships can be one-to-one, one-to-many, or many-to-many, and they help you
organise and query data effectively.

### Importance of Relationships:

Understanding and implementing relationships in Mongoose is crucial for several
reasons:

1. Efficient Data Organization: Relationships help structure data to reflect
   real-world associations, making data retrieval and management more
   efficient.
2. Data Integrity: Relationships maintain data integrity by ensuring that related
   data remains consistent and accurate.
3. Query Optimization: Properly defined relationships enable you to perform
   complex queries without the need for excessive data manipulation.
4. Improved Application Logic: Relationships allow you to represent complex
   application logic, such as users with multiple blog posts or courses with
   multiple students.

### One to Many Relationships

A one-to-many relationship is a fundamental concept in database modeling where
one entity (document) is associated with multiple related entities in another
collection. In MongoDB, this relationship is often implemented by referencing
documents from one collection in another.

#### Use Case:

You have a web application where you need to define data models for
users. Each user can have multiple blog posts associated with them.

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});
const User = mongoose.model("User", userSchema);
```

Note:

1. `mongoose.Schema.Types.ObjectId` is used to represent MongoDB's
   ObjectIds, and `ref: 'Post'` indicates that this field references documents in the 'Post'
   collection.
2. `ref` attribute helps Mongoose understand the relationship between different
   collections and facilitates population and data retrieval across related documents in a
   MongoDB database. It's a way to provide metadata about the relationship between
   fields in different schemas.

### Many-to-One Relationship

A many-to-one relationship occurs when multiple records in one collection are
associated with a single record in another collection. This type of relationship is
commonly used to represent scenarios where multiple entities share a common
parent entity.
Use Case: Consider an e-commerce platform where you have multiple customer
reviews for each product. Each review (many) is associated with a specific product
(one).

```javascript
// Product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

// Review schema with a reference to Product
const reviewSchema = new mongoose.Schema({
  content: String,
  rating: Number,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

// Product and Review models
const Product = mongoose.model("Product", productSchema);
const Review = mongoose.model("Review", reviewSchema);
```

### Many to Many Relationships

Many-to-many relationships occur when multiple records in one collection are
associated with multiple records in another collection. In Mongoose, this is
implemented by creating arrays of references to documents from other collections.
For example, in a course management system, a course can have multiple students,
and a student can enrol in multiple courses.

#### Use Case:

You are building a course management system. A course can have multiple students, and a student can enrol in multiple courses.

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const courseSchema = new mongoose.Schema({
  title: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);
```

## Implement One-to-Many relationship: each Product can have multiple Reviews

### 1. Created 'review.schema.js' file

```javascript
import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: Number,
});
```

This `reviewSchema` defines a Mongoose schema for storing product reviews in a MongoDB database.

1. 📦 reviewSchema Structure:
   - `mongoose.Schema(...)`: Creates a new schema object for the `Review` collection.
   - `export`: Makes it available for use in other files.
2. 🛍️ product Field:
   - `type: mongoose.Schema.Types.ObjectId`: This means `product` stores a reference (ID) to another MongoDB document.
   - `ref: "Product"`: Tells Mongoose this ObjectId refers to the Product collection.
   - 🔗 This creates a relationship (foreign key-like) to a Product document.
3. 👤 user Field:
   - Stores the ID of the user who gave the review.
   - `ref: "User"` creates a link to the User document.
4. ⭐ rating Field:
   - A number field representing how many stars (e.g., 1–5) the user gave the product.
   - You can later add validation here (e.g., min 1, max 5) if needed.

This schema enables storing **which user reviewed which product and what rating they gave**, while maintaining proper references for to **populate full user and product details** when needed.

### 2. Updated 'product.schema.js' file

#### ✅ Before (Old Code):

```javascript
import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  inStock: Number,
});
```

#### 🔁 After (Updated Code):

```javascript
import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
  imageUrl: String,
  category: String,
  sizes: [String],
  stock: Number,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
```

The updated schema now includes:

1. `imageUrl: String` – Stores the product's image URL.
2. `sizes: [String]` – Holds an array of available sizes for the product (e.g. ["S", "M", "L"]).
3. `stock: Number` – Renamed from inStock to reflect the product's available stock.
4. `desc: String` – Renamed from description to reflect a more concise representation of the product’s details.
5. `reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]`
   - This line adds a new `reviews` field to the product schema. It is an array of references (ObjectIds) that point to documents in the `Review` collection.
   - This setup establishes a **relationship between a product and its reviews**, allowing each product to store multiple associated review IDs.
   - By using the `ref: "Review"` option, you enable Mongoose population, which means:
     - You can easily fetch full review details (like rating, reviewer, etc.) along with the product,
     - Instead of just storing raw data, you link documents across collections, keeping your database normalized and efficient.

These changes provide a richer structure for representing a product, including its image, ratings, and available sizes, while maintaining relationships with reviews.

### 3. 'product.repository.js' file

Moved existing code from user.repository.js to user.repository_old.js, and updated code to a fresh user.repository.js file

#### 🔁 1. Shift from Embedded Ratings to Review Collection

Earlier:

```javascript
ratings: [{ userID, rating }];
```

Stored ratings directly inside the product document, making it harder to manage detailed review data, such as timestamps, comments, etc.

Now:

```javascript
reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }];
```

- Ratings are stored in a separate Review model.
- Each review references both the product and the user.
- Allows for more scalable, normalized data (follows MongoDB best practices).

#### 🏗️ 2. Integration of Mongoose Models

✅ Added at the top:

```javascript
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
```

➕ Purpose:

- ProductModel is now used to verify if a product exists before rating.
- ReviewModel is now used to create or update user ratings in a separate reviews collection.

This adds:

- Schema validation
- Relationship modeling
- Cleaner separation of concerns

#### 🔁 3. Updated rate Method Logic

```javascript
async rate(userID, productID, rating) {
    try {
      // 1. Check if product exists
      const productToUpdate = await ProductModel.findById(productID);
      if (!productToUpdate) {
        throw new Error("Product not found !");
      }

      let review;
      const existingReview = await ReviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID),
      });

      if (existingReview) {
        existingReview.rating = rating;
        await existingReview.save();
        review = existingReview;
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating,
        });
        await newReview.save();
        review = newReview;
      }

      // 3. Update the product's reviews array
      await ProductModel.findByIdAndUpdate(productID, {
        $addToSet: { reviews: review._id }, // $addToSet prevents duplicates
      });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
```

This function is designed to handle a product rating (or review) by a user.

1. Check Product Existence:
   - `ProductModel.findById(productID)` is used to check if the product exists in the database.
   - If the product isn’t found, it throws an error.
2. Handle Existing Review:
   - `ReviewModel.findOne()` is used to find an existing review for the product by the user.
   - If found, the review’s `rating` is updated and saved with `existingReview.save()`.
   - If not found, a new review is created using `new ReviewModel()` and saved with `newReview.save()`.
3. Update Product’s Review List:
   - `ProductModel.findByIdAndUpdate()` is used to update the product’s review array.
   - The `$addToSet` operator ensures that the review’s ID is added without duplicates.
4. Error Handling:
   - If any error occurs during the database operations, it’s caught in the `catch` block.
   - A custom error is thrown using `ApplicationError` to notify the user of database issues.

This function effectively interacts with the database to check product existence, manage reviews, and update the product's review list.

#### 🔍 Comparison: `findById()` vs `findOne()` vs `findByIdAndUpdate()` in Mongoose

1. `findById(id)`
   - Use: Fetches a single document using its `_id` field.
   ```javascript
   const productToUpdate = await ProductModel.findById(productID);
   ```
   - Purpose here: To check whether the product exists before proceeding.
2. `findOne(filter)`

   - Use: Finds a single document that matches the specified filter/criteria.

   ```javascript
   const existingReview = await ReviewModel.findOne({
     product: new ObjectId(productID),
     user: new ObjectId(userID),
   });
   ```

   - Purpose here: To check if the user has already submitted a review for the product.

3. `findByIdAndUpdate(id, update, options?)`
   - Use: Finds a document by `_id` and applies the given update. You can optionally return the updated document or apply other options.
   ```javascript
   await ProductModel.findByIdAndUpdate(productID, {
     $addToSet: { reviews: review._id },
   });
   ```
   - Purpose here: To add the review's ID to the product's `reviews` array, ensuring no duplicates (thanks to `$addToSet`).

### 4. Testing in Postman

#### Rating added by multiple Users, on the same product

<img src="./images/rateProduct_postman6.png" alt="Rate Product Postman" width="700" height="auto">

#### One-to-Many Relationship: A Single Product with Multiple Reviews

<img src="./images/reviews_collection.png" alt="Reviews Collection" width="700" height="auto">

<img src="./images/addedReviews_OnProduct.png" alt="Reviews added on Product" width="700" height="auto">
