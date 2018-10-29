module.exports = {
    getTeamId : function(teamName){
        var name = teamName.toLowerCase();
        switch (name){
            case "angers":
            case "angers sco" : 
                return 532;
                break;
            case "amiens": 
            case "amiens sc" : 
                return 530;
                break;
            case "bordeaux":
            case "fc girondins de bordeaux": 
            case "fc bordeaux" : 
                return 526;
                break;
            case "caen" :
            case "stade malherbe caen":
                 return 514;
                 break;
            case "dijon" :
            case "dijon football côte d'or":
            case "dijon fc": 
                return 528;
                break;
            case "guingamps" :
            case "en avant de guingamps" : 
                return 538;
                break;
            case "lille" :
            case "losc": 
                return 521;
                break;
            case "monaco" :
            case "as monaco":
                 return 548
                 break;
            case "montpellier" :
            case "mhsc" :
            case "montpellier héreut sc" :
                 return 518;
                 break;
            case "nantes" :
            case "fc nantes": 
                return 543
                break;
            case "nice" : 
            case"ogc nice" : 
                return 522;
                break;
            case "nimes" : 
                return 556;
                break;
            case "ol" :
            case "lyon" :
            case "olympique lyon" :
            case "olympique lyonnais" :
                 return 523;
                 break;
            case "om" :
            case "olympique marseille" :
            case "olympique de marseille" : 
            case "marseille":
                return 516;
                break;
            case "psg" :
            case "paris sg": 
                return 524;
                break;
            case "reims" : 
                return 547;
                break;
            case "rennes" :
            case "stade rennais football club": 
                return 529;
                break;
            case "saint-etienne" :
            case "as saint-etienne": 
                return 527;
                break;
            case "strasbourg" :
            case "racing club strasbourg alsace" :
                 return 576;
                 break;
            case "toulouse" :
            case "toulouse football club":
                 return 511;
                 break;
            default : return "error"
            
        }
    },
    getFirstMatchBetweenTwoTeam : function(matches, idTeam1, idTeam2){
        var matchs = matches.filter(
            function(matches){return (matches.homeTeam.id == (idTeam1) && (matches.awayTeam.id == (idTeam2))
                                        || matches.homeTeam.id == (idTeam2) && (matches.awayTeam.id == (idTeam1)))}
        );
        return matchs[0];
    },
    getMatchWinnerString : function(match){
        if(match.score.winner == "AWAY_TEAM"){
            var winnerTeamName = match.awayTeam.name
            var winnerTeamScore = match.score.fullTime.awayTeam
            var looserTeamName = match.homeTeam.name
            var looserTeamScore = match.score.fullTime.homeTeam
            if(winnerTeamScore == null || looserTeamScore ==null)
            {
                return (winnerTeamName +" et " + looserTeamName + " ont pas encore joué" )
            }
            else
              return (winnerTeamName +" a gagné " + winnerTeamScore + " à " + looserTeamScore + " contre " + looserTeamName)
        }else if(match.score.winner == "HOME_TEAM"){
            var winnerTeamName = match.homeTeam.name
            var winnerTeamScore = match.score.fullTime.homeTeam
            var looserTeamName = match.awayTeam.name
            var looserTeamScore = match.score.fullTime.awayTeam
            if(winnerTeamScore == null || looserTeamScore ==null)
            {
                return (winnerTeamName +" et " + looserTeamName + " ont pas encore joué" )
            }
            else
                return (winnerTeamName +" a gagné " + winnerTeamScore + " à " + looserTeamScore + " contre " + looserTeamName)
        }else{
            var winnerTeamName = match.homeTeam.name
            var winnerTeamScore = match.score.fullTime.homeTeam
            var looserTeamName = match.awayTeam.name
            var looserTeamScore = match.score.fullTime.awayTeam
            if(winnerTeamScore == null || looserTeamScore ==null)
            {
                return (winnerTeamName +" et " + looserTeamName + " ont pas encore joué" )
            }
            else
                return (winnerTeamName +" et " + looserTeamName + " ont fait match nul " + winnerTeamScore + " à " + looserTeamScore )
        }
    },
    createMatchesSortedByDateJSON : function(fetchedData){
        var parsedJson = JSON.parse(fetchedData);
        return parsedJson.matches.sort(function(a,b){return new Date(b.lastUpdated).getTime()- new Date(a.lastUpdated).getTime()});
    },
    getFirstDateOfWeek : function(week,year){
        var d = new Date("Jan 01, " + year + " 01:00:00");
        var w = d.getTime() + 604800000 * (week - 1);
        return new Date(w);
    },
     getDateOfWeek : function(week, year) {
        var day = (1 + (week - 1) * 7); // 1st of January + 7 days for each week
    
        return new Date(year, 0, day);
    }
}
/*function getTeamId(teamName){
    var name = teamName.toLowerCase();
    switch (name){
        case "angers" || "angers sco" : return 532
        case "amiens" || "amiens sc" : return 530
        case "bordeaux" || "fc girondins de bordeaux" || "fc bordeaux" : return 526
        case "caen" || "stade malherbe caen" : return 514
        case "dijon" || "dijon football côte d'or" ||"dijon fc": return 528
        case "guingamps" || "en avant de guingamps" : return 538
        case "lille" || "losc": return 521
        case "monaco" || "as monaco": return 548
        case "montpellier" || "mhsc" || "montpellier héreut sc" : return 518
        case "nantes" || "fc nantes": return 543
        case "nice" || "ogc nice" : return 522
        case "nimes" : return 556
        case "ol" || "lyon" || "olympique lyon" || "olympique lyonnais" : return 523
        case "om" || "olympique marseille" || "olympique de marseille" : return 516
        case "psg" || "paris sg": return 524
        case "reims" : return 547
        case "rennes" || "stade rennais football club": return 529
        case "saint-etienne" || "as saint-etienne": return 527
        case "strasbourg" || "racing club strasbourg alsace" : return 576
        case "toulouse" || "toulouse football club": return 511
        default : return "error"
        
    }
}

function getFirstMatchBetweenTwoTeam(matches, idTeam1, idTeam2){
    var matchs = matches.filter(
        function(matches){return (matches.homeTeam.id == (idTeam1) && (matches.awayTeam.id == (idTeam2))
                                    || matches.homeTeam.id == (idTeam2) && (matches.awayTeam.id == (idTeam1)))}
    );
    return matchs[0];
}

function getMatchWinnerString(match){
    if(match.score.winner = "AWAY_TEAM"){
        var winnerTeamName = match.awayTeam.name
        var winnerTeamScore = match.score.fullTime.awayTeam
        var looserTeamName = match.homeTeam.name
        var looserTeamScore = match.score.fullTime.homeTeam
        return (winnerTeamName +" a gagne " + winnerTeamScore + " a " + looserTeamScore + " contre " + looserTeamName)
    }else if(match.score.winner = "HOME_TEAM"){
        var winnerTeamName = match.homeTeam.name
        var winnerTeamScore = match.score.fullTime.homeTeam
        var looserTeamName = match.awayTeam.name
        var looserTeamScore = match.score.fullTime.awayTeam
        return (winnerTeamName +" a gagne " + winnerTeamScore + " a " + looserTeamScore + " contre " + looserTeamName)
    }else{
        var winnerTeamName = match.homeTeam.name
        var winnerTeamScore = match.score.fullTime.homeTeam
        var looserTeamName = match.awayTeam.name
        var looserTeamScore = match.score.fullTime.awayTeam
        return (winnerTeamName +" et " + looserTeamName + " ont fait match nul " + winnerTeamScore + "a" + looserTeamScore )
    }
}

function createMatchesSortedByDateJSON(fetchedData){
    var parsedJson = JSON.parse(fetchedData);
    return parsedJson.matches.sort(function(a,b){return new Date(a.lastUpdated).getTime()- new Date(b.lastUpdated).getTime()});
}*/