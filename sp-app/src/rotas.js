import React from 'react';

import ListagemUsuarios from './views/listagem/listagem-usuarios';
import ListagemCompeticoes from './views/listagem/listagem-competicoes';
import ListagemJogadores from './views/listagem/listagem-jogadores';
import ListagemTecnicos from './views/listagem/listagem-tecnicos';
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
        <Route path='/listagem-competicoes' element={<ListagemCompeticoes />} />
        <Route path='/listagem-jogadores' element={<ListagemJogadores />} />
        <Route path='/listagem-tecnicos' element={<ListagemTecnicos />} />
        <Route path='/listagem-times' element={<ListagemTimes />} />
        <Route path='/cadastro-tecnicos/:idParam?' element={<CadastroTecnico />} />
        <Route path='/cadastro-times/:idParam?' element={<CadastroTime />} />
        <Route path='/cadastro-usuarios/:idParam?' element={<CadastroUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;