import React from 'react';

import ListagemUsuarios from './views/listagem/listagem-usuarios';
import ListagemCompeticao from './views/listagem/listagem-competicao';
import ListagemJogador from './views/listagem/listagem-jogador';
import ListagemTecnico from './views/listagem/listagem-tecnico';
import ListagemTimes from './views/listagem/listagem-times';
import CadastroTecnico from './views/cadastro/cadastro-tecnico'
import CadastroTime from './views/cadastro/cadastro-time'
import CadastroUsuario from './views/cadastro/cadastro-usuario'

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
        <Route path='/cadastro-tecnico/:idParam?' element={<CadastroTecnico />} />
        <Route path='/cadastro-usuarios/:idParam?' element={<CadastroUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
