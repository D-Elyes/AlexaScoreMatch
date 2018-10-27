function getTeamId(teamName){
    var name = teamName.toLowerCase();
    switch (name){
        case "angers" : return 532
        case "amiens" : return 530
        case "bordeaux" : return 526
        case "caen" : return 514
        case "dijon" : return 528
        case "guingamp" : return 538
        case "lille" : return 521
        case "monaco" : return 548
        case "montpellier" : return 518
        case "nantes" : return 543
        case "nice" : return 522
        case "nimes" : return 556
        case "ol" : return 523
        case "om" : return 516
        case "psg" : return 524
        case "reims" : return 547
        case "rennes" : return 529
        case "saint-etienne" : return 527
        case "strasbourg" : return 576
        case "toulouse" : return 511
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
}