

{
    //method to submit the form data for new post using AJAX 

    let createPost = function(){
        let newpostForm = $('#new-post-form');

        newpostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                    type: 'post',
                    url: '/posts/create',
                    data: newpostForm.serialize(),
                    success: function(data){
                        let newPost = newPostDom(data.data.post , data.data.username);
                        $('#posts-list-container>ul').prepend(newPost);
                        deletePost($(' .delete-post-button', newPost));

                        new Noty({
                            theme: 'metroui',
                            type: 'success',
                            layout: 'bottomRight',
                            text: 'Post created successfully!',
                            timeout: 3000 // Notification will automatically close after 3 seconds
                        }).show();
                    
                    


                    }, error: function(error){
                        console.log(error.resposeText)

                        new Noty({
                            theme: 'metroui',
                            type: 'error',
                            layout: 'bottomRight',
                            text: 'An error occurred. Please try again later.',
                            timeout: 3000
                        }).show();
                    
                    }
            });
        });
    }

     //method to create post in Dom

     let newPostDom =function(post, username){
       

        return $(`<li id="post-${post._id}">
        <p>

            <small>
            <a class="delete-post-button" href="/posts/destroy/${ post._id}"><i class="fa-solid fa-trash" style="color: #000000;"></i></a>
            </small>

            ${post.content}
            <br>
            <small>
            ${username}
            </small>
            <br>
            <small>

                  <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                    0 Likes
                  </a>
        
             </small>
             
        </p>
        <div class="post-comments">
            
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type here to add comment..." required>
                    <input type="hidden" name="post"  value="${post._id}">
                    <input type="submit" value="Add comment">
                </form>
            
          <%  }  %>
               
          <div class="post-comment-list">
            <ul id="post-comments-${post._id}">
                
            </ul>
          </div>
            
          </div>
          </li>`)
     }
     

     //method to delete a post from dom

     let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            let deleteUrl = $(deleteLink).prop('href');
            console.log('Delete URL:', deleteUrl); // Log the delete URL
   

            $.ajax({
               type: 'get',
               url: deleteUrl, // Use the deleteUrl variable
               success: function(data){
                  $(`#post-${data.data.post_id}`).remove();

                  new Noty({
                    theme: 'metroui',
                    type: 'success',
                    layout: 'bottomRight',
                    text: 'Post deleted successfully!',
                    timeout: 3000
                }).show();
          


               }, error: function(error){
                console.log(error.responseText)
                new Noty({
                    theme: 'metroui',
                    type: 'error',
                    layout: 'bottomRight',
                    text: 'An error occurred. Please try again later.',
                    timeout: 3000
                }).show();
            
               }
            });
        });
     }

 







   $(document).ready(function() {
    // Call the createPost function to handle new post submissions
    createPost();

    // Loop through each delete link for posts and attach event handlers
    $('.delete-post-button').each(function() {
        deletePost($(this));
    });
});
}