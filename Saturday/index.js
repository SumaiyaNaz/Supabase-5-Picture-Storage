import supabase from "./config.js";
let signUp = document.getElementById('signUp')

async function signUpUser(e) {
    e.preventDefault()

    let sname = document.getElementById('exampleInputName1')
    let sphone = document.getElementById('exampleInputPhone1')
    let semail = document.getElementById('exampleInputEmail1')
    let spaass = document.getElementById('exampleInputPassword1')

    try{
        if(!sname.value){
            alert('Enter your name')
            return
        }
        else if(!sphone.value){
            alert('Enter your phone number')
            return
        }
        else if(!semail.value){
            alert('Enter your email')
            return
        }
        else if(!spaass.value){
            alert('Enter your password')
            return
        }
        const { data, error } = await supabase.auth.signUp({
            email: semail.value ,
            password: spaass.value ,
            options: {
                data: {
                  name: sname.value ,
                  phone: sphone.value,
                }
              }

          })
          if(data){
            console.log(data);
            alert('Sign Up Successfully');
            location.href = 'indexLogOut.html'
          }
          
    }
    catch(err){
        console.log(err);
    }
}

signUp && signUp.addEventListener('submit',signUpUser)