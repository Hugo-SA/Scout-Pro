import React from 'react';

import Card from '../../components/card';

import { mensagemSucesso, mensagemErro } from '../../components/toastr';

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';


import axios from 'axios';
import { BASE_URL } from '../../config/axios';

const baseURL = `${BASE_URL}/jogadores`;

function ListagemJogadores() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-jogador`);
  };

  const editar = (id) => {
    navigate(`/cadastro-jogador/${id}`);
  };

  // Nova função para ver estatísticas
  const verEstatisticas = (id) => {
    navigate(`/estatisticas-jogador/${id}`);
  };

  const [dados, setDados] = React.useState(null);
  const [times, setTimes] = React.useState({});

  async function excluir(id) {
    let data = JSON.stringify({ id });
    let url = `${baseURL}/${id}`;
    console.log(url);
    await axios
      .delete(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(function (response) {
        mensagemSucesso(`Jogador excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o jogador`);
      });
  }

  React.useEffect(() => {
    axios.get(`${BASE_URL}/times`).then((response) => {
      const timesMap = {};
      response.data.forEach((time) => {
        timesMap[time.id] = time.nome;
      });
      setTimes(timesMap);
    });
  }, []);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Listagem de Jogadores'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-primary'
                onClick={() => cadastrar()}
              >
                Novo Jogador
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Time</th>
                    <th scope='col'>Posição</th>
                    <th scope='col'>Pé Preferido</th>
                    <th scope='col'>Altura</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
                      <td>{times[dado.idTime] || 'Sem time'}</td>
                      {/* INÍCIO DA MUDANÇA: Estiliza a Posição com Chips */}
                      <td>
                        {dado.posicao ? (
                          <span 
                            className={`fm-posicao fm-posicao-${dado.posicao.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                          >
                            {dado.posicao}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      {/* FIM DA MUDANÇA */}
                      <td>{dado.pePreferido || '-'}</td>
                      <td>{dado.altura ? `${dado.altura} cm` : '-'}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='estatisticas'
                            onClick={() => verEstatisticas(dado.id)}
                            title='Ver Estatísticas'
                          >
                            <BarChartIcon />
                          </IconButton>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(dado.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(dado.id)}
                            className='action-icon delete'
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemJogadores;