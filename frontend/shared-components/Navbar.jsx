import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/citizen">Citizen Portal</Link></li>
      <li><Link to="/admin">Admin Portal</Link></li>
      <li><Link to="/employee">Gov Employee</Link></li>
      <li><Link to="/partner">Partner Portal</Link></li>
    </ul>
  </nav>
);

export default Navbar;
