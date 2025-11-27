import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../../components/card';
import FormGroup from '../../components/form-group';

import { mensagemSucesso, mensagemErro } from '../../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

function CadastroEstatisticasJogador() {
  const { idJogador } = useParams();
  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/estatisticas`;

  const [id, setId] = useState('');
  const [idJogadorState, setIdJogadorState] = useState(idJogador || '');
  const [gols, setGols] = useState('');
  const [assistencias, setAssistencias] = useState('');
  const [participacoes, setParticipacoes] = useState('');
  const [cartoes, setCartoes] = useState('');
  const [partidasJogadas, setPartidasJogadas] = useState('');

  const [dados, setDados] = React.useState({});
  const [jogador, setJogador] = React.useState(null);

  function inicializar() {
    if (!idJogador || idJogador === 'undefined') {
      setId('');
      setIdJogadorState('');
      setGols('');
      setAssistencias('');
      setParticipacoes('');
      setCartoes('');
      setPartidasJogadas('');
    } else {
      setId(dados.id || '');
      setIdJogadorState(dados.idJogador || idJogador);
      setGols(dados.gols || '');
      setAssistencias(dados.assistencias || '');
      setParticipacoes(dados.participacoes || '');
      setCartoes(dados.cartoes || '');
      setPartidasJogadas(dados.partidasJogadas || '');
    }
  }

  async function salvar() {
    if (gols === '' || assistencias === '' || participacoes === '' || cartoes === '' || partidasJogadas === '') {
      mensagemErro('Preencha todos os campos obrigatórios!');
      return;
    }

    const golsNum = parseInt(gols, 10);
    const assistenciasNum = parseInt(assistencias, 10);
    const participacoesNum = parseInt(participacoes, 10);
    const cartoesNum = parseInt(cartoes, 10);
    const partidasJogadasNum = parseInt(partidasJogadas, 10);

    if (isNaN(golsNum) || isNaN(assistenciasNum) || isNaN(participacoesNum) || 
        isNaN(cartoesNum) || isNaN(partidasJogadasNum)) {
        mensagemErro('Todos os campos devem ser números válidos!');
      return;
    }

    let data = {
      id,
      idJogador: parseInt(idJogadorState, 10),
      gols: parseInt(gols, 10),
      assistencias: parseInt(assistencias, 10),
      participacoes: parseInt(participacoes, 10),
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
          navigate(`/estatisticas-jogador/${idJogador}`);
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
          navigate(`/estatisticas-jogador/${idJogador}`);
        })
        .catch(function (error) {
          mensagemErro(error.response?.data || 'Erro ao atualizar');
        });
    }
  }

  async function buscar() {
    if (idJogador && idJogador !== 'undefined') {
      try {
        const responseJogador = await axios.get(
          `${BASE_URL}/jogadores/${idJogador}`
        );
        setJogador(responseJogador.data);

        try {
          const responseEstat = await axios.get(
            `${baseURL}/${idJogador}`
          );
          setDados(responseEstat.data);
          setId(responseEstat.data.id);
          setGols(responseEstat.data.gols);
          setAssistencias(responseEstat.data.assistencias);
          setParticipacoes(responseEstat.data.participacoes);
          setCartoes(responseEstat.data.cartoes);
          setPartidasJogadas(responseEstat.data.partidasJogadas);
        } catch (error) {
          mensagemErro('Estatísticas não encontradas, será criada uma nova');
        }
      } catch (error) {
        mensagemErro('Erro ao buscar jogador');
      }
    }
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [idJogador]);

  if (jogador === null) {
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
      <Card title={`Estatísticas de ${jogador?.nome || 'Jogador'}`}>
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
                  <strong>Jogador:</strong> {jogador?.nome}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Posição:</strong> {jogador?.posicao}
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

              <FormGroup label='Assistências: *' htmlFor='inputAssistencias'>
                <input
                  type='number'
                  id='inputAssistencias'
                  value={assistencias}
                  className='form-control'
                  name='assistencias'
                  onChange={(e) => setAssistencias(e.target.value)}
                  min='0'
                />
              </FormGroup>

              <FormGroup label='Participações: *' htmlFor='inputParticipacoes'>
                <input
                  type='number'
                  id='inputParticipacoes'
                  value={participacoes}
                  className='form-control'
                  name='participacoes'
                  onChange={(e) => setParticipacoes(e.target.value)}
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

export default CadastroEstatisticasJogador;