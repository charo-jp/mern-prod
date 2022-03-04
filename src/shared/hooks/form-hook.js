import {useCallback, useReducer} from "react";

// the reason you need to validate the title and description values is to make sure 
// to post valid ones. The moderate place to implement is within this NewPlace.js
// The form has to be valid when submitting.
const formReducer = (state, action) => {
  switch(action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]){
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {value: action.value, isValid: action.isValid}
        },
        isValid: formIsValid
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      }
    default: 
    return state;
  }
};


const useForm = (initialInputs, initialFormValidity) => {
  // dispatch is used to send information to formReducer
  const [formState, dispatch] = useReducer(formReducer, {
    inputs:  initialInputs,
    isValid: initialFormValidity
  })

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({type: "INPUT_CHANGE", value: value, isValid: isValid, inputId: id});
  }, []);


  // [] at the end guarantee that the function is never going to be executed 
  // except the first render.
  
  const setFormData = useCallback( (inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity
    })
  }, [])

  return [formState, inputHandler, setFormData];
}   

export default useForm;