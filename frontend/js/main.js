$.ajaxSetup({
    beforeSend: function beforeSend(xhr, settings) {
        function getCookie(name) {
            let cookieValue = null;


            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');

                for (let i = 0; i < cookies.length; i += 1) {
                    const cookie = jQuery.trim(cookies[i]);

                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }

            return cookieValue;
        }

        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        }
    },
});

$(document).on("click", ".js-toggle-modal", function(e) {
    e.preventDefault()
    $(".js-modal").toggleClass("hidden")
})
.on("click", ".js-submit", function(e) {
    e.preventDefault()
    const text = $(".js-post-text").val().trim()
    // btn is this js-submit button, as tagged in the base.html file
    const $btn = $(this)

    if(!text.length) {
        return false
    }

    // when the button is pressed, inform user their post is being posted and disable the button
    $btn.prop("disabled", true).text("Posting!")
    // send an ajax post request, which looks for the data type 'post-url' (added to the textarea tag in base.html )
    $.ajax({
        type: 'POST',
        url: $(".js-post-text").data("post-url"),
        // makes text accessible on the backend
        data: {
            text: text
        },
        // on success, return some html
        success: (dataHtml) => {
            $(".js-modal").addClass("hidden");
            $("#posts-container").prepend(dataHtml);
            $btn.prop("disabled", false).text("New Post");
            $(".js-post-text").val('')
        },
        error: (error) => {
            console.warn(error)
            $btn.prop("disabled", false).text("Error");
        }
    });
})