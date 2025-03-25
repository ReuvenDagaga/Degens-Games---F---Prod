import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Main } from './Main';


const Layout = ( {children} ) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Main children={children}/>
      <Footer />
    </div>
  );
};

export default Layout;