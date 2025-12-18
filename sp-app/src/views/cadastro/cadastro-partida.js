import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Card from '../../components/card';
import FormGroup from '../../components/form-group';
import { mensagemSucesso, mensagemErro } from '../../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

function CadastroPartida() {
  const { idCompeticao, idPartida } = useParams(); // idCompeticao para contexto, idPartida para edição
  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/partidas`;

  const [id, setId] = useState('');
  const [idCompeticaoState, setIdCompeticaoState] = useState(idCompeticao || '');
  const [timeCasa, setTimeCasa] = useState('');
  const [timeVisitante, setTimeVisitante] = useState('');
  const [data, setData] = useState('');
  const [placar, setPlacar] = useState('');
  const [golsCasa, setGolsCasa] = useState('');
  const [golsVisitante, setGolsVisitante] = useState('');
  const [concluida, setConcluida] = useState(false);

  const [dadosTimes, setDadosTimes] = useState([]);
  const [competicaoNome, setCompeticaoNome] = useState('');
  const [loading, setLoading] = useState(true);

  async function inicializar() {
    if (idPartida === 'nova') { // usei 'nova' para indicar criação aheuaehuhsa maldito safanov
      setId('');
      setTimeCasa('');
      setTimeVisitante('');
      setData('');
      setPlacar('');
      setGolsCasa('');
      setGolsVisitante('');
      setConcluida(false);
    }
  }

  async function buscarDadosIniciais() {
    try {
      // Buscar nome da competição
      const compResponse = await axios.get(`${BASE_URL}/competicao/${idCompeticao}`);
      setCompeticaoNome(compResponse.data.nome);

      // Buscar todos os times
      const timesResponse = await axios.get(`${BASE_URL}/times`);
      setDadosTimes(timesResponse.data);

      // Se for edição, buscar dados da partida
      if (idPartida && idPartida !== 'nova') {
        const partidaResponse = await axios.get(`${baseURL}/${idPartida}`);
        const partidaData = partidaResponse.data;
        setId(partidaData.id);
        setIdCompeticaoState(partidaData.idCompeticao);
        setTimeCasa(partidaData.timeCasa);
        setTimeVisitante(partidaData.timeVisitante);
        setData(partidaData.data);
        setPlacar(partidaData.placar);
        setGolsCasa(partidaData.golsCasa);
        setGolsVisitante(partidaData.golsVisitante);
        setConcluida(partidaData.concluida);
      }
    } catch (error) {
      console.error('Erro ao buscar dados iniciais:', error);
      mensagemErro('Erro ao carregar dados da partida/competição.');
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    if (!timeCasa || !timeVisitante || !data) {
      mensagemErro('Preencha os campos obrigatórios (Times e Data).');
      return;
    }
    if (timeCasa === timeVisitante) {
      mensagemErro('O time da casa e o time visitante não podem ser os mesmos.');
      return;
    }

    const partidaParaSalvar = {
      id: id || undefined, // undefined para POST, id para PUT
      idCompeticao: parseInt(idCompeticaoState, 10),
      timeCasa: parseInt(timeCasa, 10),
      timeVisitante: parseInt(timeVisitante, 10),
      data: data,
      placar: placar || null,
      golsCasa: golsCasa !== '' ? parseInt(golsCasa, 10) : null,
      golsVisitante: golsVisitante !== '' ? parseInt(golsVisitante, 10) : null,
      concluida: concluida,
    };

    try {
      if (!id) {
        // Nova partida (POST)
        await axios.post(baseURL, JSON.stringify(partidaParaSalvar), {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso('Partida cadastrada com sucesso!');
      } else {
        // Editar partida (PUT)
        await axios.put(`${baseURL}/${id}`, JSON.stringify(partidaParaSalvar), {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso('Partida atualizada com sucesso!');
      }
      navigate(`/estatisticas-competicao/${idCompeticao}`);
    } catch (error) {
      console.error('Erro ao salvar partida:', error);
      mensagemErro(error.response?.data || 'Erro ao salvar partida.');
    }
  }

  useEffect(() => {
    buscarDadosIniciais(); // eslint-disable-next-line
  }, [idCompeticao, idPartida]);

  if (loading) {
    return (
      <div className='container'>
        <Card title='Carregando...'>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            ⏳ Carregando formulário da partida...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container'>
      <Card title={idPartida === 'nova' ? `Nova Partida para ${competicaoNome}` : `Editar Partida de ${competicaoNome}`}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Competição:'>
                <input
                  type='text'
                  value={competicaoNome}
                  className='form-control'
                  disabled
                />
              </FormGroup>

              <FormGroup label='Time da Casa: *' htmlFor='selectTimeCasa'>
                <select
                  className='form-select'
                  id='selectTimeCasa'
                  value={timeCasa}
                  onChange={(e) => setTimeCasa(e.target.value)}
                >
                  <option value=''>Selecione o Time da Casa</option>
                  {dadosTimes.map((time) => (
                    <option key={time.id} value={time.id}>
                      {time.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label='Time Visitante: *' htmlFor='selectTimeVisitante'>
                <select
                  className='form-select'
                  id='selectTimeVisitante'
                  value={timeVisitante}
                  onChange={(e) => setTimeVisitante(e.target.value)}
                >
                  <option value=''>Selecione o Time Visitante</option>
                  {dadosTimes.map((time) => (
                    <option key={time.id} value={time.id}>
                      {time.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label='Data da Partida: *' htmlFor='inputData'>
                <input
                  type='date'
                  id='inputData'
                  value={data}
                  className='form-control'
                  onChange={(e) => setData(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Placar (Ex: 2-1):' htmlFor='inputPlacar'>
                <input
                  type='text'
                  id='inputPlacar'
                  value={placar}
                  className='form-control'
                  onChange={(e) => setPlacar(e.target.value)}
                  disabled={!concluida} // Desabilitado se não concluída
                />
              </FormGroup>

              <FormGroup label='Gols do Time da Casa:' htmlFor='inputGolsCasa'>
                <input
                  type='number'
                  id='inputGolsCasa'
                  value={golsCasa}
                  className='form-control'
                  onChange={(e) => setGolsCasa(e.target.value)}
                  min='0'
                  disabled={!concluida} // Desabilitado se não concluída
                />
              </FormGroup>

              <FormGroup label='Gols do Time Visitante:' htmlFor='inputGolsVisitante'>
                <input
                  type='number'
                  id='inputGolsVisitante'
                  value={golsVisitante}
                  className='form-control'
                  onChange={(e) => setGolsVisitante(e.target.value)}
                  min='0'
                  disabled={!concluida} // Desabilitado se não concluída
                />
              </FormGroup>

              <FormGroup htmlFor='checkboxConcluida'>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkboxConcluida"
                    checked={concluida}
                    onChange={(e) => setConcluida(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="checkboxConcluida">
                    Partida Concluída
                  </label>
                </div>
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
                  onClick={() => navigate(`/estatisticas-competicao/${idCompeticao}`)}
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

export default CadastroPartida;