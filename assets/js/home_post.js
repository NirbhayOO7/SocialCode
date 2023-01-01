    {
    // method to submit the form data for new post using AJAX 
    let createPost = function(){

        let newPostForm = $("#new-post-form");

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: "post",
                url: "/post/create",
                data: newPostForm.serialize(),
                success: function(data){           //this line data field is different from data mentioned in above line, here data constains the respose sent from the server from this url mentioned above
                    customSuccessNotification("Your post is published!");
                    let newPost = newPostDom(data.data.post, data.user);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost(' .delete-post-button', newPost); // the space before .delete-post-button is neccessary as it defines that the class delete-post-button which is inside newPost object.
                    // call the create comment class
                    new PostComments(data.data.post._id);
                },
                error: function(error){
                    console.log(error.responseText);
                    customFailureNotification(error.responseText);
                }
            })
        })

    }

    // method to create a new post in DOM without loading the page again

    let newPostDom = function(post, user){
        return $(`<li id="post-${post._id}">
        <p>
            <small>
                <!-- both post.id and post._id works as same as post.id will only means converting the post._id to string -->
                <a class="delete-post-button" href="/post/destroy/${post._id}">X</a>      
            </small>
            ${post.content}
            <br>
            <small>
            ${user}
            </small>
        </p>
        <div id="post-comments">
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="type here to add comment..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add comment">
                </form>

            <div id="post-comments-list">
                <ul id="post-comments-${post._id}">
                </ul>
            </div>
        </div>
    </li>`)
    }

    // method to delete the post from DOM

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url: $(deleteLink).prop('href'),   // .prop() will return the value of property href present in deleteLink.
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    customSuccessNotification("Post and associated comments deleted!");
                },error: function(error){
                    console.log(error.responseText);
                    customFailureNotification(error.responseText);
                }
            })
        })
    }


    // function for noty 

    let customSuccessNotification = function(message){
        new Noty({
            theme : 'relax' , 
            text: message,
            type: 'success',
            layout : "topRight",
            timeout : 1500
            
            }).show();
    }

    let customFailureNotification = function(message){
        new Noty({
            theme : 'relax' , 
            text: message,
            type: 'error',
            layout : "topRight",
            timeout : 1500
            
            }).show();
    }

    let convertPostsToAjax = function(){

        $('#posts-list-container>ul>li').each(function(){
            // console.log(this);
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    // deletePost('.delete-post-button');
    createPost();

    convertPostsToAjax();
}