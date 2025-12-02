import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../../components/card';
import FormGroup from '../../components/form-group';

import { mensagemSucesso, mensagemErro } from '../../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

function CadastroEstatisticasTime() {
  const { idTime } = useParams();
  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/estatisticasTimes`;

  const [id, setId] = useState('');
  const [idTimeState, setIdTimeState] = useState(idTime || '');
  const [gols, setGols] = useState('');
  const [vitorias, setVitorias] = useState('');
  const [derrotas, setDerrotas] = useState('');
  const [empates, setEmpates] = useState('');
  const [cartoes, setCartoes] = useState('');
  const [partidasJogadas, setPartidasJogadas] = useState('');

  const [dados, setDados] = React.useState({});
  const [time, setTime] = React.useState(null);

  function inicializar() {
    if (!idTime || idTime === 'undefined') {
      setId('');
      setIdTimeState('');
      setGols('');
      setVitorias('');
      setDerrotas('');
      setEmpates('');
      setCartoes('');
      setPartidasJogadas('');
    } else {
      setId(dados.id || '');
      setIdTimeState(dados.idTime || idTime);
      setGols(dados.gols || '');
      setVitorias(dados.vitorias || '');
      setDerrotas(dados.derrotas || '');
      setEmpates(dados.empates || '');
      setCartoes(dados.cartoes || '');
      setPartidasJogadas(dados.partidasJogadas || '');
    }
  }

  async function salvar() {
    if (gols === '' || vitorias === '' || empates === '' || derrotas === '' || cartoes === '' || partidasJogadas === '') {
      mensagemErro('Preencha todos os campos obrigatórios!');
      return;
    }

    const golsNum = parseInt(gols, 10);
    const vitoriasNum = parseInt(vitorias, 10);
    const derrotasNum = parseInt(derrotas, 10);
    const empatesNum = parseInt(empates, 10);
    const cartoesNum = parseInt(cartoes, 10);
    const partidasJogadasNum = parseInt(partidasJogadas, 10);

    if (isNaN(golsNum) || isNaN(vitoriasNum) || isNaN(derrotasNum) || 
        isNaN(cartoesNum) || isNaN(partidasJogadasNum) || isNaN(empatesNum)) {
        mensagemErro('Todos os campos devem ser números válidos!');
      return;
    }

    let data = {
      id,
      idTime: parseInt(idTimeState, 10),
      gols: parseInt(gols, 10),
      vitorias: parseInt(vitorias, 10),
      derrotas: parseInt(derrotas, 10),
      empates: parseInt(empates, 10),
      cartoes: parseInt(cartoes, 10),
      partidasJogadas: parseInt(partidasJogadas, 10),
    };
    data = JSON.stringify(data);

    if (!id || id === '') {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso('Estatísticas cadastradas com sucesso!');
          navigate(`/estatisticas-time/${idTime}`);
        })
        .catch(function (error) {
          mensagemErro(error.response?.data || 'Erro ao salvar');
        });
    } else {
      await axios
        .put(`${baseURL}/${id}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso('Estatísticas atualizadas com sucesso!');
          navigate(`/estatisticas-time/${idTime}`);
        })
        .catch(function (error) {
          mensagemErro(error.response?.data || 'Erro ao atualizar');
        });
    }
  }

  async function buscar() {
    if (idTime && idTime !== 'undefined') {
      try {
        const responseTime = await axios.get(
          `${BASE_URL}/times/${idTime}`
        );
        setTime(responseTime.data);

        try {
          const responseEstat = await axios.get(
            `${baseURL}/${idTime}`
          );
          setDados(responseEstat.data);
          setId(responseEstat.data.id);
          setGols(responseEstat.data.gols);
          setVitorias(responseEstat.data.vitorias);
          setDerrotas(responseEstat.data.derrotas);
          setEmpates(responseEstat.data.empates);
          setCartoes(responseEstat.data.cartoes);
          setPartidasJogadas(responseEstat.data.partidasJogadas);
        } catch (error) {
          mensagemErro('Estatísticas não encontradas, será criada uma nova');
        }
      } catch (error) {
        mensagemErro('Erro ao buscar time');
      }
    }
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [idTime]);

  if (time === null) {
    return (
      <div className='container'>
        <Card title='Carregando...'>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Carregando...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container'>
      <Card title={`Estatísticas de ${time?.nome || 'time'}`}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <div
                style={{
                  padding: '15px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #ddd',
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>Time:</strong> {time?.nome}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Vitorias:</strong> {time?.posicao}
                </p>
              </div>

              <FormGroup label='Gols: *' htmlFor='inputGols'>
                <input
                  type='number'
                  id='inputGols'
                  value={gols}
                  className='form-control'
                  name='gols'
                  onChange={(e) => setGols(e.target.value)}
                  min='0'
                />
              </FormGroup>

              <FormGroup label='Vitorias: *' htmlFor='inputVitorias'>
                <input
                  type='number'
                  id='inputVitorias'
                  value={vitorias}
                  className='form-control'
                  name='vitorias'
                  onChange={(e) => setVitorias(e.target.value)}
                  min='0'
                />
              </FormGroup>

              <FormGroup label='Derrotas: *' htmlFor='inputDerrotas'>
                <input
                  type='number'
                  id='inputDerrotas'
                  value={derrotas}
                  className='form-control'
                  name='derrotas'
                  onChange={(e) => setDerrotas(e.target.value)}
                  min='0'
                />
              </FormGroup>

              <FormGroup label='Empates: *' htmlFor='inputEmpates'>
                <input
                  type='number'
                  id='inputEmpates'
                  value={empates}
                  className='form-control'
                  name='empates'
                  onChange={(e) => setEmpates(e.target.value)}
                  min='0'
                />
              </FormGroup>

              <FormGroup label='Cartões: *' htmlFor='inputCartoes'>
                <input
                  type='number'
                  id='inputCartoes'
                  value={cartoes}
                  className='form-control'
                  name='cartoes'
                  onChange={(e) => setCartoes(e.target.value)}
                  min='0'
                />
              </FormGroup>

              <FormGroup label='Partidas Jogadas: *' htmlFor='inputPartidasJogadas'>
                <input
                  type='number'
                  id='inputPartidasJogadas'
                  value={partidasJogadas}
                  className='form-control'
                  name='partidasJogadas'
                  onChange={(e) => setPartidasJogadas(e.target.value)}
                  min='0'
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
                  onClick={(inicializar)}
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

export default CadastroEstatisticasTime;