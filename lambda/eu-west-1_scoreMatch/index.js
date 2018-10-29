'use strict';

const Alexa = require('alexa-sdk');
const request = require('request'); 
const Helpers = require('func.js');

const APP_ID = "amzn1.ask.skill.936453a8-3e7c-4edc-8bbf-df5b7688a9c3"

const SKILL_NAME = 'Score Match';
const HELP_MESSAGE = 'Je peux vous donner le score d\'un match. De quel match voulez-vous connaitre le résultat? ';
const HELP_REPROMPT = 'De quel match?';
const STOP_MESSAGE = 'Au revoir!';

const greetings = [
    'Bonjour, quel match vous intéresse?',
    'Salut, quel score vous voulez connaitre?',
    'Bonjour, c\'est la journée ligue 1, quel score voulez vous connaitre?',
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
                const idTeam1 = Helpers.getTeamId(team1)
                const idTeam2 = Helpers.getTeamId(team2)
                var options = {
                    url: 'https://api.football-data.org/v2/teams/'+idTeam1+'/matches/',
                    headers:{
                        'X-Auth-Token' : '090168ae007648df9b7e583867c8cbef'
                    }
                };
                request.get(options, (error, response, body)=> {
                    console.log('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    //console.log('body:', body); // Print the body

                    var matches = Helpers.createMatchesSortedByDateJSON(body);
                    var match = Helpers.getFirstMatchBetweenTwoTeam(matches,idTeam1,idTeam2);
                    var response = Helpers.getMatchWinnerString(match);
                    this.emit(':tell',response)
                })
        },
        'score_oneTeam' : function(){
            if (event.request.dialogState !== "COMPLETED" && !event.request.intent.slots.team.value){
                this.emit(":delegate");
             } 
             else 
             {
                const team  = event.request.intent.slots.team.value;
                const idTeam = Helpers.getTeamId(team);
                var options = {
                    url: 'https://api.football-data.org/v2/teams/'+idTeam+'/matches/',
                    headers:{
                        'X-Auth-Token' : '090168ae007648df9b7e583867c8cbef'
                    }
                };
                request.get(options, (error, response, body)=> {
                    console.log('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    //console.log('body:', body); // Print the body

                    var matches = Helpers.createMatchesSortedByDateJSON(body);
                    var response = Helpers.getMatchWinnerString(matches[0]);
                    this.emit(':tell', response)
                })
                
             }
            
        },
        'scoreDate': function()   {
            if(event.request.dialogState !== "COMPLETED" && !event.request.intent.slots.team.value)
            {
                this.emit(":delegate");
            }
            else
            {
                var team = event.request.intent.slots.team.value;
                const date  = event.request.intent.slots.date.value;

                this.emit(":tell","Le score de "+team+" pour le "+date)
            }
          
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
