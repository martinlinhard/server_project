var slider = {0:true, 1:true, 2:true, 3:true}

$(document).ready(function(){  
    $("input").prop('checked', true);

    $("input").on("click", function(){
        var id = parseInt($(this).attr("sliderId"));
        if($(this).is(":checked")){
            $(this).parent().css("background", "rgb(14, 161, 38)");
            slider[id-1] = true;

            if(id == 4){
                if(!$(".slideOne input").is(":checked")){
                    $(".slideOne label").click();
                    $(".slideOne").css("background", "rgb(14, 161, 38)");
                }

                if(!$(".slideTwo input").is(":checked")){
                    $(".slideTwo label").click();
                    $(".slideTwo").css("background", "rgb(14, 161, 38)");
                }

                if(!$(".slideThree input").is(":checked")){
                    $(".slideThree label").click();
                    $(".slideThree").css("background", "rgb(14, 161, 38)");
                }

                for(var i = 0; i < 3; i++){
                    slider[i] = true;
                }
            }
        }else{
            $(this).parent().css("background", "rgb(182, 37, 11)");
            slider[id-1] = false;
            
            if(id < 4 && slider[3]){
                $(".slideFour label").click();
                slider[3] = false;
                $(".slideFour").css("background", "rgb(182, 37, 11)");
            }
        }

        if(slider[0] && slider[1] && slider[2] && !slider[3]){
            slider[3] = true;
            $(".slideFour label").click();
            $(".slideFour").css("background", "rgb(14, 161, 38)");
        }

        reloadShowingSettings();
    });
});

function reloadShowingSettings(){
    var images = document.getElementsByTagName('img'); 
    

  $("html").fadeTo("slow", 0.0, function(){


    if(slider[3] == true){
        for(var i = 0; i < images.length; i++){
            var parent = images[i].parentElement;

            if(!parent.classList.contains("show")){
                parent.classList.add("show");
            }
        }
    }

    if(slider[0] == true){
        for(var i = 0; i < images.length; i++){
            var parent = images[i].parentElement;

            if(images[i].classList.contains("Elias") &&
               !parent.classList.contains("show")){
                parent.classList.add("show");       
            }
        }
    }else{
        for(var i = 0; i < images.length; i++){
            var parent = images[i].parentElement;

            if(images[i].classList.contains("Elias") &&
               parent.classList.contains("show")){
                parent.classList.remove("show");      
            }
        }
    }

    if(slider[1] == true){
        for(var i = 0; i < images.length; i++){
            var parent = images[i].parentElement;

            if(images[i].classList.contains("Martin") &&
               !parent.classList.contains("show")){
                parent.classList.add("show");       
            }
        }
    }else{
        for(var i = 0; i < images.length; i++){
            var parent = images[i].parentElement;

            if(images[i].classList.contains("Martin") &&
               parent.classList.contains("show")){
                parent.classList.remove("show");      
            }
        }
    }

    if(slider[2] == true){
        for(var i = 0; i < images.length; i++){
            var parent = images[i].parentElement;

            if(images[i].classList.contains("Alex") &&
               !parent.classList.contains("show")){
                parent.classList.add("show");       
            }
        }
    }else{
        for(var i = 0; i < images.length; i++){
            var parent = images[i].parentElement;

            if(images[i].classList.contains("Alex") &&
               parent.classList.contains("show")){
                parent.classList.remove("show");      
            }
        }
    }

    $("html").fadeTo("slow", 1.0);
  });
}

function preview(src){
    // In production:   
    // src = src.substring(22);

    // Local:
    src = "../" + src.substring(22);
    $(".preview").css("display", "block");
    $(".preview").removeClass("animated fadeOut");
    $(".preview").addClass("animated fadeIn");
    $(".preview img").removeClass("animated zoomOut");
    $(".preview img").addClass("animated zoomIn");
    $("#back").css("display", "none");
    $(window).scrollTop(0);
    $("html").css("overflow", "hidden");
    document.getElementById("preview_content").src = src;
}


function closePreview(){
    $("html").css("overflow", "auto");
    $(".preview").removeClass("animated fadeIn");
    $(".preview").addClass("animated fadeOut");
    $(".preview img").removeClass("animated zoomIn");
    $(".preview img").addClass("animated zoomOut");
    $("#back").css("display", "block");
    setTimeout(function(){
        $(".preview").css("display", "none");
        $("#back").css("display", "block");
    }, 900);
}
