exports = function({user}) {
  /*
    An Authentication Trigger will always call a function with an authEvent.
    Documentation on Triggers: https://docs.mongodb.com/realm/triggers/overview/

    Access the user associated with the authEvent:
    const user = authEvent.user

    Access the time the authEvent happened:
    const time = authEvent.time

    Access the operation type for the authEvent:
    const operationType = authEvent.operationType

    Access the providers associated with the authEvent:
    const providers = authEvent.providers

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    Access a mongodb service:
    const collection = context.services.get("<SERVICE_NAME>").db("<DB_NAME>").collection("<COLL_NAME>");
    const doc = collection.findOne({ name: "mongodb" });

    Call other named functions if they are defined in your application:
    const result = context.functions.execute("function_name", arg1, arg2);

    Access the default http client and execute a GET request:
    const response = context.http.get({ url: <URL> })

    Learn more about http client here: https://docs.mongodb.com/realm/functions/context/#context-http
  */
  const db = context.services.get("mongodb-atlas").db("dev");
  const userCollection = db.collection("User");
  const partition = `user=${user.id}`;
  const defaultLocation = context.values.get("defaultLocation");
  const userPreferences = {
    userName: "",
    profilePhoto: null
  }
  const userDoc = {
    _id: user.id,
    partition: partition,
    firstName: "",
    lastName: "",
    email: user.data.email,
    userPreferences: userPreferences,
    lastSeenAt: null,
    checkIns: [],
    friends: []
  };
  return userCollection.insertOne(userDoc)
  .then(result => {
    console.log(`Added User document with _id: ${result.insertedId}`);
  }, error => {
    console.log('Failed to insert User document ${error}');
  });
};
