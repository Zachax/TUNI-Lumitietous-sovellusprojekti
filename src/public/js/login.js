const loginbutton = document.getElementById("loginlink"); 

loginbutton.addEventListener("click", function(){login("show");});

const closebutton = document.getElementById("closelink"); 

closebutton.addEventListener("click", function(){login("hide");});


function login(showorhide) {
  if(showorhide == "show"){
    console.log("täällä?");
    document.getElementById("popupbox").style.visibility="visible";
  }else if(showorhide == "hide"){
    console.log("entä täällä?");
    document.getElementById("popupbox").style.visibility="hidden"; 
  }
}
