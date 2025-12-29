import supabase from "./config.js";

let inputFile = document.getElementById("file");
let button = document.getElementById("upload");
let imageFile = document.getElementById("img");

let publicURLOfImage; //Empty varaible that store url of image later

//Make function
async function uploadFile() {
  console.log(inputFile);
  console.log(button);
  console.log(imageFile);

  console.log(inputFile.files); //The list of files selected in input box
  console.log(inputFile.files[0]); //The file we upload
  console.log(inputFile.files[0].name); //The name of file we upload

  const file = inputFile.files[0]; //The file we upload
  const fileName = inputFile.files[0].name; //The name of file we upload

  try {
    //Supabase docs >> storage >> File buckets >> Upload a file
    const { data, error } = await supabase
      .storage
      .from("Profile Image Files")
      .upload(fileName, file);
    var FileData = data.fullPath.split("/"); //Cuts string at every /, makes array: ["profiles", "myphoto.jpg"]
    console.log(FileData[1]);

    publicURLOfImage = FileData[1];

    //Supabase docs >> storage >> File buckets >> Retrive public URL
    const { data:mydata } = supabase    //Rename data to mydata to avoid confusion
      .storage
      .from("Profile Image Files")
      .getPublicUrl(publicURLOfImage);

      if(mydata){
        console.log('Image uploaded')
        alert('Image uploaded')
        console.log(mydata.publicUrl);
        imageFile.src = mydata.publicUrl ;
        imageFile.style.width = '500px'
      }
      else{
        console.log('Fail to upload')
        alert('Fail to upload')
      }
  }
  
  catch (error) {
    console.log(error);
  }
}

//Call function
button.addEventListener("click", uploadFile);
