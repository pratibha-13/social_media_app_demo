//var dbURI = process.env.DBConnection || 'mongodb+srv://forkfreighttest:TotalRecall1998@truckmyload-8gnrn.mongodb.net/truckmyload?retryWrites=true&w=majority';
//var dbURI =process.env.DBConnection || 'mongodb+srv://mikeuser:TotalRecall1998@ForkFreightProd.dldsw.mongodb.net/ForkFreightProd?retryWrites=true&w=majority';
var dbURI =process.env.DBConnection || 'mongodb://127.0.0.1:27017/social_media_demo_db';
module.exports = {
  'secret':'nodeauthsecret',
  'database': dbURI,
};