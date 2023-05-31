const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI,{
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const app = express();


app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static("public"));

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  accountNo: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  }
});


const Customer = new mongoose.model('customer', customerSchema);

const customer1 = new Customer({
  name: "Mohit Pandey",
  accountNo: 123456,
  email: "mpandey@gmail.com",
  balance: 10000
});

const customer2 = new Customer({
  name: "Satyam Sharma",
  accountNo: 234561,
  email: "ssharma@gmail.com",
  balance: 50000
});

const customer3 = new Customer({
  name: "Soham Mishra",
  accountNo: 345612,
  email: "smishra@gmail.com",
  balance: 8000,
});

const customer4 = new Customer({
  name: "Rohit Sharma",
  accountNo: 456123,
  email: "rsharma@gmail.com",
  balance: 1000,
});

const customer5 = new Customer({
  name: "Prithwi Shaw",
  accountNo: 561234,
  email: "pshaw@gmail.com",
  balance: 450000,
});

const customer6 = new Customer({
  name: "Gotem Gemphir",
  accountNo: 612345,
  email: "ggemphir@gmail.com",
  balance: 150000,
});

const customer7 = new Customer({
  name: "Sangam Mohajan",
  accountNo: 216487,
  email: "sangammj123@gmail.com",
  balance: 950000,
});

const customer8 = new Customer({
  name: "Nishant Bhagat",
  accountNo: 216488,
  email: "nishant123@gmail.com",
  balance: 500005,
});

const customer9 = new Customer({
  name: "Nishant Sinha",
  accountNo: 216455,
  email: "nsinha783@gmail.com",
  balance: 544007,
});

const customer10 = new Customer({
  name: "Zaffer Iqbal",
  accountNo: 216489,
  email: "zaferiqbal5556@gmail.com",
  balance: 1250000,
});

const defaultCustomers = [
  customer1,
  customer2,
  customer3,
  customer4,
  customer5,
  customer6,
  customer7,
  customer8,
  customer9,
  customer10,
];


const transactionSchema = new mongoose.Schema({
  sName: String,
  rName: String,
  sAccount: Number,
  rAccount: Number,
  tAmount: Number,
})

const Transaction = new mongoose.model('transaction', transactionSchema)

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/sendMoney", (req, res) => {
  res.render("sendMoney");
});

app.get("/transactions", (req, res) => {
  Transaction.find({}).then(function(foundTransactions){
    res.render('transactions', {allTransactions: foundTransactions})
  }).catch(error => {console.log(error)})
});

app.get("/customerList", (req,res)=>{
  Customer.find({}).then((foundCustomers)=>{
    if(!foundCustomers || foundCustomers.length===0){
      Customer.insertMany(defaultCustomers);
      res.redirect("/customerList")
    }else{
      res.render('customerList', {allcustomers:foundCustomers})
    }
  }).catch(error => {console.log(error)})
})

app.post("/sendMoney", (req, res) => {
  const senderName = req.body.senderName;
  const senderAccount = req.body.senderAccountNum;
  const recipientName = req.body.recipientName;
  const recipientAccount = req.body.recipientAccountNum;
  Customer.findOne({ name: senderName, accountNo: senderAccount })
    .then(function (result) {
      if (!result) {
        console.log("error");
        res.render("failure");
      } else if (result.balance >= req.body.amount) {
        Customer.findOne({ name: recipientName, accountNo: recipientAccount })
          .then(function (result) {
            if (!result) {
              console.log("error");
              res.render("failure");
            } else {
              const newRBalance =
                parseInt(result.balance) + parseInt(req.body.amount);

              result.balance = newRBalance;
              result.save();
            }
          })
          .catch((error) => {
            console.log(error);
          });
        const newSBalance = result.balance - req.body.amount;
        result.balance = newSBalance;
        result.save();
        const newTransaction = new Transaction({
          sName: senderName,
          rName: recipientName,
          sAccount: req.body.senderAccountNum,
          rAccount: req.body.recipientAccountNum,
          tAmount: req.body.amount,
          message: req.body.msg,
        });
        newTransaction.save();
        res.render("success");
      } else {
        console.log("error");
        res.render("failure");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`now running on port ${process.env.PORT}`);
});
