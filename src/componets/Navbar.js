




import React from 'react';


const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white shadow-md shadow-white/10 px-4 py-2 flex items-center justify-between">
      <div className="text-2xl font-bold">SMARTPLUGIN</div>
      <button className="bg-blue-900 hover:bg-blue-700 hover:cursor-pointer px-4 py-1 m-1 rounded text-white font-semibold text-xl">
        LOGIN
      </button>
    </div>
  );
};

export default Navbar;


