exports = function(userIdToUpdate, friendId, newRelationshipType){
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
  // we need to update the relationship w/ friendId == friendId for userIdToUpdate on the backend
  // since this user doesn't have permission to make this change from the client
  return userCollection.updateOne({"_id": userIdToUpdate, "friends.friendId": friendId}, {$set: {"friends.$.relationshipType": newRelationshipType}})
  .then(result => {
    console.log(`Updated user relationship for ${userIdToUpdate}, updated friendId ${friendId} to ${newRelationshipType}`);
  }, error => {
    console.log(`Failed to update relationship for user ${userIdToUpdate}, tried to update friendId ${friendId} to ${newRelationshipType}`);
    console.log(error);
  });
};