exports = function(partition){
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
  console.log(`Checking if can sync a read for partition = ${partition}`);
  
  const db = context.services.get("mongodb-atlas").db("dev");
  const userCollection = db.collection("User");
  const user = context.user;
  let partitionKey = "";
  let partitionValue = "";
  
  const splitPartition = partition.split("=");
  if (splitPartition.length == 2) {
    partitionKey = splitPartition[0];
    partitionValue = splitPartition[1];
    console.log(`Partition key = ${partitionKey}, partition value = ${partitionValue}`);
  } else {
    console.log(`Couldn't extract the partition key/value from ${partition}`);
    return false;
  }
  
  switch (partitionKey) {
    case "user":
      console.log(`Checking if partitionValue(${partitionValue}) matches user.id(${user.id}) – ${partitionValue === user.id}`);
      return partitionValue === user.id;
    case "location":
      console.log("Any user can read the locations data");
      return true;
    case "all-users":
      console.log("Any user can read all-users (PublicUser) partitions");
      return true;
    default:
      console.log(`Unexpected partition key: ${partitionKey}`);
      return false;
  }
};