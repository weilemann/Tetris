import React, { useState, useEffect } from 'react';

import { createStage } from '../../gameHelpers';

import { StyledTetrisWrapper, StyledTetris } from './styles';

import { usePlayer } from '../../hooks/usePlayer';
import { useStage } from '../../hooks/useStage';

import Stage from '../Stage';
import Display from '../Display';
import StartButton from '../StartButton';

import bgMusic from '../../assets/music/tetris_song.mp3'

const Tetris = () => {
    const [audio] = useState(new Audio(bgMusic));
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [playing, setPlaying] = useState(false);

    const [player, updatePlayerPos, resetPlayer] = usePlayer();
    const [stage, setStage] = useStage(player);

    console.log('re-render');

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing]);

    const movePlayer = (dir) => {
        updatePlayerPos({ x: dir, y: 0 });
    }

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        resetPlayer();
        setPlaying(true);
    }

    const drop = () => {
        updatePlayerPos({ x: 0, y: 1, collided: false });
    }

    const dropPlayer = () => {
        drop();
    }

    const move = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 37) {
                movePlayer(-1);
            } else if(keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            }
        }
    }

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)}>
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text="Score" />
                            <Display text="Rows" />
                            <Display text="Level" />
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris;