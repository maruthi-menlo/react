import { reactLocalStorage } from 'reactjs-localstorage';

export class FsnetAuth{

    // Check if the user loggedin or not
    // the user logged in it will returns ture
    // Otherwise it will return false
    
    isAuthenticated(){
        let userDetails = reactLocalStorage.get('userData');
        if(userDetails === "null" || userDetails === undefined){
            return false;
        }else{
            return true;
        }
    }

}