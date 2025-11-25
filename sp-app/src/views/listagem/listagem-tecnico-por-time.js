import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/card';
import { mensagemErro } from '../../components/toastr';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axios from 'axios';
import { BASE_URL } from '../../config/axios';

function ListagemTecnicoPorTime() {
  const { idTime } = useParams();
  const navigate = useNavigate();

  const [tecnico, setTecnico] = React.useState(null);
  const [nomeTime, setNomeTime] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  async function buscarTecnico() {
    try {
      if (!idTime || isNaN(idTime)) {
        console.error('❌ idTime inválido:', idTime);
        setTecnico(null);
        return;
      }

      const idTimeInt = parseInt(idTime, 10);

      // Buscar o time
      const responseTime = await axios.get(`${BASE_URL}/times/${idTimeInt}`);
      setNomeTime(responseTime.data.nome);

      const idTecnico = responseTime.data.idTecnico;

      // Buscar o técnico
      if (idTecnico) {
        const responseTecnico = await axios.get(`${BASE_URL}/tecnico/${idTecnico}`);
        setTecnico(responseTecnico.data);
      } else {
        setTecnico(null);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar técnico:', error);
      mensagemErro('Erro ao buscar técnico do time');
      setTecnico(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    buscarTecnico(); // eslint-disable-next-line
  }, [idTime]);

  if (loading) {
    return (
      <div className='container'>
        <Card title='Carregando...'>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            ⏳ Carregando técnico...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container'>
      <Card title={`Técnico do Time: ${nomeTime}`}>
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

              {tecnico ? (
                <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Nome:</strong> {tecnico.nome}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Idade:</strong> {tecnico.idade}
                  </div>
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>
                  Nenhum técnico cadastrado para este time.
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemTecnicoPorTime;