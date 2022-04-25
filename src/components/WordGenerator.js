import { useState, useEffect } from "react";
import WordList from "./WordList";
import DisplayHaiku from "./DisplayHaiku";
import SaveYourHaiku from "./SaveYourHaiku";

const WordGenerator = (props) => {

    //state containing the selected words for Haiku
    const [currentHaiku, setCurrentHaiku] = useState([[], [], []]);
    //state containing total current syllables used as user selects
    const [currentSyllables, setCurrentSyllables] = useState(0);
    //allowed syllables will be used to display the # of syllables left on the side for user help 
    const [allowedSyllables, setAllowedSyllables] = useState(17);
    //state to track what the last word in the array is 
    const [lastWord, setLastWord] = useState("");
    //state to count the clicks of the remove button to trigger the re-render of lastWord
    const [removeClicks, setRemoveClicks] = useState(0);

    //track total number of syllables used as each word is added to the currentHaiku array
    const trackingSyllableCount = (numOfSyllables) => {
        setCurrentSyllables(currentSyllables + numOfSyllables);
    }

    //once currentSyllables is being tracked, figure out which line to push the incoming object to (object holding both the word and the key)
    const whichLine = (wordParam, syllablesParam, idParam) => {
        if (currentSyllables < 5) {
            let placeholder = currentHaiku;
            placeholder[0].push({ word: wordParam, key: idParam, syllables: syllablesParam });
            setCurrentHaiku(placeholder);
        } else if (currentSyllables < 12 && currentSyllables >= 5) {
            let placeholder = currentHaiku;
            placeholder[1].push({ word: wordParam, key: idParam, syllables: syllablesParam });
            setCurrentHaiku(placeholder);
        } else if (currentSyllables >= 12) {
            let placeholder = currentHaiku;
            placeholder[2].push({ word: wordParam, key: idParam, syllables: syllablesParam });
            setCurrentHaiku(placeholder);
        } else {
            console.log('too many syllables');
        }
    }

    //once current syllables has rendered, triggers setAllowedSyllables to a base # of available syllables (depending on line of poem), and subtracting current syllables from total amount 
    useEffect(() => {
        if (currentSyllables < 5) {
            let syllablesLeft = 5 - currentSyllables;
            setAllowedSyllables(syllablesLeft);
        } else if (currentSyllables >= 5 && currentSyllables < 12) {
            let syllablesLeft = 12 - currentSyllables;
            setAllowedSyllables(syllablesLeft);
        } else if (currentSyllables >= 12) {
            let syllablesLeft = 17 - currentSyllables;
            setAllowedSyllables(syllablesLeft);
        }
        // console.log(`allowed syllables is ${allowedSyllables}`);
    }, [currentSyllables]);

    //after the remove button is clicked, receive the parameters representing each line of the haiku, and set the current Haiku to each line
    const removeFromHaiku = (haikuParam, haikuParam2, haikuParam3) => {
        setCurrentHaiku([[...haikuParam], [...haikuParam2], [...haikuParam3]]);
        
        //based on the newly updated haiku, go through each line of the array and inside each word, and get the sum of total syllables
        let sum = 0
        currentHaiku.forEach((array) => {
            for (let i = 0; i < array.length; i++) {
                const syllables = array[i].syllables;
                sum += syllables
            }
            setCurrentSyllables(sum);
        })
        setRemoveClicks(removeClicks + 1);
    }

    //pull the last word of the last array, and set that word as the lastWord state
    useEffect(() => {
        //if removeClicks exists (aka has been clicked at all), then reset lastWord
        if (removeClicks) {
            let lastWord;
            //if the last line exists, pull the last word object from the array
            if (currentHaiku[2][0]) {
                lastWord = currentHaiku[2].slice(-1);
                setLastWord(lastWord[0].word);
            } else if (currentHaiku[1][0]) {
                lastWord = currentHaiku[1].slice(-1);
                setLastWord(lastWord[0].word);
            } else {
                lastWord = currentHaiku[0].slice(-1);
                setLastWord(lastWord[0].word);
            }
        }
    }, [removeClicks])


    return (
        <div className="wordBox">
            <DisplayHaiku
                currentHaiku={currentHaiku}
                currentSyllables={currentSyllables}
                removeFromHaiku={removeFromHaiku}
            />
            {allowedSyllables != 0 ? <p className="syllablesLeft">you have {allowedSyllables} syllables left for this line</p> : null}
            <WordList
                currentHaiku={currentHaiku}
                initialWord={props.initialWord}
                handleSyllables={trackingSyllableCount}
                handleHaikuWords={whichLine}
                allowedSyllables={allowedSyllables}
                currentSyllables={currentSyllables}
                newWord={lastWord}
            />
            {
                currentSyllables === 17 ? <SaveYourHaiku
                    currentHaiku = {currentHaiku}/> : null
            }
        </div>
    )
}

export default WordGenerator;
