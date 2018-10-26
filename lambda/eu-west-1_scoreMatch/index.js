'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.936453a8-3e7c-4edc-8bbf-df5b7688a9c3"

const SKILL_NAME = 'Score Match';
const HELP_MESSAGE = 'Je peux vous donner le score d\'un match. De quel match voulez-vous connaitre le résultat? ';
const HELP_REPROMPT = 'De quel match?';
const STOP_MESSAGE = 'Au revoir!';

const greetings = [
    'Bonjour, comment puis je vous aider?',
    'Salut, qu\'est ce que je peux faire pour vous?',
    'Bonjour, que souhaitez vous faire?',
];

//=========================================================================================================================================
//=========================================================================================================================================
function buildHandlers(event) {
    var handlers = {
        'LaunchRequest': function () {
            const greetingArr = greetings;
            const greetingIndex = Math.floor(Math.random() * greetingArr.length);
            this.emit(':ask',greetingArr[greetingIndex]);
        },
        'donne_score': function() {
            const team1  = event.request.intent.slots.teamone.value;
            const team2  = event.request.intent.slots.teamtwo.value;
    
            this.emit(':tell',team1 +" vs "+team2)
        },
        'score_oneTeam' : function(){
            const team  = event.request.intent.slots.team.value;
            this.emit(':tell', "Voici le score de "+ team)
        },
        'score_noTeam' : function(){

            this.emit(':tell', "Voici le score de ")
        },  
        'AMAZON.HelpIntent': function () {
            const speechOutput = HELP_MESSAGE;
            const reprompt = HELP_REPROMPT;
    
            this.response.speak(speechOutput).listen(reprompt);
            this.emit(':responseReady');
        },
        'AMAZON.CancelIntent': function () {
            this.response.speak(STOP_MESSAGE);
            this.emit(':responseReady');
        },
        'AMAZON.StopIntent': function () {
            this.response.speak(STOP_MESSAGE);
            this.emit(':responseReady');
        },
    };

    return handlers
}



exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(buildHandlers(event));
    alexa.execute();
};
