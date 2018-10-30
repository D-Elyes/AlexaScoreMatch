'use strict';

const Alexa = require('alexa-sdk');
const request = require('request'); 
const Helpers = require('func.js');
const AmazonDateParser = require('amazon-date-parser');

const APP_ID = "amzn1.ask.skill.936453a8-3e7c-4edc-8bbf-df5b7688a9c3"

const SKILL_NAME = 'Score Match';
const HELP_MESSAGE = "Pour connaitre le dernier résultat d'une équipe vous pouvez demandez : donne moi le score du PSG<break time='1s'/>"
+"Ou bien : C'est quoi le score du match entre PSG et Marseille<break time='1s'/>"+
"Vous pouvez aussi demandé : C'est quoi les scores de la semaine derniére";
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
            this.emit(':ask',greetingArr[greetingIndex]+HELP_MESSAGE);
        },
        'donne_score': function() {  
                const team1  = event.request.intent.slots.teamone.value;
                const team2  = event.request.intent.slots.teamtwo.value;
                const idTeam1 = Helpers.getTeamId(team1)
                const idTeam2 = Helpers.getTeamId(team2)
                const dateSlot = event.request.intent.slots.date.value;
                if(idTeam1 == "error" || idTeam2 =="error")
                {
                    this.emit(":ask","Désolé je ne connais que les équipe de la ligue 1 <break time='1s'/>Voulez vous connaitre le résultat d'un autre match?")
                }
                else
                {
                    var url = ""
                    if(dateSlot)
                    {
                        
                        var date = new AmazonDateParser(dateSlot);
                        var dateDebut = date.startDate.getFullYear() + "-" +("0" + (date.startDate.getMonth() + 1)).slice(-2)+ "-"+("0" + date.startDate.getDate()).slice(-2);
                        var dateFin = date.endDate.getFullYear() + "-"+("0" +(date.endDate.getMonth() + 1)).slice(-2)+"-"+("0" + (date.endDate.getDate()+1)).slice(-2);
                        url = 'https://api.football-data.org/v2/teams/'+idTeam1+'/matches?dateFrom='+dateDebut+'&dateTo='+dateFin;
                    }
                    else{
                        url = 'https://api.football-data.org/v2/teams/'+idTeam1+'/matches/'
                    }
                    var options = {
                        url: url,
                        headers:{
                            'X-Auth-Token' : '090168ae007648df9b7e583867c8cbef'
                        }
                    };
                    request.get(options, (error, response, body)=> {
                            var matches = Helpers.createMatchesSortedByDateJSON(body);
                            if(!matches)
                        {
                            var response ="Je n'ai trouvé aucun match<break time='1s'/>Voulez vous connaitre le résultat d'un autre match?"
                            this.emit(':ask',response)
                        }
                        else
                        {
                            var match = Helpers.getFirstMatchBetweenTwoTeam(matches,idTeam1,idTeam2);
                            if(!match)
                            {
                                var response ="Je n'ai trouvé aucun match<break time='1s'/>Voulez vous connaitre le résultat d'un autre match?"
                                this.emit(':ask',response)
                            }
                            else
                            {
                                var response =  Helpers.getMatchWinnerString(match);
                                response += "<break time='1s'/>Voulez vous connaitre le résultat d'un autre match?"
                                this.emit(':ask',response)
                            }
                        }
                      
                        
                    })
                }
               
        },
        'score_oneTeam' : function(){
            if (event.request.dialogState !== "COMPLETED" && !event.request.intent.slots.team.value){
                this.emit(":delegate");
             } 
             else 
             {
                const team  = event.request.intent.slots.team.value;
                const idTeam = Helpers.getTeamId(team);
                const dateSlot = event.request.intent.slots.date.value;
                if(idTeam == "error")
                {
                    this.emit(":ask","Désolé je ne connais que les équipe de la ligue 1 <break time='1s'/>Voulez vous connaitre le résultat d'un autre match?")
                }
                else
                {
                    var url = ""
                    if(dateSlot)
                    {
                        
                        var date = new AmazonDateParser(dateSlot);
                        var dateDebut = date.startDate.getFullYear() + "-" +("0" + (date.startDate.getMonth() + 1)).slice(-2)+ "-"+("0" + date.startDate.getDate()).slice(-2);
                        var dateFin = date.endDate.getFullYear() + "-"+("0" +(date.endDate.getMonth() + 1)).slice(-2)+"-"+("0" + (date.endDate.getDate()+1)).slice(-2);
                        url = 'https://api.football-data.org/v2/teams/'+idTeam+'/matches?dateFrom='+dateDebut+'&dateTo='+dateFin;
                    }
                    else{
                        url = 'https://api.football-data.org/v2/teams/'+idTeam+'/matches/'
                    }

                var options = {
                    url: url,
                    headers:{
                        'X-Auth-Token' : '090168ae007648df9b7e583867c8cbef'
                    }
                };
                request.get(options, (error, response, body)=> {
         
                    var matches = Helpers.createMatchesSortedByDateJSON(body);
                    if(!matches)
                    {
                        var response ="Je n'ai trouvé aucun match<break time='1s'/>Voulez vous connaitre le résultat d'un autre match?"
                        this.emit(':ask',response)
                    }
                    else
                    {
                        var match = Helpers.getFirstMatchOfOneTeam(matches,idTeam);
                        if(!match)
                        {
                            var response ="Je n'ai trouvé aucun match<break time='1s'/>Voulez vous connaitre le résultat d'un autre match?"
                            this.emit(':ask',response)
                        }
                        else
                        {
                        var response = Helpers.getMatchWinnerString(match);
                        response += "<break time='1s'/>Voulez vous connaitre le résultat d'un autre match?"
                        this.emit(':ask', response)
                        }
                    }
                   
                })
                
             }
            }
            
        },
        'scoreWeek' : function(){
            var date = new AmazonDateParser(event.request.intent.slots.date.value);
            var dateDebut = date.startDate.getFullYear() + "-" +("0" + (date.startDate.getMonth() + 1)).slice(-2)+ "-"+("0" + date.startDate.getDate()).slice(-2);
            var dateFin = date.endDate.getFullYear() + "-"+("0" +(date.endDate.getMonth() + 1)).slice(-2)+"-"+("0" + date.endDate.getDate()).slice(-2);
                
            var options = {
                    url: 'https://api.football-data.org/v2/matches?competitions=2015&dateFrom='+dateDebut+"&dateTo="+dateFin,
                    headers:{
                        'X-Auth-Token' : '090168ae007648df9b7e583867c8cbef'
                    }
                };  
               
                request.get(options, (error, response, body)=> {
                
                    var matches = JSON.parse(body);
                    var response = ""
                    for(var i =0; i< matches.matches.length;i++)
                    {
                        response += Helpers.getMatchWinnerString(matches.matches[i]) +"<break time='1s'/>\n";
                    }
                    response+="Voulez vous connaitre le résultat d'un autre match?"
                    
                    this.emit(':ask',response)
                })    
            
        },
        
        /*'scoreDate': function()   {
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
          
    }*/  
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
