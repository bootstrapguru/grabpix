$(document).ready(function(){
      $mainContainer = $('.unsplash-photos');
      var offset = 0;
var csInterface  = new CSInterface();

  $('.btn-more').on('click',function(){
    offset+= 20;
      fetchData(offset);

    });
  
$('#source').change(function(){
  //alert('sour changed');
    fetchData(0,true);
});
  function fetchData(offset,reload){

      var API_KEY = "0vnPZgYAxI84PbLXDhSsQX3snzk5OSfJdyttEA28en26KvwWQ3&";
      source = $('#source').val();
      link = "http://api.tumblr.com/v2/blog/" + source + ".tumblr.com/posts/photo/?api_key=" + API_KEY + "&offset=";

      if(reload)
      {
        $('.unsplash-photos').html('');
      }

    $.ajax({
      url: link + offset,
      dataType: 'jsonp',
      success: function(results){
        var posts = results.response.posts,
            length= posts.length;
        for(var i=0; i<length; i++){
          var currentPost = results.response.posts[i],
              img_url = currentPost.photos[0].original_size.url,
              small_img_url = currentPost.photos[0].alt_sizes[2].url,
              blogInfo = results.response.blog;
              //addThumbToContainer(img_url,blogInfo.title);
          // todo: cleanup the code below

            
      
                var thumb = $("<div class='image-holder'>" +
        "<img class='image-click' src='"+small_img_url+"'  data-big_image='"+img_url+"'  alt=''>" +
        "<div class='image-description'>" +
            "<ul class='list-inline image-sizes'>" +
                "<li class='one'><a class='image-size thumb' href='#' data-big_image='"+img_url+"'><i class='fa fa-file-image-o '></i><br>Thumb</a></li>" +
                "<li class='two'><a class='image-size medium' href='#' data-big_image='"+img_url+"'><i class='fa fa-image '></i><br>Medium</a></a></li>" +
                "<li class='three'><a class='image-size large' href='#' data-big_image='"+img_url+"'><i class='fa fa-arrows-alt '></i><br>Large</a></a></li>" +
            "</ul>" +
            "<div class='author'>" +
                "<h5>Author Name : <span>manohar</span></h5>" +
            "</div>" +
        "</div>" +
    "</div>").appendTo('.unsplash-photos');



          $('.image-size').on('click',function() {

          var image_url = $(this).data('big_image');
          // alert(image_url);
          $(this).find('i').addClass('fa-circle-o-notch fa-spin');
          downloadAndOpenInPhotoshop(image_url, cleanFileName(image_url));
        
          setTimeout(function(){
             $('fa-circle-o-notch').removeClass('fa-circle-o-notch');
             alert('vj');
          }, 1000);
        })
        }
      }

    });

      // todo: oncomplete hide loading container
  }



    // var thumb = $("<div class='image-container'"+
    //             "<!-- Small screens fallback -->" +
    //             "<img class='image-click' data-big_image='"+img_url+"' src='"+small_img_url+"'/>" +
    //               "<div class='image-caption'>" +
    //                 "<h2>" +
    //                   currentPost.caption +
    //                 "</h2>" +
    //               "</div>"+
    //             "</div>").appendTo('.unsplash-photos');


          // $mainContainer.append(
          //     "<div class='image-container'"+
          //       "<!-- Small screens fallback -->" +
          //       "<img class='image-click' src='"+small_img_url+"'/>" +
          //         "<div class='image-caption'>" +
          //           "<h2>" +
          //             currentPost.caption +
          //             "<span> Powered by " +
          //               "<a href="+ blogInfo.url+" target='_blank'>" +
          //                 blogInfo.title +
          //               "</a>" +
          //             "</span>" +
          //           "</h2>" +
          //         "</div>"+
          //       "</div>");

          // var image_url = $(this).attr('src')
          // alert(image_url);
          // downloadAndOpenInPhotoshop(image_url, cleanFileName(image_url));


var cleanFileName = function(name) {
  name = name.split(' ').join('-');
  return name.replace(/\W/g, '');
};

var createTempFolder = function() {
  var tempFolderName = 'com.adobe.flickr.extension/';
  var tempFolder = '/tmp/' + tempFolderName;
  if (window.navigator.platform.toLowerCase().indexOf('win') > -1) {
    tempFolder = csInterface.getSystemPath(SystemPath.USER_DATA) + '/../Local/Temp/' + tempFolderName;
  }
  window.cep.fs.makedir(tempFolder);
  return tempFolder;
};

var downloadAndOpenInPhotoshop = function(url, name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    if (this.status == 200 || this.status == 304) {
      var uInt8Array = new Uint8Array(this.response);
      var i = uInt8Array.length;
      var binaryString = new Array(i);
      while (i--)
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
      var data = binaryString.join('');
      var base64 = window.btoa(data);

      var downloadedFile = createTempFolder() + name  + '.jpg';
      
      window.cep.fs.writeFile(downloadedFile, base64, cep.encoding.Base64);
      //window.cep.fs.readFile(downloadedFile,cep.encoding.Base64);
      csInterface.evalScript('openDocument("' + downloadedFile + '")');
      //$('.container').masonry('remove');
      //$('.container').masonry('reload');
    }       
  };
  xhr.send();
};

var addThumbToContainer = function(img_url,title) {
  var thumb = $('<div class="thumb"><div class="overlay"></div><img src="' + thumb_url + '" ></img></div>').appendTo('.container');
  
};

  // Call fetchData without offset to get the first 20 images
  fetchData();

  // Use throttle to call just once fetchData without worry to much about
  // re-fatching data with other offset
  // http://underscorejs.org/#throttle
  //var checkForFetching = _.throttle(check, 1200);

  function check(){
    var window_height = $mainContainer.height(),
        document_height = $(window).height(),
        scroll_position = $(window).scrollTop();
    if (window_height - (document_height + scroll_position) < 5000) {
      // increase offset with 20 and re-call fetchData with the new offset
      // todo: add loading container
      offset+= 20;
      fetchData(offset);
    }
  }

});