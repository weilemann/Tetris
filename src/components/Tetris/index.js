import React, { useState, useEffect } from 'react';

import { createStage, checkCollision } from '../../gameHelpers';

import { StyledTetrisWrapper, StyledTetris } from './styles';

import { usePlayer } from '../../hooks/usePlayer';
import { useStage } from '../../hooks/useStage';
import { useInterval } from '../../hooks/useInterval';
import { useGameStatus } from '../../hooks/useGameStatus';

import Stage from '../Stage';
import Display from '../Display';
import StartButton from '../StartButton';

import bgMusic from '../../assets/music/tetris_song.mp3'

const Tetris = () => {
    const [audio] = useState(new Audio(bgMusic));
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [playing, setPlaying] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    console.log('re-render');

    useEffect(() => {
        playing ? audio.play() : audio.pause();
        audio.loop = true;
    }, [playing, audio]);

    const movePlayer = (dir) => {
        if(!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    }

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        setDropTime(1000);
        setPlaying(true);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
    }

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if(rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(1000 / ((level+1) + 200));
        }
        if(!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game Over
            if(player.pos.y < 1) {
                console.log("Game Over!")
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true })
        }
    }

    const keyUp = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 40 || keyCode === 83) {
                console.log("Interval on");
                setDropTime(1000 / (level+1) + 200);
            }
        }
    }

    const dropPlayer = () => {
        console.log("Interval off");
        setDropTime(null);
        drop();
    }

    const move = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 37 || keyCode === 65) {
                movePlayer(-1);
            } else if(keyCode === 39 || keyCode === 68) {
                movePlayer(1);
            } else if (keyCode === 40 || keyCode === 83) {
                dropPlayer();
            } else if (keyCode === 38 || keyCode === 87) {
                playerRotate(stage, 1);
            }
        }
    }

    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris;