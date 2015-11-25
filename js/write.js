jQuery(document).ready( function($) {
    /*
    **  Get value from TinyMCE editor 
    */
    function tmce_getContent(editor_id, textarea_id) {
        if ( typeof editor_id == 'wh_content' ) editor_id = wpActiveEditor;
        if ( typeof textarea_id == 'wh_content' ) textarea_id = editor_id;

        if ( $('#wp-'+editor_id+'-wrap').hasClass('tmce-active') && tinyMCE.get(editor_id) ) {
            return tinyMCE.get(editor_id).getContent();
        }else{
            return $('#'+textarea_id).val();
        }
    }
    
    /*
    **  Upload featured image AJAX
    */ 
    $('#wh_image_upload').change(function(){
        var userFile    =   new FormData();  
        var fileInput   =   $( '#wh_image_upload' )[0].files[0];
        //console.log(fileInput);

        userFile.append('file', fileInput);
        userFile.append('action', 'write_here_img_upload');
        
        $.ajax({
            type: 'POST',
            url: ajax_object.ajax_url,
            data: userFile,
            processData: false,
            contentType: false,
            error: function(jqXHR, textStatus, errorMessage) {
                console.log(errorMessage);
            },
            success: function(data) {
                
                //console.log(data);
                var json = $.parseJSON(data);
                console.log(json.att_id + ' Uploaded!');
                
                $('#attachment_id').val(json.att_id);
                $('#wh_img_preview').css('background-image', 'url('+json.att_url+')');
                $('#wh_img_preview').fadeIn();
                $('#wh_image_upload').fadeOut();
            }
        });
    });

    /*
    **  Remove featured image AJAX
    */
    $('.prv_del').live('click', function() {
        
        var attID = $('#attachment_id').val();

        $.ajax({
            type: 'post',
            url: ajax_object.ajax_url,
            data: {
                action: 'delete_attachment',
                att_ID: attID,
                post_type: 'attachment'
            },
            success: function() {
                console.log(attID + ' Removed!');
                
                $('#wh_image_upload').val('');
                $('#attachment_id').val('');
                $('#wh_img_preview').fadeOut(); 
                $('#wh_image_upload').fadeIn(); 
            }
        });
    });
    
    /*
    **  Validation new_post form and post AJAX
    */
    $('.write-here #new_post').validate({
        rules: {
            title: {
                required: true,
                maxlength: 70
            }
        },
        submitHandler: function(form) {
            // Get content from TinyMCE editor and assign it in hidden field
            $('#wh_content_js').val(tmce_getContent('wh_content', 'wh_content'));
            // Disable submit button
            $('#new_post #submit').attr('disabled', true).val('Submitting!');
            
            // Serialize form data
            dataString = $('#new_post').serialize();     
            
            // Post data AJAX
            $.ajax({
                type: 'POST',
                url: ajax_object.ajax_url,
                action: 'write_here_new_post',
                data: dataString,
                error: function(jqXHR, textStatus, errorThrown){                                        
                    console.error('The following error occured: ' + textStatus, errorThrown);                                                  
                },
                success: function(data) {                                       
                    console.log('Post Added! ' + data);
                    // Redirect to new post
                    window.location.href = data;
                }  
            });
        }
    });

    /*
    **  Validation edit_post form and post AJAX
    */
    $('.write-here #edit_post').validate({
        rules: {
            title: {
                required: true,
                maxlength: 70
            }
        },
        submitHandler: function(form) {
            // Get content from TinyMCE editor and assign it in hidden field
            $('#wh_content_js').val(tmce_getContent('wh_content', 'wh_content'));
            // Disable edit button
            $('#edit_post #submit').attr('disabled', true).val('Updating!');
            
            // Serialize form data
            dataString = $('#edit_post').serialize();     
            
            // Post data AJAX
            $.ajax({
                type: 'POST',
                url: ajax_object.ajax_url,
                action: 'write_here_edit_post',
                data: dataString,
                error: function(jqXHR, textStatus, errorThrown){                                        
                    console.error('The following error occured: ' + textStatus, errorThrown);                                                  
                },
                success: function(data) {                                       
                    console.log('Post Updated! ' + data);
                    // Redirect to new post
                    window.location.href = data;
                }  
            });
        }
    });
    
});