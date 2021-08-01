import React from 'react';

const sfcontext = React.createContext(null);

export const SFProvider = sfcontext.Provider;
export const SFConsumer = sfcontext.Consumer;

export default sfcontext;
