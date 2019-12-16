function parseSharepointResult(sharepointBody) {
    var retResultList = { results: [] };
    var table = sharepointBody.d.query.PrimaryQueryResult.RelevantResults.Table;
    for (var i = 0; i < table.Rows.results.length; i++) {
        var tableRowCells = table.Rows.results[i].Cells.results;
        var thisResult = {
            'Title': '',
            'Path': '',
            'Author': '',
            'LastModifiedTime': ''
        };

        for (var j = 0; j < tableRowCells.length; j++) {
            var thisCell = tableRowCells[j];
            if (thisCell.Key === 'Title' || thisCell.Key === 'Path' || thisCell.Key === 'Author' || thisCell.Key === 'LastModifiedTime') {
                thisResult[thisCell.Key] = thisCell.Value;
            }
        }
        retResultList.results.push(thisResult);
    }
    return retResultList;
}