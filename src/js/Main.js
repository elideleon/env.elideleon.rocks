


// main scss
import '../sass/app.scss';
import $ from 'jquery'


 $( document ).ready(function() {
    console.log('RWADY')
     /*  $.getJSON( 'data/api.json', function( response ) {
    // $.ajax({
    //   dataType: "json",
    //   url: 'http://dev.elideleon.rocks/api.json',
    //   data: {},
    //   success: function(response){
        console.log('RESPONSE!', response)
        $('.title').text(response.title)
        var tracks = response.tracks;
        var $list = $('.list');
        for ( var i=0,l=tracks.length; i<l; i++ ) {
          console.log(tracks[i])
          $list.append('<li class="track">'+tracks[i].name+'</li>')
        }
    // }  
    })*/


    SC.initialize({
        client_id: "LGDBrAFSvxPdqLo0e8hhWYnhvH2GFCrq",
        redirect_uri: "CALLBACK_URL"
    });

     SC.get("/users/7870486/tracks",function(response){
         for (var i = 0; i < response.length; i++) {
             $("ul").append("<li>" + response[i].title + "</li>");
         }
    

    SC.stream("/tracks/224775986", function(sound){
        sound.play();
        console.log("playing: Background Soundtrack");
    })
}); 
 });
    