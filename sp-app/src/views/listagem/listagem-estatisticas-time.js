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
          <div className='fm-text-center fm-p-20 fm-text-primary'>
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
          <div className='fm-text-center fm-p-20 fm-text-primary'>
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
                  className='btn btn-primary' 
                >
                  <EditIcon style={{ marginRight: '8px' }} />
                  Editar Estatísticas
                </button>
              </Stack>

              {/* INFORMAÇÕES DO TIME */}
              <div className='fm-info-block fm-mb-20'>
                <h5 className='fm-info-title fm-text-primary'>
                   Informações do Time
                </h5>
                <div className='fm-grid-info fm-text-primary'> {/* FORÇA O TEXTO PRINCIPAL A SER BRANCO AQUI */}
                    <div>
                        <strong className='fm-text-muted'>Nome:</strong> <span className='fm-text-primary'>{time.nome}</span>
                    </div>
                    <div>
                        <strong className='fm-text-muted'>ID Técnico:</strong> <span className='fm-text-primary'>{time.idTecnico || '-'}</span>
                    </div>
                </div>
              </div>

              {/* BLOCOS DE ESTATÍSTICAS */}
              <div className='fm-stats-grid fm-mb-20'>
                
                {/* Gols (Ouro/Destaque) */}
                <div className='fm-stat-card fm-stat-muted'>
                  <h6 className='fm-stat-label fm-text-primary'> Gols</h6>
                  <div className='fm-stat-value'>
                    {estatisticas?.gols || 0}
                  </div>
                </div>
                

                {/* Vitorias (Verde/Sucesso) */}
                <div className='fm-stat-card fm-stat-green-soft'>
                  <h6 className='fm-stat-label fm-text-primary'> Vitorias</h6>
                  <div className='fm-stat-value'>
                    {estatisticas?.vitorias || 0}
                  </div>
                </div>


                {/* Derrotas (Vermelho/Perigo) */}
                <div className='fm-stat-card fm-stat-danger'>
                  <h6 className='fm-stat-label fm-text-primary'> Derrotas</h6>
                  <div className='fm-stat-value'>
                    {estatisticas?.derrotas || 0}
                  </div>
                </div>


                {/* Empates (Azul/Neutro) */}
                <div className='fm-stat-card fm-stat-blue'>
                  <h6 className='fm-stat-label fm-text-primary'> Empates</h6>
                  <div className='fm-stat-value'>
                    {estatisticas?.empates || 0}
                  </div>
                </div>

                {/* Partidas Jogadas (Cinza/Muted) */}
                <div className='fm-stat-card fm-stat-muted'>
                  <h6 className='fm-stat-label fm-text-primary'> Partidas Jogadas</h6>
                  <div className='fm-stat-value'>
                    {estatisticas?.partidasJogadas || 0}
                  </div>
                </div>

                {/* Cartões (Vermelho/Destaque) */}
                <div className='fm-stat-card fm-stat-danger'>
                  <h6 className='fm-stat-label fm-text-primary'> Cartões</h6>
                  <div className='fm-stat-value'>
                    {estatisticas?.cartoes || 0}
                  </div>
                </div>
              </div>

              
              {/* RESUMO DE ESTATÍSTICAS (TABELA) */}
              <div className='fm-mt-30'>
                <h5 className='fm-info-title fm-text-primary'>
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
                      <td className='fm-text-stat-gold'>
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
                      <td className='fm-text-stat-green'>
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
                      <td className='fm-text-stat-blue'>
                        {estatisticas?.partidasJogadas
                          ? (
                              (estatisticas?.empates || 0) /
                              (estatisticas?.partidasJogadas || 1)
                            ).toFixed(2)
                          : '0.00'}
                      </td>
                    </tr>
                    <tr>
                      <td> Derrotas</td>
                      <td>{estatisticas?.derrotas || 0}</td>
                      <td className='fm-text-stat-danger'>
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
                      <td className='fm-text-stat-danger'>
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
                      <td className='fm-text-primary'>-</td>
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