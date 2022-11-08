# Program Design Decisions

This program will execute using command line. 
There is two files, one have more records, another less, named:-

First of all, please execute 'npm i' at root

1. transactions.csv.zip (<a href="https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip" target="_blank">Download Big CSV file</a>)
2. small_transactins.csv.zip (less records)

=> Please find small_transactins.csv.zip file in root directory.

For fast execution please comment large file at line number 12, and uncomment line number 15 in app.js

If you will execute with large file (1. transactions.csv.zip), It will take around 50 minutes for process to all records. 


# Step to execute programm

Program can execute to following bellow steps:- 

1. Given no parameters, return the latest portfolio value per token in USD
   Example: npm start

2. Given a token, return the latest portfolio value for that token in USD
   Example: npm start token=BTC

3. Given a date, return the portfolio value per token in USD on that date
    Example: npm start date=2019-10-25

4. Given a date and a token, return the portfolio value of that token in USD on that date
    Example: npm start token=BTC date=2019-10-25
