import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/card';
import { mensagemSucesso, mensagemErro } from '../../components/toastr';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

const baseURL = `${BASE_URL}/jogadores`;

function ListagemJogadoresPorTime() {
  const { idTime } = useParams();
  const navigate = useNavigate();

  const [dados, setDados] = React.useState(null);
  const [nomeTime, setNomeTime] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  async function buscarNomeTime() {
    try {
      if (!idTime || isNaN(idTime)) {
        mensagemErro('id do time inválido');
        setNomeTime('Time inválido');
        return;
      }

      const idTimeInt = parseInt(idTime, 10);

      const response = await axios.get(`${BASE_URL}/times/${idTimeInt}`);
      setNomeTime(response.data.nome);
    } catch (error) {
      try {
        const response = await axios.get(`${BASE_URL}/times`);
        const idTimeInt = parseInt(idTime, 10);
        const timeEncontrado = response.data.find(
          (time) => time.id === idTimeInt
        );
        if (timeEncontrado) {
          setNomeTime(timeEncontrado.nome);
        } else {
          mensagemErro('Time não encontrado:', idTimeInt);
          setNomeTime('Time não encontrado');
        }
      } catch (fallbackError) {
        mensagemErro(' Erro no fallback:', fallbackError);
        setNomeTime('Erro ao carregar time');
      }
    }
  }

  async function buscarJogadores() {
    try {
      if (!idTime || isNaN(idTime)) {
        mensagemErro(' id do time inválido:', idTime);
        setDados([]);
        return;
      }

      const response = await axios.get(baseURL);
      const idTimeInt = parseInt(idTime, 10);

      const jogadoresFiltrados = response.data.filter(
        (jogador) => parseInt(jogador.idTime, 10) === idTimeInt
      );

      setDados(jogadoresFiltrados);
    } catch (error) {
      mensagemErro('Erro ao buscar os jogadores');
      setDados([]);
    } finally {
      setLoading(false);
    }
  }

  const editar = (id) => {
    navigate(`/cadastro-jogador/${id}`);
  };

  async function excluir(id) {
    try {
      await axios.delete(`${baseURL}/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      mensagemSucesso('Jogador excluído com sucesso!');
      setDados(dados.filter((dado) => dado.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir o jogador');
    }
  }

  useEffect(() => {
    setLoading(true);
    buscarNomeTime();
    buscarJogadores(); // eslint-disable-next-line
  }, [idTime]);

  if (loading) {
    return (
      <div className='container'>
        <Card title='Carregando...'>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Carregando jogadores...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container'>
      <Card title={`Jogadores do Time: ${nomeTime}`}>
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
              </Stack>

              {dados && dados.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999' }}>
                  Nenhum jogador cadastrado para este time.
                </p>
              ) : (
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th scope='col'>Nome</th>
                      <th scope='col'>Posição</th>
                      <th scope='col'>Pé Preferido</th> 
                      <th scope='col'>Altura</th> 
                      <th scope='col'>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados &&
                      dados.map((dado) => (
                        <tr key={dado.id}>
                          <td>{dado.nome}</td>
                          <td>{dado.posicao || '-'}</td>
                          <td>{dado.pePreferido || '-'}</td> 
                          <td>{dado.altura ? `${dado.altura} cm` : '-'}</td>
                          <td>
                            <Stack spacing={1} padding={0} direction='row'>
                              <IconButton
                                aria-label='edit'
                                onClick={() => editar(dado.id)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                aria-label='delete'
                                onClick={() => excluir(dado.id)}
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
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemJogadoresPorTime;