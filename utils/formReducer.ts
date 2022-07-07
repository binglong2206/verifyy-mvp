// A reducer contains the funciton to make changes to state object depending on depatch action
// State is defined by default
// Reducer gets called when the dispatch() function is called
// action/param is just a normal param by dispatch(), is empty until defined

export function loginFormReducer(state: any, object: any) {
  // Use spread operator to merge any properties with same key
  return { ...state, ...object };
}
