import { useEffect, useState } from "react";
import wordListApiCall from "./wordListApiCall";
import axios from "axios";


const WordList = (props) => {
    //set during OnClick event and use this to send next API call:
    const [chosenWord, setChosenWord] = useState("");
    const [wordList, setWordList] = useState([]);
    const [filteredWordList, setFilteredWordList] = useState([])
    const [initialWord, setInitialWord] = useState("");

    const regex = /^[a-zA-Z]+$/;


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
        // manually push first word to haiku
        props.handleHaikuWords(initialWord);
        axios({
            url: "https://api.datamuse.com/words",
            params: {
                sp: initialWord,
                md: "s"
            }
        }).then((returnedData) => {
            // manually push first word syllables to 
            props.handleSyllables(returnedData.data[0].numSyllables)
        })
    }, [initialWord])

    // call API for each chosen word:
    useEffect(() => {
        wordListApiCall(chosenWord, setWordList)
    }, [chosenWord])
    
    // filter returnedWordList:
    useEffect(() => {
        const filteredForSyllables = wordList.filter((word) => {
            // return if syllables are less than allowed syllables and returned result is not a number:
            return word.numSyllables <= props.allowedSyllables && word.word.match(regex)
        })
        if (filteredForSyllables.length <= 20) {
            setFilteredWordList(filteredForSyllables)
        } else {
            let shuffledWords = [];
            while (shuffledWords.length <= 19) {
                const random = filteredForSyllables[Math.floor(Math.random() * filteredForSyllables.length)]
                if (!shuffledWords.includes(random)) {
                    shuffledWords.push(random)
                }
            }
            setFilteredWordList(shuffledWords)
        }
    }, [wordList])

    // handle click on each word:
    const handleClick = (wordParam, syllableParam) => {
        props.handleSyllables(syllableParam);
        props.handleHaikuWords(wordParam);
        setChosenWord(wordParam);
        console.log(wordParam, syllableParam)
    }


    return (
        <>
            <h3>I'm the words!</h3>
            {
                filteredWordList[0]
                    ? 
                        filteredWordList.map((word) => {
                            // console.log(word)
                            return (
                                <li key={word.score}>
                                    <button onClick={function () { handleClick(word.word, word.numSyllables) }} >{word.word}</button>
                                </li>
                            )
                        }) 
                    : null
            }
            {
                props.allowedSyllables
                    ? null
                    : <div className = "buttonContainer" >
                        <button>Save Haiku</button>
                    </div>
            }
            {
                console.log(props.currentHaiku)
            }
        </>
    )
}

export default WordList;