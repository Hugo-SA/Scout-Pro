import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/card';
import { mensagemSucesso, mensagemErro } from '../../components/toastr'; 
import Stack from '@mui/material/Stack';
import { IconButton, Tabs, Tab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add'; 
import DeleteIcon from '@mui/icons-material/Delete'; 

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

function ListagemEstatisticasCompeticao() {
  const { idCompeticao } = useParams();
  const navigate = useNavigate();

  const [competicao, setCompeticao] = React.useState(null);
  const [timesParticipantes, setTimesParticipantes] = React.useState([]);
  const [partidasJogadas, setPartidasJogadas] = React.useState([]);
  const [partidasFuturas, setPartidasFuturas] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [timesMap, setTimesMap] = useState({}); 

  async function buscarCompeticao() {
    try {
      if (!idCompeticao || isNaN(idCompeticao)) {
        console.error('idCompeticao inválido:', idCompeticao);
        setCompeticao(null);
        return;
      }

      const idCompeticaoInt = parseInt(idCompeticao, 10);
      const compResponse = await axios.get(`${BASE_URL}/competicao/${idCompeticaoInt}`);
      setCompeticao(compResponse.data);

      const idTimes = compResponse.data.idTimes || [];
      const timesData = [];
      const tempTimesMap = {}; 
      for (const idTime of idTimes) {
        try {
          const timeResponse = await axios.get(`${BASE_URL}/times/${idTime}`);
          timesData.push(timeResponse.data);
          tempTimesMap[timeResponse.data.id] = timeResponse.data.nome; 
        } catch (error) {
          console.error(`Erro ao buscar time ${idTime}:`, error);
        }
      }
      setTimesParticipantes(timesData);
      setTimesMap(tempTimesMap); 

    } catch (error) {
      console.error(' Erro ao buscar competição:', error);
      mensagemErro('Erro ao buscar competição');
      setCompeticao(null);
    }
  }

  async function buscarPartidas() {
    try {
      const response = await axios.get(`${BASE_URL}/partidas`);
      const todasPartidas = response.data || [];

      const idCompeticaoInt = parseInt(idCompeticao, 10);

      const partidasFiltradas = todasPartidas.filter((partida) => {
        return parseInt(partida.idCompeticao, 10) === idCompeticaoInt;
      });

      const agora = new Date();
      const jogadas = partidasFiltradas.filter((partida) => {
        return new Date(partida.data) < agora && partida.concluida; 
      });
      const futuras = partidasFiltradas.filter((partida) => {
        return new Date(partida.data) >= agora && !partida.concluida; 
      });

      setPartidasJogadas(jogadas);
      setPartidasFuturas(futuras);
    } catch (error) {
      console.error('Erro ao buscar partidas:', error);
      mensagemErro('Erro ao buscar partidas da competição.');
      setPartidasJogadas([]);
      setPartidasFuturas([]);
    } finally {
      setLoading(false);
    }
  }

  // Função para adicionar partida
  const adicionarPartida = () => {
    navigate(`/cadastro-partida/${idCompeticao}/nova`);
  };

  // unção para editar partida
  const editarPartida = (idPartidaEdit) => {
    navigate(`/cadastro-partida/${idCompeticao}/${idPartidaEdit}`);
  };

  // Função para excluir partida
  async function excluirPartida(idPartidaExcluir) {
    try {
      await axios.delete(`${BASE_URL}/partidas/${idPartidaExcluir}`);
      mensagemSucesso('Partida excluída com sucesso!');
      buscarPartidas(); // Recarrega as partidas após exclusão
    } catch (error) {
      console.error('Erro ao excluir partida:', error);
      mensagemErro('Erro ao excluir partida.');
    }
  }

  const editarCompeticao = () => {
    navigate(`/cadastro-competicao/${idCompeticao}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setLoading(true);
    buscarCompeticao();
  }, [idCompeticao]);

  useEffect(() => {
    if (competicao) {
      buscarPartidas();
    }
  }, [competicao]);

  if (loading) {
    return (
      <div className='container'>
        <Card title='Carregando...'>
          <div style={{ textAlign: 'center', padding: '20px' }}>
             Carregando estatísticas da competição...
          </div>
        </Card>
      </div>
    );
  }

  if (!competicao) {
    return (
      <div className='container'>
        <Card title='Erro'>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Competição não encontrada
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container'>
      <Card title={`Estatísticas da Competição: ${competicao.nome}`}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <Stack spacing={1} padding={1} direction='row' marginBottom={2}>
                <button
                  onClick={() => navigate('/listagem-competicao')}
                  type='button'
                  className='btn btn-secondary'
                >
                  <ArrowBackIcon style={{ marginRight: '8px' }} />
                  Voltar
                </button>
                <button
                  onClick={editarCompeticao}
                  type='button'
                  className='btn btn-warning'
                >
                  <EditIcon style={{ marginRight: '8px' }} />
                  Editar Competição
                </button>
                <button
                  onClick={adicionarPartida}
                  type='button'
                  className='btn btn-primary'
                >
                  <AddIcon style={{ marginRight: '8px' }} />
                  Adicionar Partida
                </button>
              </Stack>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#375a7f',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #ddd',
                }}
              >
                <h5 style={{ marginBottom: '15px', color: '#e9ecef' }}>
                   Informações da Competição
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  <div>
                    <strong>Data Início:</strong> {competicao.dataInicio || '-'}
                  </div>
                  <div>
                    <strong>Data Término:</strong> {competicao.dataTermino || '-'}
                  </div>
                  <div>
                    <strong>Times Participantes:</strong> {timesParticipantes.length}
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  {timesParticipantes.map((time) => (
                    <span
                      key={time.id}
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        margin: '2px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {time.nome}
                    </span>
                  ))}
                </div>
              </div>

              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                style={{ marginBottom: '20px' }}
              >
                <Tab label={`Partidas Jogadas (${partidasJogadas.length})`} />
                <Tab label={`Partidas Futuras (${partidasFuturas.length})`} />
              </Tabs>

              {tabValue === 0 && (
                <div>
                  <h5 style={{ marginBottom: '15px', color: '#333' }}>
                     Partidas Já Realizadas
                  </h5>
                  {partidasJogadas.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999' }}>
                      Nenhuma partida realizada ainda nesta competição.
                    </p>
                  ) : (
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th scope='col'>Data</th>
                          <th scope='col'>Time Casa</th>
                          <th scope='col'>Placar</th>
                          <th scope='col'>Time Visitante</th>
                          <th scope='col'>Ações</th> 
                        </tr>
                      </thead>
                      <tbody>
                        {partidasJogadas.map((partida) => (
                          <tr key={partida.id}>
                            <td>{partida.data || '-'}</td>
                            <td>{timesMap[partida.timeCasa] || partida.timeCasa || '-'}</td> 
                            <td>
                              <strong>{partida.placar || '0-0'}</strong>
                            </td>
                            <td>{timesMap[partida.timeVisitante] || partida.timeVisitante || '-'}</td> 
                            <td>
                              <Stack spacing={1} padding={0} direction='row'>
                                <IconButton
                                  aria-label='edit'
                                  onClick={() => editarPartida(partida.id)}
                                  title='Editar Partida'
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  aria-label='delete'
                                  onClick={() => excluirPartida(partida.id)}
                                  title='Excluir Partida'
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {tabValue === 1 && (
                <div>
                  <h5 style={{ marginBottom: '15px', color: '#333' }}>
                     Partidas Futuras
                  </h5>
                  {partidasFuturas.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999' }}>
                      Nenhuma partida futura programada para esta competição.
                    </p>
                  ) : (
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th scope='col'>Data</th>
                          <th scope='col'>Time Casa</th>
                          <th scope='col'>Time Visitante</th>
                          <th scope='col'>Ações</th> 
                        </tr>
                      </thead>
                      <tbody>
                        {partidasFuturas.map((partida) => (
                          <tr key={partida.id}>
                            <td>{partida.data || '-'}</td>
                            <td>{timesMap[partida.timeCasa] || partida.timeCasa || '-'}</td> 
                            <td>{timesMap[partida.timeVisitante] || partida.timeVisitante || '-'}</td> 
                            <td>
                              <Stack spacing={1} padding={0} direction='row'>
                                <IconButton
                                  aria-label='edit'
                                  onClick={() => editarPartida(partida.id)}
                                  title='Editar Partida'
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  aria-label='delete'
                                  onClick={() => excluirPartida(partida.id)}
                                  title='Excluir Partida'
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/*  Tabela de Classificação */}
              <div style={{ marginTop: '30px' }}>
                <h5 style={{ marginBottom: '15px', color: '#333' }}>
                   Tabela de Classificação
                </h5>
                {timesParticipantes.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#999' }}>
                    Nenhum time participante ainda.
                  </p>
                ) : (
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th scope='col'>Posição</th>
                        <th scope='col'>Time</th>
                        <th scope='col'>Jogos</th>
                        <th scope='col'>Vitórias</th>
                        <th scope='col'>Empates</th>
                        <th scope='col'>Derrotas</th>
                        <th scope='col'>Gols Marcados</th>
                        <th scope='col'>Gols Sofridos</th>
                        <th scope='col'>Saldo de Gols</th>
                        <th scope='col'>Pontos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timesParticipantes.map((time, index) => (
                        <tr key={time.id}>
                          <td>#{index + 1}</td>
                          <td>
                            <strong>{time.nome}</strong>
                          </td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div style={{ textAlign: 'center', marginTop: '10px', color: '#999', fontSize: '14px' }}>
                  * Tabela será atualizada conforme as partidas forem jogadas
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemEstatisticasCompeticao;