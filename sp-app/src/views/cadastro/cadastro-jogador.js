import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../../components/card';
import FormGroup from '../../components/form-group';

import { mensagemSucesso, mensagemErro } from '../../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

function CadastroJogador() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/jogadores`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [idTime, setIdTime] = useState(0);
  const [idade, setIdade] = useState(''); //  Novo campo
  const [posicao, setPosicao] = useState(''); //  Novo campo
  const [pePreferido, setPePreferido] = useState(''); //  Novo campo
  const [altura, setAltura] = useState(''); //  Novo campo

  const [dados, setDados] = React.useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNome('');
      setIdTime(0);
      setIdade(''); 
      setPosicao(''); 
      setPePreferido(''); 
      setAltura(''); 
    } else {
      setId(dados.id);
      setNome(dados.nome);
      setIdTime(dados.idTime);
      setIdade(dados.idade); 
      setPosicao(dados.posicao); 
      setPePreferido(dados.pePreferido); 
      setAltura(dados.altura); 
    }
  }

  //  Incluir todos os campos no objeto data
  async function salvar() {
    let data = { id, nome, idTime, idade, posicao, pePreferido, altura };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Jogador ${nome} cadastrado com sucesso!`);
          navigate(`/listagem-jogador`);
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
          mensagemSucesso(`Jogador ${nome} alterado com sucesso!`);
          navigate(`/listagem-jogador`);
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
      setIdTime(dados.idTime);
      setIdade(dados.idade); 
      setPosicao(dados.posicao); 
      setPePreferido(dados.pePreferido); 
      setAltura(dados.altura); 
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
      <Card title='Cadastro de Jogador'>
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
              <FormGroup label='Time: *' htmlFor='selectTime'>
                <select
                  className='form-select'
                  id='selectTime'
                  name='idTime'
                  value={idTime}
                  onChange={(e) => setIdTime(e.target.value)}
                >
                  <option key='0' value='0'>
                    {' '}
                  </option>
                  {dadosTimes.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label='Idade:' htmlFor='inputIdade'>
                <input
                  type='number'
                  id='inputIdade'
                  value={idade}
                  className='form-control'
                  name='idade'
                  onChange={(e) => setIdade(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Posição: *' htmlFor='selectPosicao'>
                <select
                  className='form-select'
                  id='selectPosicao'
                  name='posicao'
                  value={posicao}
                  onChange={(e) => setPosicao(e.target.value)}
                >
                  <option value=''>Selecione uma posição</option>
                  <option value='goleiro'>Goleiro</option>
                  <option value='lateral'>Lateral</option>
                  <option value='zagueiro'>Zagueiro</option>
                  <option value='meio-campo'>Meio-Campo</option>
                  <option value='meia'>Meia</option>
                  <option value='atacante'>Atacante</option>
                </select>
              </FormGroup>

              <FormGroup label='Pé Preferido: *' htmlFor='selectPePreferido'>
                <select
                  className='form-select'
                  id='selectPePreferido'
                  name='pePreferido'
                  value={pePreferido}
                  onChange={(e) => setPePreferido(e.target.value)}
                >
                  <option value=''>Selecione um pé</option>
                  <option value='direito'>Direito</option>
                  <option value='esquerdo'>Esquerdo</option>
                  <option value='ambidestro'>Ambidestro</option>
                </select>
              </FormGroup>

              {/*  Novo campo de altura */}
              <FormGroup label='Altura (cm):' htmlFor='inputAltura'>
                <input
                  type='number'
                  id='inputAltura'
                  value={altura}
                  className='form-control'
                  name='altura'
                  onChange={(e) => setAltura(e.target.value)}
                  placeholder='Ex: 185'
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

export default CadastroJogador;