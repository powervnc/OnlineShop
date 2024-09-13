import { useState } from "react";
function useInput(initialValue){
    const [value,setValue]=useState(initialValue)
    const reset=()=>{
        setValue("")
    }
   
    const bind={
        value,
        onChange:e=>{
            setValue(e.target.value)
        }
    }
    const validate=()=>{
        if(value==="")
            return false;
        return true;

    }
    return [value,bind,reset,validate]
}
export default useInput