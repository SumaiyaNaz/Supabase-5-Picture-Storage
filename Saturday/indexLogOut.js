import supabase from "./config.js";

let logOut = document.getElementById('logOut');

async function logOutUser(e) {
    e.preventDefault()
    try {
        const { error } = await supabase.auth.signOut()

    if(error){
        console.log(error)
    }
    else{
        alert('Log Out Successfully');
        location.href = 'index.html'
    }
    } 
    catch (err) {
        console.log(err)
    }
    
}

logOut.addEventListener('click',logOutUser)

//Fetching data => user name

let userName = document.getElementById('userName')

async function userFetchData() {
    try {
        const { data, error } = await supabase.auth.getUser()
        console.log(data)
        if(data){
        userName.innerHTML = data.user.user_metadata.name
    }
    } catch (err) {
        console.log(err);
    }
}

userFetchData()
