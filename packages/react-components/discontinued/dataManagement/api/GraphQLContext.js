import React, {useState} from 'react'
const GraphQLContext =  React.createContext();

export const useGraphQLContext = () => {
    const value = React.useContext(GraphQLContext);
    if (!value) {
        throw new Error('You probably forgot to use <GraphQLContextProvider>.');
    }
    return value;
};

export const GraphQLContextProvider = ({ children }) => {
    const [query, setQuery] = useState({ query: '', limit: 1, offset: 0 });

    return (
        <GraphQLContext.Provider value={{ query, setQuery }}>
            {children}
        </GraphQLContext.Provider>
    );
}



