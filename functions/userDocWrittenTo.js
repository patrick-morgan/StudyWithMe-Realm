exports = function(changeEvent){
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
  const publicUserCollection = db.collection("PublicUser");
  const userCollection = db.collection("User");
  const docId = changeEvent.documentKey._id;
  const user = changeEvent.fullDocument;
  
  // If is an update, check what has changed and only take the actions needed
  console.log(`Looking at user for docId=${docId}. operationType = ${changeEvent.operationType}`);
  switch (changeEvent.operationType) {
    case "insert":
    case "replace":
    case "update":
      console.log(`Writing PublicUser data for user _id=${user._id}`);
      // update public user data
      let publicUserDoc = {
        _id: user._id,
        partition: "all-users=all-the-users",
        firstName: user.firstName,
        lastName: user.lastName,
        lastSeenAt: user.lastSeenAt,
        checkIns: user.checkIns
      };
      if (user.userPreferences) {
        const prefs = user.userPreferences;
        publicUserDoc.userName = prefs.userName;
        console.log("Copying userName");
        if (prefs.profilePhoto && prefs.profilePhoto._id) {
          console.log("Copying profilePhoto");
          publicUserDoc.profilePhoto = prefs.profilePhoto;
          console.log(`id of profilePhoto = ${prefs.profilePhoto._id}`);
        }
      }
      // Update PublicUser db
      publicUserCollection.replaceOne({ _id: user._id }, publicUserDoc, { upsert: true })
      .then (() => {
        console.log(`Wrote PublicUser document for document _id: ${docId}`);
      }, error => {
        console.log(`Failed to write PublicUser document for document _id=${docId}: ${error}`);
      });
      // TODO: May need to update logic to update checkIns list
      break;
    case "delete":
      publicUserCollection.deleteOne({_id: docId})
      .then (() => {
        console.log(`Deleted PublicUser document for document _id: ${docId}`);
      }, error => {
        console.log(`Failed to delete PublicUser document for document _id=${docId}: ${error}`);
      });
      break;
  }
};