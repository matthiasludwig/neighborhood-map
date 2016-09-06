function getData() {
   console.log("getData() has been called with these parameters: ");
   $.ajax({
       url: "https://data.sfgov.org/resource/cuks-n6tp.json",
       type: "GET",
       data: {
           "$limit" : 100,
           "$where" : "date between '2016-08-08T00:00:00' and '2016-08-09T00:00:00'",
           "$order" : "date DESC",
           "$$app_token" : "FOWqIJ6wgZFV3PBnSg7DKip6V"
       },
       // Loading animation
       beforeSend: function(){
           $('.menu').toggle();
           $('#loadingData').show();
           $('body').css("cursor", "progress");
       },
       success: function(data){
           // TODO: DELETE. Just for debugging
           console.log("Retrieved " + data.length + " records from the dataset!");
           // console.log(data);
           createMarker(data);
       },
       complete: function(data){
           // Hiding the loading animation
           $('#loadingData').hide();
           $('.menu').toggle();
           $('body').css("cursor", "default");
       },
       error: function(){
           // TODO Implement Error Handling for failing of ajax Request
           console.log("API could not be loaded");
       }
   });
}
