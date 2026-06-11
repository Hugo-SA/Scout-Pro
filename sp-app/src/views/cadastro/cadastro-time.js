import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../../components/card';
import FormGroup from '../../components/form-group';

import { mensagemSucesso, mensagemErro } from '../../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

function CadastroTime() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/times`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [idTecnico, setIdTecnico] = useState(0);

  const [dadosTecnicos, setDadosTecnicos] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNome('');
      setIdTecnico(0);
    } else {
      buscar();
    }
  }

  async function salvar() {
    const data = {
      id,
      nome,
      idTecnico
    };

    console.log('Enviando:', data);

    try {
      if (idParam == null) {
        await axios.post(baseURL, data);

        mensagemSucesso(`Time ${nome} cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);

        mensagemSucesso(`Time ${nome} alterado com sucesso!`);
      }

      navigate('/listagem-times');
    } catch (error) {
      mensagemErro(
        error?.response?.data || 'Erro ao salvar o time.'
      );
    }
  }

  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);

      const time = response.data;

      setId(time.id);
      setNome(time.nome);
      setIdTecnico(time.idTecnico || 0);
    } catch (error) {
      mensagemErro('Erro ao carregar dados do time.');
    }
  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/tecnicos`)
      .then((response) => {
        setDadosTecnicos(response.data);
      })
      .catch(() => {
        mensagemErro('Erro ao carregar técnicos.');
      });
  }, []);

  useEffect(() => {
    if (idParam != null) {
      buscar();
    }
  }, [idParam]);

  return (
    <div className='container'>
      <Card title='Cadastro de Times'>
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

              <FormGroup label='Técnico: *' htmlFor='selectTecnico'>
                <select
                  className='form-select'
                  id='selectTecnico'
                  name='idTecnico'
                  value={idTecnico}
                  onChange={(e) =>
                    setIdTecnico(Number(e.target.value))
                  }
                >
                  <option value={0}>Selecione um técnico</option>

                  {dadosTecnicos.map((tecnico) => (
                    <option
                      key={tecnico.id}
                      value={tecnico.id}
                    >
                      {tecnico.nome}
                    </option>
                  ))}
                </select>
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

export default CadastroTime;