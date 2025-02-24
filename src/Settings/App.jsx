import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import DispositivoPotencia from '../Dispositivo'; // Importe o componente
import './App.css';

const App = () => {
  const [divida, setDivida] = useState(0);
  const [valor, setValor] = useState('');
  const [mostrarDivida, setMostrarDivida] = useState(true);
  const [historico, setHistorico] = useState([]);
  const id = 1; // ID da dívida, pode ser dinâmico conforme necessidade

  // 🔹 Função para buscar a dívida no servidor
  const fetchDivida = async () => {
    try {
      const response = await fetch(`http://localhost:5000/divida/${id}`);
      const data = await response.json();
      setDivida(data.divida);
    } catch (error) {
      console.error("Erro ao buscar a dívida:", error);
    }
  };

  // 🔹 Função para buscar o histórico de pagamentos
  const fetchHistorico = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/historico-pagamentos/${id}`
      );
      const data = await response.json();
      setHistorico(data.historico);
    } catch (error) {
      console.error("Erro ao buscar histórico de pagamentos:", error);
    }
  };

  // 🔹 Executa a busca inicial ao montar o componente e atualiza a cada 1 min
  useEffect(() => {
    fetchDivida();
    fetchHistorico();
    const interval = setInterval(fetchDivida, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  // 🔹 Função para subtrair valor da dívida
  const handleSubtrair = async () => {
    if (valor < 10) {
      alert("O valor mínimo para subtrair é 10 Kz");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/divida/${id}/subtrair`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ valor: parseFloat(valor) }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao subtrair valor");
      }

      const data = await response.json();
      setDivida(data.divida);
      setValor("");

      // 🔹 Atualiza o histórico de pagamentos após subtrair
      await fetchHistorico();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="App">
      <h1 className="titulo">Sistema de Gestão de Energia Pós-Pago</h1>
      <div className="divida-historico-container">
        <div className="container">
          <div className="divida-container">
            <div className="divida-header">
              <h2>Dívida Atual</h2>
              <button
                className="botao-olho"
                onClick={() => setMostrarDivida(!mostrarDivida)}
              >
                {mostrarDivida ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {mostrarDivida && <p className="valor-divida">{divida} Kz</p>}
          </div>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Quantia a pagar(kz)"
          />
          <button className="botao-subtrair" onClick={handleSubtrair}>
            Pagar
          </button>
        </div>

        <div className="historico-container">
          <h2>Histórico de Pagamentos</h2>
          <ul>
            {historico.map((pagamento, index) => (
              <li key={index}>
                <strong>Valor:</strong> {pagamento.valor_pago} Kz -{' '}
                <strong>Data:</strong> {new Date(pagamento.data_pagamento).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <DispositivoPotencia divida={divida} /> {/* Passe a dívida como prop */}
    </div>
  );
};

export default App;