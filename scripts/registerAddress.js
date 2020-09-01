const mysql = require('mysql');
let dbConfig = require('./dbconfig.js');

// // mysql -u ethuser -p -h 192.168.1.105 

let isEthAddressAlreadyRegistered =false;

function registerAddress( ethaddress, tokenBal) {


  let connection = mysql.createConnection(dbConfig);
  connection.query('SELECT count(*) as count FROM register WHERE ethaddress = ?', [row.ethaddress], function (error, results, fields) {
    if (error) throw error;
      resultStr= JSON.stringify(results)
      rsltParsed =JSON.parse(resultStr)
      console.log(rsltParsed[0].count )

    if (rsltParsed[0].count > 0) {
      isEthAddressAlreadyRegistered = true;
      console.log("Eth Address already registered")
    }
    else {

    
        const row = {
        ethaddress: ethaddress,
        eligible_y_n: "N",
        balance : tokenBal
      }

      //Register the ETH address and update the token balance
         var insertQuery = connection.query('INSERT INTO register SET ?', row, function (error, results, fields) {
        if (error) throw error;
          
          if (row.balance > 100) {
            connection.query('UPDATE register SET eligible_y_n= 'Y', function(err,rows,fields) { });


          }


      });
      console.log(insertQuery.sql); 
    }
  });

  
  connection.end();
}


registerAddress('0xabgf45de8254faccd66edeed2eapwd21fe', 3000)
