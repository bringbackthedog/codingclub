'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  //get a random number < 10
  const randomNum = Math.random()*10;
  
  function welcome(agent) { 
    var welcomeMsgList = ["What do you want!", 
                           "New agent, who dis?!",
                          '<speak> <prosody pitch="low"> Humanoid identified </prosody><audio clipEnd="6s" src="https://actions.google.com/sounds/v1/science_fiction/robot_code.ogg"/> </speak>',
                           'Hello human'];
    var welcomeMsgNb = Math.floor(Math.random()*welcomeMsgList.length);
	agent.add(welcomeMsgList[welcomeMsgNb]);
    
  }
 
  function fallback(agent) {
    if (randomNum >= 5) {
		agent.add(`I didn't understand`);
    } else {
    	agent.add(`I'm sorry, can you try again?`);
    }
  }

  function nameHandler(agent) {
    agent.add(`My name... is Jarvis.`);
  }  

  function heroNameHandler(agent) {
    const heroName = agent.parameters.hero;
    const unknownHero = agent.parameters.unknownHero;    
    if (heroName == "batman") {
    	agent.add(`${heroName} is really a billionaire philantropist called Bruce Wayne`);
    } else if (heroName == "ironman") {
		agent.add(`${heroName} is really a billionaire philantropist called Tony Stark`);
    } else if (heroName == "spiderman") {
    	agent.add(`Peter Parker is a teenage science whiz who fights crime as ${heroName}`);
    } else if (heroName == "superman") {
      	agent.add(`Clark Kent is ${heroName}'s secret identity`);
    } else {
		agent.add(`Sorry, I can't seem to find any information about ${unknownHero}`);      
    }
  }
  
  function contentHandler(agent){
    const requestedContent = agent.parameters.content; //content is the name of the matching entity for this intent

    
    /* 
    Insert jokes below
    
    Use the following format(copy this block):
      const nameYourJoke = 
          '<speak>' + 
          'YOUR JOKE HERE. <break time="0.5"/>'+
          'THE SECOND PART OF YOUR JOKE HERE'+
          'INSERT AS MANY LINES AS YOU NEED NEEDED'+
          '<audio clipBegin="8s" clipEnd="13s" src="https://actions.google.com/sounds/v1/cartoon/punchline_drum.ogg"/>'+
          '</speak>';
    */
    const fartJoke = '<speak>' + 
     'How do you say <break time="0.5" /> fart, in French? <break time="2" />' + 
     '<audio src="https://actions.google.com/sounds/v1/cartoon/long_fart.ogg"></audio>' + 
	 '</speak>';
    
    const bearJoke = '<speak>' + 
		'A grizzly bear walks into a restaurant and says: <break time="0.5"/>'+
		'Can I get a grilled <break time= "1"/> cheese?!'+
		'The waiter replies: <break time="0.5"/> Why the big  paws?'+
		'<audio clipBegin="8s" clipEnd="13s" src="https://actions.google.com/sounds/v1/cartoon/punchline_drum.ogg"/>'+
		'</speak>';
    
    const planetJoke = 
		'<speak>' + 
		'How do you organize a party in space <break time="0.5"/>'+
		'You plan it out'+
		'<audio clipBegin="50s" clipEnd="55s" src="https://actions.google.com/sounds/v1/science_fiction/alien_song.ogg"/>'+
		'</speak>';
    
    const robotChildJoke =
        '<speak>' + 
		'What did the robot call his father? <break time="1.5"/>'+
		'Data'+
		'<audio clipEnd="2s" src="https://actions.google.com/sounds/v1/human_voices/babies_coo.ogg"/>'+
		'</speak>';
          
    
    //Call the jokes below
    

    var jokeList = [fartJoke,planetJoke,bearJoke,robotChildJoke]; //populate joke list
    var jokeNb = Math.floor(Math.random()*jokeList.length); //get a random joke number
    agent.add(jokeList[jokeNb]); //get that joke
    
    /*
    if(requestedContent == "joke"){    
    	agent.add(fartJoke);
    }
    */
    
    //agent.add(``);
  }
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('name', nameHandler);
  intentMap.set('heroLegalName', heroNameHandler);
  intentMap.set('contentAsk', contentHandler);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
