const {google}=require('googleapis')
const express = require('express')
require('dotenv').config()
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({server:server});
app.use(express.json())
// GoogleAPIs
const Keys={
  "type": process.env.TYPE,
  "project_id":process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
  "universe_domain": process.env.UNIVERSE_DOMAIN


   }
const auth = new google.auth.GoogleAuth({
  keyFile: Keys,
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});  
const spreadsheetId =process.env.SPREDSHEET_ID
// Create client instance for auth
const client =  auth.getClient();
// Instance of Google Sheets API
const googleSheets = google.sheets({ version: "v4", auth: client });
// Get metadata about spreadsheet
const metaData =  googleSheets.spreadsheets.get({
  auth,
  spreadsheetId:process.env.SPREDSHEET_ID
});
var dataincomming;

  


 

 
  
 



wss.on('connection',  function connection(ws) {
    //**************************************** */
  console.log('A new client Connected!');
  ws.send('Welcome New Client!');

  ws.on('message',  function incoming(message) {
    console.log('received: %s', message);
    
    // Save Datat in Google sheets
   
   



    ws.send("you pass value is:"+message);
    dataincomming=message;
   // Share message all connected client
   wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });    

    //Save Ongoogle sheet
    const Name="Sumanga"
   const Email="sumaautomation.lk"
   const Message="Test Message"
   // Write row(s) to spreadsheet
   googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[Name, Email,Message]],
    }})

    
  
     });
   
    //****************************** */
 
});

app.get('/', (req, res) => res.send(
  `incomming data:${dataincomming}`))

server.listen(3000, () => console.log(`Lisening on port :3000`))       




 