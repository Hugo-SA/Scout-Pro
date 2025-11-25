import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../../components/card';
import FormGroup from '../../components/form-group';

import { mensagemSucesso, mensagemErro } from '../../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

function CadastroCompeticao() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/competicao`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [idTimes, setIdTimes] = useState([]); // Array de times
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');

  const [dados, setDados] = React.useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNome('');
      setIdTimes([]); 
      setDataInicio('');
      setDataTermino('');
    } else {
      setId(dados.id);
      setNome(dados.nome);
      setIdTimes(dados.idTimes || []); 
      setDataInicio(dados.dataInicio);
      setDataTermino(dados.dataTermino);
    }
  }

  // Função para toggle de times
  const toggleTime = (idTime) => {
    setIdTimes((prevIdTimes) => {
      if (prevIdTimes.includes(idTime)) {
        return prevIdTimes.filter((id) => id !== idTime);
      } else {
        return [...prevIdTimes, idTime];
      }
    });
  };

  // idTimes no objeto data
  async function salvar() {
    if (idTimes.length === 0) {
      mensagemErro('Selecione pelo menos um time!');
      return;
    }

    let data = { id, nome, idTimes, dataInicio, dataTermino };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Competição ${nome} cadastrada com sucesso!`);
          navigate(`/listagem-competicao`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Competição ${nome} alterada com sucesso!`);
          navigate(`/listagem-competicao`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    }
  }

  async function buscar() {
    if (idParam != null) {
      await axios.get(`${baseURL}/${idParam}`).then((response) => {
        setDados(response.data);
      });
      setId(dados.id);
      setNome(dados.nome);
      setIdTimes(dados.idTimes || []); 
      setDataInicio(dados.dataInicio);
      setDataTermino(dados.dataTermino);
    }
  }

  const [dadosTimes, setDadosTimes] = React.useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/times`).then((response) => {
      setDadosTimes(response.data);
    });
  }, []);

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if (!dadosTimes) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Competição'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nome'
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Times Participantes: *'>
                <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  {dadosTimes.map((time) => (
                    <div key={time.id} style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type='checkbox'
                          checked={idTimes.includes(time.id)}
                          onChange={() => toggleTime(time.id)}
                          style={{ marginRight: '8px' }}
                        />
                        <span>{time.nome}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </FormGroup>

              <FormGroup label='Data Início: *' htmlFor='inputDataInicio'>
                <input
                  type='text'
                  id='inputDataInicio'
                  value={dataInicio}
                  className='form-control'
                  name='dataInicio'
                  onChange={(e) => setDataInicio(e.target.value)}
                  placeholder='DD-MM-YYYY'
                />
              </FormGroup>
              <FormGroup label='Data Término: *' htmlFor='inputDataTermino'>
                <input
                  type='text'
                  id='inputDataTermino'
                  value={dataTermino}
                  className='form-control'
                  name='dataTermino'
                  onChange={(e) => setDataTermino(e.target.value)}
                  placeholder='DD-MM-YYYY'
                />
              </FormGroup>
              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                >
                  Salvar
                </button>
                <button
                  onClick={inicializar}
                  type='button'
                  className='btn btn-danger'
                >
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroCompeticao;