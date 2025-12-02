import React from 'react';

import ListagemUsuarios from './views/listagem/listagem-usuarios';
import ListagemCompeticao from './views/listagem/listagem-competicao';
import ListagemJogador from './views/listagem/listagem-jogador';
import ListagemTecnico from './views/listagem/listagem-tecnico';
import ListagemTimes from './views/listagem/listagem-times';
import CadastroTecnico from './views/cadastro/cadastro-tecnico'
import CadastroTime from './views/cadastro/cadastro-time'
import CadastroUsuario from './views/cadastro/cadastro-usuario'
import CadastroJogador from './views/cadastro/cadastro-jogador'
import ListagemJogadoresPorTime from './views/listagem/listagem-jogadores-por-time';
import ListagemTecnicoPorTime from './views/listagem/listagem-tecnico-por-time';
import ListagemCompeticoesPorTime from './views/listagem/listagem-competicoes-por-time';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ListagemEstatisticasJogador from './views/listagem/listagem-estatisticas-jogador'; 
import CadastroEstatisticasJogador from './views/cadastro/cadastro-estatisticas-jogador'; 
import CadastroCompeticao from './views/cadastro/cadastro-competicao';
import ListagemEstatisticasTime from './views/listagem/listagem-estatisticas-time';
import CadastroEstatisticasTime from './views/cadastro/cadastro-estatisticas-time';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/listagem-usuarios' element={<ListagemUsuarios />} />
        <Route path='/listagem-competicao' element={<ListagemCompeticao />} />
        <Route path='/listagem-jogador' element={<ListagemJogador />} />
        <Route path='/listagem-tecnico' element={<ListagemTecnico />} />
        <Route path='/listagem-times' element={<ListagemTimes />} />
        <Route path='/cadastro-tecnico/:idParam?' element={<CadastroTecnico />} />
        <Route path='/cadastro-usuarios/:idParam?' element={<CadastroUsuario />} />
        <Route path='/cadastro-time/:idParam?' element={<CadastroTime />} />
        <Route path='/cadastro-jogador/:idParam?' element={<CadastroJogador />} />
        <Route path='/jogadores-por-time/:idTime?' element={<ListagemJogadoresPorTime />} />
        <Route path="/tecnico-por-time/:idTime" element={<ListagemTecnicoPorTime />} />
        <Route path="/competicoes-por-time/:idTime" element={<ListagemCompeticoesPorTime />} />
        <Route path="/cadastro-competicao" element={<CadastroCompeticao />} /> 
        <Route path="/cadastro-competicao/:idParam" element={<CadastroCompeticao />} /> 
        <Route path="/estatisticas-jogador/:idJogador" element={<ListagemEstatisticasJogador />} /> 
        <Route path="/cadastro-estatisticas-jogador/:idJogador" element={<CadastroEstatisticasJogador />} />
        <Route path="/estatisticas-time/:idTime" element={<ListagemEstatisticasTime />} />
        <Route path="/cadastro-estatisticas-time/:idTime" element={<CadastroEstatisticasTime />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
