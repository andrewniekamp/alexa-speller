
# Phoneme
An Alexa (Amazon Echo) skill for practicing your spelling.
##### By Andrew Niekamp

## Setup/Installation

* The 'speller' folder can be zipped and uploaded to AWS.

## Technologies Used

JavaScript, Node.js, Amazon AWS, Alexa

## Notes I took that might be useful to anyone interested in doing something similar to this:

### API

I intend to leverage a dictionary API for retrieving random words along with definition, part of speech, usage examples, etc.

### Tests

* Testing is mostly handled in AWS, but helper classes and functions can of course be tested locally. Testing the Alexa skill response/behavior was more of a challenge to run locally.

### Local server for mock Alexa requests

* If you want to simulate the skill locally, you may want to look into alexa-app-server to mock requests locally.
  * Install alexa-app-server, carefully minding the file structure.
    * need apps directory with app name folder (speller, in this case)
    * server.js in root to serve the alexa-app-server
    * index.js with Alexa-specific stuff for intents, etc., and a simple package.json inside the specific app folder

#### Prep

* Assemble the contents of the folder you're going to deploy. In the case of this repo, 'speller' folder would be deployed (but not the folder itself). I chose to compress (.zip) the contents and upload them to AWS.
  * For instance: index.js, node_modules, package.json, and any other helper scripts

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

#### Storage

* FireBase is probably an easy and affordable solution for quick prototyping. You can also use the session store for each session a user has with the application (very useful for carrying over content between skill intents).
* You could also use DynamoDB
