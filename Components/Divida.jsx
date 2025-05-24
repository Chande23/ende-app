import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import Chart from 'chart.js/auto';
import './Divida.css';

const Divida = () => {
  const [divida, setDivida] = useState(0);
  const [valor, setValor] = useState('');
  const [mostrarDivida, setMostrarDivida] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [historicoDivida, setHistoricoDivida] = useState([]);
  const id = 1;
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const dadosGrafico = useMemo(() => {
    return historicoDivida
      .filter((item) => item.valor_divida != null && !isNaN(item.valor_divida))
      .map((item) => ({
        data: new Date(item.data_registro).getTime(),
        valor: item.valor_divida,
        dataFormatada: new Date(item.data_registro).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
  }, [historicoDivida]);

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro na requisição');
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData(`https://ende-api.onrender.com/divida/${id}`, (data) => setDivida(data.divida));
    fetchData(`https://ende-api.onrender.com/historico-divida/${id}`, (data) => setHistoricoDivida(data.historico));
  }, []);

  useEffect(() => {
    if (chartRef.current && dadosGrafico.length > 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: dadosGrafico.map(item => item.dataFormatada),
          datasets: [{
            label: 'Valor da Dívida (Kz)',
            data: dadosGrafico.map(item => item.valor),
            backgroundColor: 'rgba(255, 111, 97, 0.7)',
            borderColor: 'rgba(255, 111, 97, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Data',
                color: 'rgba(255, 255, 255, 0.7)',
                font: { size: 14 }
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: { size: 10 },
                maxRotation: 45,
                minRotation: 45
              },
              grid: { display: false }
            },
            y: {
              title: {
                display: true,
                text: 'Valor (Kz)',
                color: 'rgba(255, 255, 255, 0.7)',
                font: { size: 14 }
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: { size: 10 },
                beginAtZero: true
              },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: { size: 12 }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(30, 30, 47, 0.95)',
              titleColor: '#ff6f61',
              bodyColor: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              cornerRadius: 8,
              callbacks: {
                label: function(context) {
                  return `Valor: ${context.parsed.y} Kz`;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [dadosGrafico]);

  const handleSubtrair = async () => {
    if (valor < 10) {
      setMensagem({ tipo: 'erro', texto: 'O valor mínimo para pagamento é 10 Kz.' });
      return;
    }

    setCarregando(true);
    setMensagem('');

    try {
      const startTime = performance.now();
      const response = await fetch(`https://ende-api.onrender.com/divida/${id}/subtrair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: parseFloat(valor) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar o pagamento.');
      }

      const data = await response.json();
      setDivida(data.divida);
      setValor('');
      setMensagem({ tipo: 'sucesso', texto: 'Pagamento realizado com sucesso!' });

      await Promise.all([
        fetchData(`https://ende-api.onrender.com/historico-divida/${id}`, (data) => setHistoricoDivida(data.historico))
      ]);

      const endTime = performance.now();
      console.log(`Tempo de processamento: ${endTime - startTime}ms`);
    } catch (error) {
      console.error(error);
      setMensagem({ tipo: 'erro', texto: error.message });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="divida-container">
      <h1 className="titulo">Gestão de Dívida</h1>
      <div className="resumo-financeiro">
        <div className="card">
          <h2>Dívida Atual</h2>
          <div className="divida-header">
            <p className="valor-divida">
              {mostrarDivida ? `${divida} Kz` : '****'}
            </p>
            <button
              className="botao-olho"
              onClick={() => setMostrarDivida(!mostrarDivida)}
              aria-label={mostrarDivida ? "Ocultar valor" : "Mostrar valor"}
            >
              {mostrarDivida ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="card">
          <h2>Valor Mínimo de Pagamento</h2>
          <p className="valor-minimo">10 Kz</p>
        </div>
      </div>
      <div className="formulario-pagamento">
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Quantia a pagar (Kz)"
          className="input-valor"
          min="10"
          step="10"
        />
        <button 
          className="botao-subtrair" 
          onClick={handleSubtrair} 
          disabled={carregando || !valor}
          aria-busy={carregando}
        >
          {carregando ? <FaSpinner className="spinner" /> : 'Pagar'}
        </button>
      </div>
      {mensagem && (
        <div className={`mensagem ${mensagem.tipo}`}>
          {mensagem.tipo === 'sucesso' ? <FaCheckCircle /> : <FaTimesCircle />}
          <p>{mensagem.texto}</p>
        </div>
      )}
      <div className="grafico-container">
        <h2>Evolução da Dívida</h2>
        <canvas id="dividaChart" ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default Divida;