import React from 'react';

import Card from '../../components/card';

import { mensagemSucesso, mensagemErro } from '../../components/toastr';

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import '../../custom.css';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

const baseURL = `${BASE_URL}/times`;

function ListagemTimes() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-time`);
  };

  const editar = (id) => {
    navigate(`/cadastro-time/${id}`);
  };

  const verJogadores = (id) => {
    navigate(`/jogadores-por-time/${id}`);
  };

  const verCompeticoes = (id) => {
    navigate(`/competicoes-por-time/${id}`);
  };

  const [dados, setDados] = React.useState(null);
  const [tecnicos, setTecnicos] = React.useState({}); 

  async function excluir(id) {
    let data = JSON.stringify({ id });
    let url = `${baseURL}/${id}`;
    console.log(url);
    await axios
      .delete(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(function (response) {
        mensagemSucesso(`Time excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o time`);
      });
  }

  React.useEffect(() => {
    axios.get(`${BASE_URL}/tecnico`).then((response) => {
      const tecnicosMap = {};
      response.data.forEach((tecnico) => {
        tecnicosMap[tecnico.id] = tecnico.nome;
      });
      setTecnicos(tecnicosMap);
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
      <Card title='Listagem de Times'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning'
                onClick={() => cadastrar()}
              >
                Novo Time
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Técnico</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
                      <td>{tecnicos[dado.idTecnico] || 'Sem técnico'}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='jogadores'
                            onClick={() => verJogadores(dado.id)}
                            title='Ver Jogadores'
                          >
                            <PersonIcon />
                          </IconButton>
                          
                          <IconButton
                            aria-label='jogadores'
                            onClick={() => verCompeticoes(dado.id)}
                            title='Ver Competicoes'
                          >
                            <EmojiEventsIcon />
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

export default ListagemTimes;