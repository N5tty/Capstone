import { Home, Settings, User } from 'react-feather';

const Navbar = ({ selectedElement }) => {
  return (
    <div className="navbar">
      <div className='route'>
        <p><Home size="15"/> / {selectedElement}</p>
        <p>{selectedElement}</p>
      </div>
      <div className="tabs">
        <User size="20"/> 
        <Settings size="20"/>
      </div>
    </div>
  );
};

export default Navbar;
