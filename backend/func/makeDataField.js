function makeDataField(arr){
    var dataField=[];
    for(var i in arr){
        dataField.push("'"+arr[i]+"'");
    }
    return dataField;

}

exports.makeDataField=makeDataField;