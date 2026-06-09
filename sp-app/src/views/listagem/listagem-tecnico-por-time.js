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
  const [loading, setLoading] = React.useState(true);

  async function buscarTecnico() {
    try {
      if (!idTime || isNaN(idTime)) {
        setTecnico(null);
        return;
      }

      const idTimeInt = parseInt(idTime, 10);

      const response = await axios.get(`${BASE_URL}/times/${idTimeInt}`);
      if (response.data && response.data.idTecnico) {
        const tecnicoResponse = await axios.get(`${BASE_URL}/tecnicos/${response.data.idTecnico}`);
        setTecnico(tecnicoResponse.data);
      } else {
        setTecnico(null);
      }
    } catch (error) {
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
          <div className='fm-text-center fm-p-20 fm-text-primary'>
            Buscando dados do técnico...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container'>
      <Card title={`Detalhes do Técnico`}>
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
                  Voltar para Times
                </button>
              </Stack>

              {/* BLOCO DE INFORMAÇÕES DO TÉCNICO - AGORA DARK MODE */}
              <div className='fm-info-block fm-mb-20'>
                <h5 className='fm-info-title fm-text-primary'>
                  Informações do Técnico
                </h5>
                {tecnico ? (
                  <div className='fm-grid-info fm-text-primary'>
                    <div>
                      <strong className='fm-text-muted'>Nome:</strong> <span className='fm-text-primary'>{tecnico.nome}</span>
                    </div>
                    <div>
                      <strong className='fm-text-muted'>Idade:</strong> <span className='fm-text-primary'>{tecnico.idade || '-'}</span>
                    </div>
                    <div>
                      <strong className='fm-text-muted'>Data de Nascimento:</strong> <span className='fm-text-primary'>{tecnico.dataNascimento || '-'}</span>
                    </div>
                  </div>
                ) : (
                  <div className='fm-text-center fm-text-primary fm-p-20'>
                    Nenhum técnico associado a este time.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemTecnicoPorTime;