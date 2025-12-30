import supabase from "./config.js";

let inputFile = document.getElementById("file");
let button = document.getElementById("upload");
let card = document.getElementById("cards");
let editFile = document.getElementById("editFile");

// let imageFile = document.getElementById("img");

let publicURLOfImage; //Empty varaible that store url of image later //name of image that sotre //file name
let imgUrl ; //public url
let updateImgUrl ; //url of updated image

//Make function to upload file to database in storage
async function uploadFile() {
  // console.log(inputFile);
  // console.log(button);
  // console.log(imageFile);

  console.log(inputFile.files); //The list of files selected in input box
  console.log(inputFile.files[0]); //The file we upload
  console.log(inputFile.files[0].name); //The name of file we upload

  const file = inputFile.files[0]; //The file we upload
  const fileName = inputFile.files[0].name; //The name of file we upload

  try {
    //Supabase docs >> storage >> File buckets >> Upload a file >> copy function
    const { data, error } = await supabase
      .storage
      .from("Profiles-Images")
      .upload(fileName, file);
    var FileData = data.fullPath.split("/"); //Cuts string at every /, makes array: ["profiles", "myphoto.jpg"]
    console.log(FileData[1]);

    publicURLOfImage = FileData[1];

    //Supabase docs >> storage >> File buckets >> Retrive public URL >> copy function
    const { data:mydata } = supabase    //Rename data to mydata to avoid confusion
      .storage
      .from("Profiles-Images")
      .getPublicUrl(publicURLOfImage);

      if(mydata){
        //console.log('Image uploaded')
        //alert('Image uploaded')
        console.log(mydata.publicUrl);
        // imageFile.src = mydata.publicUrl ;
        // imageFile.style.width = '150px'
        imgUrl = mydata.publicUrl ;

        //Uploaded image will save in database table
        // Supabase docs >> database >> insert data >> copy function
        const { error } = await supabase
        .from('Images')
        .insert({ imagesURL: imgUrl })

        if(error){
        console.log(error);
        }
        else{
          alert("Picture uploaded successfully")
          showImage()
        }

      }
      else{
        console.log('Fail to upload')
        alert('Fail to upload')
      }
  }
  
  catch (error) {
    console.log('Error in showing image ' + error);
  }
}

//Call function
button.addEventListener("click", uploadFile);

//database ma jo images hyn unko page/document pe show krna
// supabase docs >> database >> fetch data >> copy function
async function showImage() {
  try {
    const { data, error } = await supabase
    .from('Images')
    .select('*')

    if(data){
      cards.innerHTML = '';
      data.forEach(card => {
        //console.log(card);
        cards.innerHTML += `<div class="card" style="width: 18rem;">
        <img class="card-img-top" src="${card.imagesURL}" alt="Card image cap">
        <div class="card-body">
        <button class="btn btn-primary" onClick='startEdit(${card.id},"${card.imagesURL}")'>Edit</button>
        <button class="btn btn-primary mt-3" onClick='deleteImage(${card.id},"${card.imagesURL}")'>Delete</button>
        </div>
      </div>`
      })
    }

  }
  
  catch (error) {
    console.log('Error in showing image ' + error);
  }
}

//Call function
showImage()

//Function to edit image
window.startEdit = (id , imgUrl) => {
  editFile.click();
  console.log(imgUrl.split('/Profiles-Images/')[1])
  window.changeName = imgUrl.split('/Profiles-Images/')[1]   //URL se sirf image ka naam lana
  window.imageId = id ;
}

editFile.addEventListener('change' , async (e) => {
  console.log(changeName , imageId);
  console.log(e.target.files[0]);

  // supabase docs >> Storage >> File buckets >> Delete files in a bucket >> copy function
  const { data, error } = await supabase
  .storage
  .from("Profiles-Images")
  .remove([changeName])

  if(error){
    console.log('Error in removing file from database ', error);
  }

  const newFile = e.target.files[0];
  const newFileName = e.target.files[0].name;

  // supabase docs >> Storage >> File buckets >> Upload a File >> copy function
  const { data:updateData , error:updateError } = await supabase
      .storage
      .from("Profiles-Images")
      .upload(newFileName, newFile, {
      cacheControl: '3600',
      upsert: true
    })

      if(updateData){
  var FileData = updateData.fullPath.split('/')
  console.log(FileData[1]);

  updateImgUrl = FileData[1] ;

  // supabase docs >> Storage >> File buckets >> Retrieve public URL >> copy function
  const { data:newPublicUrl } = supabase
  .storage
  .from("Profiles-Images")
  .getPublicUrl(updateImgUrl)

  if (newPublicUrl) {
    // supabase docs >> database >> update data >> copy function
    const { error } = await supabase
  .from('Images')
  .update({ imagesURL: newPublicUrl.publicUrl })
  .eq('id', imageId)
  }
  else{
    console.log('Error in updating data '+updErr);
  }
  showImage()
  
}
})

//Delete function
window.deleteImage = async (id, imgUrl) => {
  if (!confirm("Are you sure you want to delete this image?")) {
    return;
  }
  
  try {
    // Extract filename from URL
    const filename = imgUrl.split('/Profiles-Images/')[1];
    
    // Delete from storage
    const { data, error } = await supabase
      .storage
      .from("Profiles-Images")
      .remove([filename]);
    
    if (error) {
      console.log('Error in removing file from storage ', error);
      return;
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('Images')
      .delete()
      .eq('id', id);
    
    if (dbError) {
      console.log('Error in removing from database ', dbError);
    } else {
      alert("Image deleted successfully");
      showImage();
    }
    
  } catch (error) {
    console.log('Error in deleting image ', error);
  }
}