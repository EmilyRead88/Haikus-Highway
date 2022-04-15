import firebase from './firebase';
import { getDatabase, ref, push } from 'firebase/database';
import { useState } from 'react';

const SaveYourHaiku = (props)=>{

     const [saveButton, setSaveButton] = useState("Save Your Haiku");
     const [buttonEnabled, setButtonEnabled] = useState(false)
     const database = getDatabase(firebase);
     const dbRef = ref(database);
     

     const handleClick = ()=> {
          push(dbRef, props.currentHaiku);
          setSaveButton("Saved");
          setButtonEnabled(true);
     }



     return(
          <div className="buttonContainer">
               <button
               disabled= {buttonEnabled}
               onClick= {handleClick} className="saveButton">{saveButton}</button>
          </div>
     )     
}

export default SaveYourHaiku;