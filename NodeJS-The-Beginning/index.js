console.log("Hello World !"); //Hello World !

function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); //5

console.log(process.argv); //node index.js 2 7
/*
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\CodingNinjas\\Milestone-8\\NodeJS\\NodeJS-TheBeginning\\index.js',
  '2',
  '6'
]
*/

var args = process.argv.slice(2);
console.log("Adding the numbers:", add(parseInt(args[0]), parseInt(args[1]))); //9

/*
1- Node uses Chrome V8 engine in core 
2- Node.js is capable of asynchronous I/O requests.
*/
