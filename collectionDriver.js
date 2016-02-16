//imports the mongodb library
var ObjectID = require('mongodb').ObjectID;

//defines the database constructor & stores a mongodb client instance for later use
function CollectionDriver(db) {
  this.db = db;
}

//defines a helper method of getCollection to obtain mongo colelction by name
CollectionDriver.prototype.getCollection = function(collectionName, callback) {
  //fetches the collection object and returns the collection or an error
  this.db.collection(collectionName, function(error, the_collection){
    if(error) callback(error);
    else callback(null, the_collection);
  });
};
CollectionDriver.prototype.findAll = function(collectionName, callback){
  this.getCollection(collectionName, function(error, the_collection){
    if(error) callback(error);
    else{
      the_collection.find().toArray(function(error, results){
        if(error) callback(error);
        else callback(null, results);
      });
    }
  });
};
//gets a single item fromt he a collection by its id
CollectionDriver.prototype.get = function(collectionName, id, callback){
  this.getCollection(collectionName, function(error, the_collection){
    if (error) callback(error);
    else{
      //check to make sure objectid has the appropriate hex string
      var checkForHexRegExp = new RegExp("^[0-9a-fA-F{24}$]");
      if(!checkForHexRegExp.test(id)) callback({error:"invalid id"});
      else the_collection.findOne({"_id": ObjectID(id)}, function(error, doc){
        if (error) callback(error);
        else callback(null, doc);
      });
    }
  });
};

exports.CollectionDriver = CollectionDriver;
