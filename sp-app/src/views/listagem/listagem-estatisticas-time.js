import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/card';
import { mensagemErro } from '../../components/toastr';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

function ListagemEstatisticasTime() {
  const { idTime } = useParams();
  const navigate = useNavigate();

  const [time, setTime] = React.useState(null);
  const [estatisticas, setEstatisticas] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  async function buscarTime() {
    try {
      if (!idTime || isNaN(idTime)) {
        setTime(null);
        return;
      }

      const idTimeInt = parseInt(idTime, 10);

      const response = await axios.get(`${BASE_URL}/times/${idTimeInt}`);
      setTime(response.data);
    } catch (error) {
      mensagemErro('Erro ao buscar jogador');
      setTime(null);
    }
  }

  async function buscarEstatisticas() {
    try {
      if (!idTime || isNaN(idTime)) {
        setEstatisticas(null);
        return;
      }

      const idTimeInt = parseInt(idTime, 10);

      const response = await axios.get(`${BASE_URL}/estatisticasTimes/${idTimeInt}`);
      setEstatisticas(response.data);
    } catch (error) {
      setEstatisticas({
        idTime: parseInt(idTime, 10),
        gols: 0,
        vitorias: 0,
        derrotas: 0,
        empates: 0,
        cartoes: 0,
        partidasJogadas: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  const editar = () => {
    navigate(`/cadastro-estatisticas-time/${idTime}`);
  };

  useEffect(() => {
    setLoading(true);
    buscarTime();
    buscarEstatisticas(); // eslint-disable-next-line
  }, [idTime]);

  if (loading) {
    return (
      <div className='container'>
        <Card title='Carregando...'>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Carregando estatísticas...
          </div>
        </Card>
      </div>
    );
  }

  if (!time) {
    return (
      <div className='container'>
        <Card title='Erro'>
          <div style={{ textAlign: 'center', padding: '20px' }}>
             Time não encontrado
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container'>
      <Card title={`Estatísticas de ${time.nome}`}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <Stack spacing={1} padding={1} direction='row' marginBottom={2}>
                <button
                  onClick={() => navigate('/listagem-times')}
                  type='button'
                  className='btn btn-secondary'
                >
                  <ArrowBackIcon style={{ marginRight: '8px' }} />
                  Voltar
                </button>
                <button
                  onClick={editar}
                  type='button'
                  className='btn btn-warning'
                >
                  <EditIcon style={{ marginRight: '8px' }} />
                  Editar Estatísticas
                </button>
              </Stack>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #ddd',
                }}
              >
                <h5 style={{ marginBottom: '15px', color: '#333' }}>
                   Informações do Time
                </h5>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                    border: '1px solid #ffc107',
                    textAlign: 'center',
                  }}
                >
                  <h6 style={{ color: '#856404', marginBottom: '10px' }}> Gols</h6>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#f5a623',
                    }}
                  >
                    {estatisticas?.gols || 0}
                  </div>
                </div>
                

                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#d4edda',
                    borderRadius: '8px',
                    border: '1px solid #28a745',
                    textAlign: 'center',
                  }}
                >
                  <h6 style={{ color: '#155724', marginBottom: '10px' }}> Vitorias</h6>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#28a745',
                    }}
                  >
                    {estatisticas?.vitorias || 0}
                  </div>
                </div>


                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                    border: '1px solid #ff0000',
                    textAlign: 'center',
                  }}
                >
                  <h6 style={{ color: '#856404', marginBottom: '10px' }}> Derrotas</h6>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#f5a623',
                    }}
                  >
                    {estatisticas?.derrotas || 0}
                  </div>
                </div>


                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#d1ecf1',
                    borderRadius: '8px',
                    border: '1px solid #17a2b8',
                    textAlign: 'center',
                  }}
                >
                  <h6 style={{ color: '#0c5460', marginBottom: '10px' }}> Empates</h6>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#17a2b8',
                    }}
                  >
                    {estatisticas?.empates || 0}
                  </div>
                </div>

                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#e2e3e5',
                    borderRadius: '8px',
                    border: '1px solid #6c757d',
                    textAlign: 'center',
                  }}
                >
                  <h6 style={{ color: '#383d41', marginBottom: '10px' }}> Partidas Jogadas</h6>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#6c757d',
                    }}
                  >
                    {estatisticas?.partidasJogadas || 0}
                  </div>
                </div>

                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#f8d7da',
                    borderRadius: '8px',
                    border: '1px solid #f5c6cb',
                    textAlign: 'center',
                  }}
                >
                  <h6 style={{ color: '#721c24', marginBottom: '10px' }}> Cartões</h6>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#dc3545',
                    }}
                  >
                    {estatisticas?.cartoes || 0}
                  </div>
                </div>
              </div>

              
              <div style={{ marginTop: '30px' }}>
                <h5 style={{ marginBottom: '15px', color: '#333' }}>
                   Resumo de Estatísticas
                </h5>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th scope='col'>Métrica</th>
                      <th scope='col'>Valor</th>
                      <th scope='col'>Média por Jogo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td> Gols</td>
                      <td>{estatisticas?.gols || 0}</td>
                      <td>
                        {estatisticas?.partidasJogadas
                          ? (
                              (estatisticas?.gols || 0) /
                              (estatisticas?.partidasJogadas || 1)
                            ).toFixed(2)
                          : '0.00'}
                      </td>
                    </tr>
                    <tr>
                      <td> Vitorias</td>
                      <td>{estatisticas?.vitorias || 0}</td>
                      <td>
                        {estatisticas?.partidasJogadas
                          ? (
                              (estatisticas?.vitorias || 0) /
                              (estatisticas?.partidasJogadas || 1)
                            ).toFixed(2)
                          : '0.00'}
                      </td>
                    </tr>
                    <tr>
                      <td> Empates</td>
                      <td>{estatisticas?.empates || 0}</td>
                      <td>
                        {estatisticas?.partidasJogadas
                          ? (
                              (estatisticas?.empates || 0) /
                              (estatisticas?.partidasJogadas || 1)
                            ).toFixed(2)
                          : '0.00'}
                      </td>
                    </tr>
                    <tr>
                      <td> Participações</td>
                      <td>{estatisticas?.derrotas || 0}</td>
                      <td>
                        {estatisticas?.partidasJogadas
                          ? (
                              (estatisticas?.derrotas || 0) /
                              (estatisticas?.partidasJogadas || 1)
                            ).toFixed(2)
                          : '0.00'}
                      </td>
                    </tr>
                    <tr>
                      <td> Cartões</td>
                      <td>{estatisticas?.cartoes || 0}</td>
                      <td>
                        {estatisticas?.partidasJogadas
                          ? (
                              (estatisticas?.cartoes || 0) /
                              (estatisticas?.partidasJogadas || 1)
                            ).toFixed(2)
                          : '0.00'}
                      </td>
                    </tr>
                    <tr>
                      <td> Partidas Jogadas</td>
                      <td>{estatisticas?.partidasJogadas || 0}</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemEstatisticasTime;