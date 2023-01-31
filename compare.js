"use strict";

/********************************************************************
 Used for comparing characters between guessed word and secret word
 *******************************************************************/

function compare( word, guess ) {  

  let wordCompareObj = {};
  let count = 0;
    
  for( let ch of word.toLowerCase()){
    wordCompareObj[ch] = (!wordCompareObj[ch]) ? 1 : wordCompareObj[ch] + 1;
  }
  
  for( let ch of guess.toLowerCase()){
    if(wordCompareObj[ch] && wordCompareObj[ch] > 0){
        count++;
        wordCompareObj[ch]--;
    }
  }

  return count;
}


module.exports = compare;
