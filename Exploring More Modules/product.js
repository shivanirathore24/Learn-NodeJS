function calculateTotal(products) {
  let total = 0;
  products.forEach((product) => {
    total += product.quantity * product.quantity; //error
  });
  return total;
}

const productsList = [
  { name: "Shoes", price: 50, quantity: 2 },
  { name: "Hat", price: 25, quantity: 1 },
  { name: "Gloves", price: 30, quantity: 2 },
];

// expected result = 100+25+60=185
const grandTotal = calculateTotal(productsList);
console.log("Grand Total:", grandTotal);
