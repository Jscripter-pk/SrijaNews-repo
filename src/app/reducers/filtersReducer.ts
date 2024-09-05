export type State = {
  searchQuery: string;
  category: string;
};

export type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY"; payload: string };

export const initialState: State = {
  searchQuery: "",
  category: "general",
};

export const filtersReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    default:
      return state;
  }
};
