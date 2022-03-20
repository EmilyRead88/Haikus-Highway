import { useEffect, useState } from "react";
import wordListApiCall from "./wordListApiCall";


const WordList = (props) => {
    //set during OnClick event and use this to send next API call:
    const [chosenWord, setChosenWord] = useState("");
    const [wordList, setWordList] = useState([]);
    const [initialWord, setInitialWord] = useState("");

    // establish initial word from user word handed down via props:
    if (props.initialWord) {
        // ensure initialWord only updates ONCE:
        if (props.initialWord !== initialWord) {
            setInitialWord( props.initialWord )
        }
    }
    // once we've received the initial word from the user set chosen word manually ONCE:
    useEffect(() => {
        setChosenWord(initialWord)
    }, [initialWord])

    // call API for each chosen word:
    useEffect(() => {
        wordListApiCall(chosenWord, setWordList)
    }, [chosenWord])

    const handleClick = (wordParam, syllableParam) => {
        props.handleSyllables(syllableParam);
        props.handleHaikuWords(wordParam);
        setChosenWord(wordParam);
    }


    return (
        <>
            <h3>I'm the words!</h3>
            {
                wordList[0]
                    ? 
                        wordList.map((word) => {
                            console.log(word)
                            return (
                                <button onClick={ function() { handleClick(word.word, word.numSyllables) } } >{ word.word }</button>
                            )
                        }) 
                    : null
            }
        </>
    )
}

export default WordList;