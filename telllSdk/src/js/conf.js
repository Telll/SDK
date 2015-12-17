// conf.js
// put all global var configuration here
module.exports = {
    host:'52.3.72.192:3000',
    home:'http://52.20.194.143',
    upload: "http://52.20.194.143/cgi-bin/telll_upload.pl",
    extime: 3000000,
    dashboardFields: {
       profile: [{
           name:"username",
           value:"",
	   type:"text",
	   size:"30",
           label:"Username",
       },{
           name:"email",
           value:"",
	   type:"text",
	   size:"30",
           label:"E-Mail",
       },{
           name:"password",
           value:"",
	   type:"password",
	   size:"30",
           label:"Password",
       }],
       movies: [{
	   name:"title",
           value:"",
	   type:"text",
	   size:"30",
           label:"Title",
       },{
	   name:"description",
           value:"",
	   type:"hidden",
	   size:"255",
           label:"Description",
       },{
	   name:"url",
           value:"http://",
	   type:"text",
	   size:"30",
           label:"Url",
       },{
	   name:"image",
           value:"http://",
	   type:"text",
	   size:"30",
           label:"Image",
       }],
       tags: [{},{}],
       photolinks: [{},{}],
       clicks: [{},{}],
    },
//
}
