import React, { createContext, useState, useContext } from 'react';

const RoomContext = createContext({
  contextRoom: null,
  setcontextRoom: () => {}
});

export const RoomProvider = ({ children }) => {
  const [contextRoom, setcontextRoom] = useState(null);

  const contextValue = {
    contextRoom,
    setcontextRoom
  };

  return (
    <RoomContext.Provider value={contextValue}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};

export default RoomProvider;