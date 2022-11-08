const express = require('express');
const csv = require('csv-parser');
const yauzl = require("yauzl");
const axios = require("axios");
const config = require('./config/config');
const app = express();


try{

    //file local path
    //const path = "transactions.csv.zip";    
    
    //small size file(same structure)
    const path = "small_transactins.csv.zip";    

    const search_query=process.argv.slice(2);
    var query_token=query_date=token='';
    if(search_query.length>0){
        search_query.forEach(query => { 
            if(query.toUpperCase().includes('TOKEN')){
                query_token=query.toUpperCase().substring(query.indexOf("=") + 1);
            }
            if(query.toUpperCase().includes('DATE')){
                query_date=query.substring(query.indexOf("=") + 1);;
            }
        });
    }
    console.log("query_token->", query_token);
    console.log("query_date->", query_date);
    console.log("Please wait file is under process...");
    console.log("\n\n");


    const row_data = []; var total_deposite=total_withdrawal=td=tw=total_value=0;
    yauzl.open(path, function(err, zipfile) {
        if (err) throw err;
        //if error in file
        zipfile.on("error", function(err) {
            throw err;
        });
        //if no error process with file
        zipfile.on("entry", function(entry) {
            if (/\/$/.exec(entry)) return;
            zipfile.openReadStream(entry, function(err, readStream) {
            if (err) throw err;
            readStream.pipe(csv({ columns: true }))
            .on("data", (row) => { 
                var date_time = new Date(row.timestamp * 1000); 
                var date_only=date_time.toDateString().split('T')[0];
                date_only=new Date(date_only).toLocaleDateString('se').replace(/\D/g, '-');               
            if(query_token.trim() && query_date){ 
                //if token and date both selected
                if(query_token==row.token.trim() &&  query_date==date_only) { 
                    transaction(row);
                }
            } else if (query_token.trim() && !query_date) {
                //if only token selected
                if(query_token==row.token.trim()) { 
                    transaction(row);
                }
            } else if (!query_token && query_date){
                //if only date selected
                if(query_date==date_only) { 
                    transaction(row);
                }
            } else {
            //if token and date not selected  
               transaction(row);
            }   
            }).on("end", () => {  
                portfolio();
                console.log("End CSV");
            });
            });
        });
   });


   async function portfolio(){
        var final_portfolio=[];
        var total_portfolio_value=0;
        if(row_data.length>0){ 
            const token_str = row_data.map((x) => x.token).join(',');
            try {
                //get crypto exchange rates in USD
                var url=config.cryptocompare+token_str+'&tsyms=USD';
                const crypto_exchange = await axios.get(url);
                for (const [key, value] of Object.entries(crypto_exchange.data)) {
                    const USD_Exchange=value.USD;
                    let get_token_value = row_data.find(o => o.token ===  key);
                    var per_token_value=get_token_value.total_value * USD_Exchange;
                    total_portfolio_value=total_portfolio_value + per_token_value;

                    final_portfolio.push({
                        token:key, total_crypto_Value:get_token_value.total_value, 
                        token_exchange_rates:USD_Exchange, portfolio_value_in_USD:per_token_value
                    });
                }
            } catch (error) { 
                console.log(error);
                console.log("Error while getting crypto excange rate");
            }          
        }
        final_portfolio.aggregate_portfolio_value_in_USD=total_portfolio_value;
        console.log("Per Token and Aggregate Portfolio Value:-");
        console.log(final_portfolio);
   }


   async function transaction (row){ 
    let objIndex = row_data.findIndex((obj => obj.token == row.token.trim()));
    if(objIndex!=-1){ 
            if(row.transaction_type.trim()=='DEPOSIT'){
                total_deposite+=Number(row.amount);
            }
            if(row.transaction_type.trim()=='WITHDRAWAL'){
                total_withdrawal+=Number(row.amount);
            }
            if(total_deposite>total_withdrawal){
                total_value=total_deposite-total_withdrawal;
            } else {                  
                row_data[objIndex].total_value-=total_withdrawal;  
            }
            row_data[objIndex].total_value+= total_value;
            total_deposite=0;
            total_withdrawal=0;
            total_value=0;

        } else { 
            if(row.transaction_type.trim()=='DEPOSIT'){
                td+=Number(row.amount);
            }
            if(row.transaction_type.trim()=='WITHDRAWAL'){ 
                tw+=Number(row.amount);
            }
            if(td>tw){
                total_value=td-tw;
            }
            row_data.push({token:row.token.trim(), total_value:total_value});
            td=0;
            tw=0;
            total_value=0;
        }
        return row_data
   }


 } catch (err){
    console.log(err);
 }


process.on('unhandledRejection', error => {
    console.error('Uncaught Error 3000', error);
});



module.exports = app;
