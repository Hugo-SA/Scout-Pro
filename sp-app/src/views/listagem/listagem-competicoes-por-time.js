import React, { useState, useEffect } from 'react';
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

const baseURL = `${BASE_URL}/competicao`;

function ListagemCompeticoesPorTime() {
  const { idTime } = useParams();
  const navigate = useNavigate();

  console.log('🔍 idTime recebido:', idTime, 'Tipo:', typeof idTime);

  const [dados, setDados] = React.useState(null);
  const [nomeTime, setNomeTime] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  async function buscarNomeTime() {
    try {
      if (!idTime || isNaN(idTime)) {
        console.error(' idTime inválido:', idTime);
        setNomeTime('Time inválido');
        return;
      }

      const idTimeInt = parseInt(idTime, 10);
      console.log(' Buscando time com ID:', idTimeInt);

      const response = await axios.get(`${BASE_URL}/times/${idTimeInt}`);
      console.log(' Time encontrado:', response.data);
      setNomeTime(response.data.nome);
    } catch (error) {
      console.log(' Erro ao buscar time específico, usando fallback...');
      try {
        const response = await axios.get(`${BASE_URL}/times`);
        const idTimeInt = parseInt(idTime, 10);
        const timeEncontrado = response.data.find(
          (time) => time.id === idTimeInt
        );
        if (timeEncontrado) {
          console.log(' Time encontrado via fallback:', timeEncontrado);
          setNomeTime(timeEncontrado.nome);
        } else {
          console.error(' Time não encontrado:', idTimeInt);
          setNomeTime('Time não encontrado');
        }
      } catch (fallbackError) {
        console.error(' Erro no fallback:', fallbackError);
        setNomeTime('Erro ao carregar time');
      }
    }
  }

  async function buscarCompeticoes() {
    try {
      if (!idTime || isNaN(idTime)) {
        console.error(' idTime inválido:', idTime);
        setDados([]);
        return;
      }

      const response = await axios.get(baseURL);
      const idTimeInt = parseInt(idTime, 10);
      console.log(' Buscando competições para time:', idTimeInt);

      //Filtrar competições que contêm o time no array idTimes
      const competicoesFiltradas = response.data.filter((competicao) => {
        const idTimes = competicao.idTimes || [];
        return idTimes.some((id) => parseInt(id, 10) === idTimeInt);
      });

      console.log(' Competições encontradas:', competicoesFiltradas);
      setDados(competicoesFiltradas);
    } catch (error) {
      console.error(' Erro ao buscar competições:', error);
      mensagemErro('Erro ao buscar competições');
      setDados([]);
    } finally {
      setLoading(false);
    }
  }

  const editar = (id) => {
    navigate(`/cadastro-competicao/${id}`);
  };

  async function excluir(id) {
    try {
      await axios.delete(`${baseURL}/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      mensagemSucesso('Competição excluída com sucesso!');
      setDados(dados.filter((dado) => dado.id !== id));
    } catch (error) {
      console.error(' Erro ao excluir:', error);
      mensagemErro('Erro ao excluir a competição');
    }
  }

  useEffect(() => {
    setLoading(true);
    buscarNomeTime();
    buscarCompeticoes(); // eslint-disable-next-line
  }, [idTime]);

  if (loading) {
    return (
      <div className='container'>
        <Card title='Carregando...'>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            ⏳ Carregando competições...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container'>
      <Card title={`Competições do Time: ${nomeTime}`}>
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
                  Nenhuma competição cadastrada para este time.
                </p>
              ) : (
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th scope='col'>Nome</th>
                      <th scope='col'>Data Início</th>
                      <th scope='col'>Data Término</th>
                      <th scope='col'>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados &&
                      dados.map((dado) => (
                        <tr key={dado.id}>
                          <td>{dado.nome}</td>
                          <td>{dado.dataInicio || '-'}</td>
                          <td>{dado.dataTermino || '-'}</td>
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

export default ListagemCompeticoesPorTime;