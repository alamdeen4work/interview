# Program Design Decisions

This program will execute using command line. 
There is two files, one have more records, another less, named:-

First of all, please execute 'npm i' at root

1. transactions.csv.zip (Big file Link: https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip)
2. small_transactins.csv.zip (less records)

=> Please find small_transactins.csv.zip file in root directory, if want to process with big file (transactions.csv.zip), please download by link and put in root directory.

For fast execution code by default process with small file (small_transactins.csv.zip)

If you will execute with big file (1. transactions.csv.zip), It will take around 50 minutes for process to all records. 


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
