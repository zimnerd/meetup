function fetchGroups(url, cb, data) {
    if (!data) data = [];

    $.ajax({

        dataType: 'jsonp',
        method: 'get',
        url: url,
        success: function (result) {
            console.log('back with ' + result.data.length + ' results');
            console.dir(result);
            //add to data
            data.push.apply(data, result.data);
                cb(data);

        }
    });

}


$(document).ready(function () {


    if (localStorage.getItem('default_id') !== undefined) {
        var c = localStorage.getItem('default_id');
    }
    else {
        alert("Please set a preferred category")
        window.location = 'settings.html'
    }

    var res = JSON.parse(localStorage.getItem('categories'));

    var filter_ids = [];
    var filteredArray = res.filter(function (cat) {
        return cat.id == c;
    })[0];
    $("#preferred_category").text("Preferred Category: " + filteredArray.name)

    var $results = $("#groups");

    $results.html("<p>Finding groups....</p>");

    initaliseGroups()

    function initaliseGroups() {


        fetchGroups('https://api.meetup.com/find/groups?key=26835622050174f704649284f64542d&category=' + c + '&location=johannesburg', function (res) {
            console.log("totally done");
            console.dir(res);

            var s = "";
            for (var i = 0; i < res.length; i++) {
                var group = res[i];
                s += "<div class='col-md-12'> <div class='col-md-2'>";
                if (group.group_photo && group.group_photo.thumb_link) {
                    s += "<img src=\"" + group.group_photo.thumb_link + "\" align=\"left\">";
                }
                else {
                    s += "<img src=\"img/default.jpg\" align=\"left\">";
                }
                s += "</div> <div class='col-md-10'> <h4> <a href='" + group.link + "'>" + group.name + "</a></h4>";

                s += "<p>Location: " + group.city + ", " + group.state + " " + group.country + "</p><br clear=\"left\"></div></div>";
            }
            $results.html(s);

        });
    }

    var s = "<form>";
    for (var i = 0; i < res.length; i++) {
        var category = res[i];
        s += "<label class='checkbox-inline'><input type='checkbox' class='checkbox filteropt' name='categories[]'  id='" + category.id + "' value='" + category.id + "'>" + category.name + "</label><br>";
    }
    s += "</form>"
    $("#filter").html(s);
    $(".filteropt").unbind('click').click(function () {
        var $selected = $('input[name=categories]:checked');
        $selected.each(function (data) {
            // Do stuff here with this
            console.log($(this).val())
        })
    });
    $('body').on('change', 'input', function () {
        $("input").unbind('change')

        c = localStorage.getItem('default_id')
        if ($(this).prop('checked') === true) {
            if ($(this).val() != localStorage.getItem('default_id')) {

                filter_ids.push($(this).val())
            }

        }
        else {
            filter_ids.splice(filter_ids.indexOf($(this).val()), 1);
        }
        // Do stuff here with this
        console.log(filter_ids);

        $.each(filter_ids, function (index, val) {
            c += "," + val;
        });

        initaliseGroups()

    });


});