import React, { useState, useEffect } from "react";
import "./DispositivoPotencia.css";
import endeIMG from "../assets/ende.png";

const DispositivoPotencia = ({ divida }) => {
  const [ledVerde, setLedVerde] = useState(false);
  const [ledAmarelo, setLedAmarelo] = useState(false);
  const [ledVermelho, setLedVermelho] = useState(false);

  // Lógica para controlar os LEDs com base na dívida
  useEffect(() => {
    if (divida <= 10) { // 10.000 Kz
      setLedVerde(true);
      setLedVermelho(false);
    } else {
      setLedVerde(false);
      setLedVermelho(true);
    }
  }, [divida]);

  // Função para verificar se a dívida foi incrementada
  const verificarIncremento = async () => {
    try {
      const response = await fetch(`http://localhost:5000/divida/1/incrementada`); // Substitua 1 pelo ID da dívida
      const data = await response.json();

      if (data.incrementada) {
        setLedAmarelo(true); // Acende o LED amarelo
        setTimeout(() => {
          setLedAmarelo(false); // Apaga o LED amarelo após 1 minuto
        }, 60000); // 1 minuto = 60000 ms
      }
    } catch (error) {
      console.error("Erro ao verificar incremento da dívida:", error);
    }
  };

  // Verifica o incremento da dívida a cada 10 segundos
  useEffect(() => {
    const intervalo = setInterval(verificarIncremento, 60000); // Verifica a cada 10 segundos
    return () => clearInterval(intervalo); // Limpa o intervalo ao desmontar o componente
  }, []);

  return (
    <div className="dispositivo-container">
      <img src={endeIMG} alt="ENDE Logo" className="logo" />
      <h1 className="titulod">Monitor de Consumo de Energia</h1>
      <div className="lcd-display">
        <p>Dívida: {divida} Kz</p>
      </div>
      <div className="led-container">
        <div className={`led verde ${ledVerde ? "aceso" : ""}`}></div>
        <div className={`led amarelo ${ledAmarelo ? "aceso" : ""}`}></div>
        <div className={`led vermelho ${ledVermelho ? "aceso" : ""}`}></div>
        <div className="led azul"></div>
      </div>
      <p className="descricao">
        O LED indicará o status da dívida em tempo real.
      </p>
    </div>
  );
};

export default DispositivoPotencia;
