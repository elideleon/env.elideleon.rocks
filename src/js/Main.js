


// main scss
import '../sass/app.scss';
import $ from 'jquery'


 $( document ).ready(function() {
    console.log('RWADY')
    $.getJSON( 'data/api.json', function( response ) {
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
    });
  });

