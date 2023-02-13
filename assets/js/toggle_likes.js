class ToggleLike{

    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
        // console.log('inside constructor:',this, typeof(this));
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();

            let self = this;
            // console.log('self',self);

            $.ajax({
                type: 'POST',
                url: $(self).attr('href'), 
                success: function(data){
                    let likesCount = parseInt($(self).attr('data-likes'));
                    // console.log(likesCount);
                    if(data.data.deleted == true){
                        likesCount-=1;
                    }
                    else{
                        likesCount+=1;
                    }
                    
                    $(self).attr('data-likes', likesCount); // we have done this because since this is an ajax request and page is not referensing so post.likes.length will not update so we will update data-likes value maually.
                    $(self).html(`${likesCount} Likes`);
                
                },error : function(err){
                    console.log(err.responseText);
                }
            });

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises, above ajax call can also be written like this.
            // $.ajax({
            //     type: 'POST',
            //     url: $(self).attr('href'),
            // })
            // .done(function(data) {
            //     let likesCount = parseInt($(self).attr('data-likes'));
            //     console.log(likesCount);
            //     if (data.data.deleted == true){
            //         likesCount -= 1;
                    
            //     }else{
            //         likesCount += 1;
            //     }


            //     $(self).attr('data-likes', likesCount);
            //     $(self).html(`${likesCount} Likes`);

            // })
            // .fail(function(errData) {
            //     console.log('error in completing the request');
            // });
        })
    }
};