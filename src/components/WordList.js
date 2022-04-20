import { useEffect, useState } from "react";
import wordListApiCall from "../reusableLogic/wordListApiCall";
import TextInput from './TextInput';
import axios from "axios";


const WordList = (props) => {
    //set during OnClick event and use this to send next API call:
    const [chosenWord, setChosenWord] = useState("");
    const [wordList, setWordList] = useState([]);
    const [filteredWordList, setFilteredWordList] = useState([])
    const [initialWord, setInitialWord] = useState("");
    // set as true when no returned words to show text input:
    const [showInput, setShowInput] = useState(false);

    const regex = /^[a-zA-Z]+$/;


    // console.log(props.newWord);
    // establish initial word from user word handed down via props:
    if (props.initialWord) {
        // ensure initialWord only updates ONCE:
        if (props.initialWord !== initialWord) {
            setInitialWord( props.initialWord )
        }
    }

    const handleNewWord = (word) => {
        axios({
            url: "https://api.datamuse.com/words",
            params: {
                sp: word,
                md: "s"
            }
        }).then((returnedData) => {
            props.handleSyllables(returnedData.data[0].numSyllables)
            props.handleHaikuWords(word, returnedData.data[0].numSyllables, props.currentSyllables);
        })
    }
    // once we've received the initial word from the user set chosen word manually ONCE:
    useEffect(() => {
        setChosenWord(initialWord)
        // manually push first word to haiku
        handleNewWord(initialWord)
        // props.handleHaikuWords(initialWord, props.currentSyllables);
        // axios({
        //     url: "https://api.datamuse.com/words",
        //     params: {
        //         sp: initialWord,
        //         md: "s"
        //     }
        // }).then((returnedData) => {
        //     // manually push first word syllables to 
        //     // console.log(returnedData.data[0]);
        //     props.handleSyllables(returnedData.data[0].numSyllables)
        // })
    }, [initialWord])

    // call API for each chosen word:
    useEffect(() => {
        wordListApiCall(chosenWord, setWordList)
    }, [chosenWord])

    //call API for when the remove button is hit (call based on last word displayed)
    useEffect(()=> {
        if(props.newWord){
            setChosenWord(props.newWord);
        }
    }, [props.newWord])
    
    // filter returnedWordList:
    useEffect(() => {
        const filteredForSyllables = wordList.filter((word) => {
            // return if syllables are less than allowed syllables and returned result is not a number:
            return word.numSyllables <= props.allowedSyllables && word.word.match(regex)
        })
        if (!wordList[0]) {
            setFilteredWordList([])
            setShowInput(true)
        } else if (filteredForSyllables.length <= 20) {
            setFilteredWordList(filteredForSyllables)
            setShowInput(false)
        } else {
            let shuffledWords = [];
            while (shuffledWords.length <= 19) {
                const random = filteredForSyllables[Math.floor(Math.random() * filteredForSyllables.length)]
                if (!shuffledWords.includes(random)) {
                    shuffledWords.push(random)
                }
            }
            setFilteredWordList(shuffledWords)
            setShowInput(false)
        }
    }, [wordList])

    // handle click on each word:
    const handleClick = (wordParam, syllableParam,idParam) => {
        props.handleSyllables(syllableParam);
        props.handleHaikuWords(wordParam, syllableParam, idParam);
        setChosenWord(wordParam);
    }

    const handleUserInput = (userWord) => {
        setChosenWord(userWord)
        handleNewWord(userWord)
        setShowInput(false)
    }

    return (
        <>
            <ul className="wordListContainer">
                {
                    filteredWordList[0]
                        ?
                        filteredWordList.map((word) => {
                            return (
                                <li key={word.score}>
                                    <button className="wordButton" onClick={function () { handleClick(word.word, word.numSyllables, props.currentSyllables) }} >{word.word}</button>
                                </li>
                            )
                        })
                        : null
                }
            </ul>
            {
                showInput
                    ?<TextInput className="haikuPage" allowedSyllables={ props.allowedSyllables } customFunction={ handleUserInput } />
                    :null
            }
        </>
    )
}

export default WordList;