import React, { useState, useEffect } from 'react';
import {fases} from "./utils/labirintos";

const LabirintoApp = () => {
  const larguraLabirinto = 10;
  const alturaLabirinto = 10;
  const tamanhoBloco = 30;

  // Matriz do labirinto (exemplo básico)
  const [index, setIndex] = useState(0);
  const matrix = fases[index];
  const [isFinished, setIsFinished] = useState(false);

  // Posição inicial e final do jogador
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const endPosition= { x: larguraLabirinto - 2, y: alturaLabirinto - 2 };

  // Caminho mais curto encontrado pelo algoritmo de Dijkstra
  const [shortestPath, setShortestPath] = useState([]);


  // Função para encontrar o caminho mais curto usando Dijkstra
  const findShortestPath = () => {
    const matrixCopy = JSON.parse(JSON.stringify(matrix)); // Cópia da matriz para não modificar a original
    const distances = [];
    const previousNodes = [];
    const unvisitedNodes = [];

    // Inicialização das estruturas de dados para Dijkstra
    for (let i = 0; i < alturaLabirinto; i++) {
      distances.push(Array(larguraLabirinto).fill(Infinity));
      previousNodes.push(Array(larguraLabirinto).fill(null));
      for (let j = 0; j < larguraLabirinto; j++) {
        unvisitedNodes.push({ x: j, y: i, distance: Infinity });
      }
    }

    // Configuração do ponto de início e do ponto final para Dijkstra
    const startNode = unvisitedNodes.find(node => node.x === playerPosition.x && node.y === playerPosition.y);
    startNode.distance = 0;

    const endNode = unvisitedNodes.find(node => node.x === endPosition.x && node.y === endPosition.y);

    while (unvisitedNodes.length > 0) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();

      if (closestNode.distance === Infinity) break;

      const { x, y } = closestNode;

      if (matrixCopy[y][x] === 1) continue;

      if (x === endNode.x && y === endNode.y) break;

      const neighbors = [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
      ];

      for (const neighbor of neighbors) {
        const { x: neighborX, y: neighborY } = neighbor;
        const unvisitedNeighbor = unvisitedNodes.find(node => node.x === neighborX && node.y === neighborY);

        if (!unvisitedNeighbor || matrixCopy[neighborY][neighborX] === 1) continue;

        const distance = closestNode.distance + 1;

        if (distance < unvisitedNeighbor.distance) {
          unvisitedNeighbor.distance = distance;
          previousNodes[neighborY][neighborX] = { x, y };
        }
      }
    }

    // Reconstrução do caminho mais curto
    const shortestPathNodes = [];
    let currentNode = previousNodes[endNode.y][endNode.x];
    while (currentNode) {
      shortestPathNodes.unshift(currentNode);
      currentNode = previousNodes[currentNode.y][currentNode.x];
    }

    setShortestPath(shortestPathNodes);
  };

  // Função para movimentar o jogador apenas com as setas do teclado
  const movePlayer = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        attemptMove(0, -1);
        break;
      case 'ArrowDown':
        attemptMove(0, 1);
        break;
      case 'ArrowLeft':
        attemptMove(-1, 0);
        break;
      case 'ArrowRight':
        attemptMove(1, 0);
        break;
      default:
        break;
    }
  };

  // Função para tentar movimentar o jogador
  const attemptMove = (dx, dy) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if(!isFinished) {
      if (matrix[newY][newX] === 0 || matrix[newY][newX] === 2) {
        setPlayerPosition({ x: newX, y: newY });
      }
    }

    if (newX === endPosition.x && newY === endPosition.y) {
      setIsFinished(true);
      setTimeout(() => {
        alert('Você encontrou a saída!');

        if(index < fases.length - 1) {
          setIndex(index + 1);
          setPlayerPosition({ x: 1, y: 1 })
          setIsFinished(false)
        }
      }, 200);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', movePlayer);
    return () => window.removeEventListener('keydown', movePlayer);
  }, [playerPosition]);

  // Função para renderizar o labirinto
  const renderLabirinto = () => {
    const labirinto = [];

    for (let y = 0; y < alturaLabirinto; y++) {
      for (let x = 0; x < larguraLabirinto; x++) {
        const isPlayer = playerPosition.x === x && playerPosition.y === y;
        const isPath = shortestPath.some(node => node.x === x && node.y === y);

        let backgroundColor = 'white';
        if (matrix[y][x] === 1) backgroundColor = 'black';
        if (isPlayer) backgroundColor = 'red';
        if (isPath) backgroundColor = 'blue';

        labirinto.push(
            <div
                key={`${x}-${y}`}
                style={{
                  width: tamanhoBloco,
                  height: tamanhoBloco,
                  backgroundColor: backgroundColor,
                  border: '1px solid gray',
                  boxSizing: 'border-box',
                }}
            />
        );
      }
    }

    return labirinto;
  };

  return (
      <div>
        <h1>Jogo de Labirinto</h1>
        <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${larguraLabirinto}, ${tamanhoBloco}px)`,
              gap: '1px',
            }}
            onKeyDown={movePlayer}
            tabIndex="0"
        >
          {renderLabirinto()}
        </div>
        <button onMouseDown={findShortestPath} onMouseUp={() => setShortestPath([])}>Segure para encontrar o menor caminho</button>
      </div>
  );
};

export default LabirintoApp;
