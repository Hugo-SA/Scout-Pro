import React from 'react';

import ListagemUsuarios from './views/listagem/listagem-usuarios';
import ListagemCompeticao from './views/listagem/listagem-competicao';
import ListagemJogador from './views/listagem/listagem-jogador';
import ListagemTecnico from './views/listagem/listagem-tecnico';
import ListagemTimes from './views/listagem/listagem-times';

import { Route, Routes, BrowserRouter } from 'react-router-dom';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        {/* Suas outras rotas */}
        <Route path='/listagem-usuarios' element={<ListagemUsuarios />} />
        <Route path='/listagem-competicao' element={<ListagemCompeticao />} />
        <Route path='/listagem-jogador' element={<ListagemJogador />} />
        <Route path='/listagem-tecnico' element={<ListagemTecnico />} />
        <Route path='/listagem-times' element={<ListagemTimes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
