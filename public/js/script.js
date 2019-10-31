let option;

function optionSelect(){
    $('input[type=radio][name=input]').change(function() {
        let container = $('#textInputContainer');
        option = this.value
        container.html('');
        if(option == 'Author'){
            container.append(`<input type = "text" placeholder="Author" id = "authorInput"/>`);
        }
        else if(option == 'Delete'){
            container.append(`<input type = "text" placeholder="Id" id = "idInput"/>`);
        }
        else if(option == 'Post'){
            container.append(`<div id = titleDiv><input type = "text" placeholder="Title" id = "titleInput"/></div>
                              <div id = contentDiv><textarea placeholder="Content" id = "contentInput"></textarea></div>
                              <div id = authorDiv><input type = "text" placeholder="Author" id = "authorInput"/></div>
                              <div id = publishDateDiv><input type = "text" placeholder="Date, ex. 01/20/2011" id = "publishDateInput"/></div>`);
        }
        else if(option == 'Update'){
            container.append(`<div id = idDiv><input type = "text" placeholder="Id" id = "idInput"/></div>
                              <div id = titleDiv><input type = "text" placeholder="Title" id = "titleInput"/></div>
                              <div id = contentDiv><textarea placeholder="Content" id = "contentInput"></textarea></div>
                              <div id = authorDiv><input type = "text" placeholder="Author" id = "authorInput"/></div>
                              <div id = publishDateDiv><input type = "text" placeholder="Date, ex. 01/20/2011" id = "publishDateInput"/></div>`);
        }
    });
}

function submitForm(){
    $('#inputForm').on('submit', function(event){
        event.preventDefault()
        if(option !== undefined){
            if(option == 'All'){
                getAll();
            }
            else if(option == 'Author'){
                getOne($('#authorInput').val());
                $('#authorInput').html('');
            }
            else if(option == "Post"){
                let obj = {
                    title: $('#titleInput').val(),
                    content: $('#contentInput').val(),
                    author: $('#authorInput').val(),
                    publishDate: new Date($('#publishDateInput').val())
                };
                postOne(obj);
            }
            else if(option == "Update"){
                let obj = {
                    id: $('#idInput').val(),
                    title: $('#titleInput').val(),
                    content: $('#contentInput').val(),
                    author: $('#authorInput').val(),
                    publishDate: $('#publishDateInput').val()
                };
                updateOne(obj);
            }
            else if(option == "Delete"){
                deleteOne($('#idInput').val())
            }
        }
    });
}

function getAll(){
    $.ajax({
        url: 'http://localhost:8080/blog-posts',
        method: "GET",
        data: {},
        dataType: "json",
        ContentType : "application/json",
        success: function (resJSON){
            $('#blogPostsList').html('');
            for(let i = 0; i < resJSON.length; i++){
                $('#blogPostsList').append(`<li><div>${resJSON[i].id}</div>
                                            <div>${resJSON[i].title}</div>
                                            <div>${resJSON[i].content}</div>
                                            <div>${resJSON[i].author}</div>
                                            <div>${resJSON[i].publishDate}</div></li>
                `);
            }
        },
        error: function(err){
            console.log(err.statusText);
        }
    });
}

function getOne(val){
    $.ajax({
        url: 'http://localhost:8080/blog-post?author='+val,
        method: "GET",
        data: {},
        dataType: "json",
        ContentType : "application/json",
        success: function (resJSON){
            console.log(resJSON);
            $('#blogPostsList').html('');
            $('#blogPostsList').append(`<li><div>${resJSON.id}</div>
                                        <div>${resJSON.title}</div>
                                        <div>${resJSON.content}</div>
                                        <div>${resJSON.author}</div>
                                        <div>${resJSON.publishDate}</div></li>
            `);
        },
        error: function(err){
            console.log(err.statusText);
        }
    });
}

function postOne(obj){ 
    $.ajax({
        url: 'http://localhost:8080/blog-posts',
        data: obj,
        dataType: "json",
        type: "POST",
        ContentType : "application/json",
        success: function (resJSON){
            $('#blogPostsList').html('');
            $('#blogPostsList').append(`<li><div>${resJSON.id}</div>
                                        <div>${resJSON.title}</div>
                                        <div>${resJSON.content}</div>
                                        <div>${resJSON.author}</div>
                                        <div>${resJSON.publishDate}</div></li>
            `);
        },
        error: function(err){
            console.log(err.statusText);
        }
    });
}

function updateOne(obj){ 
    $.ajax({
        url: 'http://localhost:8080/blog-posts/'+obj.id,
        data: obj,
        dataType: "json",
        type: "PUT",
        ContentType : "application/json",
        success: function (resJSON){
            $('#blogPostsList').html('');
            $('#blogPostsList').append(`<li><div>${resJSON.id}</div>
                                        <div>${resJSON.title}</div>
                                        <div>${resJSON.content}</div>
                                        <div>${resJSON.author}</div>
                                        <div>${resJSON.publishDate}</div></li>
            `);
        },
        error: function(err){
            console.log(err.statusText);
        }
    });
}

function deleteOne(id){ 
    $.ajax({
        url: 'http://localhost:8080/blog-posts/'+id,
        data: {},
        dataType: "json",
        method: "DELETE",
        ContentType : "application/json",
        success: function (resJSON){
            console.log(resJSON.message);
            $('#blogPostsList').html('');
            getAll();
        },
        error: function(err){
            console.log(err.statusText);
        }
    });
}

optionSelect();
submitForm();
