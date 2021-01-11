import React, { useState, useEffect } from 'react';

import { createStage, checkCollision } from '../../gameHelpers';

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

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage] = useStage(player, resetPlayer);

    console.log('re-render');

    useEffect(() => {
        playing ? audio.play() : audio.pause();
        audio.loop = true;
    }, [playing]);

    const movePlayer = (dir) => {
        if(!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    }

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        setPlaying(true);
        resetPlayer();
        setGameOver(false);
    }

    const drop = () => {
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
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
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