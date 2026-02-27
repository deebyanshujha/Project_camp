import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

let myusername = process.env.MY_USERNAME;
console.log(myusername);
console.log("Start of fantastic backend project");
