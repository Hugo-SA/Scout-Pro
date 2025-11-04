import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';

import NavbarItem from './navbarItem';

function Navbar(props) {
  return (
    <div className='navbar navbar-expand-lg fixed-top navbar-dark bg-primary'>
      <div className='container'>
        <a href='/' className='navbar-brand'>
          SCOUT PRO
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarResponsive'
          aria-controls='navbarResponsive'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarResponsive'>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/listagem-usuarios' label='Usuários' />
            <NavbarItem render='true' href='/listagem-competicao' label='Competições' />
            <NavbarItem render='true' href='/listagem-jogador' label='Jogadores' />
            <NavbarItem render='true' href='/listagem-tecnico' label='Técnicos' />
            <NavbarItem render='true' href='/listagem-times' label='Times' />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
