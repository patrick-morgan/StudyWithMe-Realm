exports = function(userIdToUpdate, friendId){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    collection.findOne({ owner_id: context.user.id }).then((doc) => {
      // do something with doc
    });

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
  */

  const db = context.services.get("mongodb-atlas").db("dev");
  const userCollection = db.collection("User");
  
  // friendId is actually the current user calling this function
  // userIdToUpdate is the other user they interacted with
  // we need to delete the relationship w/ friendId == friendId for userIdToUpdate on the backend
  // since this user doesn't have permission to make this change from the client
  return userCollection.updateOne({ "_id": userIdToUpdate }, {$pull : {friends: {friendId: friendId}}})
  .then(result => {
    console.log(`Deleted user relationship for ${userIdToUpdate}, w/ friendId ${friendId}`);
  }, error => {
    console.log(`Failed to delete relationship for user ${userIdToUpdate}, w/ friendId ${friendId}`);
    console.log(error);
  });
};