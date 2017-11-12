
# Spelling Thing

## API

Currently using Pearson
Example: [Pearson](http://api.pearson.com/v2/dictionaries/entries?headword=test)

However, this one is deprecated and will be gone by the end of the year.
It is free and didn't require signup, I'm waiting on Macmillan's API key registration to complete.
Will need to update tests for the new API definitions, as they will likely differ.

### Tests

* Start with tests.
  * Test for the methods you know you need, like getDefinition, getRandomWord, formatDefinition
    * The format methods will be to format the string for Alexa's presentation of it.
  * Using the API required promisified stuff/tests (async).
  * Mock data might even be better (I added mock words in a separate file as API doesn't get random words)

### Build something to test

* I then made a class with methods to pass the tests, with static methods as there is no apparent need for instances.
  * Perhaps helper methods would be better/simpler... not sure.

### Local server for mock Alexa requests

* Bring in alexa-app-server next, to mock requests locally
  * Install alexa-app-server, mind the file structure, it is opinionated!
    * need apps directory with app name folder (speller, in this case)
    * server.js in root to serve the alexa-app-server
    * index.js with Alexa-specific stuff for intents, etc., and a simple package.json inside the specific app folder

### Deployment

#### Prep

* Once some intents are working in the browser UI for alexa-app-server, you are ready to start deploying!
  * First, address the applicationId: ??get one by starting to make an alexa app in the other UI, copy it into your package.json??
  * Then, assemble your actual app files and .ZIP them (don't zip the root folder, just zip the actual files inside the app's directory)
    * index.js, node_modules, package.json, and any other helper scripts

#### AWS Lambda

* Create the AWS lambda function
  * click: Create Function
  * click: Author from scratch
    * Give name, Role: choose an existing role, Existing role: lambda_basic_execution
    * click: Create function
  * In Triggers tab, click add Trigger
    * Click the dashed outline box, then click 'Alexa Skills Kit', then click Submit
    * On configuration, select 'Upload a .ZIP file' from the 'Code entry type' dropdown
      * click: Upload, then use the UI to select the .ZIP you made above from your local machine
* Run a quick AWS lambda test for Alexa launch event
  * click: 'Select a test event..' dropdown and select 'Configure test events'
  * click: 'Event template' dropdown and select 'Alexa Start Session'
  * In the 'Event name' field, give your event a name (such as Start)
  * click: Create
    * You now have the test in the test dropdown select, and can choose it and click the 'Test' button
    * If it fails, try to search for why--I ended up not installing all of my dependencies before archiving and uploading, oops!
* Take note of RN, (keep the tab open to copy into Alexa skill in next step)

#### Alexa Skill Creation (Yes, this is separate)

* Log in, create Alexa skill
* Name it, and give invocation word(s)
* Copy in rn into 'Configure' after intitial skill setup

#### Storage?

##### Local

* dynamodb-local
* Must download/install Java SE Development Kit
* (java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb)

##### Cloud

* DynamoDB
* Add custom role to AWS Lambda
* Change dynamo/dynasty code to production from dev
* Can dynamo and use FireBase, keep testing
