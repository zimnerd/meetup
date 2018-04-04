function fetchCategories(url, cb, data) {
    if (!data) data = [];

    $.ajax({

        dataType: 'jsonp',
        method: 'get',
        url: url,
        success: function (result) {
            localStorage.setItem('categories', JSON.stringify(result.results));
            //add to data
            data.push.apply(data, result.results);
            cb(data);
        }
    });
}

$(document).ready(function () {

    var $results = $("#categories");

    $results.html("<p>Finding meetups with Ionic in the description.</p>");

    if (localStorage.getItem("categories") === undefined) {
        fetchCategories("https://api.meetup.com/2/categories?key=26835622050174f704649284f64542d")
    }

    var s = "<form>";
    var res = JSON.parse(localStorage.getItem('categories'));
    for (var i = 0; i < res.length; i++) {
        var category = res[i];
        s += "<label class='radio-inline'><input type='radio' name='category'  id='" + category.id +"' value='" + category.id +"'>" + category.name + "</label><br>";
    }
    s +="</form>"
    $results.html(s);
    $("#"+localStorage.getItem('default_id')).prop("checked", true);

    $("input[name='category']").unbind('change').change(function(event){
        var id = $("input[name='category']:checked").val();
        localStorage.setItem('default_id',id)
    })

});
