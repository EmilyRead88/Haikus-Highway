import axios from 'axios';
import { useEffect, useState } from 'react';

const TextInput = (props) => {

    const [userInput, setUserInput] = useState("");
    const [syllableCount, setSyllableCount] = useState();
    const [spelling, setSpelling] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userInput) {
            axios({
                url: `https://api.datamuse.com/words?sp=${userInput}&md=s`
            }).then(function (result) {
                setSpelling("")
                const { data } = result;
                if (data[0]) {
                    setSyllableCount(result.data[0].numSyllables)
                    setSpelling(data[0].word)
                }
                setLoading(false);
            }).catch((error) => {
                setErrorMessage("Sorry, our word database is undergoing maintenance")
                setLoading(false);
            })
        } 
    }, [userInput])

    const disableButton = (input) => {
        if (!stringDoesNotPass(input) && syllableCount <= props.allowedSyllables && spelling) {
            return false;
        } else {
            return true;
        }
    }

    const handleChange = (event) => {
        setUserInput(event.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        props.customFunction( userInput );
        setLoading(true);
    }

    const stringDoesNotPass = (string) => {
        if (/^[a-z]+$/i.test(string)) {
            return false;
        } else {
            return true;
        }
    }

    return (
        <>
            <form className={`textInputForm ${ props.className }`} onSubmit={handleSubmit} id="form">
                <input onChange={handleChange} type="text" id="input" name="input" value={userInput}/>
                <label className='sr-only' htmlFor="input">Enter a word for the haiku:</label>
                <button className="submitButton" disabled={ disableButton(userInput) }>Submit</button>
            </form>

            {(!spelling) ? 
                <p>{errorMessage}</p> : null
            }

            {loading ? (
                <p>Retrieving words for your haiku</p>
            ) : (
                null
            )}

            {syllableCount > props.allowedSyllables && userInput ? (
                <p className='warning'>Too many syllables!</p>
            ) : (
                <p className='secondaryWarning'>Within allowed syllable count</p>
            )}

            {stringDoesNotPass(userInput) && userInput && (
                <p className='warning'>No special characters, numbers or spaces please!</p>
            )}
        </>
    )
}

export default TextInput;